import type { FC } from 'react';
import type { Signal } from '../../types/intelligence';

interface Props {
  signals: Signal[];
}

const IMPACT_SCORE: Record<string, number> = {
  Critical: 100,
  High: 75,
  Medium: 50,
  Low: 25,
};

const TRAJECTORY_SCORE: Record<string, number> = {
  Accelerating: 90,
  Emerging: 70,
  Plateauing: 40,
  Declining: 20,
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

export const PriorityMatrix: FC<Props> = ({ signals }) => {
  const visible = signals.filter((s) => !s.dismissed).slice(0, 8);

  if (visible.length === 0) return null;

  // Map signals to x/y coordinates
  // x = urgency (trajectory score)  0-100
  // y = impact score                0-100
  const plotted = visible.map((s) => ({
    signal: s,
    x: TRAJECTORY_SCORE[s.trajectory] ?? 50,
    y: IMPACT_SCORE[s.impactLevel]    ?? 50,
  }));

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <p className="label-tag mb-0">Priority Matrix</p>
        <p className="font-mono text-[9px] text-textSecondary">
          Impact vs Urgency
        </p>
      </div>

      {/* Matrix */}
      <div className="relative">
        {/* Grid container */}
        <div
          className="relative rounded-xl border border-white/5 bg-surface2 overflow-hidden"
          style={{ height: 280 }}
        >
          {/* Quadrant backgrounds */}
          {/* Top right — Act Now (high impact, high urgency) */}
          <div className="absolute right-0 top-0 h-1/2 w-1/2 bg-danger/5 border-l border-b border-white/5" />
          {/* Top left — Monitor (high impact, low urgency) */}
          <div className="absolute left-0 top-0 h-1/2 w-1/2 bg-amber/5 border-r border-b border-white/5" />
          {/* Bottom right — Quick wins (low impact, high urgency) */}
          <div className="absolute right-0 bottom-0 h-1/2 w-1/2 bg-cyan/5 border-l border-t border-white/5" />
          {/* Bottom left — Low priority */}
          <div className="absolute left-0 bottom-0 h-1/2 w-1/2 border-r border-t border-white/5" />

          {/* Quadrant labels */}
          <div className="absolute right-2 top-2 font-mono text-[9px] uppercase tracking-widest  text-danger/60">
            Act Now
          </div>
          <div className="absolute left-2 top-2 font-mono text-[9px] uppercase tracking-widest text-amber/60">
            Monitor
          </div>
          <div className="absolute right-2 bottom-2 font-mono text-[9px] uppercase tracking-widest text-cyan/60">
            Quick Wins
          </div>
          <div className="absolute left-2 bottom-2 font-mono text-[9px] uppercase tracking-widest text-textDim">
            Low Priority
          </div>

          {/* Centre lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />

          {/* Signal dots */}
          {plotted.map(({ signal, x, y }) => (
            <div
              key={signal.id}
              className="absolute group cursor-pointer"
              style={{
                left:   `calc(${x}% - 14px)`,
                bottom: `calc(${y}% - 14px)`,
              }}
              title={signal.headline}
            >
              <div className={`
                flex h-7 w-7 items-center justify-center rounded-full border text-sm
                transition-all duration-200 group-hover:scale-125
                ${signal.impactLevel === 'Critical' ? 'border-danger/50 bg-danger/20' :
                  signal.impactLevel === 'High'     ? 'border-amber/50 bg-amber/20' :
                  signal.impactLevel === 'Medium'   ? 'border-cyan/50 bg-cyan/20' :
                                                      'border-white/10 bg-surface'}
              `}>
                {CATEGORY_ICONS[signal.category] ?? '📌'}
              </div>

              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-surface px-3 py-2 text-[11px] text-textPrimary shadow-xl group-hover:block z-10">
                <p className="font-medium leading-snug">{signal.headline}</p>
                <p className="mt-1 font-mono text-[9px] text-textSecondary">
                  {signal.impactLevel} · {signal.trajectory}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Axis labels */}
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="font-mono text-[9px] text-textSecondary">← Lower Urgency</span>
          <span className="font-mono text-[9px] text-textSecondary">Higher Urgency →</span>
        </div>
        <div
          className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] text-textSecondary"
          style={{ transformOrigin: 'center' }}
        >
          Impact ↑
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
          <span key={cat} className="flex items-center gap-1 font-mono text-[9px] text-textSecondary">
            {icon} {cat}
          </span>
        ))}
      </div>
    </div>
  );
};