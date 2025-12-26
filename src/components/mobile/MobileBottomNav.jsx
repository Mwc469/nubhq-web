/**
 * MobileBottomNav - Game-style bottom navigation for mobile
 */
import { NavLink, useLocation } from 'react-router-dom';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  User,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { playSound } from '../../lib/soundSystem';
import { haptic } from './MobileComponents';

const navItems = [
  { to: '/', icon: Gamepad2, label: 'Hub' },
  { to: '/achievements', icon: Trophy, label: 'Trophies' },
  { to: '/unlocks', icon: Sparkles, label: 'Unlocks' },
  { to: '/leaderboard', icon: User, label: 'Profile' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleNavClick = () => {
    playSound('tap');
    haptic?.('light');
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'border-t-3 border-black',
        isLight ? 'bg-white/95 backdrop-blur-sm' : 'bg-brand-dark/95 backdrop-blur-sm'
      )}
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className="flex flex-col items-center justify-center px-4 py-2 min-w-[64px] min-h-[48px] relative touch-target"
            >
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-pink" />
              )}

              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                  isActive
                    ? 'bg-neon-pink/20 text-neon-pink scale-110'
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

      {/* Safe area padding for notched devices */}
      <div className="h-safe-bottom" />
    </nav>
  );
}
