import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard',     label: 'Dashboard',   icon: '⚡' },
  { path: '/intelligence',  label: 'Intelligence', icon: '🔭' },
  { path: '/strategy',      label: 'Strategy',     icon: '🎯' },
  { path: '/research',      label: 'Research',     icon: '💬' },
  { path: '/digest',        label: 'Digest',       icon: '📋' },
  { path: '/competitors',   label: 'Competitors',  icon: '🔍' },
];

interface Props {
  onClose?: () => void;
}

export const Sidebar: FC<Props> = ({ onClose }) => {
  const { profile } = useProfileStore();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-white/5 bg-surface">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/30 font-mono text-xs text-cyan font-bold">
            IX
          </span>
          <span className="font-mono text-sm font-medium tracking-[0.06em] text-textPrimary">
            IntelliAxis
          </span>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1 text-textSecondary hover:text-textPrimary md:hidden"
          >
            ✕
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-cyan/10 text-cyan border border-cyan/20'
                  : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary border border-transparent'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="font-sans text-[13px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile footer */}
      <div className="border-t border-white/5 p-4">
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
              isActive
                ? 'bg-cyan/10 text-cyan'
                : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'
            }`
          }
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface2 border border-white/10 font-mono text-[11px] text-textSecondary">
            {profile.founderName ? profile.founderName[0].toUpperCase() : '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-textPrimary">
              {profile.businessName || 'My Business'}
            </p>
            <p className="truncate text-[10px] text-textSecondary">
              {profile.industry || 'Setup profile'}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};