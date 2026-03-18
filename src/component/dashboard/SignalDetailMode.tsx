import type { FC } from 'react';
import type { Signal } from '../../types/intelligence';

interface Props {
  signal: Signal;
  onClose: () => void;
}

export const SignalDetailModal: FC<Props> = ({ signal, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="card-flat w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-amber">{signal.impactLevel}</span>
            <span className="badge badge-default">{signal.category}</span>
            <span className="badge badge-cyan">{signal.trajectory}</span>
          </div>
          <h2 className="text-lg font-bold text-textPrimary leading-snug">
            {signal.headline}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-textSecondary hover:text-textPrimary"
        >
          ✕
        </button>
      </div>

      <div>
        <p className="label-tag">Full Analysis</p>
        <p className="text-[13px] leading-relaxed text-textSecondary">
          {signal.fullAnalysis}
        </p>
      </div>

      <div className="rounded-xl border border-cyan/15 bg-cyan/5 p-4">
        <p className="label-tag">Why It Matters To You</p>
        <p className="text-[13px] leading-relaxed text-textSecondary">
          {signal.whyItMatters}
        </p>
      </div>

      <div>
        <p className="label-tag">Strategic Implication</p>
        <p className="text-[13px] leading-relaxed text-textSecondary">
          {signal.strategicImplication}
        </p>
      </div>

      <div>
        <p className="label-tag">Recommended Actions</p>
        <div className="space-y-2.5">
          {signal.recommendedActions.map((action, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 font-mono text-[10px] text-cyan mt-0.5">
                {i + 1}
              </div>
              <p className="text-[13px] leading-relaxed text-textSecondary">
                {action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);