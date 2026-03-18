import { type FC, useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';

export const CompetitorsPage: FC = () => {
  const { profile, updateProfile } = useProfileStore();
  const { signals }                = useIntelligenceStore();
  const [draft, setDraft]          = useState('');

  const competitorSignals = signals.filter(
    (s) => s.category === 'Competitor Move' && !s.dismissed,
  );

  const addCompetitor = () => {
    const trimmed = draft.trim();
    if (trimmed && !profile.competitors.includes(trimmed)) {
      updateProfile({ competitors: [...profile.competitors, trimmed] });
    }
    setDraft('');
  };

  const removeCompetitor = (name: string) => {
    updateProfile({
      competitors: profile.competitors.filter((c) => c !== name),
    });
  };

  return (
    <div className="animate-[fade-up_0.5s_ease-out_both] space-y-6 max-w-3xl">

      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-textSecondary mb-1">
          Competitive Intelligence
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
          Competitor Tracker
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          Track competitor moves in <span className="text-cyan">{profile.industry}</span>
        </p>
      </div>

      {/* Add competitor */}
      <div className="card space-y-4">
        <p className="label-tag">Tracked Competitors</p>

        {/* Tag input */}
        <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-surface2 px-3 py-2.5 focus-within:border-cyan/40 transition-colors">
          {profile.competitors.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-[10px] text-cyan"
            >
              {c}
              <button
                onClick={() => removeCompetitor(c)}
                className="text-cyan/50 hover:text-cyan leading-none"
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addCompetitor();
              }
            }}
            onBlur={addCompetitor}
            placeholder={
              profile.competitors.length === 0
                ? 'Add competitors — press Enter to add each one'
                : ''
            }
            className="min-w-[200px] flex-1 bg-transparent text-sm text-textPrimary placeholder-textSecondary/40 outline-none"
          />
        </div>
        <p className="font-mono text-[10px] text-textSecondary">
          {profile.competitors.length} competitor{profile.competitors.length !== 1 ? 's' : ''} tracked ·
          Changes are saved automatically
        </p>
      </div>

      {/* Competitor cards */}
      {profile.competitors.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profile.competitors.map((competitor) => {
            const relevantSignals = competitorSignals.filter((s) =>
              s.headline.toLowerCase().includes(competitor.toLowerCase()) ||
              s.summary.toLowerCase().includes(competitor.toLowerCase()),
            );

            return (
              <div key={competitor} className="card space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface2 font-mono text-sm font-bold text-textPrimary">
                      {competitor[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-textPrimary">
                        {competitor}
                      </p>
                      <p className="font-mono text-[10px] text-textSecondary">
                        {profile.industry}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCompetitor(competitor)}
                    className="font-mono text-[10px] text-textDim hover:text-danger transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {relevantSignals.length > 0 ? (
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-textSecondary">
                      Recent Signals
                    </p>
                    {relevantSignals.slice(0, 2).map((s) => (
                      <div
                        key={s.id}
                        className="rounded-lg border border-white/5 bg-surface2 px-3 py-2"
                      >
                        <p className="text-[12px] text-textPrimary">{s.headline}</p>
                        <p className="mt-0.5 text-[11px] text-textSecondary line-clamp-2">
                          {s.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/5 bg-surface2 px-3 py-3 text-center">
                    <p className="text-[12px] text-textSecondary">
                      No specific signals detected yet
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-textDim">
                      Refresh intelligence to scan for competitor moves
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Competitor move signals */}
      {competitorSignals.length > 0 && (
        <div className="card space-y-4">
          <p className="label-tag">
            Competitor Intelligence Signals ({competitorSignals.length})
          </p>
          {competitorSignals.map((s) => (
            <div
              key={s.id}
              className="border-b border-white/5 pb-4 last:border-0 last:pb-0 space-y-1"
            >
              <p className="text-[13px] font-medium text-textPrimary">{s.headline}</p>
              <p className="text-[12px] text-textSecondary">{s.summary}</p>
              <p className="text-[11px] text-cyan">{s.strategicImplication}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {profile.competitors.length === 0 && (
        <div className="flex min-h-[20vh] flex-col items-center justify-center gap-3 text-center">
          <div className="text-4xl">🔍</div>
          <p className="font-medium text-textPrimary">No competitors tracked yet</p>
          <p className="text-sm text-textSecondary">
            Add your competitors above to start monitoring their moves
          </p>
        </div>
      )}
    </div>
  );
};