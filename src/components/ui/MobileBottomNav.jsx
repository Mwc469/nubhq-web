import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  PenSquare,
  CheckCircle,
  Image,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
  { icon: Plus, label: 'Create', path: '/post-studio', isMain: true },
  { icon: CheckCircle, label: 'Approvals', path: '/approvals' },
  { icon: Image, label: 'Media', path: '/media' },
];

export function MobileBottomNav({ className }) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'bg-background/95 backdrop-blur-md border-t-2 border-foreground/10',
        'safe-area-inset-bottom',
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isMain) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -mt-6"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br from-pink-500 to-purple-600',
                    'border-4 border-background shadow-lg',
                    'text-white'
                  )}
                  style={{
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-1 px-3 min-w-[60px]"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon
                  className={cn(
                    'w-6 h-6 transition-colors',
                    isActive
                      ? 'text-pink-500'
                      : 'text-muted-foreground'
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
              <span
                className={cn(
                  'text-[10px] mt-1 font-medium transition-colors',
                  isActive
                    ? 'text-pink-500'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Quick action FAB for mobile
export function QuickActionFAB({ onClick, className }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 lg:hidden',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-br from-cyan-400 to-cyan-600',
        'flex items-center justify-center',
        'shadow-lg border-2 border-background',
        'text-white',
        className
      )}
      style={{
        boxShadow: '0 4px 20px rgba(34, 211, 238, 0.4)',
      }}
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
}

export default MobileBottomNav;
