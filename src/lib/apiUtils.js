/**
 * NubHQ API Utilities
 * Unified error handling, retries, caching, and offline detection
 */

import { toast } from 'sonner';
import { getAccessToken, refreshAccessToken, forceLogout } from '../contexts/AuthContext';

// ============================================================
// CONFIGURATION
// ============================================================

export const API_CONFIG = {
  baseUrl: (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, ''),
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  cacheTime: 5 * 60 * 1000, // 5 minutes
};

// ============================================================
// ONLINE/OFFLINE DETECTION
// ============================================================

let isOnline = navigator.onLine;
let isBackendAvailable = true;
const onlineListeners = new Set();

export function getOnlineStatus() {
  return { isOnline, isBackendAvailable };
}

export function subscribeToOnlineStatus(callback) {
  onlineListeners.add(callback);
  return () => onlineListeners.delete(callback);
}

function notifyOnlineStatus() {
  const status = { isOnline, isBackendAvailable };
  onlineListeners.forEach(cb => cb(status));
}

// Browser online/offline
window.addEventListener('online', () => {
  isOnline = true;
  notifyOnlineStatus();
  toast.success('Back online!', { id: 'online-status' });
});

window.addEventListener('offline', () => {
  isOnline = false;
  isBackendAvailable = false;
  notifyOnlineStatus();
  toast.warning('You\'re offline. Changes will sync when reconnected.', {
    id: 'online-status',
    duration: Infinity,
  });
});

// ============================================================
// ERROR TYPES
// ============================================================

export class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error - please check your connection') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request timed out - please try again') {
    super(message, 0, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends ApiError {
  constructor(message, details) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

// ============================================================
// ERROR MESSAGES (NUB VOICE)
// ============================================================

const ERROR_MESSAGES = {
  // HTTP Status Codes
  400: "That request made no sense. Try again with less chaos.",
  401: "You're not authorized. Did you forget to log in?",
  403: "Access denied. This area is for authorized otters only.",
  404: "That thing doesn't exist. Maybe it never did.",
  409: "Conflict! Someone else is messing with this.",
  422: "The data was weird. Even for us, and we love weird.",
  429: "Slow down there, speed demon! Too many requests.",
  500: "Server had a meltdown. Our otters are investigating.",
  502: "Bad gateway. The backend is having a moment.",
  503: "Service unavailable. Probably Matt's fault.",
  504: "Gateway timeout. The server got distracted.",

  // Custom Codes
  NETWORK_ERROR: "Can't reach the server. Check your internet?",
  TIMEOUT: "Request took too long. The server fell asleep.",
  OFFLINE: "You're offline. We'll sync when you're back.",
  AUTHENTICATION_ERROR: "Session expired. Please log in again.",
  UNKNOWN: "Something weird happened. Even for NUB.",
};

export function getErrorMessage(error) {
  if (error instanceof ApiError) {
    return ERROR_MESSAGES[error.status] || ERROR_MESSAGES[error.code] || error.message;
  }
  return error.message || ERROR_MESSAGES.UNKNOWN;
}

// ============================================================
// RETRY LOGIC
// ============================================================

const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

function shouldRetry(error, attempt, maxRetries) {
  if (attempt >= maxRetries) return false;
  if (!isOnline) return false;
  if (error instanceof ValidationError) return false;
  if (error instanceof AuthenticationError) return false;
  if (error instanceof ApiError && !RETRYABLE_STATUSES.includes(error.status)) return false;
  return true;
}

async function withRetry(fn, options = {}) {
  const maxRetries = options.retries ?? API_CONFIG.retries;
  const baseDelay = options.retryDelay ?? API_CONFIG.retryDelay;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error, attempt, maxRetries)) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============================================================
// FETCH WRAPPER WITH AUTH
// ============================================================

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    isForm = false,
    timeout = API_CONFIG.timeout,
    retries = API_CONFIG.retries,
    showError = true,
    showSuccess = false,
    successMessage = 'Done!',
    requireAuth = true, // Most API calls require auth
    skipAuthRetry = false, // Skip token refresh on 401 (used internally)
  } = options;

  // Offline check
  if (!isOnline) {
    const error = new NetworkError('You\'re offline');
    if (showError) toast.error(getErrorMessage(error));
    throw error;
  }

  const url = `${API_CONFIG.baseUrl}${path}`;

  const fetchOptions = {
    method,
    headers: {
      ...(!isForm && { 'Content-Type': 'application/json' }),
      ...headers,
    },
  };

  // Inject auth header if we have a token and auth is required
  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      fetchOptions.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (body) {
    fetchOptions.body = isForm ? body : JSON.stringify(body);
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  fetchOptions.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const result = await withRetry(async () => {
      const response = await fetch(url, fetchOptions);

      // Update backend availability
      isBackendAvailable = true;

      // Handle 401 - try to refresh token
      if (response.status === 401 && !skipAuthRetry && requireAuth) {
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Retry the request with the new token
          fetchOptions.headers.Authorization = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, fetchOptions);

          if (!retryResponse.ok) {
            if (retryResponse.status === 401) {
              // Still 401 after refresh - force logout
              forceLogout();
              throw new AuthenticationError('Session expired. Please log in again.');
            }

            let message = `Request failed (${retryResponse.status})`;
            try {
              const errorData = await retryResponse.json();
              message = errorData?.detail || errorData?.error || errorData?.message || message;
            } catch (_) {}

            throw new ApiError(message, retryResponse.status, `HTTP_${retryResponse.status}`);
          }

          const contentType = retryResponse.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            return retryResponse.json();
          }
          return retryResponse.text();
        } else {
          // No refresh token or refresh failed
          forceLogout();
          throw new AuthenticationError('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        let message = `Request failed (${response.status})`;
        let details = null;

        try {
          const errorData = await response.json();
          message = errorData?.detail || errorData?.error || errorData?.message || message;
          details = errorData;
        } catch (_) {}

        throw new ApiError(message, response.status, `HTTP_${response.status}`, details);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return response.json();
      }
      return response.text();
    }, { retries });

