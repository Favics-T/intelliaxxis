import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Signal } from '../types/intelligence';
import type { Recommendation } from '../types/strategy';
import type { ResearchSession } from '../types/research';

interface IntelligenceStore {
  signals: Signal[];
  recommendations: Recommendation[];
  sessions: ResearchSession[];
  lastGeneratedAt: string | null;

  setSignals: (signals: Signal[]) => void;
  saveSignal: (id: string) => void;
  dismissSignal: (id: string) => void;

  setRecommendations: (recs: Recommendation[]) => void;
  updateRecommendationStatus: (id: string, status: Recommendation['status']) => void;

  addSession: (session: ResearchSession) => void;
  updateSession: (session: ResearchSession) => void;
  deleteSession: (id: string) => void;
}

export const useIntelligenceStore = create<IntelligenceStore>()(
  persist(
    (set) => ({
      signals: [],
      recommendations: [],
      sessions: [],
      lastGeneratedAt: null,

      setSignals: (signals) =>
        set({ signals, lastGeneratedAt: new Date().toISOString() }),

      saveSignal: (id) =>
        set((state) => ({
          signals: state.signals.map((s) =>
            s.id === id ? { ...s, saved: true } : s,
          ),
        })),

      dismissSignal: (id) =>
        set((state) => ({
          signals: state.signals.map((s) =>
            s.id === id ? { ...s, dismissed: true } : s,
          ),
        })),

      setRecommendations: (recommendations) =>
        set({ recommendations }),

      updateRecommendationStatus: (id, status) =>
        set((state) => ({
          recommendations: state.recommendations.map((r) =>
            r.id === id ? { ...r, status } : r,
          ),
        })),

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
        })),

      updateSession: (session) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === session.id ? session : s,
          ),
        })),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'intelliaxis-intelligence',
    },
  ),
);