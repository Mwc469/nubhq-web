/**
 * Streak Master Mode - High-stakes streak challenge
 * XP multiplier based on current streak, skip = streak broken!
 */
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, X, ArrowLeft, ArrowRight, Skull, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { playSound } from '../../lib/soundSystem';
import { haptic } from '../mobile/MobileComponents';
import { XP_REWARDS } from '../../lib/gamification';

// Mock content
const MOCK_CONTENT = [
  { id: 1, text: "New walrus meme drop tomorrow!", type: 'post' },
  { id: 2, text: "Behind the scenes: recording weird sounds", type: 'post' },
  { id: 3, text: "The official NUB guide to chaos", type: 'post' },
  { id: 4, text: "Weekend vibes with the band", type: 'post' },
  { id: 5, text: "Merch restock coming soon!", type: 'post' },
  { id: 6, text: "Live stream announcement", type: 'post' },
  { id: 7, text: "Fan art appreciation post", type: 'post' },
  { id: 8, text: "Tour dates revealed!", type: 'post' },
  { id: 9, text: "New single preview", type: 'post' },
  { id: 10, text: "Collab with mystery artist", type: 'post' },
];

const STREAK_MILESTONES = [
  { streak: 3, title: "Getting Started", bonus: 25 },
  { streak: 7, title: "On Fire!", bonus: 50 },
  { streak: 15, title: "Unstoppable", bonus: 100 },
  { streak: 30, title: "LEGENDARY", bonus: 250 },
];

