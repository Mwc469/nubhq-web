/**
 * NubHQ Approval Game
 * Swipe-based approval queue that feels like a game
 */

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { haptic } from '@/components/mobile/MobileComponents';
import {
  XP_REWARDS,
  getLevelInfo,
  getXpProgress,
  type PlayerStats,
} from '@/lib/gamification';
import { Check, X, SkipForward, Clock, Zap, Flame } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface PostApproval {
  id?: string;
  caption: string;
  platform: string;
  scheduledFor?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  hashtags?: string[];
}

// ============================================================
// SWIPE CARD COMPONENT
// ============================================================

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
}

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  leftLabel = "Reject",
  rightLabel = "Approve",
  leftColor = "#ef4444",
  rightColor = "#22c55e",
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [decision, setDecision] = useState<'left' | 'right' | 'up' | null>(null);

  const threshold = 100;
  const rotationFactor = 0.1;

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;

    setPosition({ x: deltaX, y: deltaY });
    setRotation(deltaX * rotationFactor);

    // Determine decision preview
    if (Math.abs(deltaX) > threshold) {
      setDecision(deltaX > 0 ? 'right' : 'left');
    } else if (deltaY < -threshold && onSwipeUp) {
      setDecision('up');
    } else {
      setDecision(null);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (position.x > threshold) {
      // Swipe right - approve
      animateOut('right');
      haptic('success');
      setTimeout(onSwipeRight, 200);
    } else if (position.x < -threshold) {
      // Swipe left - reject
      animateOut('left');
      haptic('medium');
      setTimeout(onSwipeLeft, 200);
    } else if (position.y < -threshold && onSwipeUp) {
      // Swipe up - skip
      animateOut('up');
      haptic('light');
      setTimeout(onSwipeUp, 200);
    } else {
      // Return to center
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }

    setDecision(null);
  };

  const animateOut = (direction: 'left' | 'right' | 'up') => {
    const targets = {
      left: { x: -500, y: 0 },
      right: { x: 500, y: 0 },
      up: { x: 0, y: -500 },
    };
    setPosition(targets[direction]);
    setRotation(direction === 'left' ? -30 : direction === 'right' ? 30 : 0);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchEnd = () => handleEnd();

  // Mouse handlers (for desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) handleEnd();
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Decision indicators */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-2xl border-4 pointer-events-none z-10"
        style={{
          borderColor: decision === 'right' ? rightColor : decision === 'left' ? leftColor : 'transparent',
          backgroundColor: decision ? `${decision === 'right' ? rightColor : leftColor}20` : 'transparent',
          opacity: decision ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      >
        {decision === 'right' && (
          <span className="text-4xl font-black text-green-500 rotate-12">{rightLabel}</span>
        )}
        {decision === 'left' && (
          <span className="text-4xl font-black text-red-500 -rotate-12">{leftLabel}</span>
        )}
        {decision === 'up' && (
          <span className="text-4xl font-black text-gray-400">SKIP</span>
        )}
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-white dark:bg-brand-dark border-3 border-black rounded-2xl",
          "shadow-[4px_4px_0_#000] cursor-grab active:cursor-grabbing",
          !isDragging && "transition-all duration-200"
        )}
        style={{
          transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>

      {/* Swipe hints */}
      <div className="flex justify-between mt-4 px-4 text-sm text-gray-500">
        <span>← {leftLabel}</span>
        {onSwipeUp && <span>↑ Skip</span>}
        <span>{rightLabel} →</span>
      </div>
    </div>
  );
}

// ============================================================
// POST APPROVAL CARD
// ============================================================

interface PostCardProps {
  post: PostApproval;
  onApprove: () => void;
  onReject: () => void;
  onSkip: () => void;
}

export function PostApprovalCard({ post, onApprove, onReject, onSkip }: PostCardProps) {
  return (
    <SwipeCard
      onSwipeRight={onApprove}
      onSwipeLeft={onReject}
      onSwipeUp={onSkip}
      rightLabel="POST IT"
      leftLabel="NOPE"
    >
      <div className="p-4">
        {/* Platform badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-neon-pink text-white text-sm font-bold rounded-full">
            {post.platform}
          </span>
          {post.scheduledFor && (
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {post.scheduledFor}
            </span>
          )}
        </div>

        {/* Media preview */}
        {post.mediaUrl && (
          <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-200">
            {post.mediaType === 'video' ? (
              <video
                src={post.mediaUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={post.mediaUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Caption */}
        <p className="text-base leading-relaxed mb-3">{post.caption}</p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map(tag => (
              <span
                key={tag}
                className="text-sm text-neon-pink font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick action buttons */}
      <div className="flex border-t-2 border-black">
        <button
          onClick={(e) => { e.stopPropagation(); onReject(); }}
          className="flex-1 py-4 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 active:bg-red-100 transition-colors"
        >
          <X className="w-5 h-5" /> Reject
        </button>
        <div className="w-px bg-black" />
        <button
          onClick={(e) => { e.stopPropagation(); onSkip(); }}
          className="flex-1 py-4 flex items-center justify-center gap-2 text-gray-500 font-bold hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <SkipForward className="w-5 h-5" /> Skip
        </button>
        <div className="w-px bg-black" />
        <button
          onClick={(e) => { e.stopPropagation(); onApprove(); }}
          className="flex-1 py-4 flex items-center justify-center gap-2 text-green-500 font-bold hover:bg-green-50 active:bg-green-100 transition-colors"
        >
          <Check className="w-5 h-5" /> Approve
        </button>
      </div>
    </SwipeCard>
  );
}

// ============================================================
// XP BAR & LEVEL DISPLAY
// ============================================================

interface XpBarProps {
  stats: PlayerStats;
  recentXp?: number;
}

export function XpBar({ stats, recentXp }: XpBarProps) {
  const levelInfo = getLevelInfo(stats.xp);
  const progress = getXpProgress(stats.xp);

  return (
    <div className="bg-white dark:bg-brand-dark border-2 border-black rounded-xl p-3 relative">
      {/* Level & Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{levelInfo.badge}</span>
          <div>
            <p className="font-bold text-sm">{levelInfo.title}</p>
            <p className="text-xs text-gray-500">Level {levelInfo.level}</p>
          </div>
        </div>

        {/* Streak */}
        {stats.streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-bold">{stats.streak}</span>
          </div>
        )}
      </div>

      {/* XP Bar */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-pink to-neon-orange transition-all duration-500"
          style={{ width: `${progress.percent}%` }}
        />
        {recentXp && recentXp > 0 && (
          <div
            className="absolute inset-y-0 bg-yellow-400 animate-pulse"
            style={{
              left: `${Math.max(0, progress.percent - 5)}%`,
              width: '5%',
            }}
          />
        )}
      </div>

      {/* XP Text */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{stats.xp.toLocaleString()} XP</span>
        <span>{progress.current} / {progress.max === Infinity ? '∞' : progress.max}</span>
      </div>

      {/* Recent XP gain */}
      {recentXp && recentXp > 0 && (
        <div className="absolute -top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full animate-bounce">
          +{recentXp} XP
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMBO DISPLAY
// ============================================================

interface ComboDisplayProps {
  combo: number;
  visible: boolean;
}

export function ComboDisplay({ combo, visible }: ComboDisplayProps) {
  if (!visible || combo < 2) return null;

  return (
    <div className={cn(
      "fixed top-1/4 right-4 z-50",
      "px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500",
      "text-white font-black text-2xl rounded-xl",
      "shadow-lg animate-bounce",
      "border-2 border-white"
    )}>
      <div className="flex items-center gap-2">
        <Zap className="w-6 h-6" />
        <span>{combo}x</span>
      </div>
      <div className="text-xs font-normal opacity-80">COMBO!</div>
    </div>
  );
}

// ============================================================
// QUEUE STATS
// ============================================================

interface QueueStatsProps {
  remaining: number;
  completed: number;
  skipped: number;
}

export function QueueStats({ remaining, completed, skipped }: QueueStatsProps) {
  const total = remaining + completed + skipped;
  const progress = total > 0 ? ((completed + skipped) / total) * 100 : 0;

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-500" />
        <span className="text-sm font-medium">{completed}</span>
      </div>
      <div className="flex items-center gap-2">
        <SkipForward className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">{skipped}</span>
      </div>
      <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-neon-pink transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium">{remaining} left</span>
    </div>
  );
}

// ============================================================
// EMPTY QUEUE STATE
// ============================================================

export function EmptyQueue({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="text-6xl mb-4 animate-bounce">🦭</div>
      <h2 className="text-2xl font-bold mb-2">Queue Clear! 🎉</h2>
      <p className="text-gray-500 mb-6 max-w-[280px]">
        You've reviewed everything! The walrus is proud. Come back later for more.
      </p>
      <button
        onClick={onRefresh}
        className="px-6 py-3 bg-neon-pink text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all"
      >
        Check for More
      </button>
    </div>
  );
}

export default {
  SwipeCard,
  PostApprovalCard,
  XpBar,
  ComboDisplay,
  QueueStats,
  EmptyQueue,
};
