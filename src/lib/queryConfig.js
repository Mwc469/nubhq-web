/**
 * React Query Configuration
 * Centralized config for caching, retries, and error handling
 */

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError, NetworkError, TimeoutError, getErrorMessage } from './apiUtils';

// ============================================================
// QUERY CLIENT CONFIGURATION
// ============================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Caching
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 30 * 60 * 1000, // 30 minutes - cache garbage collection (was cacheTime)
      
      // Retries
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetching behavior
      refetchOnWindowFocus: false, // Don't spam on tab focus
      refetchOnReconnect: true, // Refetch when coming back online
      refetchOnMount: true,
      
      // Network mode
      networkMode: 'offlineFirst', // Return cached data when offline
    },
    mutations: {
      // Retry mutations only once
      retry: 1,
      retryDelay: 1000,
      
      // Global error handling for mutations
      onError: (error) => {
        console.error('Mutation error:', error);
        // Don't show toast here - let individual mutations handle it
      },
    },
  },
});

// ============================================================
// QUERY KEYS FACTORY
// ============================================================

/**
 * Centralized query key factory for consistent cache management
 */
export const queryKeys = {
  // Content
  contentItems: {
    all: ['content-items'],
    list: (filters) => ['content-items', 'list', filters],
    detail: (id) => ['content-items', 'detail', id],
  },
  
  // Approvals
  approvals: {
    all: ['approvals'],
    pending: () => ['approvals', 'pending'],
    stats: () => ['approvals', 'stats'],
  },
  
  // Media
  media: {
    all: ['media'],
    list: (filters) => ['media', 'list', filters],
    detail: (id) => ['media', 'detail', id],
  },
  
  // Templates
  templates: {
    all: ['templates'],
    list: (filters) => ['templates', 'list', filters],
    detail: (id) => ['templates', 'detail', id],
  },
  
  // Calendar
  calendar: {
    all: ['calendar'],
    events: (days) => ['calendar', 'events', days],
    show: (id) => ['calendar', 'show', id],
  },
  
  // Dashboard
  dashboard: {
    overview: () => ['dashboard', 'overview'],
    suggestions: () => ['dashboard', 'suggestions'],
    dueItems: () => ['dashboard', 'due-items'],
  },
  
  // Activity
  activity: {
    all: ['activity'],
    list: (filters) => ['activity', 'list', filters],
  },
  
  // Video/Clips
  clips: {
    all: ['clips'],
    highlights: (videoId) => ['clips', 'highlights', videoId],
    jobs: () => ['clips', 'jobs'],
    job: (id) => ['clips', 'job', id],
  },
};

// ============================================================
// PREFETCH HELPERS
// ============================================================

/**
 * Prefetch data for faster navigation
 */
export async function prefetchDashboard() {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.overview(),
      staleTime: 60 * 1000, // Fresh for 1 minute
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.approvals.pending(),
      staleTime: 30 * 1000,
    }),
  ]);
}

export async function prefetchContent() {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.contentItems.list({}),
    staleTime: 60 * 1000,
  });
}

// ============================================================
// CACHE HELPERS
// ============================================================

/**
 * Invalidate related caches after mutations
 */
export function invalidateContentCaches() {
  queryClient.invalidateQueries({ queryKey: queryKeys.contentItems.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
  queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
}

export function invalidateApprovalCaches() {
  queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
}

export function invalidateMediaCaches() {
  queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
}

/**
 * Optimistically update cache
 */
export function optimisticUpdate(queryKey, updater) {
  queryClient.setQueryData(queryKey, updater);
}

/**
 * Get cached data
 */
export function getCachedData(queryKey) {
  return queryClient.getQueryData(queryKey);
}

// ============================================================
// CUSTOM HOOKS HELPERS
// ============================================================

/**
 * Standard query options factory
 */
export function createQueryOptions(queryKey, queryFn, options = {}) {
  return {
    queryKey,
    queryFn,
    ...options,
  };
}

/**
 * Standard mutation options factory with toast feedback
 */
export function createMutationOptions({
  mutationFn,
  onSuccess,
  onError,
  invalidateKeys = [],
  successMessage,
  errorMessage,
}) {
  return {
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate caches
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      // Show success toast
      if (successMessage) {
        toast.success(typeof successMessage === 'function' 
          ? successMessage(data, variables) 
          : successMessage
        );
      }
      
      // Call custom handler
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error toast
      const message = errorMessage 
        ? (typeof errorMessage === 'function' ? errorMessage(error) : errorMessage)
        : getErrorMessage(error);
      toast.error(message);
      
      // Call custom handler
      onError?.(error, variables, context);
    },
  };
}

// ============================================================
// POLLING HELPERS
// ============================================================

/**
 * Poll query until condition is met
 */
export function pollUntil(queryKey, queryFn, conditionFn, intervalMs = 2000) {
  return new Promise((resolve, reject) => {
    const checkCondition = async () => {
      try {
        const data = await queryClient.fetchQuery({
          queryKey,
          queryFn,
          staleTime: 0, // Always fetch fresh
        });
        
        if (conditionFn(data)) {
          resolve(data);
          return;
        }
        
        // Continue polling
        setTimeout(checkCondition, intervalMs);
      } catch (error) {
        reject(error);
      }
    };
    
    checkCondition();
  });
}

// ============================================================
// DEV TOOLS
// ============================================================

if (import.meta?.env?.DEV) {
  // Expose query client for debugging
  window.__queryClient = queryClient;
  
  // Log cache state changes
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated') {
      console.log('📦 Cache updated:', event.query.queryKey);
    }
  });
}

export default queryClient;
