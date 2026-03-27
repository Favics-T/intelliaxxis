import { type FC, useEffect } from 'react';
import { useNews } from '../../hook/useNews';
import { useProfileStore } from '../../store/profileStore';
import { Spinner } from '../ui/Spinner';

const timeAgo = (dateString: string): string => {
  const mins = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 60000,
  );
  if (mins < 60)  return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
};

export const NewsFeed: FC = () => {
  const { articles, fetchNews, isLoading } = useNews();
  const { profile } = useProfileStore();

  useEffect(() => {
    void fetchNews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="label-tag mb-0">
          Live Industry News
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-[pulse-glow_2s_ease-in-out_infinite]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="font-mono text-[10px] text-textSecondary">
            {profile.industry}
          </span>
          <button
            onClick={() => void fetchNews()}
            className="font-mono text-[10px] text-cyan hover:underline"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner size="sm" />
        </div>
      )}

      {/* Articles */}
      {!isLoading && articles.length > 0 && (
  <div className="space-y-0 divide-y divide-white/5">
    {articles.map((article, i) => (
      <a
        key={article.id}
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 py-3.5 first:pt-0 last:pb-0 transition-colors hover:bg-white/2"
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        <div className="mt-1 flex shrink-0 flex-col items-center gap-1">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              article.relevanceScore >= 90
                ? 'bg-danger'
                : article.relevanceScore >= 80
                ? 'bg-amber'
                : article.relevanceScore >= 70
                ? 'bg-cyan'
                : 'bg-textDim'
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium leading-snug text-textPrimary group-hover:text-cyan transition-colors line-clamp-2">
            {article.title}
          </p>

          <p className="mt-1 text-[11px] leading-relaxed text-textSecondary line-clamp-2">
            {article.description}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="font-mono text-[9px] text-textDim">
              {article.source}
            </span>

            <span className="text-textDim">·</span>

            <span className="font-mono text-[9px] text-textDim">
              {timeAgo(article.publishedAt)}
            </span>

            <span className="text-textDim">·</span>

            <span
              className={`font-mono text-[9px] ${
                article.relevanceScore >= 90
                  ? 'text-danger'
                  : article.relevanceScore >= 80
                  ? 'text-amber'
                  : 'text-cyan'
              }`}
            >
              {article.relevanceScore}% relevant
            </span>
          </div>
        </div>

        <span className="shrink-0 font-mono text-[11px] text-textDim opacity-0 transition-opacity group-hover:opacity-100">
          →
        </span>
      </a>
    ))}
  </div>
)}

      {/* Empty */}
      {!isLoading && articles.length === 0 && (
        <p className="py-4 text-center text-[13px] text-textSecondary">
          No news found for {profile.industry}
        </p>
      )}
    </div>
  );
};