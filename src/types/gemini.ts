// Gemini Prediction Markets API Types

export interface GeminiEvent {
  id: string;
  title: string;
  slug: string;
  description: string | Record<string, unknown>;
  imageUrl?: string;
  type: 'binary' | 'categorical';
  category: string;
  series?: string;
  ticker: string;
  status: 'approved' | 'active' | 'closed' | 'under_review' | 'settled' | 'invalid';
  resolvedAt?: string;
  createdAt: string;
  effectiveDate?: string;
  expiryDate: string;
  contracts: GeminiContract[];
  volume: number;
  volume24h: number;
  liquidity: number;
  tags: string[];
  subcategory?: {
    id: string;
    slug: string;
    name: string;
    path: string[];
  };
  template?: string;
  participants?: Array<{ name: string; imageUrl?: string }>;
  gameId?: string;
  eventTags?: string[];
  startTime?: string;
  isLive?: boolean;
}

export interface GeminiContract {
  id: string;
  label: string;
  abbreviatedName?: string;
  description: string | Record<string, unknown>;
  ticker: string;
  instrumentSymbol: string;
  prices: {
    buy: { yes: string; no: string };
    sell: { yes: string; no: string };
    bestBid: string;
    bestAsk: string;
    lastTradePrice: string;
  };
  status: string;
  color?: string;
  marketState: 'open' | 'closed' | 'post_only';
  strike?: {
    value: string;
    type: 'above' | 'below';
    availableAt?: string;
  };
  source?: string;
  settlementValue?: string;
  sportsSide?: 'home' | 'away';
  teamId?: string;
  createdAt: string;
  expiryDate: string;
  resolutionSide?: 'yes' | 'no' | null;
  termsAndConditionsUrl?: string;
}

export interface OrderBookEntry {
  price: string;
  amount: string;
  timestamp: string;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface TickerData {
  bid: string;
  ask: string;
  last: string;
  volume: {
    [key: string]: string;
    timestamp: string;
  };
}

export interface Trade {
  timestamp: number;
  timestampms: number;
  tid: number;
  price: string;
  amount: string;
  exchange: string;
  type: 'buy' | 'sell';
}

export interface EventsResponse {
  events: GeminiEvent[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}
