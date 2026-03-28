'use client';

import { motion } from 'framer-motion';
import { AGENTS } from '@/lib/agents';
import { AgentId, AgentMessage } from '@/types/agent';

interface AgentCardProps {
  message: AgentMessage;
  index?: number;
}

export function AgentCard({ message, index = 0 }: AgentCardProps) {
  const agent = AGENTS[message.agentId];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.3 }}
      className="relative rounded-lg border p-4 transition-all"
      style={{
        borderColor: `${agent.color}33`,
        backgroundColor: agent.bgGlow,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: agent.color }}
      />

      <div className="flex items-center gap-2 mb-2 pl-2">
        <span className="text-lg">{agent.emoji}</span>
        <div>
          <span className="text-sm font-bold" style={{ color: agent.color }}>
            {agent.name}
          </span>
          <span className="text-xs text-gray-500 ml-2">{agent.title}</span>
        </div>
      </div>

      <div className="pl-2 text-sm text-gray-300 leading-relaxed">
        {message.content}
        {message.isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block w-2 h-4 ml-0.5 align-middle"
            style={{ backgroundColor: agent.color }}
          />
        )}
      </div>
    </motion.div>
  );
}

export function AgentCardSkeleton({ agentId }: { agentId: AgentId }) {
  const agent = AGENTS[agentId];

  return (
    <div
      className="rounded-lg border p-4 relative animate-pulse"
      style={{ borderColor: `${agent.color}22`, backgroundColor: `${agent.color}08` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg opacity-30" style={{ backgroundColor: agent.color }} />
      <div className="flex items-center gap-2 mb-2 pl-2">
        <span className="text-lg opacity-50">{agent.emoji}</span>
        <span className="text-sm font-bold opacity-50" style={{ color: agent.color }}>
          {agent.name}
        </span>
      </div>
      <div className="pl-2 space-y-2">
        <div className="h-3 rounded w-full" style={{ backgroundColor: `${agent.color}15` }} />
        <div className="h-3 rounded w-2/3" style={{ backgroundColor: `${agent.color}10` }} />
      </div>
    </div>
  );
}
