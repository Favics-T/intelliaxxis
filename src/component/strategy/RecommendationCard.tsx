import type { FC } from 'react';
import type { Recommendation } from '../../types/strategy';
import { useIntelligenceStore } from '../../store/intelligenceStore';

const EFFORT_STYLES: Record<string, string> = {
  Low:    'badge-emerald',
  Medium: 'badge-amber',
  High:   'badge-danger',
};

const TIME_STYLES: Record<string, string> = {
  'Immediate':    'badge-danger',
  'This Week':    'badge-amber',
  'This Month':   'badge-cyan',
  'This Quarter': 'badge-default',
};

const STATUS_STYLES: Record<string, string> = {
  pending:     'badge-default',
  saved:       'badge-cyan',
  'in-progress': 'badge-amber',
  done:        'badge-emerald',
  dismissed:   'badge-default',
};

interface Props {
  rec: Recommendation;
  onExpand?: (rec: Recommendation) => void;
}

export const RecommendationCard: FC<Props> = ({ rec, onExpand }) => {
  const { updateRecommendationStatus } = useIntelligenceStore();

  if (rec.status === 'dismissed') return null;

  return (
    <div className="card space-y-4">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge ${TIME_STYLES[rec.timeSensitivity] ?? 'badge-default'}`}>
          {rec.timeSensitivity}
        </span>
        <span className={`badge ${EFFORT_STYLES[rec.effortLevel] ?? 'badge-default'}`}>
          {rec.effortLevel} effort
        </span>
        <span className={`badge ${STATUS_STYLES[rec.status] ?? 'badge-default'}`}>
          {rec.status}
        </span>
        <span className="ml-auto font-mono text-[10px] text-textSecondary">
          Impact: <span className="text-cyan">{rec.impactScore}</span>/100
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold leading-snug text-textPrimary">
        {rec.title}
      </h3>

      {/* Rationale */}
      <p className="text-[13px] leading-relaxed text-textSecondary">
        {rec.rationale}
      </p>

      {/* Why it matters */}
      <div className="rounded-lg border border-violet/10 bg-violet/5 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-violet mb-1">
          Why it matters
        </p>
        <p className="text-[12px] leading-relaxed text-textSecondary">
          {rec.whyItMatters}
        </p>
      </div>

      {/* Framework */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-textSecondary">Framework:</span>
        <span className="font-mono text-[10px] text-cyan">{rec.framework}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {rec.status === 'pending' && (
          <>
            <button
              onClick={() => updateRecommendationStatus(rec.id, 'in-progress')}
              className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-cyan transition-all hover:bg-cyan/20"
            >
              Start →
            </button>
            <button
              onClick={() => updateRecommendationStatus(rec.id, 'saved')}
              className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-textSecondary transition-all hover:border-white/20"
            >
              Save
            </button>
          </>
        )}
        {rec.status === 'in-progress' && (
          <button
            onClick={() => updateRecommendationStatus(rec.id, 'done')}
            className="rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald transition-all hover:bg-emerald/20"
          >
            ✓ Mark Done
          </button>
        )}
        {onExpand && (
          <button
            onClick={() => onExpand(rec)}
            className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-textSecondary transition-all hover:border-cyan/30 hover:text-cyan"
          >
            View Playbook →
          </button>
        )}
        <button
          onClick={() => updateRecommendationStatus(rec.id, 'dismissed')}
          className="ml-auto rounded-full border border-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-textDim transition-all hover:border-danger/20 hover:text-danger"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};