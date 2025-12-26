import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { getLoadingMessage } from '@/lib/personality';

// Fun loading messages that rotate
const WALRUS_LOADING_TIPS = [
  "The walrus is thinking...",
  "Doing walrus things...",
  "Summoning content from the void...",
  "Consulting the chaos gods...",
  "Warming up the weird machine...",
  "Hold tight, we're being weird...",
  "Manifesting pixels...",
  "Teaching the otter to fetch...",
  "Brewing digital chaos...",
  "Asking the cactus for advice...",
  "Vibing sensually...",
  "Loading the weirdness...",
];

/**
 * Skeleton - Animated placeholder while content loads
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  );
}

/**
 * SkeletonText - Text line placeholder
 */
export function SkeletonText({ lines = 1, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - Card-shaped placeholder
 */
export function SkeletonCard({ className, hasImage = false, lines = 3 }) {
  return (
    <div className={cn(
      "rounded-2xl border-3 border-gray-200 dark:border-gray-700 p-4 space-y-4",
      className
    )}>
      {hasImage && (
        <Skeleton className="aspect-video w-full rounded-xl" />
      )}
      <div className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <SkeletonText lines={lines} />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * SkeletonTable - Table placeholder
 */
export function SkeletonTable({ rows = 5, columns = 4, className }) {
  return (
    <div className={cn("rounded-xl border-3 border-gray-200 dark:border-gray-700 overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gray-100 dark:bg-gray-800 p-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div 
          key={rowIdx} 
          className="p-3 flex gap-4 border-t border-gray-100 dark:border-gray-800"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton 
              key={colIdx} 
              className={cn(
                "h-4 flex-1",
                colIdx === 0 && "w-1/4 flex-none"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonGrid - Grid of cards placeholder
 */
export function SkeletonGrid({ count = 6, columns = 3, hasImage = true, className }) {
  return (
    <div className={cn(
      "grid gap-4",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} hasImage={hasImage} />
      ))}
    </div>
  );
}

/**
 * SkeletonList - List items placeholder
 */
export function SkeletonList({ count = 5, className }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <Skeleton className="w-10 h-10 rounded-lg flex-none" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonStatCard - Single stat card placeholder
 */
export function SkeletonStatCard({ className }) {
  return (
    <div className={cn("rounded-2xl border-3 border-gray-200 dark:border-gray-700 p-4", className)}>
      <Skeleton className="h-3 w-1/2 mb-2" />
      <Skeleton className="h-8 w-2/3 mb-1" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

/**
 * SkeletonStats - Dashboard stats placeholder
 */
export function SkeletonStats({ count = 4, className }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border-3 border-gray-200 dark:border-gray-700 p-4">
          <Skeleton className="h-3 w-1/2 mb-2" />
          <Skeleton className="h-8 w-2/3 mb-1" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

/**
 * LoadingSpinner - Centered spinner with optional message
 */
export function LoadingSpinner({ message, size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-[#f19b38]", sizes[size])} />
      {message && (
        <p className="text-sm opacity-60 animate-pulse">{message}</p>
      )}
    </div>
  );
}

/**
 * LoadingOverlay - Full-screen or container overlay
 */
export function LoadingOverlay({ message, isFullScreen = false }) {
  return (
    <div className={cn(
      "flex items-center justify-center bg-white/80 dark:bg-[#262729]/80 backdrop-blur-sm z-50",
      isFullScreen ? "fixed inset-0" : "absolute inset-0 rounded-2xl"
    )}>
      <LoadingSpinner message={message} size="lg" />
    </div>
  );
}

/**
 * LoadingPage - Full page loading state with rotating walrus messages
 */
export function LoadingPage({ message, rotateMessages = true }) {
  const [currentMessage, setCurrentMessage] = useState(
    message || WALRUS_LOADING_TIPS[0]
  );

  useEffect(() => {
    if (!rotateMessages || message) return;

    const interval = setInterval(() => {
      setCurrentMessage(
        WALRUS_LOADING_TIPS[Math.floor(Math.random() * WALRUS_LOADING_TIPS.length)]
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [rotateMessages, message]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🦦</div>
        <LoadingSpinner message={currentMessage} />
      </div>
    </div>
  );
}

/**
 * Suspense fallback wrapper with skeleton
 */
export function SuspenseFallback({ type = 'page', ...props }) {
  switch (type) {
    case 'page':
      return <LoadingPage {...props} />;
    case 'grid':
      return <SkeletonGrid {...props} />;
    case 'list':
      return <SkeletonList {...props} />;
    case 'table':
      return <SkeletonTable {...props} />;
    case 'stats':
      return <SkeletonStats {...props} />;
    case 'card':
      return <SkeletonCard {...props} />;
    default:
      return <LoadingSpinner {...props} />;
  }
}

/**
 * ContentLoader - Wrapper that shows skeleton while loading
 */
export function ContentLoader({ 
  isLoading, 
  isEmpty, 
  error,
  skeleton,
  emptyMessage = "Nothing here yet",
  emptyIcon = "🦦",
  children,
}) {
  if (isLoading) {
    return skeleton || <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">😵</div>
        <p className="font-bold text-[#b44a1c] mb-2">Something went wrong</p>
        <p className="text-sm opacity-60">{error.message || 'Unknown error'}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">{emptyIcon}</div>
        <p className="opacity-60">{emptyMessage}</p>
      </div>
    );
  }

  return children;
}

export default {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonGrid,
  SkeletonList,
  SkeletonStats,
  LoadingSpinner,
  LoadingOverlay,
  LoadingPage,
  SuspenseFallback,
  ContentLoader,
};
