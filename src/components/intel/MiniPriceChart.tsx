'use client';

import { MarketSnapshot } from '@/lib/marketAnalysis';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MiniPriceChartProps {
  snapshots: MarketSnapshot[];
}

export function MiniPriceChart({ snapshots }: MiniPriceChartProps) {
  const data = snapshots.map(s => ({
    time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: s.lastPrice,
    bid: s.bestBid,
    ask: s.bestAsk,
  }));

  if (data.length < 2) {
    return (
      <div className="rounded-lg bg-[#111118] border border-[#1e1e2e] p-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Price Chart</h4>
        <div className="h-24 flex items-center justify-center text-xs text-gray-600">
          Collecting data...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#111118] border border-[#1e1e2e] p-3">
      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Price Chart</h4>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111118',
                border: '1px solid #1e1e2e',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#e5e7eb',
              }}
              formatter={(value) => [`$${Number(value).toFixed(3)}`, '']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00DCFA"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
