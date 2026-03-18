import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import type { Recommendation } from '../types/strategy';

interface StrategyResponse {
  recommendations: Recommendation[];
}

export const useStrategy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const { profile }              = useProfileStore();
  const { setRecommendations }   = useIntelligenceStore();

  const generate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: profile }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? `API error ${response.status}`);
      }

      const data = (await response.json()) as StrategyResponse;
      setRecommendations(data.recommendations ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate strategy');
    } finally {
      setIsLoading(false);
    }
  }, [profile, setRecommendations]);

  return { generate, isLoading, error };
};