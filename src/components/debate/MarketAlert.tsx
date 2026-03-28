'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FlashReaction } from '@/types/agent';
import { AGENTS } from '@/lib/agents';

interface MarketAlertProps {
  reactions: FlashReaction[];
  shiftDescription?: string;
}

export function MarketAlert({ reactions, shiftDescription }: MarketAlertProps) {
  if (reactions.length === 0 && !shiftDescription) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="rounded-lg border-2 border-red-500/30 bg-red-500/5 p-4 animate-alert-flash"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-400 text-sm font-bold tracking-wider">MARKET ALERT</span>
          {shiftDescription && (
            <span className="text-xs text-red-300/70">{shiftDescription}</span>
          )}
        </div>

        <div className="space-y-2">
          {reactions.slice(-4).map((reaction, i) => {
            const agent = AGENTS[reaction.agentId];
            return (
              <motion.div
                key={reaction.timestamp + reaction.agentId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <span>{agent.emoji}</span>
                <span style={{ color: agent.color }} className="font-medium">{agent.name}:</span>
                <span className="text-gray-300">{reaction.content}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
