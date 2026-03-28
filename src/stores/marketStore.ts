import { create } from 'zustand';
import { GeminiEvent, OrderBook, TickerData, Trade } from '@/types/gemini';
import { MarketSnapshot } from '@/lib/marketAnalysis';

interface MarketState {
  events: GeminiEvent[];
  categories: string[];
  currentEvent: GeminiEvent | null;
  orderBook: OrderBook | null;
  ticker: TickerData | null;
  trades: Trade[];
  newlyListed: string[];
  snapshots: MarketSnapshot[];
  isLoading: boolean;
  error: string | null;

  setEvents: (events: GeminiEvent[]) => void;
  setCategories: (categories: string[]) => void;
  setCurrentEvent: (event: GeminiEvent | null) => void;
  setOrderBook: (book: OrderBook | null) => void;
  setTicker: (ticker: TickerData | null) => void;
  setTrades: (trades: Trade[]) => void;
  setNewlyListed: (tickers: string[]) => void;
  addSnapshot: (snapshot: MarketSnapshot) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  events: [],
  categories: [],
  currentEvent: null,
  orderBook: null,
  ticker: null,
  trades: [],
  newlyListed: [],
  snapshots: [],
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setCategories: (categories) => set({ categories }),
  setCurrentEvent: (currentEvent) => set({ currentEvent }),
  setOrderBook: (orderBook) => set({ orderBook }),
  setTicker: (ticker) => set({ ticker }),
  setTrades: (trades) => set({ trades }),
  setNewlyListed: (tickers) => set({ newlyListed: tickers }),
  addSnapshot: (snapshot) => set((state) => ({
    snapshots: [...state.snapshots.slice(-60), snapshot],
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
