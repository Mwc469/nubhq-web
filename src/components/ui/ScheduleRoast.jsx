import React, { useMemo } from 'react';
import { parseISO, isMonday, isFriday, isWeekend, differenceInDays, getHours } from 'date-fns';
import { SCHEDULE_ROASTS, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

export default function ScheduleRoast({ scheduledAt, className }) {
  const roast = useMemo(() => {
    if (!scheduledAt) return null;
    
    const date = typeof scheduledAt === 'string' ? parseISO(scheduledAt) : scheduledAt;
    const hour = getHours(date);
    const daysUntil = differenceInDays(date, new Date());
    
    // Same day
    if (daysUntil === 0) {
      return pick(SCHEDULE_ROASTS.sameDay);
    }
    
    // Far future (> 14 days)
    if (daysUntil > 14) {
      return pick(SCHEDULE_ROASTS.farFuture);
    }
    
    // Late night (10pm - 5am)
    if (hour >= 22 || hour < 5) {
      return pick(SCHEDULE_ROASTS.lateNight);
    }
    
    // Monday morning
    if (isMonday(date) && hour < 10) {
      return pick(SCHEDULE_ROASTS.mondayMorning);
    }
    
    // Friday
    if (isFriday(date)) {
      return pick(SCHEDULE_ROASTS.friday);
    }
    
    // Weekend
    if (isWeekend(date)) {
      return pick(SCHEDULE_ROASTS.weekend);
    }
    
    return null;
  }, [scheduledAt]);

  if (!roast) return null;

  return (
    <p className={cn(
      "text-xs italic opacity-60 flex items-center gap-1",
      className
    )}>
      <span>🦦</span>
      <span>{roast}</span>
    </p>
  );
}
