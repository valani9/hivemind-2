import { AgentId } from './agent';

export interface Vote {
  eventTicker: string;
  agentId: AgentId;
  round: number;
  timestamp: number;
  marketPriceAtVote: number;
}

export interface VoteDistribution {
  bull: number;
  bear: number;
  analyst: number;
  contrarian: number;
}

export interface AccuracyRecord {
  eventTicker: string;
  eventTitle: string;
  category: string;
  settledAt: string;
  actualOutcome: 'yes' | 'no';
  agents: Record<AgentId, {
    predictedProbability: number;
    wasCorrect: boolean;
  }>;
  userVotedFor: AgentId | null;
  userWasCorrect: boolean | null;
}
