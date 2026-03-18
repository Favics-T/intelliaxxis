import type { FC } from 'react';
import type { Signal } from '../../types/intelligence';
import { useIntelligenceStore } from '../../store/intelligenceStore';

const IMPACT_STYLES: Record<string, string> = {
  Critical: 'badge-danger',
  High:     'badge-amber',
  Medium:   'badge-cyan',
  Low:      'badge-default',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Market Trend':      '📈',
  'Competitor Move':   '🔍',
  'Regulation':        '⚖️',
  'Technology':        '⚡',
  'Consumer Behavior': '👥',
  'Economic Signal':   '💹',
  'Opportunity':       '🎯',
};

interface Props {
  signal: Signal;
  onDeepDive?: (signal: Signal) => void;
}

export const SignalCard: FC<Props> = ({ signal, onDeepDive }) => {
  const { saveSignal, dismissSignal } = useIntelligenceStore();

  if (signal.dismissed) return null;

  return (
    <div className="card animate-[fade-up_0.5s_ease-out_both] space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">
            {CATEGORY_ICONS[signal.category] ?? '📌'}
          </span>
          <span className={`badge ${IMPACT_STYLES[signal.impactLevel] ?? 'badge-default'}`}>
            {signal.impactLevel}
          </span>
        </div>
        <span className="badge badge-default shrink-0 text-[9px]">
          {signal.category}
        </span>
      </div>

      <h3 className="text-[14px] font-semibold leading-snug text-textPrimary">
        {signal.headline}
      </h3>

      <p className="text-[13px] leading-relaxed text-textSecondary">
        {signal.summary}
      </p>

      <div className="rounded-lg border border-cyan/10 bg-cyan/5 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan mb-1">
          Why it matters
        </p>
        <p className="text-[12px] leading-relaxed text-textSecondary">
          {signal.whyItMatters}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {signal.saved ? (
          <span className="rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald">
            ✓ Saved
          </span>
        ) : (
          <button
            onClick={() => saveSignal(signal.id)}
            className="rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald transition-all hover:bg-emerald/20"
          >
            ✓ Save
          </button>
        )}
        {onDeepDive && (
          <button
            onClick={() => onDeepDive(signal)}
            className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-textSecondary transition-all hover:border-cyan/30 hover:text-cyan"
          >
            Deep Dive →
          </button>
        )}
        <button
          onClick={() => dismissSignal(signal.id)}
          className="ml-auto rounded-full border border-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-textDim transition-all hover:border-danger/20 hover:text-danger"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};