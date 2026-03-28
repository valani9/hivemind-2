'use client';

import { motion } from 'framer-motion';
import { AGENTS, AGENT_ORDER } from '@/lib/agents';
import { AgentId } from '@/types/agent';
import { useVoteStore } from '@/stores/voteStore';

interface VotePanelProps {
  eventTicker: string;
  currentPrice: number;
  isDebateActive: boolean;
}

export function VotePanel({ eventTicker, currentPrice, isDebateActive }: VotePanelProps) {
  const { addVote, getDistribution, getUserVote } = useVoteStore();
  const userVote = getUserVote(eventTicker);
  const distribution = getDistribution(eventTicker);

  const handleVote = (agentId: AgentId) => {
    addVote({
      eventTicker,
      agentId,
      round: 0,
      timestamp: Date.now(),
      marketPriceAtVote: currentPrice,
    });
  };

  if (!isDebateActive) return null;

  return (
    <div className="rounded-lg border border-[#1e1e2e] bg-[#111118] p-4">
      <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
        Who do you agree with?
      </h4>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {AGENT_ORDER.map((agentId) => {
          const agent = AGENTS[agentId];
          const isSelected = userVote === agentId;
          return (
            <motion.button
              key={agentId}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote(agentId)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-opacity-60'
                  : 'border-[#1e1e2e] hover:border-opacity-30'
              }`}
              style={{
                borderColor: isSelected ? agent.color : undefined,
                backgroundColor: isSelected ? `${agent.color}15` : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{agent.emoji}</span>
                <span className="text-xs font-medium" style={{ color: isSelected ? agent.color : '#9ca3af' }}>
                  {agent.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Vote Distribution Bar */}
      <div>
        <div className="flex text-[10px] text-gray-500 justify-between mb-1">
          <span>Community votes</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex bg-[#1e1e2e]">
          {AGENT_ORDER.map((agentId) => {
            const pct = distribution[agentId];
            if (pct === 0) return null;
            return (
              <motion.div
                key={agentId}
                className="h-full"
                style={{ backgroundColor: AGENTS[agentId].color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          {AGENT_ORDER.map((agentId) => (
            <span key={agentId} className="text-[10px]" style={{ color: AGENTS[agentId].color }}>
              {distribution[agentId]}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
