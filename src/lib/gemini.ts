const BASE_URL = 'https://api.gemini.com';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 3000;

async function cachedFetch<T>(path: string, ttl = CACHE_TTL): Promise<T> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }

  const res = await fetch(`${BASE_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  cache.set(path, { data, timestamp: Date.now() });
  return data as T;
}

export async function getEvents(params?: {
  status?: string[];
  category?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.status) params.status.forEach(s => searchParams.append('status[]', s));
  if (params?.category) params.category.forEach(c => searchParams.append('category[]', c));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());

  const query = searchParams.toString();
  return cachedFetch(`/v1/prediction-markets/events${query ? `?${query}` : ''}`);
}

export async function getEvent(ticker: string) {
  return cachedFetch(`/v1/prediction-markets/events/${ticker}`);
}

export async function getNewlyListed(params?: { category?: string[]; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.category) params.category.forEach(c => searchParams.append('category[]', c));
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  const query = searchParams.toString();
  return cachedFetch(`/v1/prediction-markets/events/newly-listed${query ? `?${query}` : ''}`);
}

export async function getRecentlySettled(params?: { category?: string[]; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.category) params.category.forEach(c => searchParams.append('category[]', c));
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  const query = searchParams.toString();
  return cachedFetch(`/v1/prediction-markets/events/recently-settled${query ? `?${query}` : ''}`);
}

export async function getCategories() {
  return cachedFetch('/v1/prediction-markets/categories', 60000);
}

export async function getOrderBook(symbol: string, limit?: number) {
  const params = limit ? `?limit_bids=${limit}&limit_asks=${limit}` : '';
  return cachedFetch(`/v1/book/${symbol}${params}`);
}

export async function getTicker(symbol: string) {
  return cachedFetch(`/v1/pubticker/${symbol}`);
}

export async function getTrades(symbol: string, limit = 50) {
  return cachedFetch(`/v1/trades/${symbol}?limit_trades=${limit}`);
}
