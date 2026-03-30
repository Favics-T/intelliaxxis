import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard',    label: 'Dashboard',    icon: '' },
  { path: '/intelligence', label: 'Intelligence',  icon: '' },
  { path: '/strategy',     label: 'Strategy',      icon: '' },
  { path: '/research',     label: 'Research',      icon: '' },
  { path: '/digest',       label: 'Digest',        icon: '' },
  { path: '/competitors',  label: 'Competitors',   icon: '' },
];

interface Props { onClose?: () => void }

export const Sidebar: FC<Props> = ({ onClose }) => {
  const { profile } = useProfileStore();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue font-mono text-xs font-bold text-white">
            IX
          </div>
          <div>
            <p className="text-[13px] font-bold text-textPrimary tracking-tight">
              IntelliAxis
            </p>
            <p className="text-[10px] text-textSecondary">
              Industry Intelligence
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-textSecondary hover:bg-surface2 md:hidden"
          >
            ✕
          </button>
        )}
      </div>

      {/* Business badge */}
      {profile.businessName && (
        <div className="mx-3 mt-3 rounded-lg bg-blueLight border border-blue/10 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-blue mb-0.5">
            Active Profile
          </p>
          <p className="text-[12px] font-semibold text-textPrimary truncate">
            {profile.businessName}
          </p>
          <p className="text-[11px] text-textSecondary truncate">
            {profile.industry}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3 mt-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                isActive
                  ? 'bg-blueLight text-blue font-semibold'
                  : 'text-textSecondary hover:bg-surface hover:text-textPrimary'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-[13px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile footer */}
      <div className="border-t border-border p-3">
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
              isActive
                ? 'bg-blueLight text-blue'
                : 'text-textSecondary hover:bg-surface hover:text-textPrimary'
            }`
          }
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue font-sans text-[12px] font-bold text-white">
            {profile.founderName ? profile.founderName[0].toUpperCase() : '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-textPrimary">
              {profile.founderName || 'My Profile'}
            </p>
            <p className="truncate text-[10px] text-textSecondary">
              {profile.businessStage || 'Setup profile'}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};