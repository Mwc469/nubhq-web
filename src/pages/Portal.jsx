/**
 * Portal - The NUB universe entry experience
 * An immersive cosmic gateway that sets the tone for the entire app
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicBackground from '../components/ui/CosmicBackground';
import { BRAND_ASSETS } from '../lib/brandAssets';
import { playSound, playLevelUp } from '../lib/soundSystem';
import { haptic } from '../components/mobile/MobileComponents';

const PORTAL_VISITED_KEY = 'nub_portal_visited';

export default function Portal() {
  const navigate = useNavigate();
  const [stage, setStage] = useState('loading'); // loading, ready, entering
  const [hasVisited, setHasVisited] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);

  useEffect(() => {
    const visited = localStorage.getItem(PORTAL_VISITED_KEY);
    setHasVisited(!!visited);

    // Quick entry for returning users
    if (visited) {
      setTimeout(() => setStage('ready'), 500);
    } else {
      // Full dramatic entrance for first-timers
      setTimeout(() => setStage('ready'), 1500);
    }
  }, []);

  const enterPortal = useCallback(() => {
    setStage('entering');
    haptic?.('medium');
    playSound('success');

    // Mark as visited
    localStorage.setItem(PORTAL_VISITED_KEY, 'true');

    // Navigate after animation
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 600);
  }, [navigate]);

  const handleLogoTap = useCallback(() => {
    haptic?.('light');
    playSound('tap');
    setLogoTaps((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        // Easter egg: rapid taps trigger celebration
        playLevelUp();
        haptic?.('success');
        return 0;
      }
      return newCount;
    });
  }, []);

  // Auto-enter for returning users after brief display
  useEffect(() => {
    if (hasVisited && stage === 'ready') {
      const timer = setTimeout(enterPortal, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasVisited, stage, enterPortal]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <CosmicBackground variant="portal" animated overlay={false} className="absolute inset-0" />

      <AnimatePresence mode="wait">
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-white/50 text-lg font-medium">
              <span className="nub-loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </motion.div>
        )}

        {stage === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            {/* Floating decorative elements */}
            <motion.img
              src={BRAND_ASSETS.buttons.cactus}
              alt=""
              className="absolute top-[15%] left-[10%] w-16 h-16 object-contain opacity-60 animate-cosmic-float"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ animationDelay: '0.5s' }}
            />
            <motion.img
              src={BRAND_ASSETS.buttons.cactus}
              alt=""
              className="absolute bottom-[20%] right-[8%] w-12 h-12 object-contain opacity-40 animate-cosmic-float"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ animationDelay: '1.2s' }}
            />

            {/* Main logo */}
            <motion.div
              initial={{ scale: hasVisited ? 1 : 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: hasVisited ? 0 : 0.2,
              }}
              className="relative mb-8"
            >
              <motion.img
                src={BRAND_ASSETS.logos.screaming}
                alt="NUB"
                className="w-48 h-48 md:w-64 md:h-64 object-contain cursor-pointer animate-portal-breathe drop-shadow-2xl"
                onClick={handleLogoTap}
                whileTap={{ scale: 0.95 }}
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(233, 30, 140, 0.5))',
                }}
              />

              {/* Glow ring behind logo */}
              <div
                className="absolute inset-0 -z-10 rounded-full animate-nebula-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(233, 30, 140, 0.3) 0%, transparent 70%)',
                  transform: 'scale(1.5)',
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: hasVisited ? 0.2 : 0.6 }}
              className="text-white/70 text-lg md:text-xl font-medium mb-8 text-center"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Take Weird Seriously
            </motion.p>

            {/* Enter button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: hasVisited ? 0.3 : 0.8 }}
              onClick={enterPortal}
              className="relative px-8 py-4 bg-brand-orange text-white font-bold text-xl rounded-xl
                         border-3 border-black shadow-brutal hover:shadow-brutal-lg
                         transform hover:-translate-y-1 hover:-translate-x-1
                         active:translate-y-0.5 active:translate-x-0.5 active:shadow-brutal-sm
                         transition-all duration-150 nub-button-tap"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Touch the Nub</span>

              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-50"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(233, 30, 140, 0.5)',
                    '0 0 40px rgba(233, 30, 140, 0.8)',
                    '0 0 20px rgba(233, 30, 140, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.button>

            {/* Skip hint for returning users */}
            {hasVisited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-white/40 text-sm"
              >
                Auto-entering in a moment...
              </motion.p>
            )}
          </motion.div>
        )}

        {stage === 'entering' && (
          <motion.div
            key="entering"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 20, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(233, 30, 140, 1) 0%, rgba(155, 48, 255, 1) 100%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 right-6 p-3 text-white/50 hover:text-white/80 transition-colors"
        onClick={() => {
          haptic?.('light');
          // TODO: Toggle sound mute
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      </motion.button>
    </div>
  );
}
