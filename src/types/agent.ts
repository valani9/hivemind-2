export type AgentId = 'bull' | 'bear' | 'analyst' | 'contrarian';

export interface AgentDefinition {
  id: AgentId;
  name: string;
  title: string;
  color: string;
  bgGlow: string;
  emoji: string;
  description: string;
  systemPrompt: string;
}

export interface AgentMessage {
  agentId: AgentId;
  round: number;
  content: string;
  isStreaming: boolean;
  timestamp: number;
}

export interface DebateRound {
  number: number;
  title: string;
  messages: AgentMessage[];
  isComplete: boolean;
}

export interface FlashReaction {
  agentId: AgentId;
  content: string;
  shiftType: string;
  timestamp: number;
}

export interface DebateState {
  eventTicker: string | null;
  rounds: DebateRound[];
  currentRound: number;
  isActive: boolean;
  isLoading: boolean;
  flashReactions: FlashReaction[];
}
