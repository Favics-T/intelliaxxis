import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  relevanceScore: number;
}

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const { profile } = useProfileStore();

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: profile.industry,
          market:   profile.targetMarket,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch news');

      const data = await response.json();
      setArticles(data.articles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  }, [profile.industry, profile.targetMarket]);

  return { articles, fetchNews, isLoading, error };
};