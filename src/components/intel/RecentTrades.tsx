'use client';

import { Trade } from '@/types/gemini';

interface RecentTradesProps {
  trades: Trade[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <div className="rounded-lg bg-[#111118] border border-[#1e1e2e] p-3">
      <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Trades</h4>

      {trades.length === 0 ? (
        <div className="text-xs text-gray-600 text-center py-4">No trades yet</div>
      ) : (
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {trades.slice(0, 10).map((trade) => (
            <div key={trade.tid} className="flex items-center justify-between text-[11px]">
              <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                {trade.type.toUpperCase()}
              </span>
              <span className="text-gray-300">${trade.price}</span>
              <span className="text-gray-500">x{parseFloat(trade.amount).toFixed(0)}</span>
              <span className="text-gray-600">
                {new Date(trade.timestampms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
