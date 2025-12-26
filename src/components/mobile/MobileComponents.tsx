/**
 * NubHQ Mobile-First Components
 * Touch-friendly, fun, and full of personality
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  getLoadingMessage,
  getErrorMessage,
  getSuccessMessage,
  getWalrusReaction,
  getGreeting,
  EMPTY_STATES,
  CONFIRMATIONS,
} from '@/lib/personality';

// ============================================================
// HAPTIC FEEDBACK
// ============================================================

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
  if (!navigator.vibrate) return;

  const patterns: Record<string, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    error: [50, 100, 50],
  };

  navigator.vibrate(patterns[type]);
}

// ============================================================
// MOBILE BUTTON
// ============================================================

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  hapticFeedback?: boolean;
}

export function MobileButton({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  hapticFeedback = true,
  className,
  onClick,
  ...props
}: MobileButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback) haptic('light');
    onClick?.(e);
  };

  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  const variantClasses = {
    primary: 'bg-neon-pink text-white border-black shadow-[4px_4px_0_#000]',
    secondary: 'bg-white text-gray-900 border-gray-300',
    ghost: 'bg-transparent text-gray-900 border-transparent',
    danger: 'bg-red-500 text-white border-black',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold',
        'border-[3px] rounded-xl',
        'active:scale-95 transition-transform duration-100',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={handleClick}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">🦭</span>
      ) : icon ? (
        <span className="w-5 h-5">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

// ============================================================
// FLOATING ACTION BUTTON
// ============================================================

interface FABProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export function FAB({ icon, onClick, label, variant = 'primary' }: FABProps) {
  const handleClick = () => {
    haptic('medium');
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      className={cn(
        'fixed z-50',
        'w-14 h-14 rounded-full',
        'flex items-center justify-center',
        'border-[3px] border-black',
        'shadow-[4px_4px_0_#000]',
        'active:scale-90 transition-transform duration-100',
        'bottom-24 right-4',
        variant === 'primary'
          ? 'bg-neon-pink text-white'
          : 'bg-white text-gray-900'
      )}
    >
      {icon}
    </button>
  );
}

// ============================================================
// BOTTOM SHEET
// ============================================================

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 100) {
      haptic('light');
      onClose();
    }
    setCurrentY(0);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-white dark:bg-brand-dark',
          'border-t-[3px] border-x-[3px] border-black',
          'rounded-t-3xl',
          'max-h-[90vh] overflow-auto',
          'animate-[slideUp_0.3s_ease-out]',
          'pb-8'
        )}
        style={{ transform: `translateY(${currentY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <h2 className="text-lg font-bold px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}

// ============================================================
// SWIPEABLE CARD
// ============================================================

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: { icon: React.ReactNode; label: string; color: string };
  rightAction?: { icon: React.ReactNode; label: string; color: string };
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
}: SwipeableCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const threshold = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;

    // Only allow swipe in direction with action
    if (diff > 0 && !rightAction) return;
    if (diff < 0 && !leftAction) return;

    setSwipeX(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (swipeX > threshold && onSwipeRight) {
      haptic('success');
      onSwipeRight();
    } else if (swipeX < -threshold && onSwipeLeft) {
      haptic('success');
      onSwipeLeft();
    }

    setSwipeX(0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left action (revealed on right swipe) */}
      {rightAction && (
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-4"
          style={{ backgroundColor: rightAction.color }}
        >
          <div className="text-white flex flex-col items-center">
            {rightAction.icon}
            <span className="text-xs mt-1">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action (revealed on left swipe) */}
      {leftAction && (
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-4"
          style={{ backgroundColor: leftAction.color }}
        >
          <div className="text-white flex flex-col items-center">
            {leftAction.icon}
            <span className="text-xs mt-1">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Card content */}
      <div
        className="relative bg-white dark:bg-brand-dark transition-transform"
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================
// PULL TO REFRESH
// ============================================================

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return;

    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 120));
    }
  };

  const handleTouchEnd = async () => {
    setPulling(false);

    if (pullDistance > threshold && !refreshing) {
      setRefreshing(true);
      haptic('medium');

      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50',
          'bg-white dark:bg-brand-dark border-2 border-gray-200 rounded-full',
          'px-4 py-2 flex items-center gap-2',
          'transition-all duration-200',
          (pullDistance > 0 || refreshing) ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transform: `translateX(-50%) translateY(${Math.min(pullDistance, 60)}px)` }}
      >
        {refreshing ? (
          <>
            <span className="animate-spin">🦭</span>
            <span className="text-sm">Refreshing...</span>
          </>
        ) : pullDistance > threshold ? (
          <>
            <span>🦭</span>
            <span className="text-sm">Release to refresh!</span>
          </>
        ) : (
          <>
            <span>👇</span>
            <span className="text-sm">Pull to refresh</span>
          </>
        )}
      </div>

      {children}
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

