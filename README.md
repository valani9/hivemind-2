# Second Opinion — AI Debate Arena for Prediction Markets

> Watch four AI agents debate live Gemini prediction market outcomes using real-time data. Bull vs Bear vs Analyst vs Contrarian — who do you agree with?

## What It Does

**Second Opinion** turns prediction market analysis into a spectator sport. Pick any active Gemini prediction market — crypto prices, politics, sports, economics — and watch four AI agents with distinct personalities debate the outcome in real-time:

- **Maximilian (The Bull)** — Relentlessly optimistic, finds bullish signals everywhere
- **Cassandra (The Bear)** — Skeptical contrarian who always sees the downside
- **Dr. Sigma (The Analyst)** — Pure quant, speaks only in data and statistics
- **Maverick (The Contrarian)** — Always opposes market consensus

Each agent cites **real live market data** — order book depth, bid/ask spreads, trade history, and volume metrics — as evidence for their arguments. Debates update in real-time when market data shifts.

## Gemini API Endpoints Used

| Endpoint | Usage |
|----------|-------|
| `GET /v1/prediction-markets/events` | Market Explorer — browse active events with filters |
| `GET /v1/prediction-markets/events/{ticker}` | Debate Arena — live event data for AI agents |
| `GET /v1/prediction-markets/events/newly-listed` | "NEW" badges on market cards |
| `GET /v1/prediction-markets/events/recently-settled` | Accuracy Leaderboard |
| `GET /v1/prediction-markets/categories` | Category filter dropdown |
| `GET /v1/book/{symbol}` | Order book visualization + AI agent evidence |
| `GET /v1/pubticker/{symbol}` | Live bid/ask/last price + volume data |
| `GET /v1/trades/{symbol}` | Recent trades feed + AI agent evidence |

## How to Run

```bash
# Clone the repo
git clone <repo-url>
cd second-opinion

# Install dependencies
npm install

# Set your Anthropic API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Market Explorer** — Browse and search all active Gemini prediction markets with category filters and sorting
- **AI Debate Arena** — 3-round debates (Opening Statements, Rebuttals, Final Verdicts) with streaming AI responses
- **Real-Time Market Intel** — Live price charts, order book visualization, recent trades, and bid/ask spreads
- **Market Shift Detection** — Automatic "flash debates" when significant price or volume changes occur
- **Vote & Track** — Cast your vote on which agent you agree with, track accuracy against actual settlements
- **Accuracy Leaderboard** — See recently settled events and agent prediction performance

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + Framer Motion for animations
- **Claude API** (Anthropic) for AI agent streaming responses
- **Zustand** for state management
- **Recharts** for price visualization

## Known Limitations

- Agent accuracy tracking uses simulated baseline data (real tracking requires events to settle over time)
- WebSocket not implemented (uses 5-second polling for real-time updates)
- Voting is local-only (localStorage) — no shared community votes in this version

## Team

Built at UPenn Hacks 3, March 2026.
