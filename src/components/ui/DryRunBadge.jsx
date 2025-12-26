import { cn } from '../../lib/utils';
import { Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DryRunBadge({
  variant = 'default',
  className,
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (variant === 'compact') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg',
          'bg-neon-green/20 text-neon-green border border-neon-green/30',
          className
        )}
      >
        <Shield size={10} />
        DRY
      </span>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2',
        'bg-neon-green/10 border-neon-green/30',
        className
      )}
    >
      <Shield size={16} className="text-neon-green" />
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase tracking-wider text-neon-green">
          DRY RUN
        </span>
        <span className={cn(
          'text-[10px]',
          isLight ? 'text-gray-500' : 'text-white/50'
        )}>
          No real posts
        </span>
      </div>
    </div>
  );
}
