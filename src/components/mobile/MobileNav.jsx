import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  PenTool,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/post-studio', icon: PenTool, label: 'Create' },
  { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const MobileNav = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 border-t-3 border-black z-50 lg:hidden',
        isLight ? 'bg-white' : 'bg-brand-dark'
      )}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          const isCreate = to === '/post-studio';

          if (isCreate) {
            return (
              <NavLink
                key={to}
                to={to}
                className="flex flex-col items-center justify-center"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center -mt-4 border-3 border-black transition-all',
                    'bg-neon-pink text-white shadow-[4px_4px_0_#000]',
                    isActive && 'shadow-[2px_2px_0_#000] translate-x-[2px] translate-y-[2px]'
                  )}
                >
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <span className={cn(
                  'text-[10px] mt-1 font-bold uppercase tracking-wider',
                  isActive ? 'text-neon-pink' : isLight ? 'text-gray-500' : 'text-white/50'
                )}>
                  {label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center px-2 py-1"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  isActive
                    ? 'bg-neon-pink/20 text-neon-pink'
                    : isLight
                    ? 'text-gray-400 hover:text-gray-600'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  'text-[10px] mt-0.5 font-bold uppercase tracking-wider',
                  isActive ? 'text-neon-pink' : isLight ? 'text-gray-500' : 'text-white/50'
                )}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
