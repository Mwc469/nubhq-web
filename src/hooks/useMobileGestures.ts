/**
 * NubHQ Mobile Gesture Hooks
 * Touch-first interactions that feel native
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// ============================================================
// DEVICE DETECTION
// ============================================================

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function useTouchDevice() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
}

// ============================================================
// SWIPE GESTURE
// ============================================================

interface SwipeState {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  preventScroll?: boolean;
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    preventScroll = false,
  } = options;

  const [state, setState] = useState<SwipeState>({
    direction: null,
    distance: 0,
    velocity: 0,
  });

  const startRef = useRef({ x: 0, y: 0, time: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    currentRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    currentRef.current = { x: touch.clientX, y: touch.clientY };

    const deltaX = touch.clientX - startRef.current.x;
    const deltaY = touch.clientY - startRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    let direction: SwipeState['direction'] = null;
    let distance = 0;

    if (absX > absY) {
      direction = deltaX > 0 ? 'right' : 'left';
      distance = absX;
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
      distance = absY;
    }

    if (preventScroll && distance > 10) {
      e.preventDefault();
    }

    setState({ direction, distance, velocity: 0 });
  }, [preventScroll]);

  const handleTouchEnd = useCallback(() => {
    const deltaX = currentRef.current.x - startRef.current.x;
    const deltaY = currentRef.current.y - startRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const duration = Date.now() - startRef.current.time;
    const velocity = Math.max(absX, absY) / duration;

    if (absX > threshold && absX > absY) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absY > threshold && absY > absX) {
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    setState({ direction: null, distance: 0, velocity });
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const bind = useMemo(() => ({
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }), [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { state, bind };
}

// ============================================================
// LONG PRESS
// ============================================================

interface UseLongPressOptions {
  duration?: number;
  onLongPress: () => void;
  onPress?: () => void;
}

export function useLongPress(options: UseLongPressOptions) {
  const { duration = 500, onLongPress, onPress } = options;
  
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, duration);
  }, [duration, onLongPress]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isLongPress.current) {
      onPress?.();
    }
  }, [onPress]);

  const bind = useMemo(() => ({
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: stop, // Cancel on move
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
  }), [start, stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return bind;
}

// ============================================================
// DOUBLE TAP
// ============================================================

interface UseDoubleTapOptions {
  delay?: number;
  onDoubleTap: () => void;
  onSingleTap?: () => void;
}

export function useDoubleTap(options: UseDoubleTapOptions) {
  const { delay = 300, onDoubleTap, onSingleTap } = options;
  
  const lastTap = useRef(0);
  const timerRef = useRef<number | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      // Double tap
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      onDoubleTap();
    } else {
      // Potential single tap
      timerRef.current = window.setTimeout(() => {
        onSingleTap?.();
      }, delay);
    }

    lastTap.current = now;
  }, [delay, onDoubleTap, onSingleTap]);

  const bind = useMemo(() => ({
    onClick: handleTap,
  }), [handleTap]);

  return bind;
}

// ============================================================
// PINCH ZOOM
// ============================================================

interface PinchState {
  scale: number;
  origin: { x: number; y: number };
}

export function usePinchZoom(minScale = 1, maxScale = 3) {
  const [state, setState] = useState<PinchState>({
    scale: 1,
    origin: { x: 0, y: 0 },
  });

  const initialDistance = useRef(0);
  const initialScale = useRef(1);

  const getDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touches: TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches);
      initialScale.current = state.scale;
      setState(s => ({ ...s, origin: getCenter(e.touches) }));
    }
  }, [state.scale]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      const currentDistance = getDistance(e.touches);
      const scaleChange = currentDistance / initialDistance.current;
      const newScale = Math.min(
        maxScale,
        Math.max(minScale, initialScale.current * scaleChange)
      );
      
      setState({
        scale: newScale,
        origin: getCenter(e.touches),
      });
    }
  }, [minScale, maxScale]);

  const handleTouchEnd = useCallback(() => {
    // Snap to 1 if close
    if (state.scale < 1.1) {
      setState(s => ({ ...s, scale: 1 }));
    }
  }, [state.scale]);

  const reset = useCallback(() => {
    setState({ scale: 1, origin: { x: 0, y: 0 } });
  }, []);

  const bind = useMemo(() => ({
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }), [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { state, bind, reset };
}

// ============================================================
// PULL TO REFRESH
// ============================================================

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
}

export function usePullToRefresh(options: UsePullToRefreshOptions) {
  const { onRefresh, threshold = 80, maxPull = 120 } = options;

  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const startY = useRef(0);
  const canPull = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      canPull.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!canPull.current || refreshing) return;

    const y = e.touches[0].clientY;
    const diff = y - startY.current;

    if (diff > 0) {
      setPulling(true);
      // Resistance effect - harder to pull the further you go
      const resistance = 1 - Math.min(diff / maxPull, 1) * 0.5;
      setPullDistance(Math.min(diff * resistance, maxPull));
      e.preventDefault();
    }
  }, [refreshing, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    canPull.current = false;
    setPulling(false);

    if (pullDistance > threshold && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, refreshing, onRefresh]);

  const bind = useMemo(() => ({
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }), [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pulling,
    refreshing,
    pullDistance,
    pullProgress: Math.min(pullDistance / threshold, 1),
    bind,
  };
}

// ============================================================
// SCROLL LOCK (for modals/sheets)
// ============================================================

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const body = document.body;
    
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

// ============================================================
// VIEWPORT HEIGHT (fix mobile browser chrome)
// ============================================================

export function useViewportHeight() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
}

// ============================================================
// SAFE AREA INSETS
// ============================================================

export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateInsets = () => {
      const style = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(style.getPropertyValue('--nub-safe-top') || '0', 10),
        right: parseInt(style.getPropertyValue('--nub-safe-right') || '0', 10),
        bottom: parseInt(style.getPropertyValue('--nub-safe-bottom') || '0', 10),
        left: parseInt(style.getPropertyValue('--nub-safe-left') || '0', 10),
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}

// ============================================================
// KEYBOARD VISIBILITY (mobile)
// ============================================================

export function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      // On mobile, viewport shrinks when keyboard opens
      const isKeyboardVisible = 
        window.innerHeight < window.outerHeight * 0.75;
      
      setVisible(isKeyboardVisible);
      if (isKeyboardVisible) {
        setHeight(window.outerHeight - window.innerHeight);
      } else {
        setHeight(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { visible, height };
}

// ============================================================
// HAPTIC FEEDBACK
// ============================================================

export function useHaptic() {
  const trigger = useCallback((
    type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light'
  ) => {
    if (!navigator.vibrate) return;
    
    const patterns: Record<string, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [50, 100, 50],
    };
    
    navigator.vibrate(patterns[type]);
  }, []);

  return trigger;
}

export default {
  useIsMobile,
  useTouchDevice,
  useSwipe,
  useLongPress,
  useDoubleTap,
  usePinchZoom,
  usePullToRefresh,
  useScrollLock,
  useViewportHeight,
  useSafeAreaInsets,
  useKeyboardVisible,
  useHaptic,
};
