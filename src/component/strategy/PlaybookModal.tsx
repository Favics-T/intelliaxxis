import type { FC } from 'react';
import type { Recommendation } from '../../types/strategy';

interface Props {
  rec: Recommendation;
  onClose: () => void;
}

export const PlaybookModal: FC<Props> = ({ rec, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="card-flat w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-violet">{rec.framework}</span>
            <span className="badge badge-cyan">{rec.timeSensitivity}</span>
            <span className="badge badge-default">Impact: {rec.impactScore}/100</span>
          </div>
          <h2 className="text-lg font-bold text-textPrimary">{rec.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-textSecondary hover:text-textPrimary"
        >
          ✕
        </button>
      </div>

      {/* Rationale */}
      <div>
        <p className="label-tag">Rationale</p>
        <p className="text-[13px] leading-relaxed text-textSecondary">{rec.rationale}</p>
      </div>

      {/* Why it matters */}
      <div className="rounded-xl border border-violet/15 bg-violet/5 p-4">
        <p className="label-tag">Why It Matters</p>
        <p className="text-[13px] leading-relaxed text-textSecondary">{rec.whyItMatters}</p>
      </div>

      {/* Implementation steps */}
      <div>
        <p className="label-tag">Implementation Playbook</p>
        <div className="space-y-3">
          {rec.implementationSteps.map((step) => (
            <div
              key={step.step}
              className="flex items-start gap-4 rounded-xl border border-white/5 bg-surface2 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 font-mono text-xs font-bold text-cyan">
                {step.step}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[13px] text-textPrimary">{step.action}</p>
                <p className="font-mono text-[10px] text-textSecondary">
                  ⏱ {step.timeframe}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);