interface EmptyStateProps {
  type: keyof typeof EMPTY_STATES;
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const content = EMPTY_STATES[type];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <div className="text-6xl mb-4 animate-bounce">🦭</div>
      <h3 className="text-xl font-bold mb-2">{content.title}</h3>
      <p className="text-gray-500 mb-6 max-w-[280px]">
        {content.subtitle}
      </p>
      {onAction && (
        <MobileButton onClick={onAction} variant="primary">
          {content.action}
        </MobileButton>
      )}
    </div>
  );
}

// ============================================================
// FUN LOADING STATE
// ============================================================

interface FunLoadingProps {
  category?: 'default' | 'video' | 'ai' | 'upload' | 'save';
  fullScreen?: boolean;
}

export function FunLoading({ category = 'default', fullScreen = false }: FunLoadingProps) {
  const [message, setMessage] = useState(getLoadingMessage(category));

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getLoadingMessage(category));
    }, 3000);

    return () => clearInterval(interval);
  }, [category]);

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-5xl animate-bounce">🦭</div>
      <p className="text-gray-500 text-center animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-brand-dark z-50">
        {content}
      </div>
    );
  }

  return content;
}

// ============================================================
// CONFETTI CELEBRATION
// ============================================================

export function triggerConfetti() {
  const emojis = ['🎉', '🎊', '✨', '🦭', '⭐', '🔥', '💥'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;right:0;pointer-events:none;z-index:9999;';
  document.body.appendChild(container);

  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('span');
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    confetti.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}vw;
      font-size: 1.5rem;
      animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    container.appendChild(confetti);
  }

  setTimeout(() => {
    document.body.removeChild(container);
  }, 5000);

  haptic('success');
}

// ============================================================
// GREETING HEADER
// ============================================================

export function GreetingHeader({ userName }: { userName?: string }) {
  const greeting = getGreeting();

  return (
    <div className="p-4 bg-white dark:bg-brand-dark border-b-2 border-gray-200 dark:border-gray-700">
      <h1 className="text-lg font-bold">
        {userName ? `Hey ${userName}! ` : 'Hey! '}
        <span className="inline-block animate-pulse">👋</span>
      </h1>
      <p className="text-sm text-gray-500">{greeting}</p>
    </div>
  );
}

// ============================================================
// WALRUS MASCOT
// ============================================================

type WalrusMood = 'happy' | 'sad' | 'thinking' | 'excited' | 'sleepy' | 'working';

export function WalrusMascot({ mood = 'happy', message }: { mood?: WalrusMood; message?: string }) {
  const expressions: Record<WalrusMood, string> = {
    happy: '🦭',
    sad: '🦭😢',
    thinking: '🦭🤔',
    excited: '🦭🎉',
    sleepy: '🦭😴',
    working: '🦭💻',
  };

  const animations: Record<WalrusMood, string> = {
    happy: 'animate-bounce',
    sad: '',
    thinking: '',
    excited: 'animate-bounce',
    sleepy: '',
    working: 'animate-spin',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className={cn('text-4xl', animations[mood])}>
        {expressions[mood]}
      </span>
      {message && (
        <p className="text-sm text-center text-gray-500 max-w-[200px]">
          {message}
        </p>
      )}
    </div>
  );
}

export default {
  haptic,
  MobileButton,
  FAB,
  BottomSheet,
  SwipeableCard,
  PullToRefresh,
  EmptyState,
  FunLoading,
  triggerConfetti,
  GreetingHeader,
  WalrusMascot,
};
