import React, { useMemo } from 'react';
import { CHARACTER_COUNT, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

// Platform-specific character limits
const PLATFORM_LIMITS = {
  twitter: 280,
  instagram: 2200,
  facebook: 63206,
  tiktok: 2200,
  youtube: 5000,
  default: 2200,
};

export default function NubCharacterCount({ 
  text = '', 
  platform = 'default',
  showRoast = true,
  className 
}) {
  const limit = PLATFORM_LIMITS[platform] || PLATFORM_LIMITS.default;
  const count = text.length;
  const remaining = limit - count;
  const percentage = (count / limit) * 100;

  // Determine status and roast
  const { status, roast } = useMemo(() => {
    if (count === 0) {
      return { status: 'empty', roast: null };
    }
    if (count < 20) {
      return { status: 'short', roast: pick(CHARACTER_COUNT.tooShort) };
    }
    if (percentage > 100) {
      return { status: 'over', roast: pick(CHARACTER_COUNT.wayTooLong) };
    }
    if (percentage > 90) {
      return { status: 'warning', roast: pick(CHARACTER_COUNT.tooLong) };
    }
    if (percentage > 70) {
      return { status: 'long', roast: pick(CHARACTER_COUNT.gettingLong) };
    }
    if (percentage > 30) {
      return { status: 'good', roast: pick(CHARACTER_COUNT.perfect) };
    }
    return { status: 'short', roast: null };
  }, [count, percentage]);

  const statusColors = {
    empty: 'text-gray-400',
    short: 'text-gray-500',
    good: 'text-[var(--neon-green)]',
    long: 'text-[var(--neon-yellow)]',
    warning: 'text-[var(--neon-orange)]',
    over: 'text-[var(--neon-pink)]',
  };

  const progressColors = {
    empty: 'bg-gray-200 dark:bg-gray-700',
    short: 'bg-gray-300 dark:bg-gray-600',
    good: 'bg-[var(--neon-green)]',
    long: 'bg-[var(--neon-yellow)]',
    warning: 'bg-[var(--neon-orange)]',
    over: 'bg-[var(--neon-pink)]',
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-300",
            progressColors[status]
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Count and roast */}
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-mono", statusColors[status])}>
          {count.toLocaleString()} / {limit.toLocaleString()}
          {remaining < 0 && (
            <span className="ml-1 font-bold">({Math.abs(remaining)} over!)</span>
          )}
        </span>
        
        {showRoast && roast && (
          <span className={cn("text-xs italic", statusColors[status])}>
            {roast}
          </span>
        )}
      </div>
    </div>
  );
}
