/**
 * AmbientEventLayer - Global overlay for random ambient events
 * Renders walrus bubbles, confetti, achievements, and rare events
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAmbientEvents } from '../../hooks/useAmbientEvents';
import { haptic } from '../mobile/MobileComponents';

// Walrus speech bubble
function WalrusBubble({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      className="fixed bottom-24 right-4 z-50 max-w-xs"
      onClick={onDismiss}
    >
      <div className="relative bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl border-3 border-black shadow-brutal">
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 border-r-3 border-b-3 border-black transform rotate-45" />

        <div className="flex items-start gap-3">
          <span className="text-2xl animate-bounce">🦭</span>
          <p className="text-sm font-medium text-gray-800 dark:text-white pr-2">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Encouragement toast
function EncouragementToast({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed bottom-24 right-4 z-50 max-w-xs"
      onClick={onDismiss}
    >
      <div className="bg-gradient-to-r from-neon-pink to-neon-purple px-4 py-3 rounded-xl border-2 border-black shadow-lg">
        <p className="text-sm font-bold text-white">{message}</p>
      </div>
    </motion.div>
  );
}

// Silly achievement popup
function SillyAchievementPopup({ title, desc, icon, onDismiss }) {
  useEffect(() => {
    haptic?.('success');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
      onClick={onDismiss}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 rounded-2xl border-3 border-black shadow-brutal-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <p className="text-black font-black text-sm">ACHIEVEMENT UNLOCKED!</p>
            <p className="text-black font-bold">{title}</p>
            <p className="text-black/70 text-xs">{desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Confetti burst overlay
function ConfettiBurst({ onDismiss }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    haptic?.('success');

    // Generate confetti particles
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#E91E8C', '#9B30FF', '#00D4D4', '#E6C700', '#FF6B35'][i % 5],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random(),
    }));
    setParticles(newParticles);

    // Auto dismiss
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: -20, x: `${p.x}vw`, rotate: 0 }}
          animate={{
            opacity: 0,
            y: '110vh',
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ background: p.color }}
        />
      ))}
    </div>
  );
}

// Rare event modal
function RareEventModal({ title, message, icon, color, xpReward, onDismiss }) {
  useEffect(() => {
    haptic?.('success');
    haptic?.('success');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.5, y: -100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: -50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className={`relative px-6 py-5 bg-gradient-to-r ${color} rounded-2xl border-4 border-black shadow-brutal-lg`}>
          <div className="text-center">
            <div className="text-5xl mb-2 animate-bounce">{icon}</div>
            <h2 className="text-2xl font-black text-black mb-1">{title}</h2>
            <p className="text-black/80 font-medium mb-2">{message}</p>
            {xpReward && (
              <div className="inline-block px-3 py-1 bg-black/20 rounded-full">
                <span className="text-black font-bold">+{xpReward} XP!</span>
              </div>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-black font-bold hover:bg-black/30 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Floating cactus (rare easter egg)
function FloatingCactus({ onDismiss }) {
  useEffect(() => {
    haptic?.('light');
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ x: '-10vw', y: '50vh' }}
      animate={{ x: '110vw', y: '40vh' }}
      transition={{ duration: 8, ease: 'linear' }}
      className="fixed z-40 pointer-events-none"
    >
      <motion.img
        src="/assets/cactusnub.png"
        alt="Friendly cactus"
        className="w-24 h-24 object-contain"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Main ambient event layer
export default function AmbientEventLayer() {
  const { currentEvent, dismissEvent } = useAmbientEvents();

  return (
    <AnimatePresence mode="wait">
      {currentEvent?.type === 'bubble' && (
        <WalrusBubble
          key="bubble"
          message={currentEvent.message}
          onDismiss={dismissEvent}
        />
      )}

      {currentEvent?.type === 'toast' && (
        <EncouragementToast
          key="toast"
          message={currentEvent.message}
          onDismiss={dismissEvent}
        />
      )}

      {currentEvent?.type === 'achievement' && (
        <SillyAchievementPopup
          key="achievement"
          title={currentEvent.title}
          desc={currentEvent.desc}
          icon={currentEvent.icon}
          onDismiss={dismissEvent}
        />
      )}

      {currentEvent?.type === 'confetti' && (
        <ConfettiBurst key="confetti" onDismiss={dismissEvent} />
      )}

      {currentEvent?.type === 'modal' && (
        <RareEventModal
          key="modal"
          title={currentEvent.title}
          message={currentEvent.message}
          icon={currentEvent.icon}
          color={currentEvent.color}
          xpReward={currentEvent.xpReward}
          onDismiss={dismissEvent}
        />
      )}

      {currentEvent?.type === 'cactus' && (
        <FloatingCactus key="cactus" onDismiss={dismissEvent} />
      )}
    </AnimatePresence>
  );
}
