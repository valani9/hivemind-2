'use client';

import { OrderBook } from '@/types/gemini';

interface OrderBookVizProps {
  orderBook: OrderBook | null;
}

export function OrderBookViz({ orderBook }: OrderBookVizProps) {
  if (!orderBook) {
    return (
      <div className="rounded-lg bg-[#111118] border border-[#1e1e2e] p-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Order Book</h4>
        <div className="text-xs text-gray-600 text-center py-4">No data</div>
      </div>
    );
  }

  const bids = orderBook.bids.slice(0, 5);
  const asks = orderBook.asks.slice(0, 5);
  const maxAmount = Math.max(
    ...bids.map(b => parseFloat(b.amount)),
    ...asks.map(a => parseFloat(a.amount)),
    1
  );

  return (
    <div className="rounded-lg bg-[#111118] border border-[#1e1e2e] p-3">
      <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Order Book</h4>

      <div className="space-y-1">
        {/* Asks (reversed so highest is top) */}
        {[...asks].reverse().map((ask, i) => {
          const pct = (parseFloat(ask.amount) / maxAmount) * 100;
          return (
            <div key={`ask-${i}`} className="relative h-6 flex items-center">
              <div
                className="absolute right-0 top-0 bottom-0 bg-red-500/15 rounded-sm"
                style={{ width: `${pct}%` }}
              />
              <span className="relative z-10 text-[11px] text-red-400 w-14">${ask.price}</span>
              <span className="relative z-10 text-[11px] text-gray-500 ml-auto">{parseFloat(ask.amount).toFixed(0)}</span>
            </div>
          );
        })}

        {/* Spread indicator */}
        {bids[0] && asks[0] && (
          <div className="border-t border-b border-[#1e1e2e] py-1 my-1 text-center">
            <span className="text-[10px] text-gray-500">
              Spread: {((parseFloat(asks[0].price) - parseFloat(bids[0].price)) * 100).toFixed(1)}c
            </span>
          </div>
        )}

        {/* Bids */}
        {bids.map((bid, i) => {
          const pct = (parseFloat(bid.amount) / maxAmount) * 100;
          return (
            <div key={`bid-${i}`} className="relative h-6 flex items-center">
              <div
                className="absolute left-0 top-0 bottom-0 bg-green-500/15 rounded-sm"
                style={{ width: `${pct}%` }}
              />
              <span className="relative z-10 text-[11px] text-green-400 w-14">${bid.price}</span>
              <span className="relative z-10 text-[11px] text-gray-500 ml-auto">{parseFloat(bid.amount).toFixed(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