    if (showSuccess) {
      toast.success(successMessage);
    }

    return result;

  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort (timeout)
    if (error.name === 'AbortError') {
      const timeoutError = new TimeoutError();
      if (showError) toast.error(getErrorMessage(timeoutError));
      throw timeoutError;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      isBackendAvailable = false;
      notifyOnlineStatus();
      const networkError = new NetworkError();
      if (showError) toast.error(getErrorMessage(networkError));
      throw networkError;
    }

    // Handle authentication errors - redirect to login
    if (error instanceof AuthenticationError) {
      if (showError) toast.error(getErrorMessage(error));
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw error;
    }

    // Handle API errors
    if (error instanceof ApiError) {
      if (showError) toast.error(getErrorMessage(error));
      throw error;
    }

    // Unknown errors
    if (showError) toast.error(getErrorMessage(error));
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================
// OPTIMISTIC UPDATES HELPER
// ============================================================

export function createOptimisticMutation(queryClient) {
  return function optimisticMutation({
    mutationFn,
    queryKey,
    optimisticUpdate,
    onSuccess,
    onError,
  }) {
    return {
      mutationFn,
      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey });

        // Snapshot current value
        const previousData = queryClient.getQueryData(queryKey);

        // Optimistically update
        if (optimisticUpdate) {
          queryClient.setQueryData(queryKey, (old) => optimisticUpdate(old, variables));
        }

        return { previousData };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData);
        }
        onError?.(err, variables, context);
      },
      onSuccess: (data, variables, context) => {
        onSuccess?.(data, variables, context);
      },
      onSettled: () => {
        // Refetch to ensure consistency
        queryClient.invalidateQueries({ queryKey });
      },
    };
  };
}

// ============================================================
// DEBOUNCE & THROTTLE
// ============================================================

export function debounce(fn, delay = 300) {
  let timeoutId;

  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timeoutId);
  debounced.flush = () => {
    clearTimeout(timeoutId);
    fn();
  };

  return debounced;
}

export function throttle(fn, limit = 300) {
  let inThrottle = false;

  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`nubhq_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`nubhq_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`nubhq_${key}`);
      return true;
    } catch {
      return false;
    }
  },

  // Auto-save drafts
  saveDraft(key, value) {
    return this.set(`draft_${key}`, {
      value,
      savedAt: new Date().toISOString(),
    });
  },

  getDraft(key) {
    return this.get(`draft_${key}`);
  },

  clearDraft(key) {
    return this.remove(`draft_${key}`);
  },
};

// ============================================================
// VALIDATION HELPERS
// ============================================================

export const validate = {
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value, min, fieldName = 'Field') => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value, max, fieldName = 'Field') => {
    if (value && value.length > max) {
      return `${fieldName} must be at most ${max} characters`;
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return null;
  },

  url: (value) => {
    try {
      if (value) new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },

  // Run multiple validators
  all: (value, validators) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  },
};

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

const shortcuts = new Map();

export function registerShortcut(key, callback, description = '') {
  shortcuts.set(key.toLowerCase(), { callback, description });
}

export function unregisterShortcut(key) {
  shortcuts.delete(key.toLowerCase());
}

export function getShortcuts() {
  return Array.from(shortcuts.entries()).map(([key, { description }]) => ({
    key,
    description,
  }));
}

// Global keyboard listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    // Don't trigger in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Build key string
    const parts = [];
    if (e.metaKey || e.ctrlKey) parts.push('cmd');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    parts.push(e.key.toLowerCase());

    const keyString = parts.join('+');

    const shortcut = shortcuts.get(keyString);
    if (shortcut) {
      e.preventDefault();
      shortcut.callback(e);
    }
  });
}

// Register default shortcuts
registerShortcut('cmd+k', () => {
  document.querySelector('[data-global-search]')?.click();
}, 'Open search');

registerShortcut('cmd+n', () => {
  window.location.href = '/PostStudio';
}, 'New post');

registerShortcut('?', () => {
  console.log('Shortcuts:', getShortcuts());
}, 'Show shortcuts');

// ============================================================
// PERFORMANCE MONITORING
// ============================================================

export const perf = {
  marks: new Map(),

  start(name) {
    this.marks.set(name, performance.now());
  },

  end(name, log = true) {
    const start = this.marks.get(name);
    if (!start) return null;

    const duration = performance.now() - start;
    this.marks.delete(name);

    if (log) {
      const color = duration > 1000 ? 'red' : duration > 100 ? 'orange' : 'green';
      console.log(`%c⏱ ${name}: ${duration.toFixed(2)}ms`, `color: ${color}`);
    }

    return duration;
  },

  measure(name, fn) {
    this.start(name);
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(() => this.end(name));
    }
    this.end(name);
    return result;
  },
};
