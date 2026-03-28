'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LivePulse } from './LivePulse';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Markets' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00DCFA] to-[#a855f7] flex items-center justify-center text-sm font-bold text-black">
              SO
            </div>
            <span className="text-lg font-bold text-white group-hover:text-[#00DCFA] transition-colors">
              Second Opinion
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-[#1e1e2e] text-[#00DCFA]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1e1e2e]/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LivePulse />
          <span className="text-xs text-gray-500 hidden sm:block">Powered by Gemini API</span>
        </div>
      </div>
    </nav>
  );
}
