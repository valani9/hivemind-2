'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GeminiEvent } from '@/types/gemini';
import { PriceBar } from './PriceBar';
import { formatVolume, formatCountdown } from '@/lib/formatters';

interface EventCardProps {
  event: GeminiEvent;
  isNew?: boolean;
  index?: number;
}

export function EventCard({ event, isNew, index = 0 }: EventCardProps) {
  const primaryContract = event.contracts?.[0];
  if (!primaryContract) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/debate/${event.ticker}`}>
        <div className="group relative rounded-xl border border-[#1e1e2e] bg-[#111118] p-4 hover:border-[#00DCFA]/30 hover:bg-[#111118]/80 transition-all duration-300 cursor-pointer h-full flex flex-col">
          {isNew && (
            <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-[#00DCFA]/20 text-[#00DCFA] rounded-full uppercase tracking-wider">
              New
            </span>
          )}

          <div className="flex items-start gap-3 mb-3">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt=""
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white group-hover:text-[#00DCFA] transition-colors line-clamp-2 leading-tight">
                {event.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-[10px] font-medium bg-[#1e1e2e] text-gray-400 rounded-full">
              {event.category}
            </span>
            {event.type === 'categorical' && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/10 text-purple-400 rounded-full">
                {event.contracts.length} outcomes
              </span>
            )}
          </div>

          <div className="mt-auto">
            <PriceBar
              yesPrice={primaryContract.prices.bestBid}
              noPrice={primaryContract.prices.buy?.no || '0'}
            />

            <div className="flex justify-between items-center mt-3 text-[11px] text-gray-500">
              <span>Vol: {formatVolume(event.volume24h || 0)}</span>
              <span>{formatCountdown(event.expiryDate)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
