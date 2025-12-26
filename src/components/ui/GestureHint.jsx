/**
 * GestureHint - Dismissable overlay hints for teaching gestures
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

// Storage key for seen hints
const HINTS_STORAGE_KEY = 'nub_seen_hints';

// Get seen hints from localStorage
export function getSeenHints() {
  try {
    const stored = localStorage.getItem(HINTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Mark a hint as seen
export function markHintSeen(hintType) {
  const seen = getSeenHints();
  if (!seen.includes(hintType)) {
    seen.push(hintType);
    localStorage.setItem(HINTS_STORAGE_KEY, JSON.stringify(seen));
  }
}

// Check if a hint has been seen
export function hasSeenHint(hintType) {
  return getSeenHints().includes(hintType);
}

// Hint configurations
const HINT_CONFIGS = {
  swipe: {
    icon: '👆',
    animation: 'swipe',
    defaultMessage: 'Swipe left to reject, right to approve',
  },
  pull: {
    icon: '👇',
    animation: 'pull',
    defaultMessage: 'Pull down to refresh',
  },
  tap: {
    icon: '👆',
    animation: 'tap',
    defaultMessage: 'Tap to view details',
  },
};

export default function GestureHint({
  type = 'swipe', // 'swipe' | 'pull' | 'tap'
  message,
  show = true,
  onDismiss,
  autoDismissMs = 5000,
  className,
}) {
  const [visible, setVisible] = useState(show);
  const config = HINT_CONFIGS[type] || HINT_CONFIGS.swipe;

  // Auto-dismiss after timeout
  useEffect(() => {
    if (!visible || !autoDismissMs) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [visible, autoDismissMs]);

  const handleDismiss = () => {
    setVisible(false);
    markHintSeen(type);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          'bg-black/60 backdrop-blur-sm',
          className
        )}
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative max-w-xs mx-4 p-6 bg-white dark:bg-brand-dark rounded-2xl border-3 border-black shadow-brutal text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>

          {/* Animated icon */}
          <div className="mb-4">
            <GestureAnimation type={type} />
          </div>

          {/* Message */}
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {message || config.defaultMessage}
          </p>

          {/* Tap to dismiss */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tap anywhere to dismiss
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Animated gesture illustration
function GestureAnimation({ type }) {
  if (type === 'swipe') {
    return (
      <div className="relative w-24 h-24 mx-auto">
        {/* Card representation */}
        <div className="absolute inset-2 bg-gray-200 dark:bg-gray-700 rounded-xl border-2 border-gray-300 dark:border-gray-600" />

        {/* Animated finger */}
        <motion.div
          className="absolute text-4xl"
          initial={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
          animate={{
            left: ['50%', '20%', '80%', '50%'],
            top: '50%',
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          👆
        </motion.div>

        {/* Direction arrows */}
        <motion.span
          className="absolute left-0 top-1/2 -translate-y-1/2 text-red-500 text-2xl"
          animate={{ opacity: [0.3, 1, 0.3], x: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ←
        </motion.span>
        <motion.span
          className="absolute right-0 top-1/2 -translate-y-1/2 text-green-500 text-2xl"
          animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
        >
          →
        </motion.span>
      </div>
    );
  }

  if (type === 'pull') {
    return (
      <div className="relative w-24 h-24 mx-auto">
        {/* Pull indicator */}
        <motion.div
          className="text-5xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          👇
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-neon-pink text-2xl"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.div>
      </div>
    );
  }

  if (type === 'tap') {
    return (
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <motion.div
          className="text-5xl"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          👆
        </motion.div>

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-neon-pink"
          animate={{ scale: [0.5, 1.2], opacity: [0.8, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
        />
      </div>
    );
  }

  return null;
}

/**
 * Hook to check and show hint if not seen
 */
export function useGestureHint(hintType) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setShouldShow(!hasSeenHint(hintType));
  }, [hintType]);

  const dismiss = () => {
    setShouldShow(false);
    markHintSeen(hintType);
  };

  return { shouldShow, dismiss };
}
