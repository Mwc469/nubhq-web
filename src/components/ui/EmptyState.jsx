import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { EMPTY_STATES, pick } from '@/lib/nubCopy';

export default function EmptyState({ 
  icon: Icon,
  title,
  description,
  action,
  type, // 'drafts' | 'posts' | 'approvals' | 'media' | 'templates' | 'events' | 'activity' | 'search'
  className 
}) {
  // Get a random roast if type is provided and no custom title/description
  const roast = useMemo(() => {
    if (type && EMPTY_STATES[type] && !title && !description) {
      return pick(EMPTY_STATES[type]);
    }
    return null;
  }, [type, title, description]);

  const displayTitle = title || roast?.title || "Nothing here";
  const displayDescription = description || roast?.message || "It's looking a bit empty...";

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-8 text-center",
      className
    )}>
      {Icon && (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#a76d24]/20 to-[#f19b38]/20 flex items-center justify-center mb-6 border-3 border-dashed border-[#f19b38]/30 animate-pulse">
          <Icon className="w-10 h-10 text-[#f19b38]" />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{displayTitle}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm max-w-sm mb-6">
        {displayDescription}
      </p>
      {action}
    </div>
  );
}
