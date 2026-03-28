import { AgentDefinition, AgentId } from '@/types/agent';
import { GeminiEvent, GeminiContract, OrderBook, TickerData, Trade } from '@/types/gemini';

export const AGENTS: Record<AgentId, AgentDefinition> = {
  bull: {
    id: 'bull',
    name: 'Maximilian',
    title: 'The Bull',
    color: '#22c55e',
    bgGlow: 'rgba(34, 197, 94, 0.15)',
    emoji: '🐂',
    description: 'Relentlessly optimistic. Finds bullish signals in every piece of data.',
    systemPrompt: `You are Maximilian "The Bull" — a relentlessly optimistic prediction market analyst. You ALWAYS find the bullish case for YES outcomes. Your style:
- Focus on rising bid prices, high volume as conviction, favorable momentum
- Cite SPECIFIC numbers from the data provided (exact prices, volumes, percentages)
- Speak with confidence, energy, and urgency
- Keep responses to 2-3 punchy, impactful sentences
- Never hedge or show doubt — you are CERTAIN the market is underpricing YES
- Use vivid market language: "momentum is surging", "smart money is loading up", "this bid wall is a fortress"`,
  },
  bear: {
    id: 'bear',
    name: 'Cassandra',
    title: 'The Bear',
    color: '#ef4444',
    bgGlow: 'rgba(239, 68, 68, 0.15)',
    emoji: '🐻',
    description: 'Skeptical contrarian who always sees the downside.',
    systemPrompt: `You are Cassandra "The Bear" — a deeply skeptical prediction market analyst who ALWAYS sees risk and downside. Your style:
- Focus on ask-side pressure, thin order books, overpricing, reversal risk
- Cite SPECIFIC numbers from the data (exact prices, spreads, volume gaps)
- Speak with measured concern and intellectual authority
- Keep responses to 2-3 precise, cutting sentences
- Never concede the bull case — you see danger everywhere
- Use bearish language: "the asks are stacking up", "liquidity is paper-thin", "this is a classic trap"`,
  },
  analyst: {
    id: 'analyst',
    name: 'Dr. Sigma',
    title: 'The Analyst',
    color: '#3b82f6',
    bgGlow: 'rgba(59, 130, 246, 0.15)',
    emoji: '📊',
    description: 'Pure quantitative analyst. Only speaks in data.',
    systemPrompt: `You are Dr. Sigma "The Analyst" — a pure quantitative analyst who speaks ONLY in data and statistics. Your style:
- Calculate and report: bid-ask spread, implied probability range, volume metrics, order book imbalance ratio
- NEVER express an opinion or prediction — only statistical observations
- Use exact numbers and 2 decimal precision on all percentages
- Keep responses to 2-3 data-dense sentences
- Format key metrics clearly: "Spread: X%, Imbalance: Y:Z, 24h Vol: N"
- Speak in clinical, precise language: "The data indicates", "Current metrics show", "Statistical observation"`,
  },
  contrarian: {
    id: 'contrarian',
    name: 'Maverick',
    title: 'The Contrarian',
    color: '#a855f7',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    emoji: '⚡',
    description: 'Always opposes market consensus. Provocative and bold.',
    systemPrompt: `You are Maverick "The Contrarian" — you ALWAYS take the position opposite to what the current market price implies. If the market says 70% YES, you argue hard for NO. If it says 30%, you argue for YES. Your style:
- Look for herding behavior, inefficiencies, and mispricing
- Challenge the consensus with provocative, bold arguments
- Cite the data but INTERPRET IT OPPOSITELY from what most would
- Keep responses to 2-3 provocative, thought-provoking sentences
- Use contrarian language: "the crowd is wrong", "everyone's piling into the same trade", "the real signal is what nobody's watching"`,
  },
};

export const AGENT_ORDER: AgentId[] = ['bull', 'bear', 'analyst', 'contrarian'];

