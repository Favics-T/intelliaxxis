import type { FC } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':    { title: "Today's Intelligence",   subtitle: "What matters to your business right now" },
  '/intelligence': { title: 'Industry Intelligence',   subtitle: 'Trends, signals and market developments' },
  '/strategy':     { title: 'Strategy Center',         subtitle: 'AI-generated recommendations for your business' },
  '/research':     { title: 'Research Chat',           subtitle: 'Ask anything about your industry' },
  '/digest':       { title: 'Weekly Digest',           subtitle: 'Your personalised intelligence briefing' },
  '/competitors':  { title: 'Competitor Tracker',      subtitle: 'Monitor competitor moves and market positioning' },
  '/profile':      { title: 'Business Profile',        subtitle: 'Your business context and preferences' },
};

export const Topbar: FC = () => {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] ?? { title: 'IntelliAxis', subtitle: '' };

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-surface/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-[15px] font-semibold text-textPrimary leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-[11px] text-textSecondary mt-0.5">{page.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-textSecondary">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          Live
        </span>
      </div>
    </header>
  );
};