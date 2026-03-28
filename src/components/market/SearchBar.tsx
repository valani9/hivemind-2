'use client';

import { useState, useCallback, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search markets...' }: SearchBarProps) {
  const [value, setValue] = useState('');

  const debounced = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return (val: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => onSearch(val), 300);
      };
    })(),
    [onSearch]
  );

  useEffect(() => {
    debounced(value);
  }, [value, debounced]);

  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-[#111118] border border-[#1e1e2e] rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00DCFA]/50 transition-colors"
      />
    </div>
  );
}
