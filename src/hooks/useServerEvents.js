/**
 * NubHQ Real-time Events Hook
 * Subscribe to Server-Sent Events for live updates
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

// ============================================================
// SSE CONNECTION STATES
// ============================================================

export const ConnectionState = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
};

// ============================================================
// MAIN HOOK
// ============================================================

/**
 * Subscribe to server-sent events
 * 
 * @param {string[]} topics - Topics to subscribe to (jobs, content, system, all)
 * @param {Object} handlers - Event handlers { [eventType]: (data) => void }
 * @param {Object} options - { autoReconnect, reconnectDelay, onConnect, onDisconnect }
 */
export function useServerEvents(topics = ['all'], handlers = {}, options = {}) {
  const {
    autoReconnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
    onConnect,
    onDisconnect,
    onError,
    enabled = true,
  } = options;

  const [connectionState, setConnectionState] = useState(ConnectionState.DISCONNECTED);
  const [lastEvent, setLastEvent] = useState(null);
  const eventSourceRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const handlersRef = useRef(handlers);

  // Keep handlers ref updated
  handlersRef.current = handlers;

  const connect = useCallback(() => {
    if (!enabled) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const topicsParam = topics.join(',');
    const url = `${API_BASE}/api/events/stream?topics=${topicsParam}`;
    
    setConnectionState(ConnectionState.CONNECTING);
    
    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setConnectionState(ConnectionState.CONNECTED);
        reconnectAttempts.current = 0;
        onConnect?.();
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        setConnectionState(ConnectionState.ERROR);
        eventSource.close();
        eventSourceRef.current = null;
        onError?.(error);

        // Auto-reconnect
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = reconnectDelay * Math.pow(2, reconnectAttempts.current - 1);
          
          console.log(`SSE reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionState(ConnectionState.DISCONNECTED);
          toast.error('Lost connection to server. Please refresh the page.');
        }
      };

      // Handle all events
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastEvent(data);

          // Call specific handler if exists
          const handler = handlersRef.current[data.type];
          if (handler) {
            handler(data.data, data);
          }

          // Call wildcard handler if exists
          handlersRef.current['*']?.(data.type, data.data, data);
        } catch (e) {
          console.error('Error parsing SSE event:', e);
        }
      };

      // Handle specific event types
      Object.keys(handlersRef.current).forEach((eventType) => {
        if (eventType === '*') return;
        
        eventSource.addEventListener(eventType, (event) => {
          try {
            const data = JSON.parse(event.data);
            setLastEvent(data);
            handlersRef.current[eventType]?.(data.data, data);
          } catch (e) {
            console.error(`Error parsing ${eventType} event:`, e);
          }
        });
      });

    } catch (error) {
      console.error('Failed to create EventSource:', error);
      setConnectionState(ConnectionState.ERROR);
      onError?.(error);
    }
  }, [topics, enabled, autoReconnect, reconnectDelay, maxReconnectAttempts, onConnect, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setConnectionState(ConnectionState.DISCONNECTED);
    onDisconnect?.();
  }, [onDisconnect]);

  // Connect on mount
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    connectionState,
    isConnected: connectionState === ConnectionState.CONNECTED,
    lastEvent,
    connect,
    disconnect,
  };
}

// ============================================================
// SPECIALIZED HOOKS
// ============================================================

/**
 * Subscribe to job updates
 */
export function useJobUpdates(jobId, onUpdate) {
  const [job, setJob] = useState(null);

  const handlers = {
    job_update: (data) => {
      if (!jobId || data.job_id === jobId) {
        setJob(data);
        onUpdate?.(data);
      }
    },
  };

  const { isConnected } = useServerEvents(['jobs'], handlers, {
    enabled: !!jobId,
  });

  return { job, isConnected };
}

/**
 * Subscribe to content updates
 */
export function useContentUpdates(onUpdate) {
  const handlers = {
    content_update: (data) => {
      onUpdate?.(data);
    },
  };

  return useServerEvents(['content'], handlers);
}

/**
 * Subscribe to notifications
 */
export function useNotifications(onNotification) {
  const handlers = {
    notification: (data) => {
      // Auto-show toast for notifications
      const { title, message, level = 'info' } = data;
      
      switch (level) {
        case 'success':
          toast.success(message, { description: title });
          break;
        case 'warning':
          toast.warning(message, { description: title });
          break;
        case 'error':
          toast.error(message, { description: title });
          break;
        default:
          toast.info(message, { description: title });
      }

      onNotification?.(data);
    },
  };

  return useServerEvents(['all'], handlers);
}

// ============================================================
// CONNECTION STATUS COMPONENT
// ============================================================

export function ConnectionStatus({ connectionState }) {
  if (connectionState === ConnectionState.CONNECTED) {
    return null; // Don't show when connected
  }

  const statusConfig = {
    [ConnectionState.CONNECTING]: {
      color: 'bg-yellow-500',
      text: 'Connecting...',
    },
    [ConnectionState.DISCONNECTED]: {
      color: 'bg-gray-500',
      text: 'Disconnected',
    },
    [ConnectionState.ERROR]: {
      color: 'bg-red-500',
      text: 'Connection Error',
    },
  };

  const config = statusConfig[connectionState];
  if (!config) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border">
      <span className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}

export default useServerEvents;
