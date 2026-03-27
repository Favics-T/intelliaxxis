import { type FC, useState, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useIntelligence } from '../hook/useIntelligence';
import { SignalCard } from '../component/dashboard/SignalCard';
import { SignalDetailModal } from '../component/dashboard/SignalDetailMode';
import { Spinner } from '../component/ui/Spinner';
import { NewsFeed } from '../component/intelligence/NewsFeed';
import { TrendChart } from '../component/intelligence/TrendChart';
import { Button } from '../component/ui/Button';
import type { Signal } from '../types/intelligence';
import type { SignalCategory, ImpactLevel } from '../types/intelligence';

const CATEGORIES: SignalCategory[] = [
  'Market Trend',
  'Competitor Move',
  'Regulation',
  'Technology',
  'Consumer Behavior',
  'Economic Signal',
  'Opportunity',
];

const IMPACT_LEVELS: ImpactLevel[] = ['Critical', 'High', 'Medium', 'Low'];

export const IntelligencePage: FC = () => {
  const { profile }                             = useProfileStore();
  const { signals }                             = useIntelligenceStore();
  const { generate, isLoading, error, summary } = useIntelligence();

  const [selectedSignal, setSelectedSignal]     = useState<Signal | null>(null);
  const [categoryFilter, setCategoryFilter]     = useState<SignalCategory | 'All'>('All');
  const [impactFilter, setImpactFilter]         = useState<ImpactLevel | 'All'>('All');
  const [showSavedOnly, setShowSavedOnly]       = useState(false);

  useEffect(() => {
    if (signals.length === 0 && !isLoading) {
      void generate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = signals
    .filter((s) => !s.dismissed)
    .filter((s) => categoryFilter === 'All' || s.category === categoryFilter)
    .filter((s) => impactFilter  === 'All' || s.impactLevel === impactFilter)
    .filter((s) => !showSavedOnly || s.saved);

  return (
    <div className=" animate-fade-up space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-textSecondary mb-1">
            {profile.industry} · {profile.targetMarket}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Industry Intelligence Feed
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            {signals.filter(s => !s.dismissed).length} active signals for{' '}
            <span className="text-cyan">{profile.businessName}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => void generate()}
          loading={isLoading}
        >
          ↻ Refresh
        </Button>
      </div>

      {/* Filters */}
      {!isLoading && signals.length > 0 && (
        <div className="space-y-3">
          {/* Category filter */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-textSecondary mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {(['All', ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all ${
                    categoryFilter === cat
                      ? 'border-cyan/60 bg-cyan/10 text-cyan'
                      : 'border-white/10 text-textSecondary hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Impact + saved filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {(['All', ...IMPACT_LEVELS] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setImpactFilter(level)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all ${
                    impactFilter === level
                      ? 'border-amber/60 bg-amber/10 text-amber'
                      : 'border-white/10 text-textSecondary hover:border-white/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all ${
                showSavedOnly
                  ? 'border-emerald/60 bg-emerald/10 text-emerald'
                  : 'border-white/10 text-textSecondary hover:border-white/20'
              }`}
            >
              ✓ Saved Only
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Scanning industry signals..." />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-card border border-danger/30 bg-danger/5 p-6 text-center space-y-3">
          <p className="text-sm font-medium text-textPrimary">Failed to load intelligence</p>
          <p className="text-xs text-textSecondary">{error}</p>
          <Button variant="danger" onClick={() => void generate()}>Try Again</Button>
        </div>
      )}

      {/* Summary */}
      {summary && !isLoading && (
        <div className="rounded-xl border border-cyan/15 bg-gradient-to-r from-cyan/5 to-transparent p-5">
          <p className="label-tag">Industry Summary</p>
          <p className="text-[13px] leading-relaxed text-textSecondary">{summary}</p>
        </div>
      )}

      {!isLoading && signals.length > 0 && (
  <TrendChart signals={signals} />
)}

      {/* Results count */}
      {!isLoading && filtered.length > 0 && (
        <p className="font-mono text-[11px] text-textSecondary">
          Showing {filtered.length} of {signals.filter(s => !s.dismissed).length} signals
        </p>
      )}

      {/* Signal grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((signal, i) => (
            <div key={signal.id} style={{ animationDelay: `${i * 0.06}s` }}>
              <SignalCard signal={signal} onDeepDive={setSelectedSignal} />
            </div>
          ))}
        </div>
      )}

      {/* Empty filtered */}
      {!isLoading && !error && filtered.length === 0 && signals.length > 0 && (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
          <div className="text-4xl">🔍</div>
          <p className="font-medium text-textPrimary">No signals match your filters</p>
          <button
            onClick={() => {
              setCategoryFilter('All');
              setImpactFilter('All');
              setShowSavedOnly(false);
            }}
            className="font-mono text-[11px] text-cyan hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* No signals at all */}
      {!isLoading && !error && signals.length === 0 && (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
          <div className="text-5xl">🔭</div>
          <p className="font-medium text-textPrimary">No intelligence yet</p>
          <Button onClick={() => void generate()}>Generate Intelligence</Button>
        </div>
      )}

      {/* Detail modal */}
      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
        />
      )}

      {/* Live News Feed */}
{!isLoading && (
  <NewsFeed />
)}
    </div>
  );
};