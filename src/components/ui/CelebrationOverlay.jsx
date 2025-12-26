/**
 * CelebrationOverlay - Full-screen celebration for major achievements
 * Rocket walrus, golden confetti, the works!
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../../lib/soundSystem';
import { haptic } from '../mobile/MobileComponents';

// Generate confetti particles
function generateConfetti(count = 50, golden = false) {
  const colors = golden
    ? ['#FFD700', '#FFA500', '#FFDF00', '#FFB347', '#F4C430']
    : ['#E91E8C', '#9B30FF', '#00D4D4', '#E6C700', '#FF6B35', '#32CD32'];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[i % colors.length],
    delay: Math.random() * 0.5,
    duration: 2.5 + Math.random() * 1.5,
    size: 8 + Math.random() * 8,
    rotation: Math.random() * 720 - 360,
  }));
}

// Confetti shower component
function ConfettiShower({ golden = false, duration = 4000 }) {
  const [particles] = useState(() => generateConfetti(golden ? 60 : 40, golden));

  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: -20, x: `${p.x}vw`, rotate: 0, scale: 1 }}
          animate={{
            opacity: 0,
            y: '110vh',
            rotate: p.rotation,
            scale: 0.5,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: golden ? `0 0 10px ${p.color}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// Rocket walrus animation
function RocketWalrus() {
  return (
    <motion.div
      initial={{ x: '-20vw', y: '80vh', rotate: -45 }}
      animate={{ x: '120vw', y: '-20vh', rotate: -45 }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
      className="fixed z-[71] pointer-events-none"
    >
      <motion.img
        src="/assets/pinupwalrus.png"
        alt="Rocket Walrus"
        className="w-32 h-32 object-contain"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      {/* Rocket trail */}
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-16 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm"
        animate={{ opacity: [0.8, 1, 0.8], scaleY: [1, 1.2, 1] }}
        transition={{ duration: 0.15, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Level up burst effect
function LevelUpBurst() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[69] pointer-events-none"
    >
      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan" />
    </motion.div>
  );
}

// Main CelebrationOverlay component
export default function CelebrationOverlay({
  type = 'achievement', // 'achievement' | 'levelUp' | 'queueClear' | 'combo'
  title,
  message,
  icon,
  xpAmount,
  show = false,
  onComplete,
  autoDismissMs = 4000,
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);

    if (show) {
      // Play appropriate sound
      if (type === 'levelUp') {
        playSound('levelUp');
      } else if (type === 'queueClear') {
        playSound('achievement');
      } else if (type === 'combo') {
        playSound('combo');
      } else {
        playSound('achievement');
      }

      // Haptic feedback
      haptic?.('success');
      setTimeout(() => haptic?.('success'), 100);

      // Auto dismiss
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, autoDismissMs);

      return () => clearTimeout(timer);
    }
  }, [show, type, autoDismissMs, onComplete]);

  const handleDismiss = () => {
    setVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[68] bg-black/40 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Level up burst effect */}
          {type === 'levelUp' && <LevelUpBurst />}

          {/* Confetti */}
          <ConfettiShower golden={type === 'levelUp' || type === 'queueClear'} />

          {/* Rocket walrus for level up */}
          {type === 'levelUp' && <RocketWalrus />}

          {/* Main content card */}
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[72] w-[90%] max-w-sm"
            onClick={handleDismiss}
          >
            <div className={`
              relative p-6 rounded-2xl border-4 border-black shadow-brutal-lg text-center
              ${type === 'levelUp' ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500' :
                type === 'queueClear' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                type === 'combo' ? 'bg-gradient-to-br from-neon-pink to-neon-purple' :
                'bg-gradient-to-br from-neon-cyan to-neon-purple'}
            `}>
              {/* Icon */}
              <motion.div
                className="text-6xl mb-3"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {icon || (type === 'levelUp' ? '🚀' : type === 'queueClear' ? '🎉' : type === 'combo' ? '🔥' : '🏆')}
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                {title || (type === 'levelUp' ? 'LEVEL UP!' : type === 'queueClear' ? 'QUEUE CLEARED!' : type === 'combo' ? 'COMBO!' : 'ACHIEVEMENT!')}
              </h2>

              {/* Message */}
              {message && (
                <p className="text-white/90 font-medium mb-3">{message}</p>
              )}

              {/* XP reward */}
              {xpAmount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="inline-block px-4 py-2 bg-white/20 rounded-full"
                >
                  <span className="text-white font-black text-xl">+{xpAmount} XP</span>
                </motion.div>
              )}

              {/* Tap to dismiss hint */}
              <p className="mt-4 text-white/60 text-sm">Tap to dismiss</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Export a hook for triggering celebrations
export function useCelebration() {
  const [celebration, setCelebration] = useState(null);

  const celebrate = (options) => {
    setCelebration(options);
  };

  const dismiss = () => {
    setCelebration(null);
  };

  return {
    celebration,
    celebrate,
    dismiss,
    CelebrationComponent: celebration ? (
      <CelebrationOverlay
        {...celebration}
        show={true}
        onComplete={dismiss}
      />
    ) : null,
  };
}
