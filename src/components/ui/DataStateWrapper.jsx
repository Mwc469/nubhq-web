/**
 * DataStateWrapper - Universal loading/error/empty/content handler
 *
 * Provides consistent UI states across all pages:
 * - Loading: Shows skeleton based on type
 * - Error: Shows ErrorState with retry
 * - Empty: Shows EmptyState based on type
 * - Content: Renders children
 */
import React from 'react';
import { cn } from '@/lib/utils';
import {
  SkeletonGrid,
  SkeletonList,
  SkeletonStats,
  SkeletonCard,
  LoadingSpinner,
} from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { FileText, Image, Trophy, Sparkles, Users, BarChart3 } from 'lucide-react';

// Skeleton type configurations
const SKELETON_TYPES = {
  grid: (props) => <SkeletonGrid {...props} />,
  list: (props) => <SkeletonList {...props} />,
  stats: (props) => <SkeletonStats {...props} />,
  card: (props) => <SkeletonCard {...props} />,
  spinner: (props) => (
    <div className="flex items-center justify-center min-h-[300px]">
      <LoadingSpinner size="lg" {...props} />
    </div>
  ),
};

// Empty state type to icon mapping
const EMPTY_ICONS = {
  posts: FileText,
  drafts: FileText,
  approvals: FileText,
  media: Image,
  achievements: Trophy,
  unlocks: Sparkles,
  leaderboard: Users,
  stats: BarChart3,
};

export default function DataStateWrapper({
  // State props
  isLoading = false,
  error = null,
  isEmpty = false,

  // Content customization
  skeletonType = 'spinner', // 'grid' | 'list' | 'stats' | 'card' | 'spinner'
  skeletonProps = {},
  emptyType = 'posts', // matches EMPTY_STATES keys in nubCopy
  emptyTitle,
  emptyMessage,
  emptyAction,

  // Error handling
  onRetry,
  errorType = 'generic',

  // Wrapper options
  className,
  minHeight = 'min-h-[300px]',

  // Content
  children,
}) {
  // Loading state
  if (isLoading) {
    const SkeletonComponent = SKELETON_TYPES[skeletonType] || SKELETON_TYPES.spinner;
    return (
      <div className={cn(minHeight, "flex items-center justify-center", className)}>
        {SkeletonComponent(skeletonProps)}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn(minHeight, className)}>
        <ErrorState
          error={error}
          onRetry={onRetry}
          type={errorType}
        />
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    const EmptyIcon = EMPTY_ICONS[emptyType];
    return (
      <div className={cn(minHeight, className)}>
        <EmptyState
          icon={EmptyIcon}
          type={emptyType}
          title={emptyTitle}
          description={emptyMessage}
          action={emptyAction}
        />
      </div>
    );
  }

  // Content
  return <div className={className}>{children}</div>;
}

/**
 * GameHubSkeleton - Custom skeleton for GameHub page
 */
export function GameHubSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border-3 border-gray-200 dark:border-gray-700 p-4 animate-pulse">
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Game buttons grid */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border-3 border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
            <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * AchievementsSkeleton - Grid of achievement cards
 */
export function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl border-3 border-gray-200 dark:border-gray-700 p-4 text-center animate-pulse">
          <div className="w-12 h-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
          <div className="h-4 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-6 w-1/2 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * LeaderboardSkeleton - List of ranking items
 */
export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-none" />
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex-none" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * UnlocksSkeleton - Grid of unlock items
 */
export function UnlocksSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-2xl border-3 border-gray-200 dark:border-gray-700 p-4 animate-pulse">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}
