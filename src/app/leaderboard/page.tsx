'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GeminiEvent } from '@/types/gemini';
import { AGENTS, AGENT_ORDER } from '@/lib/agents';
import { formatPrice } from '@/lib/formatters';

export default function LeaderboardPage() {
  const [settledEvents, setSettledEvents] = useState<GeminiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gemini/events/recently-settled')
      .then(r => r.json())
      .then(data => {
        const events = Array.isArray(data) ? data : data.data || data.events || [];
        setSettledEvents(events);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Simulated agent accuracy stats
  const agentStats = {
    bull: { wins: 47, losses: 31, brierScore: 0.21 },
    bear: { wins: 39, losses: 39, brierScore: 0.25 },
    analyst: { wins: 52, losses: 26, brierScore: 0.18 },
    contrarian: { wins: 35, losses: 43, brierScore: 0.29 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Accuracy Leaderboard</h1>
        <p className="text-gray-400">Track which AI agent makes the best predictions against actual market settlements.</p>
      </motion.div>

      {/* Agent Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {AGENT_ORDER.map((agentId, i) => {
          const agent = AGENTS[agentId];
          const stats = agentStats[agentId];
          const winRate = Math.round((stats.wins / (stats.wins + stats.losses)) * 100);

          return (
            <motion.div
              key={agentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border p-5 relative overflow-hidden"
              style={{
                borderColor: `${agent.color}33`,
                backgroundColor: agent.bgGlow,
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: agent.color }} />

              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{agent.emoji}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: agent.color }}>{agent.name}</div>
                  <div className="text-[10px] text-gray-500">{agent.title}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-2xl font-bold text-white">{winRate}%</div>
                  <div className="text-[10px] text-gray-500">Win Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.brierScore}</div>
                  <div className="text-[10px] text-gray-500">Brier Score</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                {stats.wins}W - {stats.losses}L
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recently Settled Events */}
      <h2 className="text-lg font-semibold text-white mb-4">Recently Settled Events</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-[#1e1e2e] bg-[#111118] p-4 animate-pulse">
              <div className="h-4 bg-[#1e1e2e] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#1e1e2e] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : settledEvents.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No recently settled events found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settledEvents.map((event, i) => {
            const contract = event.contracts?.[0];
            const settled = contract?.resolutionSide;

            return (
              <motion.div
                key={event.ticker}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-[#1e1e2e] bg-[#111118] p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-2 py-0.5 text-[10px] bg-[#1e1e2e] text-gray-400 rounded-full">
                        {event.category}
                      </span>
                      {event.resolvedAt && (
                        <span className="text-[11px] text-gray-500">
                          Settled: {new Date(event.resolvedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {settled && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        settled === 'yes'
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}>
                        {settled.toUpperCase()}
                      </span>
                    )}
                    {contract && (
                      <div className="text-[11px] text-gray-500 mt-1">
                        Final: {formatPrice(contract.settlementValue || contract.prices.lastTradePrice)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
