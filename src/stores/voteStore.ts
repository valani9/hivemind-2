import { create } from 'zustand';
import { AgentId } from '@/types/agent';
import { Vote, VoteDistribution, AccuracyRecord } from '@/types/voting';

interface VoteState {
  votes: Vote[];
  accuracyRecords: AccuracyRecord[];

  addVote: (vote: Vote) => void;
  getDistribution: (eventTicker: string) => VoteDistribution;
  getUserVote: (eventTicker: string) => AgentId | null;
  addAccuracyRecord: (record: AccuracyRecord) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useVoteStore = create<VoteState>((set, get) => ({
  votes: [],
  accuracyRecords: [],

  addVote: (vote) => {
    set((state) => {
      const filtered = state.votes.filter(v => v.eventTicker !== vote.eventTicker);
      const newVotes = [...filtered, vote];
      return { votes: newVotes };
    });
    get().saveToStorage();
  },

  getDistribution: (eventTicker) => {
    const votes = get().votes.filter(v => v.eventTicker === eventTicker);
    const total = votes.length || 1;
    const dist: VoteDistribution = { bull: 0, bear: 0, analyst: 0, contrarian: 0 };
    votes.forEach(v => { dist[v.agentId]++; });
    return {
      bull: Math.round((dist.bull / total) * 100),
      bear: Math.round((dist.bear / total) * 100),
      analyst: Math.round((dist.analyst / total) * 100),
      contrarian: Math.round((dist.contrarian / total) * 100),
    };
  },

  getUserVote: (eventTicker) => {
    const vote = get().votes.find(v => v.eventTicker === eventTicker);
    return vote?.agentId ?? null;
  },

  addAccuracyRecord: (record) => {
    set((state) => ({
      accuracyRecords: [...state.accuracyRecords, record],
    }));
    get().saveToStorage();
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const votes = JSON.parse(localStorage.getItem('so_votes') || '[]');
      const records = JSON.parse(localStorage.getItem('so_accuracy') || '[]');
      set({ votes, accuracyRecords: records });
    } catch { /* ignore */ }
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    const state = get();
    localStorage.setItem('so_votes', JSON.stringify(state.votes));
    localStorage.setItem('so_accuracy', JSON.stringify(state.accuracyRecords));
  },
}));
