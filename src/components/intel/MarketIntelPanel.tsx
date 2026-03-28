'use client';

import { GeminiContract, OrderBook, TickerData, Trade } from '@/types/gemini';
import { MarketSnapshot } from '@/lib/marketAnalysis';
import { OrderBookViz } from './OrderBookViz';
import { RecentTrades } from './RecentTrades';
import { MiniPriceChart } from './MiniPriceChart';
import { formatPrice, formatProbability, formatVolume } from '@/lib/formatters';

interface MarketIntelPanelProps {
  contract: GeminiContract | null;
  orderBook: OrderBook | null;
  ticker: TickerData | null;
  trades: Trade[];
  snapshots: MarketSnapshot[];
  volume24h: number;
}

export function MarketIntelPanel({ contract, orderBook, ticker, trades, snapshots, volume24h }: MarketIntelPanelProps) {
  if (!contract) return null;

  const bid = ticker?.bid || contract.prices.bestBid;
  const ask = ticker?.ask || contract.prices.bestAsk;
  const last = ticker?.last || contract.prices.lastTradePrice;

  return (
    <div className="space-y-3">
      {/* Price Header */}
      <div className="rounded-lg bg-[#111118] border border-[#1e1e2e] p-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Bid</div>
            <div className="text-lg font-bold text-green-400">{formatPrice(bid)}</div>
            <div className="text-[10px] text-gray-500">{formatProbability(bid)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Ask</div>
            <div className="text-lg font-bold text-red-400">{formatPrice(ask)}</div>
            <div className="text-[10px] text-gray-500">{formatProbability(ask)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Last</div>
            <div className="text-lg font-bold text-[#00DCFA]">{formatPrice(last)}</div>
            <div className="text-[10px] text-gray-500">{formatProbability(last)}</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex justify-between text-xs">
          <span className="text-gray-500">24h Vol: <span className="text-gray-300">{formatVolume(volume24h)}</span></span>
          <span className="text-gray-500">Spread: <span className="text-gray-300">
            {((parseFloat(ask) - parseFloat(bid)) * 100).toFixed(1)}c
          </span></span>
        </div>
      </div>

      <MiniPriceChart snapshots={snapshots} />
      <OrderBookViz orderBook={orderBook} />
      <RecentTrades trades={trades} />
    </div>
  );
}
