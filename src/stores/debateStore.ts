import { create } from 'zustand';
import { AgentId, AgentMessage, DebateRound, FlashReaction } from '@/types/agent';

interface DebateState {
  eventTicker: string | null;
  rounds: DebateRound[];
  currentRound: number;
  isActive: boolean;
  isGenerating: boolean;
  flashReactions: FlashReaction[];
  selectedContract: number;

  startDebate: (ticker: string) => void;
  setCurrentRound: (round: number) => void;
  addMessage: (message: AgentMessage) => void;
  updateMessage: (agentId: AgentId, round: number, content: string) => void;
  finishMessage: (agentId: AgentId, round: number) => void;
  completeRound: (round: number) => void;
  setGenerating: (generating: boolean) => void;
  addFlashReaction: (reaction: FlashReaction) => void;
  setSelectedContract: (index: number) => void;
  reset: () => void;
}

const ROUND_TITLES = ['', 'Opening Statements', 'Rebuttals', 'Final Verdicts'];

export const useDebateStore = create<DebateState>((set) => ({
  eventTicker: null,
  rounds: [],
  currentRound: 0,
  isActive: false,
  isGenerating: false,
  flashReactions: [],
  selectedContract: 0,

  startDebate: (ticker) => set({
    eventTicker: ticker,
    rounds: [1, 2, 3].map(n => ({
      number: n,
      title: ROUND_TITLES[n],
      messages: [],
      isComplete: false,
    })),
    currentRound: 1,
    isActive: true,
    isGenerating: false,
    flashReactions: [],
  }),

  setCurrentRound: (round) => set({ currentRound: round }),

  addMessage: (message) => set((state) => {
    const rounds = state.rounds.map(r => {
      if (r.number === message.round) {
        return { ...r, messages: [...r.messages, message] };
      }
      return r;
    });
    return { rounds };
  }),

  updateMessage: (agentId, round, content) => set((state) => {
    const rounds = state.rounds.map(r => {
      if (r.number === round) {
        const messages = r.messages.map(m => {
          if (m.agentId === agentId && m.round === round) {
            return { ...m, content };
          }
          return m;
        });
        return { ...r, messages };
      }
      return r;
    });
    return { rounds };
  }),

  finishMessage: (agentId, round) => set((state) => {
    const rounds = state.rounds.map(r => {
      if (r.number === round) {
        const messages = r.messages.map(m => {
          if (m.agentId === agentId && m.round === round) {
            return { ...m, isStreaming: false };
          }
          return m;
        });
        return { ...r, messages };
      }
      return r;
    });
    return { rounds };
  }),

  completeRound: (round) => set((state) => {
    const rounds = state.rounds.map(r => {
      if (r.number === round) return { ...r, isComplete: true };
      return r;
    });
    return { rounds, isGenerating: false };
  }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  addFlashReaction: (reaction) => set((state) => ({
    flashReactions: [...state.flashReactions.slice(-10), reaction],
  })),

  setSelectedContract: (index) => set({ selectedContract: index }),

  reset: () => set({
    eventTicker: null,
    rounds: [],
    currentRound: 0,
    isActive: false,
    isGenerating: false,
    flashReactions: [],
    selectedContract: 0,
  }),
}));