export default function StreakMaster({ onClose, onComplete }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [milestonesHit, setMilestonesHit] = useState([]);
  const [isShaking, setIsShaking] = useState(false);

  const currentContent = MOCK_CONTENT[currentIndex % MOCK_CONTENT.length];

  // Calculate multiplier based on streak
  const getMultiplier = (currentStreak) => {
    return 1 + (currentStreak * 0.1); // 1.0x, 1.1x, 1.2x, etc.
  };

  // Start the game
  const startGame = useCallback(() => {
    setGameState('playing');
    setStreak(0);
    setHighestStreak(0);
    setXpEarned(0);
    setCurrentIndex(0);
    setMilestonesHit([]);
    playSound('levelUp');
    haptic?.('success');
  }, []);

  // Handle approve (builds streak)
  const handleApprove = useCallback(() => {
    if (gameState !== 'playing') return;

    const newStreak = streak + 1;
    const multiplier = getMultiplier(newStreak);
    const baseXp = XP_REWARDS.approvePost;
    const xp = Math.round(baseXp * multiplier);

    setStreak(newStreak);
    setHighestStreak(prev => Math.max(prev, newStreak));
    setXpEarned(prev => prev + xp);

    // Check milestones
    const milestone = STREAK_MILESTONES.find(m => m.streak === newStreak);
    if (milestone) {
      setMilestonesHit(prev => [...prev, milestone]);
      setXpEarned(prev => prev + milestone.bonus);
      playSound('achievement');
      haptic?.('success');
    } else {
      playSound('approve');
      haptic?.('light');
    }

    setShowResult('approve');
    setTimeout(() => setShowResult(null), 300);
    setCurrentIndex(prev => prev + 1);
  }, [gameState, streak]);

  // Handle skip (BREAKS STREAK)
  const handleSkip = useCallback(() => {
    if (gameState !== 'playing') return;

    // Streak broken!
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    if (streak > 0) {
      playSound('error');
      haptic?.('error');
      setStreak(0);
    } else {
      playSound('reject');
      haptic?.('light');
    }

    setShowResult('reject');
    setTimeout(() => setShowResult(null), 300);
    setCurrentIndex(prev => prev + 1);
  }, [gameState, streak]);

  // End game
  const endGame = useCallback(() => {
    setGameState('finished');
    playSound('achievement');
    haptic?.('success');

    // Save results
    const stats = JSON.parse(localStorage.getItem('nub_player_stats') || '{}');
    stats.xp = (stats.xp || 0) + xpEarned;
    stats.longestStreak = Math.max(stats.longestStreak || 0, highestStreak);
    localStorage.setItem('nub_player_stats', JSON.stringify(stats));

    // Save high score
    const highScores = JSON.parse(localStorage.getItem('nub_streak_master_scores') || '[]');
    highScores.push({
      streak: highestStreak,
      xpEarned,
      milestonesHit: milestonesHit.length,
      date: new Date().toISOString(),
    });
    highScores.sort((a, b) => b.streak - a.streak);
    localStorage.setItem('nub_streak_master_scores', JSON.stringify(highScores.slice(0, 10)));

    onComplete?.({ streak: highestStreak, xpEarned });
  }, [xpEarned, highestStreak, milestonesHit, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'ready' && e.key === ' ') {
        e.preventDefault();
        startGame();
      } else if (gameState === 'playing') {
        if (e.key === 'ArrowRight' || e.key === 'a') {
          handleApprove();
        } else if (e.key === 'ArrowLeft' || e.key === 'd') {
          handleSkip();
        } else if (e.key === 'Escape') {
          endGame();
        }
      } else if (gameState === 'finished' && e.key === ' ') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, handleApprove, handleSkip, endGame, onClose]);

  const bestStreak = JSON.parse(localStorage.getItem('nub_streak_master_scores') || '[]')[0]?.streak || 0;
  const multiplier = getMultiplier(streak);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className={cn(
        'w-full max-w-md mx-4 transition-transform',
        isShaking && 'animate-[shake_0.5s_ease-in-out]'
      )}>
        {/* Ready State */}
        {gameState === 'ready' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">
              <Flame className="w-24 h-24 mx-auto text-neon-orange animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">STREAK MASTER</h1>
            <p className="text-white/70 mb-6">Build your streak! Skip = streak broken!</p>

            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-white/80 text-sm mb-2">Multiplier increases with streak:</p>
              <div className="flex justify-center gap-2">
                {[1, 5, 10, 20].map(s => (
                  <div key={s} className="text-center px-3 py-1 bg-white/10 rounded">
                    <div className="text-xs text-white/60">{s}x</div>
                    <div className="text-sm text-neon-orange font-bold">
                      {(1 + s * 0.1).toFixed(1)}x
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center mb-6 text-sm">
              <div className="px-3 py-2 rounded-lg bg-neon-green/20 text-neon-green">
                <span className="font-bold">RIGHT</span> = Approve (builds streak)
              </div>
              <div className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400">
                <span className="font-bold">LEFT</span> = Skip (BREAKS streak!)
              </div>
            </div>

            {bestStreak > 0 && (
              <p className="text-neon-orange mb-4">
                Best Streak: {bestStreak}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xl rounded-2xl border-4 border-black shadow-[4px_4px_0_#000]"
            >
              START STREAK
            </motion.button>
            <p className="text-white/40 text-sm mt-4">Press SPACE to start</p>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div>
            {/* Streak Display */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3">
                <Flame className={cn(
                  'w-8 h-8',
                  streak >= 15 ? 'text-neon-yellow animate-pulse' :
                  streak >= 7 ? 'text-neon-orange' :
                  streak >= 3 ? 'text-orange-400' :
                  'text-white/40'
                )} />
                <span className="text-5xl font-black text-white">{streak}</span>
                <Flame className={cn(
                  'w-8 h-8',
                  streak >= 15 ? 'text-neon-yellow animate-pulse' :
                  streak >= 7 ? 'text-neon-orange' :
                  streak >= 3 ? 'text-orange-400' :
                  'text-white/40'
                )} />
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-neon-orange font-bold">{multiplier.toFixed(1)}x</span>
                <span className="text-white/40">multiplier</span>
              </div>
            </div>

            {/* Milestone Progress */}
            <div className="flex justify-center gap-2 mb-6">
              {STREAK_MILESTONES.map(m => (
                <div
                  key={m.streak}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-bold',
                    streak >= m.streak
                      ? 'bg-neon-orange text-white'
                      : 'bg-white/10 text-white/40'
                  )}
                >
                  {m.streak}
                </div>
              ))}
            </div>

            {/* Content Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'p-6 rounded-2xl border-4 mb-6',
                  showResult === 'approve' && 'bg-neon-green/20 border-neon-green',
                  showResult === 'reject' && 'bg-red-500/20 border-red-500',
                  !showResult && 'bg-white/10 border-black'
                )}
              >
                <p className="text-white text-xl text-center font-medium">
                  {currentContent.text}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSkip}
                className="flex-1 flex items-center justify-center gap-2 p-4 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-2xl border-2 border-red-500/50 transition-colors"
              >
                <Skull size={20} />
                <span className="font-bold">SKIP</span>
                <span className="text-xs opacity-60">(breaks streak)</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 p-4 bg-neon-green/20 hover:bg-neon-green/40 text-neon-green rounded-2xl border-2 border-neon-green/50 transition-colors"
              >
                <Star size={20} />
                <span className="font-bold">APPROVE</span>
              </motion.button>
            </div>

            {/* XP & End */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-white/60 text-sm">
                +{xpEarned} XP earned
              </div>
              <button
                onClick={endGame}
                className="text-white/40 hover:text-white/60 text-sm"
              >
                End Session (ESC)
              </button>
            </div>
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">
              {highestStreak >= 30 ? (
                <Trophy className="w-24 h-24 mx-auto text-neon-yellow" />
              ) : highestStreak >= 15 ? (
                <Flame className="w-24 h-24 mx-auto text-neon-orange" />
              ) : (
                <Star className="w-24 h-24 mx-auto text-white" />
              )}
            </div>

            <h1 className="text-4xl font-black text-white mb-2">
              {highestStreak >= 30 ? 'LEGENDARY!' :
               highestStreak >= 15 ? 'UNSTOPPABLE!' :
               highestStreak >= 7 ? 'ON FIRE!' :
               'GOOD RUN!'}
            </h1>

            <div className="bg-white/10 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-black text-neon-orange mb-2">
                {highestStreak}
              </div>
              <div className="text-white/60 mb-4">Highest Streak</div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan">+{xpEarned}</div>
                  <div className="text-white/60">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-purple">{milestonesHit.length}</div>
                  <div className="text-white/60">Milestones</div>
                </div>
              </div>
            </div>

            {highestStreak > bestStreak && bestStreak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-neon-orange font-bold mb-4"
              >
                NEW PERSONAL BEST!
              </motion.div>
            )}

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl"
              >
                PLAY AGAIN
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/10 text-white font-bold rounded-xl"
              >
                EXIT
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
