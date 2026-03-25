import { type FC, useState, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useIntelligence } from '../hook/useIntelligence';
import { SignalCard } from '../component/dashboard/SignalCard';
import { SignalDetailModal } from '../component/dashboard/SignalDetailMode';
import { Spinner } from '../component/ui/Spinner';
import { Button } from '../component/ui/Button';
import type { Signal } from '../types/intelligence';
import type { PriorityMatrix } from '../component/dashboard/PriorityMatrix'


export const DashboardPage: FC = () => {
  const { profile }                              = useProfileStore();
  const { signals, lastGeneratedAt }             = useIntelligenceStore();
  const { generate, isLoading, error, summary }  = useIntelligence();
  const [selectedSignal, setSelectedSignal]      = useState<Signal | null>(null);

  const visibleSignals = signals.filter((s) => !s.dismissed);

  useEffect(() => {
    if (signals.length === 0 && !isLoading) {
      void generate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedDate = lastGeneratedAt
    ? new Date(lastGeneratedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="animate-[fade-up_0.5s_ease-out_both] space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-textSecondary mb-1">
            {formattedDate ?? 'Intelligence Dashboard'}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Good morning, {profile.founderName.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Here is what matters for{' '}
            <span className="text-cyan">{profile.businessName}</span> today
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => void generate()}
          loading={isLoading}
        >
          ↻ Refresh Intelligence
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="space-y-6 text-center">
            <Spinner size="lg" />
            <div className="space-y-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-textSecondary">
                Analysing your industry
              </p>
              <p className="text-sm text-textSecondary">
                Scanning signals relevant to{' '}
                <span className="text-textPrimary">{profile.businessName}</span>{' '}
                in <span className="text-cyan">{profile.industry}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-card border border-danger/30 bg-danger/5 p-6 text-center space-y-3">
          <p className="text-sm font-medium text-textPrimary">
            Failed to generate intelligence
          </p>
          <p className="text-xs text-textSecondary">{error}</p>
          <Button variant="danger" onClick={() => void generate()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Executive summary */}
      {summary && !isLoading && (
        <div className="rounded-xl border border-cyan/15 bg-gradient-to-r from-cyan/5 to-transparent p-5">
          <p className="label-tag">Executive Summary</p>
          <p className="text-[13px] leading-relaxed text-textSecondary">
            {summary}
          </p>
        </div>
      )}

      {/* Stats row */}
      {!isLoading && visibleSignals.length > 0 && (
       
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
           
          {[
            { label: 'Total Signals',  value: visibleSignals.length, color: 'text-cyan' },
            { label: 'Critical / High', value: visibleSignals.filter(s => ['Critical','High'].includes(s.impactLevel)).length, color: 'text-amber' },
            { label: 'Opportunities',  value: visibleSignals.filter(s => s.category === 'Opportunity').length, color: 'text-emerald' },
            { label: 'Saved',          value: signals.filter(s => s.saved).length, color: 'text-violet' },
          ].map((stat) => (
            <div key={stat.label} className="card-flat text-center space-y-1">
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>
                {stat.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-textSecondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Signal grid */}
      {!isLoading && visibleSignals.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="label-tag mb-0">
              {visibleSignals.length} Signal{visibleSignals.length !== 1 ? 's' : ''}
            </p>
            <p className="font-mono text-[10px] text-textSecondary">
              {profile.industry} · {profile.targetMarket}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleSignals.map((signal, i) => (
              <div key={signal.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <SignalCard
                  signal={signal}
                  onDeepDive={setSelectedSignal}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All dismissed */}
      {!isLoading && !error && visibleSignals.length === 0 && signals.length > 0 && (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
          <div className="text-5xl">✓</div>
          <p className="font-medium text-textPrimary">All caught up</p>
          <p className="text-sm text-textSecondary max-w-sm">
            You have reviewed all current signals. Refresh to get new intelligence.
          </p>
          <Button onClick={() => void generate()}>
            Get New Intelligence
          </Button>
        </div>
      )}

      {/* Detail modal */}
      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
        />
      )}
    </div>
  );
};