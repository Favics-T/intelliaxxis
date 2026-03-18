import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import type { Signal } from '../types/intelligence';

interface IntelligenceResponse {
  summary: string;
  signals: Signal[];
}

export const useIntelligence = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [summary, setSummary]     = useState<string>('');

  const { profile }      = useProfileStore();
  const { setSignals }   = useIntelligenceStore();

  const generate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: profile }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? `API error ${response.status}`);
      }

      const data = (await response.json()) as IntelligenceResponse;
      setSignals(data.signals ?? []);
      setSummary(data.summary ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate intelligence');
    } finally {
      setIsLoading(false);
    }
  }, [profile, setSignals]);

  return { generate, isLoading, error, summary };
};