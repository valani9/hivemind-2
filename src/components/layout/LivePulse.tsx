'use client';

export function LivePulse() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" style={{ color: '#22c55e' }} />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500/30 animate-ping" />
      </div>
      <span className="text-xs font-medium text-green-500">LIVE</span>
    </div>
  );
}
