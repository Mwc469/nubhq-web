/**
 * NubHQ Approval Game
 * Swipe-based approval queue that feels like a game
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  const [isExiting, setIsExiting] = useState(false);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);

  const threshold = 100;
  const rotationFactor = 0.15; // Increased for more dynamic feel

  // Calculate swipe progress (0 to 1)
  const swipeProgress = Math.min(Math.abs(position.x) / threshold, 1);
  const isApproving = position.x > 0;

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setHasTriggeredHaptic(false);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;

    setPosition({ x: deltaX, y: deltaY });
    setRotation(deltaX * rotationFactor);

    // Preview haptic at 50% threshold
    const progress = Math.abs(deltaX) / threshold;
    if (progress >= 0.5 && !hasTriggeredHaptic) {
      haptic('light');
      setHasTriggeredHaptic(true);
    }

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
      setTimeout(onSwipeRight, 250);
    } else if (position.x < -threshold) {
      // Swipe left - reject
      animateOut('left');
      haptic('medium');
      setTimeout(onSwipeLeft, 250);
    } else if (position.y < -threshold && onSwipeUp) {
      // Swipe up - skip
      animateOut('up');
      haptic('light');
      setTimeout(onSwipeUp, 250);
    } else {
      // Return to center
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }

    setDecision(null);
  };

  const animateOut = (direction: 'left' | 'right' | 'up') => {
    setIsExiting(true);
    const targets = {
      left: { x: -600, y: 100 },
      right: { x: 600, y: 100 },
      up: { x: 0, y: -600 },
    };
    setPosition(targets[direction]);
    setRotation(direction === 'left' ? -45 : direction === 'right' ? 45 : 0);
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

  // Progressive background color based on swipe progress
  const getSwipeGradient = () => {
    if (!isDragging || swipeProgress < 0.1) return 'transparent';
    const alpha = swipeProgress * 0.35;
    if (position.x > 0) {
      return `rgba(34, 197, 94, ${alpha})`; // Green for approve
    } else {
      return `rgba(239, 68, 68, ${alpha})`; // Red for reject
    }
  };

  // Card scale reduces slightly during drag
  const cardScale = isDragging ? 0.98 : isExiting ? 0.9 : 1;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Decision indicators with progressive feedback */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none z-10 overflow-hidden"
        style={{
          background: getSwipeGradient(),
          border: swipeProgress > 0.3
            ? `${Math.round(2 + swipeProgress * 4)}px solid ${isApproving ? rightColor : leftColor}`
            : '4px solid transparent',
          transition: isExiting ? 'all 0.3s ease-out' : 'border 0.1s',
        }}
      >
        {/* Animated decision label */}
        {swipeProgress > 0.2 && isDragging && position.x !== 0 && (
          <span
            className={cn(
              "text-5xl font-black drop-shadow-lg",
              isApproving ? "text-green-500" : "text-red-500"
            )}
            style={{
              transform: `scale(${0.6 + swipeProgress * 0.6}) rotate(${isApproving ? 12 : -12}deg)`,
              opacity: Math.min(1, swipeProgress * 1.5),
              transition: 'transform 0.1s ease-out',
              textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
            }}
          >
            {isApproving ? rightLabel : leftLabel}
          </span>
        )}
        {/* Skip indicator */}
        {position.y < -threshold * 0.5 && onSwipeUp && (
          <span
            className="text-4xl font-black text-gray-500"
            style={{
              opacity: Math.min(1, Math.abs(position.y) / threshold),
              textShadow: '2px 2px 0 #000',
            }}
          >
            SKIP
          </span>
        )}
      </div>

      {/* Card with enhanced animations */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-white dark:bg-brand-dark border-3 border-black rounded-2xl",
          "shadow-[4px_4px_0_#000] cursor-grab active:cursor-grabbing",
          isExiting && "transition-all duration-300 ease-out"
        )}
        style={{
          transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg) scale(${cardScale})`,
          opacity: isExiting ? 0 : 1,
          transition: !isDragging && !isExiting
            ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s'
            : isExiting
            ? 'transform 0.3s ease-out, opacity 0.25s ease-out'
            : 'none',
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

      {/* Animated swipe hints - only visible when not dragging */}
      <div
        className={cn(
          "flex justify-between mt-4 px-4 text-sm font-medium transition-opacity duration-200",
          isDragging ? "opacity-0" : "opacity-100"
        )}
      >
        <span className="flex items-center gap-1 text-red-400">
          <span className="animate-pulse">←</span> {leftLabel}
        </span>
        {onSwipeUp && (
          <span className="flex items-center gap-1 text-gray-400">
            <span className="animate-pulse">↑</span> Skip
          </span>
        )}
        <span className="flex items-center gap-1 text-green-400">
          {rightLabel} <span className="animate-pulse">→</span>
        </span>
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
  const [floatingXp, setFloatingXp] = useState<{ id: number; amount: number }[]>([]);
  const floatIdRef = useRef(0);

  // Add floating XP bubbles when XP is gained
  useEffect(() => {
    if (recentXp && recentXp > 0) {
      const id = ++floatIdRef.current;
      setFloatingXp(prev => [...prev, { id, amount: recentXp }]);
      // Remove after animation completes
      setTimeout(() => {
        setFloatingXp(prev => prev.filter(f => f.id !== id));
      }, 1500);
    }
  }, [recentXp]);

  return (
    <div className="bg-white dark:bg-brand-dark border-2 border-black rounded-xl p-3 relative overflow-visible">
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
      <div
        className="relative h-4 bg-gray-200 rounded-full overflow-hidden"
        style={{
          // Glow effect when close to level up (> 80%)
          boxShadow: progress.percent > 80
            ? '0 0 10px rgba(233, 30, 140, 0.5), 0 0 20px rgba(233, 30, 140, 0.3)'
            : recentXp && recentXp > 0
            ? '0 0 8px rgba(250, 204, 21, 0.6)'
            : 'none',
          transition: 'box-shadow 0.3s ease-out',
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-pink to-neon-orange"
          style={{
            width: `${progress.percent}%`,
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy easing
          }}
        />
        {/* Shimmer effect on the bar */}
        <div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            left: `${progress.percent - 10}%`,
            animation: 'shimmer 2s infinite',
          }}
        />
        {/* Recent XP flash in the bar */}
        {recentXp && recentXp > 0 && (
          <div
            className="absolute inset-y-0 bg-gradient-to-r from-yellow-300 to-yellow-500"
            style={{
              left: `${Math.max(0, progress.percent - 5)}%`,
              width: '5%',
              animation: 'pulse 0.5s ease-out',
            }}
          />
        )}
      </div>

      {/* XP Text */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{stats.xp.toLocaleString()} XP</span>
        <span>{progress.current} / {progress.max === Infinity ? '∞' : progress.max}</span>
      </div>

      {/* Floating XP bubbles */}
      {floatingXp.map((xp, index) => (
        <div
          key={xp.id}
          className="absolute pointer-events-none font-black text-lg"
          style={{
            right: `${20 + (index % 3) * 30}px`,
            top: '-8px',
            color: xp.amount >= 50 ? '#f59e0b' : xp.amount >= 20 ? '#22c55e' : '#3b82f6',
            textShadow: '1px 1px 0 #000, -1px -1px 0 #000',
            animation: 'floatUpFade 1.5s ease-out forwards',
          }}
        >
          +{xp.amount} XP
        </div>
      ))}
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

// Tier-based combo styling
const COMBO_TIERS = {
  normal: {
    gradient: 'from-orange-500 to-red-500',
    glow: 'shadow-lg shadow-orange-500/30',
    text: 'COMBO!',
  },
  hot: {
    gradient: 'from-red-500 to-pink-500',
    glow: 'shadow-lg shadow-red-500/40',
    text: 'HOT!',
  },
  fire: {
    gradient: 'from-pink-500 via-red-500 to-orange-500',
    glow: 'shadow-xl shadow-pink-500/50',
    text: 'ON FIRE!',
  },
  legendary: {
    gradient: 'from-yellow-400 via-pink-500 to-purple-600',
    glow: 'shadow-xl shadow-purple-500/50',
    text: 'LEGENDARY!',
  },
};

export function ComboDisplay({ combo, visible }: ComboDisplayProps) {
  const [prevCombo, setPrevCombo] = useState(combo);
  const [isScaling, setIsScaling] = useState(false);

  // Trigger scale animation when combo increases
  useEffect(() => {
    if (combo > prevCombo) {
      setIsScaling(true);
      setTimeout(() => setIsScaling(false), 200);
    }
    setPrevCombo(combo);
  }, [combo, prevCombo]);

  if (!visible || combo < 2) return null;

  // Determine tier
  const tier = combo >= 10 ? 'legendary' : combo >= 5 ? 'fire' : combo >= 3 ? 'hot' : 'normal';
  const tierStyle = COMBO_TIERS[tier];

  return (
    <div
      className={cn(
        "fixed top-1/4 right-4 z-50",
        "px-4 py-2 rounded-xl",
        "text-white font-black text-2xl",
        "border-2 border-white",
        `bg-gradient-to-r ${tierStyle.gradient}`,
        tierStyle.glow,
        tier === 'legendary' && 'animate-pulse',
        tier === 'fire' && combo >= 7 && 'animate-shake'
      )}
      style={{
        transform: isScaling ? 'scale(1.3)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="flex items-center gap-2">
        <Zap className={cn("w-6 h-6", tier === 'legendary' && 'animate-spin')} />
        <span>{combo}x</span>
        {tier === 'fire' && <Flame className="w-5 h-5 animate-pulse" />}
      </div>
      <div className="text-xs font-bold opacity-90">{tierStyle.text}</div>
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
// EMPTY QUEUE STATE - NOW WITH MAXIMUM SILLINESS
// ============================================================

// Silly empty state messages - because finishing should be celebrated absurdly
const SILLY_EMPTY_STATES = [
  { title: "Queue Clear!", subtitle: "The walrus is weeping tears of joy", emoji: "🦭✨" },
  { title: "You Did It!", subtitle: "Achievement Unlocked: Professional Emptier of Queues", emoji: "🏆" },
  { title: "Inbox Zero Energy!", subtitle: "The void stares back... approvingly", emoji: "🕳️👀" },
  { title: "All Caught Up!", subtitle: "Time to stare at the wall professionally", emoji: "🧱" },
  { title: "Nothing Left!", subtitle: "You ate all the content. Burp.", emoji: "😋" },
  { title: "Queue Annihilated!", subtitle: "The content never stood a chance", emoji: "💥" },
  { title: "Productivity God!", subtitle: "The hamsters powering your brain need a break", emoji: "🐹" },
  { title: "Empty Like My...", subtitle: "Actually let's not go there", emoji: "😅" },
  { title: "Queue? What Queue?", subtitle: "Never heard of her", emoji: "🙅" },
  { title: "You're Free!", subtitle: "Quick! Before more content arrives!", emoji: "🏃" },
  { title: "Mission Complete!", subtitle: "Snake? SNAKE? SNAAAAAAKE!", emoji: "🐍" },
  { title: "Finished!", subtitle: "The simulation thanks you for your service", emoji: "🤖" },
  { title: "Victory Achieved!", subtitle: "Your thumb can finally rest", emoji: "👍💤" },
  { title: "Level Complete!", subtitle: "But the princess is in another castle", emoji: "🏰" },
  { title: "Congratulations!", subtitle: "You've reached the end of content (for now)", emoji: "📜" },
];

// Silly button labels that rotate
const SILLY_REFRESH_LABELS = [
  "Check for More",
  "Feed Me Content",
  "I Need More",
  "Again! Again!",
  "Summon More Tasks",
  "Poke the Server",
  "Refresh (Please Work)",
  "More Chaos Please",
  "Hit Me",
  "Keep Em Coming",
];

function getRandomEmptyState() {
  return SILLY_EMPTY_STATES[Math.floor(Math.random() * SILLY_EMPTY_STATES.length)];
}

function getRandomRefreshLabel() {
  return SILLY_REFRESH_LABELS[Math.floor(Math.random() * SILLY_REFRESH_LABELS.length)];
}

export function EmptyQueue({ onRefresh }: { onRefresh: () => void }) {
  const [emptyState, setEmptyState] = useState(getRandomEmptyState);
  const [refreshLabel, setRefreshLabel] = useState(getRandomRefreshLabel);
  const [tapCount, setTapCount] = useState(0);

  // Easter egg: tapping the emoji 5 times shows a secret message
  const handleEmojiTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 5) {
      setEmptyState({
        title: "You Found the Secret!",
        subtitle: "There's no prize, just this. Worth it? Probably not.",
        emoji: "🎁"
      });
      setTapCount(0);
    } else {
      // Each tap changes the message
      setEmptyState(getRandomEmptyState());
    }
    haptic?.('light');
  };

  // New random refresh label each time
  const handleRefresh = () => {
    setRefreshLabel(getRandomRefreshLabel());
    onRefresh();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div
        className="text-6xl mb-4 animate-bounce cursor-pointer"
        onClick={handleEmojiTap}
      >
        {emptyState.emoji}
      </div>
      <h2 className="text-2xl font-bold mb-2">{emptyState.title}</h2>
      <p className="text-gray-500 mb-6 max-w-[280px]">
        {emptyState.subtitle}
      </p>
      <button
        onClick={handleRefresh}
        className="px-6 py-3 bg-neon-pink text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all"
      >
        {refreshLabel}
      </button>
      <p className="text-xs text-gray-400 mt-4">
        (tap the {emptyState.emoji.split('')[0]} for more vibes)
      </p>
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
