import type { FC } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':    { title: "Today's Intelligence",  subtitle: "What matters to your business right now" },
  '/intelligence': { title: 'Intelligence Feed',      subtitle: 'Industry trends and market signals' },
  '/strategy':     { title: 'Strategy Center',        subtitle: 'Your personalised growth playbooks' },
  '/research':     { title: 'Research Assistant',     subtitle: 'Ask anything about your industry' },
  '/digest':       { title: 'Weekly Digest',          subtitle: 'Your intelligence briefing' },
  '/competitors':  { title: 'Competitor Tracker',     subtitle: 'Monitor competitor moves' },
  '/profile':      { title: 'Business Profile',       subtitle: 'Your intelligence context' },
};

interface Props { onMenuClick: () => void }

export const Topbar: FC<Props> = ({ onMenuClick }) => {
  const location = useLocation();
  const page     = PAGE_TITLES[location.pathname] ?? { title: 'IntelliAxis', subtitle: '' };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-textSecondary hover:bg-surface md:hidden"
        >
          ☰
        </button>
        <div>
          <h1 className="text-[15px] font-bold text-textPrimary leading-tight">
            {page.title}
          </h1>
          <p className="hidden text-[11px] text-textSecondary sm:block">
            {page.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-emeraldLight border border-emerald/20 px-2.5 py-1 font-mono text-[10px] text-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-[pulse-dot_2s_ease-in-out_infinite]" />
          Live
        </span>
      </div>
    </header>
  );
};








