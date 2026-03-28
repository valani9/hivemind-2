'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMarketStore } from '@/stores/marketStore';
import { GeminiEvent, OrderBook, TickerData, Trade } from '@/types/gemini';
import { computeSnapshot, detectShifts, MarketSnapshot } from '@/lib/marketAnalysis';

interface UseMarketPollingOptions {
  eventTicker: string | null;
  instrumentSymbol: string | null;
  pollInterval?: number;
  onMarketShift?: (description: string) => void;
}

export function useMarketPolling({
  eventTicker,
  instrumentSymbol,
  pollInterval = 5000,
  onMarketShift,
}: UseMarketPollingOptions) {
  const {
    setCurrentEvent,
    setOrderBook,
    setTicker,
    setTrades,
    addSnapshot,
    setLoading,
    setError,
  } = useMarketStore();

  const prevSnapshotRef = useRef<MarketSnapshot | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    if (!eventTicker) return;

    try {
      const fetches: Promise<unknown>[] = [
        fetch(`/api/gemini/events/${eventTicker}`).then(r => r.json()),
      ];

      if (instrumentSymbol) {
        fetches.push(
          fetch(`/api/gemini/book/${instrumentSymbol}`).then(r => r.json()),
          fetch(`/api/gemini/ticker/${instrumentSymbol}`).then(r => r.json()),
          fetch(`/api/gemini/trades/${instrumentSymbol}`).then(r => r.json()),
        );
      }

      const results = await Promise.all(fetches);

      const event = results[0] as GeminiEvent;
      setCurrentEvent(event);

      let orderBook: OrderBook | null = null;
      let ticker: TickerData | null = null;
      let trades: Trade[] = [];

      if (instrumentSymbol) {
        orderBook = results[1] as OrderBook;
        ticker = results[2] as TickerData;
        trades = Array.isArray(results[3]) ? results[3] as Trade[] : [];

        setOrderBook(orderBook);
        setTicker(ticker);
        setTrades(trades);

        // Compute snapshot and check for shifts
        const snapshot = computeSnapshot(orderBook, ticker, trades);
        addSnapshot(snapshot);

        if (prevSnapshotRef.current && onMarketShift) {
          const shifts = detectShifts(prevSnapshotRef.current, snapshot);
          if (shifts.length > 0) {
            onMarketShift(shifts.map(s => s.description).join('; '));
          }
        }
        prevSnapshotRef.current = snapshot;
      }

      setError(null);
    } catch (err) {
      console.error('Polling error:', err);
      setError('Failed to fetch market data');
    }
  }, [eventTicker, instrumentSymbol, setCurrentEvent, setOrderBook, setTicker, setTrades, addSnapshot, setError, onMarketShift]);

  useEffect(() => {
    if (!eventTicker) return;

    setLoading(true);
    poll().then(() => setLoading(false));

    intervalRef.current = setInterval(poll, pollInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [eventTicker, pollInterval, poll, setLoading]);
}