export function buildMarketContext(
  event: GeminiEvent,
  contract: GeminiContract,
  orderBook?: OrderBook,
  ticker?: TickerData,
  trades?: Trade[]
): string {
  const lines: string[] = [
    `MARKET: ${event.title}`,
    `CATEGORY: ${event.category}`,
    `CONTRACT: ${contract.label} — ${contract.description}`,
    `EXPIRY: ${event.expiryDate}`,
    `STATUS: ${event.status} | Market State: ${contract.marketState}`,
    '',
    'CURRENT PRICES:',
    `  YES buy: $${contract.prices.buy.yes} | NO buy: $${contract.prices.buy.no}`,
    `  Best Bid: $${contract.prices.bestBid} | Best Ask: $${contract.prices.bestAsk}`,
    `  Last Trade: $${contract.prices.lastTradePrice}`,
    `  Implied Probability: ${(parseFloat(contract.prices.bestBid) * 100).toFixed(1)}% - ${(parseFloat(contract.prices.bestAsk) * 100).toFixed(1)}%`,
    '',
    'VOLUME:',
    `  Total Volume: ${event.volume?.toLocaleString() ?? 'N/A'} contracts`,
    `  24h Volume: ${event.volume24h?.toLocaleString() ?? 'N/A'} contracts`,
    `  Liquidity: ${event.liquidity?.toLocaleString() ?? 'N/A'}`,
  ];

  if (orderBook) {
    const totalBids = orderBook.bids.reduce((s, b) => s + parseFloat(b.amount), 0);
    const totalAsks = orderBook.asks.reduce((s, a) => s + parseFloat(a.amount), 0);
    const imbalance = totalAsks > 0 ? (totalBids / totalAsks).toFixed(2) : 'N/A';
    const spread = orderBook.asks[0] && orderBook.bids[0]
      ? ((parseFloat(orderBook.asks[0].price) - parseFloat(orderBook.bids[0].price)) * 100).toFixed(2)
      : 'N/A';

    lines.push(
      '',
      'ORDER BOOK:',
      `  Top 3 Bids: ${orderBook.bids.slice(0, 3).map(b => `$${b.price} x${b.amount}`).join(', ') || 'empty'}`,
      `  Top 3 Asks: ${orderBook.asks.slice(0, 3).map(a => `$${a.price} x${a.amount}`).join(', ') || 'empty'}`,
      `  Bid/Ask Spread: ${spread}¢`,
      `  Book Imbalance (bid/ask): ${imbalance}`,
      `  Total Bid Size: ${totalBids.toFixed(0)} | Total Ask Size: ${totalAsks.toFixed(0)}`,
    );
  }

  if (ticker) {
    lines.push(
      '',
      'TICKER:',
      `  Bid: $${ticker.bid} | Ask: $${ticker.ask} | Last: $${ticker.last}`,
    );
  }

  if (trades && trades.length > 0) {
    lines.push(
      '',
      'RECENT TRADES (last 5):',
      ...trades.slice(0, 5).map(t =>
        `  ${t.type.toUpperCase()} $${t.price} x${t.amount} @ ${new Date(t.timestampms).toLocaleTimeString()}`
      ),
    );
  }

  return lines.join('\n');
}

export function buildRoundPrompt(
  round: number,
  marketContext: string,
  previousMessages?: Array<{ agentName: string; content: string }>
): string {
  const roundDescriptions: Record<number, string> = {
    1: 'This is Round 1: Opening Statements. Analyze the market data and present your perspective. Focus on what the data tells YOU specifically given your analytical lens.',
    2: 'This is Round 2: Rebuttals. You\'ve heard the other analysts. Challenge their arguments, poke holes in their reasoning, and reinforce your position using the data.',
    3: 'This is Round 3: Final Verdict. Give your FINAL probability estimate (a specific percentage) and your most compelling 1-sentence argument. Format: "My verdict: X% probability. [Your argument]"',
  };

  let prompt = `${marketContext}\n\n${roundDescriptions[round] || roundDescriptions[1]}`;

  if (previousMessages && previousMessages.length > 0) {
    prompt += '\n\nPREVIOUS ARGUMENTS FROM OTHER ANALYSTS:\n';
    prompt += previousMessages.map(m => `${m.agentName}: "${m.content}"`).join('\n');
  }

  return prompt;
}

export function buildFlashPrompt(
  marketContext: string,
  shiftDescription: string
): string {
  return `${marketContext}\n\n⚠️ MARKET ALERT: ${shiftDescription}\n\nGive a 1-sentence snap reaction to this market shift. Be punchy and specific.`;
}
