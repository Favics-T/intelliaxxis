import { type FC, useState, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useStrategy } from '../hook/useStrategy';
import { RecommendationCard } from '../component/strategy/RecommendationCard';
import { PlaybookModal } from '../component/strategy/PlaybookModal';
import { Spinner } from '../component/ui/Spinner';
import { Button } from '../component/ui/Button';
import type { Recommendation, RecommendationStatus } from '../types/strategy';

const STATUS_FILTERS: { label: string; value: RecommendationStatus | 'all' }[] = [
  { label: 'All',         value: 'all'        },
  { label: 'Pending',     value: 'pending'     },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Saved',       value: 'saved'       },
  { label: 'Done',        value: 'done'        },
];

export const StrategyPage: FC = () => {
  const { profile }          = useProfileStore();
  const { recommendations }  = useIntelligenceStore();
  const { generate, isLoading, error } = useStrategy();

  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>('all');
  const [selectedRec, setSelectedRec]   = useState<Recommendation | null>(null);

  useEffect(() => {
    if (recommendations.length === 0 && !isLoading) {
      void generate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = recommendations
    .filter((r) => r.status !== 'dismissed')
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .sort((a, b) => b.impactScore - a.impactScore);

  const inProgress = recommendations.filter(r => r.status === 'in-progress').length;
  const done       = recommendations.filter(r => r.status === 'done').length;

  return (
    <div className="animate-[fade-up_0.5s_ease-out_both] space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-textSecondary mb-1">
            Strategic Recommendations
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Strategy Center
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            AI-generated playbooks tailored for{' '}
            <span className="text-cyan">{profile.businessName}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => void generate()}
          loading={isLoading}
        >
          ↻ Regenerate
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Building your strategy..." />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-card border border-danger/30 bg-danger/5 p-6 text-center space-y-3">
          <p className="text-sm font-medium text-textPrimary">Failed to generate strategy</p>
          <p className="text-xs text-textSecondary">{error}</p>
          <Button variant="danger" onClick={() => void generate()}>Try Again</Button>
        </div>
      )}

      {/* Stats */}
      {!isLoading && recommendations.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total',       value: recommendations.filter(r => r.status !== 'dismissed').length, color: 'text-cyan'    },
            { label: 'In Progress', value: inProgress,                                                    color: 'text-amber'   },
            { label: 'Completed',   value: done,                                                          color: 'text-emerald' },
            { label: 'Avg Impact',  value: recommendations.length ? Math.round(recommendations.reduce((a,r) => a + r.impactScore, 0) / recommendations.length) : 0, color: 'text-violet' },
          ].map((stat) => (
            <div key={stat.label} className="card-flat text-center space-y-1">
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>
                {stat.value}{stat.label === 'Avg Impact' ? '/100' : ''}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-textSecondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Status filters */}
      {!isLoading && recommendations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all ${
                statusFilter === f.value
                  ? 'border-cyan/60 bg-cyan/10 text-cyan'
                  : 'border-white/10 text-textSecondary hover:border-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Recommendation grid */}
      {!isLoading && visible.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {visible.map((rec, i) => (
            <div key={rec.id} style={{ animationDelay: `${i * 0.08}s` }}>
              <RecommendationCard rec={rec} onExpand={setSelectedRec} />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && visible.length === 0 && recommendations.length > 0 && (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
          <div className="text-4xl">🎯</div>
          <p className="font-medium text-textPrimary">No recommendations in this category</p>
          <button
            onClick={() => setStatusFilter('all')}
            className="font-mono text-[11px] text-cyan hover:underline"
          >
            Show all
          </button>
        </div>
      )}

      {/* Playbook modal */}
      {selectedRec && (
        <PlaybookModal rec={selectedRec} onClose={() => setSelectedRec(null)} />
      )}
    </div>
  );
};