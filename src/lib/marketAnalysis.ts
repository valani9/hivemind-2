import { OrderBook, TickerData, Trade } from '@/types/gemini';

export interface MarketShift {
  type: 'price_move' | 'volume_spike' | 'spread_change' | 'book_imbalance';
  magnitude: number;
  description: string;
}

export interface MarketSnapshot {
  bestBid: number;
  bestAsk: number;
  lastPrice: number;
  spread: number;
  bidVolume: number;
  askVolume: number;
  imbalanceRatio: number;
  recentTradeCount: number;
  timestamp: number;
}

export function computeSnapshot(
  orderBook?: OrderBook,
  ticker?: TickerData,
  trades?: Trade[]
): MarketSnapshot {
  const bestBid = ticker ? parseFloat(ticker.bid) : 0;
  const bestAsk = ticker ? parseFloat(ticker.ask) : 0;
  const lastPrice = ticker ? parseFloat(ticker.last) : 0;
  const spread = bestAsk - bestBid;

  const bidVolume = orderBook?.bids.reduce((s, b) => s + parseFloat(b.amount), 0) ?? 0;
  const askVolume = orderBook?.asks.reduce((s, a) => s + parseFloat(a.amount), 0) ?? 0;
  const imbalanceRatio = askVolume > 0 ? bidVolume / askVolume : 0;

  return {
    bestBid,
    bestAsk,
    lastPrice,
    spread,
    bidVolume,
    askVolume,
    imbalanceRatio,
    recentTradeCount: trades?.length ?? 0,
    timestamp: Date.now(),
  };
}

export function detectShifts(prev: MarketSnapshot, curr: MarketSnapshot): MarketShift[] {
  const shifts: MarketShift[] = [];

  // Price move >= 3 cents
  const priceDelta = Math.abs(curr.lastPrice - prev.lastPrice);
  if (priceDelta >= 0.03) {
    const direction = curr.lastPrice > prev.lastPrice ? 'UP' : 'DOWN';
    shifts.push({
      type: 'price_move',
      magnitude: priceDelta,
      description: `Price moved ${direction} by $${priceDelta.toFixed(2)} (${prev.lastPrice.toFixed(2)} → ${curr.lastPrice.toFixed(2)})`,
    });
  }

  // Spread change > 2 cents
  const spreadDelta = Math.abs(curr.spread - prev.spread);
  if (spreadDelta >= 0.02) {
    const direction = curr.spread > prev.spread ? 'WIDENED' : 'NARROWED';
    shifts.push({
      type: 'spread_change',
      magnitude: spreadDelta,
      description: `Spread ${direction} by ${(spreadDelta * 100).toFixed(1)}¢ (now ${(curr.spread * 100).toFixed(1)}¢)`,
    });
  }

  // Book imbalance flip
  if (prev.imbalanceRatio > 0 && curr.imbalanceRatio > 0) {
    const prevSide = prev.imbalanceRatio > 1 ? 'bid' : 'ask';
    const currSide = curr.imbalanceRatio > 1 ? 'bid' : 'ask';
    if (prevSide !== currSide) {
      shifts.push({
        type: 'book_imbalance',
        magnitude: Math.abs(curr.imbalanceRatio - prev.imbalanceRatio),
        description: `Order book flipped from ${prevSide}-heavy to ${currSide}-heavy (ratio: ${curr.imbalanceRatio.toFixed(2)})`,
      });
    }
  }

  // Volume spike (trade count doubles)
  if (prev.recentTradeCount > 0 && curr.recentTradeCount >= prev.recentTradeCount * 2) {
    shifts.push({
      type: 'volume_spike',
      magnitude: curr.recentTradeCount / prev.recentTradeCount,
      description: `Volume spike detected: ${curr.recentTradeCount} recent trades (${(curr.recentTradeCount / prev.recentTradeCount).toFixed(1)}x increase)`,
    });
  }

  return shifts;
}

export function computeSpreadPercent(bid: string, ask: string): number {
  const b = parseFloat(bid);
  const a = parseFloat(ask);
  if (a === 0) return 0;
  return ((a - b) / a) * 100;
}
