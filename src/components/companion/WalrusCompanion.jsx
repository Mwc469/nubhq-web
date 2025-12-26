/**
 * WalrusCompanion - The NUB brand character using real art assets
 * An interactive guide that appears on the hub and during games
 */
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_ASSETS, WALRUS_MOODS } from '../../lib/brandAssets';
import { playSound } from '../../lib/soundSystem';
import { haptic } from '../mobile/MobileComponents';

// Companion messages based on context
const COMPANION_MESSAGES = {
  greeting: [
    "Hey there, ya beautiful freak!",
    "Ready to make some chaos?",
    "The weird won't post itself!",
    "Let's get beautifully strange.",
    "Time to feed the algorithm.",
    "Ahoy ya juicy nublet!",
  ],
  pending: [
    "items need your wisdom",
    "decisions await your judgment",
    "things are waiting on you, chief",
    "approvals in the queue",
  ],
  empty: [
    "All caught up! Time to create.",
    "Nothing pending. You're a machine!",
    "Queue's empty. Go touch grass?",
    "Inbox zero energy right here.",
  ],
  encouragement: [
    "You're killing it!",
    "That's the NUB way!",
    "Chef's kiss, honestly.",
    "The vibes are immaculate.",
    "Keep that weird energy going!",
  ],
  idle: [
    "Still here if you need me!",
    "The walrus waits patiently...",
    "Tap me if you're bored.",
    "I see you staring at me.",
  ],
  celebration: [
    "YESSSS! Look at you go!",
    "That was beautiful!",
    "The walrus approves!",
    "Absolute legend behavior!",
  ],
  tap: [
    "*happy walrus noises*",
    "Hehe, that tickles!",
    "You found me!",
    "Boop!",
    "The walrus likes attention.",
    "Okay okay I'm working!",
  ],
};

function getRandomMessage(category) {
  const messages = COMPANION_MESSAGES[category] || COMPANION_MESSAGES.greeting;
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function WalrusCompanion({
  mood = 'idle',
  pendingCount = 0,
  message: customMessage,
  size = 'md',
  showSpeechBubble = true,
  onTap,
  className = '',
}) {
  const [currentMood, setCurrentMood] = useState(mood);
  const [message, setMessage] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const moodConfig = WALRUS_MOODS[currentMood] || WALRUS_MOODS.idle;
  const assetPath = BRAND_ASSETS.characters[moodConfig.asset];

  // Generate contextual message
  useEffect(() => {
    if (customMessage) {
      setMessage(customMessage);
      return;
    }

    if (pendingCount > 0) {
      setMessage(`${pendingCount} ${getRandomMessage('pending')}`);
    } else {
      setMessage(getRandomMessage('greeting'));
    }
  }, [customMessage, pendingCount]);

  // Update mood based on props
  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  const handleTap = useCallback(() => {
    haptic?.('light');
    playSound('tap');
    setIsAnimating(true);

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Easter egg: 5 rapid taps
    if (newTapCount >= 5) {
      setCurrentMood('celebrating');
      setMessage(getRandomMessage('celebration'));
      haptic?.('success');
      playSound('achievement');
      setTimeout(() => {
        setTapCount(0);
        setCurrentMood(mood);
      }, 2000);
    } else {
      setMessage(getRandomMessage('tap'));
      setTimeout(() => {
        setMessage(pendingCount > 0
          ? `${pendingCount} ${getRandomMessage('pending')}`
          : getRandomMessage('greeting'));
      }, 2000);
    }

    setTimeout(() => setIsAnimating(false), 300);
    onTap?.();
  }, [tapCount, mood, pendingCount, onTap]);

  // Reset tap count after inactivity
  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showSpeechBubble && message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-3 max-w-xs"
          >
            <div
              className="relative px-4 py-2 bg-white dark:bg-brand-dark rounded-2xl
                         border-2 border-black shadow-brutal-sm"
            >
              <p
                className="text-sm md:text-base font-medium text-gray-800 dark:text-white text-center"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {message}
              </p>

              {/* Speech bubble tail */}
              <div
                className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid black',
                }}
              />
              <div
                className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid white',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Walrus character */}
      <motion.div
        className={`relative cursor-pointer ${sizeClasses[size]}`}
        onClick={handleTap}
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.img
          src={assetPath}
          alt="NUB Walrus"
          className={`w-full h-full object-contain ${moodConfig.animation ? `animate-${moodConfig.animation}` : 'animate-cosmic-float'}`}
          style={{
            filter: currentMood === 'celebrating'
              ? 'drop-shadow(0 0 20px rgba(233, 30, 140, 0.6))'
              : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
          draggable={false}
        />

        {/* Celebration particles */}
        <AnimatePresence>
          {currentMood === 'celebrating' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: (Math.random() - 0.5) * 100,
                    y: -50 - Math.random() * 50,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: ['#E91E8C', '#9B30FF', '#00D4D4', '#E6C700'][i % 4],
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Smaller version for use in headers/corners
export function WalrusMini({ onClick, className = '' }) {
  return (
    <motion.img
      src={BRAND_ASSETS.characters.glamorousWalrus}
      alt="NUB"
      className={`w-10 h-10 object-contain cursor-pointer ${className}`}
      onClick={() => {
        haptic?.('light');
        playSound('tap');
        onClick?.();
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
      }}
    />
  );
}
