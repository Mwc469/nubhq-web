/**
 * FloatingXp - Shows "+15 XP" floating up when XP is earned
 * Use via the FloatingXpProvider context
 */
import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../../lib/soundSystem';

const FloatingXpContext = createContext(null);

export function FloatingXpProvider({ children }) {
  const [floats, setFloats] = useState([]);

  const showXp = useCallback((amount, position = { x: '50%', y: '50%' }) => {
    const id = Date.now() + Math.random();
    playSound('xp');

    setFloats(prev => [...prev, { id, amount, position }]);

    // Auto remove after animation
    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== id));
    }, 1000);
  }, []);

  return (
    <FloatingXpContext.Provider value={{ showXp }}>
      {children}

      {/* Render floating XP indicators */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {floats.map(({ id, amount, position }) => (
            <motion.div
              key={id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -60, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute font-bold text-lg"
              style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                color: '#E91E8C',
                textShadow: '0 0 10px rgba(233, 30, 140, 0.5), 2px 2px 0 #000',
              }}
            >
              +{amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FloatingXpContext.Provider>
  );
}

export function useFloatingXp() {
  const context = useContext(FloatingXpContext);
  if (!context) {
    // Return no-op if not wrapped in provider
    return { showXp: () => {} };
  }
  return context;
}

// Standalone component for manual placement
export function FloatingXpIndicator({ amount, show, onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -60, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute font-bold text-lg pointer-events-none"
          style={{
            color: '#E91E8C',
            textShadow: '0 0 10px rgba(233, 30, 140, 0.5), 2px 2px 0 #000',
          }}
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
