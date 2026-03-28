'use client';

import { motion } from 'framer-motion';

interface PriceBarProps {
  yesPrice: string;
  noPrice: string;
}

export function PriceBar({ yesPrice, noPrice }: PriceBarProps) {
  const yes = parseFloat(yesPrice) || 0;
  const no = parseFloat(noPrice) || 0;
  const yesPct = Math.round(yes * 100);
  const noPct = Math.round(no * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-green-400 font-medium">YES {yesPct}c</span>
        <span className="text-red-400 font-medium">NO {noPct}c</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-red-500/30 flex">
        <motion.div
          className="h-full bg-green-500 rounded-l-full"
          initial={{ width: 0 }}
          animate={{ width: `${yesPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
