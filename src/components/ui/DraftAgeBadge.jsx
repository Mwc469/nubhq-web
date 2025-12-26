import React, { useMemo } from 'react';
import { differenceInDays, differenceInHours, formatDistanceToNow, parseISO } from 'date-fns';
import { Clock, AlertTriangle, Skull } from 'lucide-react';
import { DRAFT_AGE_ROASTS, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

export default function DraftAgeBadge({ 
  createdAt, 
  showRoast = true,
  size = 'default' // 'default' | 'sm'
}) {
  const { age, status, roast, Icon } = useMemo(() => {
    if (!createdAt) return { age: null, status: 'unknown', roast: null, Icon: Clock };
    
    const date = typeof createdAt === 'string' ? parseISO(createdAt) : createdAt;
    const days = differenceInDays(new Date(), date);
    const hours = differenceInHours(new Date(), date);
    
    if (hours < 24) {
      return { 
        age: 'Fresh', 
        status: 'fresh', 
        roast: pick(DRAFT_AGE_ROASTS.fresh),
        Icon: Clock 
      };
    }
    if (days < 7) {
      return { 
        age: `${days}d old`, 
        status: 'stale', 
        roast: pick(DRAFT_AGE_ROASTS.stale),
        Icon: Clock 
      };
    }
    if (days < 30) {
      return { 
        age: `${Math.floor(days / 7)}w old`, 
        status: 'old', 
        roast: pick(DRAFT_AGE_ROASTS.old),
        Icon: AlertTriangle 
      };
    }
    return { 
      age: `${Math.floor(days / 30)}mo old`, 
      status: 'ancient', 
      roast: pick(DRAFT_AGE_ROASTS.ancient),
      Icon: Skull 
    };
  }, [createdAt]);

  if (!createdAt) return null;

  const statusStyles = {
    fresh: 'bg-[var(--neon-green)]/10 text-[var(--neon-green)] border-[var(--neon-green)]/30',
    stale: 'bg-[var(--neon-yellow)]/10 text-[var(--neon-yellow)] border-[var(--neon-yellow)]/30',
    old: 'bg-[var(--neon-orange)]/10 text-[var(--neon-orange)] border-[var(--neon-orange)]/30',
    ancient: 'bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] border-[var(--neon-pink)]/30',
    unknown: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const sizeStyles = {
    default: 'px-2 py-1 text-xs',
    sm: 'px-1.5 py-0.5 text-[10px]',
  };

  return (
    <div className="group relative inline-block">
      <span className={cn(
        "inline-flex items-center gap-1 rounded-full border font-bold",
        statusStyles[status],
        sizeStyles[size]
      )}>
        <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        {age}
      </span>
      
      {/* Roast tooltip on hover */}
      {showRoast && roast && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold max-w-xs text-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-normal">
          {roast}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </div>
      )}
    </div>
  );
}
