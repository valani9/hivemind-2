'use client';

import { useState, useEffect, useCallback } from 'react';
import { GeminiEvent } from '@/types/gemini';
import { EventCard } from '@/components/market/EventCard';
import { SearchBar } from '@/components/market/SearchBar';
import { CategoryFilter } from '@/components/market/CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';

type SortBy = 'volume' | 'newest' | 'expiry';

export default function MarketExplorer() {
  const [events, setEvents] = useState<GeminiEvent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newlyListed, setNewlyListed] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('volume');
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('status[]', 'active');
      params.set('limit', '100');
      if (selectedCategory) params.append('category[]', selectedCategory);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/gemini/events?${params}`);
      const data = await res.json();
      const eventList = Array.isArray(data) ? data : data.data || data.events || [];
      setEvents(eventList);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  useEffect(() => {
    fetch('/api/gemini/categories')
      .then(r => r.json())
      .then(data => {
        const cats = Array.isArray(data) ? data : data.categories || [];
        setCategories(cats);
      })
      .catch(console.error);

    fetch('/api/gemini/events/newly-listed')
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : data.data || data.events || [];
        setNewlyListed(new Set(items.map((e: GeminiEvent) => e.ticker)));
      })
      .catch(console.error);
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'volume') return (b.volume24h || 0) - (a.volume24h || 0);
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Get a <span className="text-[#00DCFA]">Second Opinion</span>
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Pick any prediction market. Watch four AI agents debate the outcome using live data.
          Bull vs Bear vs Analyst vs Contrarian — who do you agree with?
        </p>
      </motion.div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <div className="flex gap-2">
            {(['volume', 'newest', 'expiry'] as SortBy[]).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  sortBy === sort
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {sort === 'volume' ? 'Top Volume' : sort === 'newest' ? 'Newest' : 'Expiring Soon'}
              </button>
            ))}
          </div>
        </div>
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Event Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-4 h-48 animate-pulse">
              <div className="h-4 bg-[#1e1e2e] rounded w-3/4 mb-3" />
              <div className="h-3 bg-[#1e1e2e] rounded w-1/2 mb-6" />
              <div className="h-2 bg-[#1e1e2e] rounded w-full" />
            </div>
          ))}
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No markets found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${searchQuery}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {sortedEvents.map((event, i) => (
              <EventCard
                key={event.ticker}
                event={event}
                isNew={newlyListed.has(event.ticker)}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
