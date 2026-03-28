'use client';

import { motion } from 'framer-motion';
import { useDebateStore } from '@/stores/debateStore';
import { AgentCard, AgentCardSkeleton } from './AgentCard';
import { MarketAlert } from './MarketAlert';
import { AGENT_ORDER } from '@/lib/agents';

export function DebateStage() {
  const { rounds, currentRound, isActive, isGenerating, flashReactions } = useDebateStore();

  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Click &quot;Start Debate&quot; to begin the AI analysis</p>
      </div>
    );
  }

  const visibleRounds = rounds.filter(r => r.number <= currentRound);

  return (
    <div className="space-y-6">
      {visibleRounds.map((round) => (
        <motion.div
          key={round.number}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Round Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#00DCFA]/20 text-[#00DCFA] flex items-center justify-center text-xs font-bold">
                {round.number}
              </div>
              <h3 className="text-sm font-semibold text-white">{round.title}</h3>
            </div>
            {round.isComplete && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-green-500/10 text-green-400 rounded-full">
                Complete
              </span>
            )}
            {!round.isComplete && round.number === currentRound && isGenerating && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-[#00DCFA]/10 text-[#00DCFA] rounded-full animate-pulse">
                Analyzing...
              </span>
            )}
          </div>

          {/* Agent Messages */}
          <div className="space-y-3">
            {round.messages.map((msg, i) => (
              <AgentCard key={`${msg.agentId}-${round.number}`} message={msg} index={i} />
            ))}

            {/* Show skeletons for agents that haven't spoken yet in current round */}
            {!round.isComplete && round.number === currentRound && isGenerating &&
              AGENT_ORDER
                .filter(id => !round.messages.some(m => m.agentId === id))
                .map(id => <AgentCardSkeleton key={id} agentId={id} />)
            }
          </div>
        </motion.div>
      ))}

      {/* Flash Reactions */}
      {flashReactions.length > 0 && (
        <MarketAlert reactions={flashReactions} />
      )}
    </div>
  );
}
