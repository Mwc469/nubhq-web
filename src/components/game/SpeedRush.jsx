/**
 * Speed Rush Mode - 60 second timed challenge!
 * Fast decisions, 3x XP, combo multiplier builds faster
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Trophy, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { playSound } from '../../lib/soundSystem';
import { haptic } from '../mobile/MobileComponents';
import { XP_REWARDS } from '../../lib/gamification';

// Mock content for speed rush
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
  { id: 11, text: "Studio day vibes", type: 'post' },
  { id: 12, text: "Q&A session this Friday", type: 'post' },
  { id: 13, text: "Throwback to first gig", type: 'post' },
  { id: 14, text: "Exclusive backstage content", type: 'post' },
  { id: 15, text: "Album artwork teaser", type: 'post' },
];

const GAME_DURATION = 60; // seconds
const XP_MULTIPLIER = 3;

export default function SpeedRush({ onClose, onComplete }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [approvals, setApprovals] = useState(0);
  const [rejects, setRejects] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const currentContent = MOCK_CONTENT[currentIndex % MOCK_CONTENT.length];

  // Start the game
  const startGame = useCallback(() => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setApprovals(0);
    setRejects(0);
    setCurrentIndex(0);
    setXpEarned(0);
    startTimeRef.current = Date.now();
    playSound('levelUp');
    haptic?.('success');
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('finished');
          playSound('achievement');
          haptic?.('success');
          return 0;
        }
        // Warning beep in last 10 seconds
        if (prev <= 10) {
          playSound('tap');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Handle decision
  const handleDecision = useCallback((decision) => {
    if (gameState !== 'playing') return;

    const baseXp = decision === 'approve'
      ? XP_REWARDS.approvePost
      : XP_REWARDS.rejectPost;

    // Calculate XP with multiplier and combo
    const comboBonus = combo >= 3 ? Math.min(combo * 2, 20) : 0;
    const xp = (baseXp * XP_MULTIPLIER) + comboBonus;

    setXpEarned(prev => prev + xp);
    setScore(prev => prev + (100 * (1 + combo * 0.1)));
    setCombo(prev => {
      const newCombo = prev + 1;
      setMaxCombo(max => Math.max(max, newCombo));
      return newCombo;
    });

    if (decision === 'approve') {
      setApprovals(prev => prev + 1);
      playSound('approve');
    } else {
      setRejects(prev => prev + 1);
      playSound('reject');
    }

    haptic?.('light');
    setShowResult(decision);
    setTimeout(() => setShowResult(null), 300);

    // Next content
    setCurrentIndex(prev => prev + 1);
  }, [gameState, combo]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'ready' && e.key === ' ') {
        e.preventDefault();
        startGame();
      } else if (gameState === 'playing') {
        if (e.key === 'ArrowRight' || e.key === 'a') {
          handleDecision('approve');
        } else if (e.key === 'ArrowLeft' || e.key === 'd') {
          handleDecision('reject');
        }
      } else if (gameState === 'finished' && e.key === ' ') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, handleDecision, onClose]);

  // Save score on finish
  useEffect(() => {
    if (gameState === 'finished') {
      // Save high score
      const highScores = JSON.parse(localStorage.getItem('nub_speed_rush_scores') || '[]');
      highScores.push({
        score: Math.round(score),
        approvals,
        rejects,
        maxCombo,
        xpEarned,
        date: new Date().toISOString(),
      });
      highScores.sort((a, b) => b.score - a.score);
      localStorage.setItem('nub_speed_rush_scores', JSON.stringify(highScores.slice(0, 10)));

      // Add XP to player stats
      const stats = JSON.parse(localStorage.getItem('nub_player_stats') || '{}');
      stats.xp = (stats.xp || 0) + xpEarned;
      stats.totalApprovals = (stats.totalApprovals || 0) + approvals + rejects;
      localStorage.setItem('nub_player_stats', JSON.stringify(stats));

      onComplete?.({ score, xpEarned, approvals, rejects, maxCombo });
    }
  }, [gameState, score, xpEarned, approvals, rejects, maxCombo, onComplete]);

  const highScore = JSON.parse(localStorage.getItem('nub_speed_rush_scores') || '[]')[0]?.score || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md mx-4">
        {/* Ready State */}
        {gameState === 'ready' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">
              <Zap className="w-24 h-24 mx-auto text-neon-yellow animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">SPEED RUSH</h1>
            <p className="text-white/70 mb-6">60 seconds. Max approvals. 3x XP!</p>

            <div className="flex gap-4 justify-center mb-6 text-sm">
              <div className="px-3 py-2 rounded-lg bg-white/10 text-white">
                <span className="text-neon-green">RIGHT</span> = Approve
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/10 text-white">
                <span className="text-neon-pink">LEFT</span> = Reject
              </div>
            </div>

            {highScore > 0 && (
              <p className="text-neon-yellow mb-4">
                High Score: {Math.round(highScore).toLocaleString()}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-orange text-white font-black text-xl rounded-2xl border-4 border-black shadow-[4px_4px_0_#000]"
            >
              START RUSH
            </motion.button>
            <p className="text-white/40 text-sm mt-4">Press SPACE to start</p>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div>
            {/* Timer & Stats Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-white">
                <Timer className={cn(
                  'w-6 h-6',
                  timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'
                )} />
                <span className={cn(
                  'text-2xl font-black font-mono',
                  timeLeft <= 10 && 'text-red-500'
                )}>
                  {timeLeft}
                </span>
              </div>

              {combo >= 3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-neon-orange/20 rounded-full"
                >
                  <span className="text-neon-orange font-bold">
                    {combo}x COMBO!
                  </span>
                </motion.div>
              )}

              <div className="text-right">
                <div className="text-white font-black text-xl">
                  {Math.round(score).toLocaleString()}
                </div>
                <div className="text-neon-green text-xs">+{xpEarned} XP</div>
              </div>
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
                  'p-6 rounded-2xl border-4 border-black mb-6',
                  showResult === 'approve' && 'bg-neon-green/20',
                  showResult === 'reject' && 'bg-neon-pink/20',
                  !showResult && 'bg-white/10'
                )}
              >
                <p className="text-white text-xl text-center font-medium">
                  {currentContent.text}
                </p>
                <p className="text-white/40 text-sm text-center mt-2">
                  #{currentIndex + 1}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDecision('reject')}
                className="flex-1 flex items-center justify-center gap-2 p-4 bg-neon-pink/20 hover:bg-neon-pink/40 text-neon-pink rounded-2xl border-2 border-neon-pink/50 transition-colors"
              >
                <ArrowLeft size={24} />
                <span className="font-bold">SKIP</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDecision('approve')}
                className="flex-1 flex items-center justify-center gap-2 p-4 bg-neon-green/20 hover:bg-neon-green/40 text-neon-green rounded-2xl border-2 border-neon-green/50 transition-colors"
              >
                <span className="font-bold">APPROVE</span>
                <ArrowRight size={24} />
              </motion.button>
            </div>

            {/* 3x XP Badge */}
            <div className="text-center mt-4">
              <span className="px-3 py-1 bg-neon-yellow/20 rounded-full text-neon-yellow text-sm font-bold">
                3x XP ACTIVE
              </span>
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
              <Trophy className="w-24 h-24 mx-auto text-neon-yellow" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">TIME'S UP!</h1>

            <div className="bg-white/10 rounded-2xl p-6 mb-6">
              <div className="text-4xl font-black text-white mb-4">
                {Math.round(score).toLocaleString()}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green">{approvals}</div>
                  <div className="text-white/60">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-pink">{rejects}</div>
                  <div className="text-white/60">Rejected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-orange">{maxCombo}x</div>
                  <div className="text-white/60">Max Combo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan">+{xpEarned}</div>
                  <div className="text-white/60">XP Earned</div>
                </div>
              </div>
            </div>

            {score > highScore && highScore > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-neon-yellow font-bold mb-4"
              >
                NEW HIGH SCORE!
              </motion.div>
            )}

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-orange text-white font-bold rounded-xl"
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
