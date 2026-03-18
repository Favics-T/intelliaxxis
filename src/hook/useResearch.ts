import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import type { ResearchSession, ResearchMessage } from '../types/research';
import { generateId } from '../utils/id';

interface ResearchResponse {
  answer: string;
  sources: string[];
}

export const useResearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(null);

  const { profile }                              = useProfileStore();
  const { addSession, updateSession, sessions }  = useIntelligenceStore();

  const ask = useCallback(async (question: string, sessionId?: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: ResearchMessage = {
      id: generateId(),
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    };

    let session = sessionId
      ? sessions.find((s) => s.id === sessionId) ?? null
      : null;

    if (!session) {
      session = {
        id: generateId(),
        title: question.slice(0, 60),
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addSession(session);
    } else {
      session = {
        ...session,
        messages: [...session.messages, userMessage],
        updatedAt: new Date().toISOString(),
      };
      updateSession(session);
    }

    setActiveSession(session);

    try {
      const history = session.messages
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history,
          context: {
            businessName:        profile.businessName,
            industry:            profile.industry,
            businessStage:       profile.businessStage,
            targetMarket:        profile.targetMarket,
            goals:               profile.goals,
            businessDescription: profile.businessDescription,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to get research response');
      }

      const data = (await response.json()) as ResearchResponse;

      const assistantMessage: ResearchMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        createdAt: new Date().toISOString(),
      };

      const updatedSession: ResearchSession = {
        ...session,
        messages: [...session.messages, assistantMessage],
        updatedAt: new Date().toISOString(),
      };

      updateSession(updatedSession);
      setActiveSession(updatedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed');
    } finally {
      setIsLoading(false);
    }
  }, [profile, sessions, addSession, updateSession]);

  return { ask, isLoading, error, activeSession, setActiveSession };
};