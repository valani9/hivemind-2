'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMarketStore } from '@/stores/marketStore';
import { useDebateStore } from '@/stores/debateStore';
import { useDebate } from '@/hooks/useDebate';
import { useMarketPolling } from '@/hooks/useMarketPolling';
import { DebateStage } from '@/components/debate/DebateStage';
import { MarketIntelPanel } from '@/components/intel/MarketIntelPanel';
import { VotePanel } from '@/components/voting/VotePanel';
import { LivePulse } from '@/components/layout/LivePulse';
import { formatCountdown, formatProbability } from '@/lib/formatters';

export default function DebateArenaPage() {
  const params = useParams();
  const router = useRouter();
  const ticker = params.ticker as string;

  const { currentEvent, orderBook, ticker: tickerData, trades, snapshots, isLoading } = useMarketStore();
  const { isActive, isGenerating, currentRound, selectedContract, setSelectedContract } = useDebateStore();
  const { startDebate, nextRound, triggerFlashReaction } = useDebate();
  const [hasStarted, setHasStarted] = useState(false);

  const contract = currentEvent?.contracts?.[selectedContract] ?? null;
  const instrumentSymbol = contract?.instrumentSymbol ?? null;

  const handleMarketShift = useCallback((description: string) => {
    if (isActive && !isGenerating) {
      triggerFlashReaction(description);
    }
  }, [isActive, isGenerating, triggerFlashReaction]);

  useMarketPolling({
    eventTicker: ticker,
    instrumentSymbol,
    pollInterval: 5000,
    onMarketShift: handleMarketShift,
  });

  const handleStartDebate = async () => {
    setHasStarted(true);
    await startDebate(ticker);
  };

  const handleNextRound = async () => {
    await nextRound();
  };

  const lastPrice = tickerData?.last || contract?.prices.lastTradePrice || '0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => router.push('/')}
          className="text-gray-500 hover:text-gray-300 text-sm mb-3 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Markets
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            {currentEvent?.imageUrl && (
              <img src={currentEvent.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
            )}
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                {currentEvent?.title || 'Loading...'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {currentEvent?.category && (
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-[#1e1e2e] text-gray-400 rounded-full">
                    {currentEvent.category}
                  </span>
                )}
                {currentEvent?.expiryDate && (
                  <span className="text-xs text-gray-500">
                    Expires: {formatCountdown(currentEvent.expiryDate)}
                  </span>
                )}
                <LivePulse />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {contract && (
              <div className="text-right">
                <div className="text-2xl font-bold text-[#00DCFA]">
                  {formatProbability(lastPrice)}
                </div>
                <div className="text-[10px] text-gray-500">implied probability</div>
              </div>
            )}
          </div>
        </div>

        {/* Contract selector for multi-contract events */}
        {currentEvent && currentEvent.contracts.length > 1 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {currentEvent.contracts.map((c, i) => (
              <button
                key={c.ticker}
                onClick={() => setSelectedContract(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === selectedContract
                    ? 'bg-[#00DCFA]/20 text-[#00DCFA] border border-[#00DCFA]/30'
                    : 'bg-[#1e1e2e] text-gray-400 border border-transparent hover:text-gray-200'
                }`}
              >
                {c.label || c.abbreviatedName || c.ticker}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Content: 2-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Debate Stage (60%) */}
        <div className="flex-1 lg:w-[60%] space-y-4">
          {/* Start / Next Round Controls */}
          {!hasStarted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-4">🎭</div>
              <h2 className="text-xl font-bold text-white mb-2">Ready to Debate</h2>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Four AI agents will analyze this market using live data and debate the outcome.
                Round 1: Opening Statements, Round 2: Rebuttals, Round 3: Final Verdicts.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartDebate}
                disabled={isLoading || !currentEvent}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00DCFA] to-[#a855f7] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#00DCFA]/20 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Loading market data...' : 'Start Debate'}
              </motion.button>
            </motion.div>
          ) : (
            <>
              <DebateStage />

              {/* Next Round Button */}
              {isActive && !isGenerating && currentRound < 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextRound}
                    className="px-6 py-2.5 rounded-lg bg-[#00DCFA]/10 border border-[#00DCFA]/30 text-[#00DCFA] text-sm font-medium hover:bg-[#00DCFA]/20 transition-all"
                  >
                    {currentRound === 1 ? 'Proceed to Rebuttals →' : 'Proceed to Final Verdicts →'}
                  </motion.button>
                </motion.div>
              )}

              {/* Debate Complete */}
              {isActive && !isGenerating && currentRound === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 rounded-lg border border-[#00DCFA]/20 bg-[#00DCFA]/5"
                >
                  <span className="text-[#00DCFA] text-sm font-medium">
                    Debate Complete — Cast your vote below!
                  </span>
                </motion.div>
              )}
            </>
          )}

          {/* Vote Panel */}
          <VotePanel
            eventTicker={ticker}
            currentPrice={parseFloat(lastPrice) || 0}
            isDebateActive={isActive}
          />
        </div>

        {/* Right: Market Intel (40%) */}
        <div className="lg:w-[40%]">
          <MarketIntelPanel
            contract={contract}
            orderBook={orderBook}
            ticker={tickerData}
            trades={trades}
            snapshots={snapshots}
            volume24h={currentEvent?.volume24h || 0}
          />
        </div>
      </div>
    </div>
  );
}
