/**
 * GameHub - The game-like command center
 * 4 core approval/training tasks presented as fun games
 * NOW WITH EXTRA SILLINESS
 */
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Mail,
  MessageCircle,
  Brain,
  Zap,
  Flame,
  Sparkles,
  Trophy,
  Star,
  PartyPopper,
} from 'lucide-react';

import { CosmicGlow } from '../components/ui/CosmicBackground';
import WalrusCompanion from '../components/companion/WalrusCompanion';
import { LEVELS, XP_REWARDS } from '../lib/gamification';
import { playSound } from '../lib/soundSystem';
import { haptic } from '../components/mobile/MobileComponents';
import { cn } from '../lib/utils';

// SILLY ACHIEVEMENTS - for doing absolutely nothing
const SILLY_ACHIEVEMENTS = [
  { title: "You Showed Up!", desc: "Achievement: Opening the app. Incredible.", icon: "🏆" },
  { title: "Professional Scroller", desc: "You scrolled! The algorithm trembles.", icon: "📜" },
  { title: "Breathing Champion", desc: "You've been breathing this whole time!", icon: "🌬️" },
  { title: "Screen Starer", desc: "5 seconds of dedicated screen staring.", icon: "👁️" },
  { title: "Gravity Defier", desc: "Your phone hasn't fallen yet. Hero.", icon: "🦸" },
  { title: "Blink Master", desc: "You blinked! Moisture retained!", icon: "😑" },
  { title: "Time Traveler", desc: "You just traveled 1 second into the future.", icon: "⏰" },
  { title: "Wi-Fi Warrior", desc: "Still connected. The router respects you.", icon: "📶" },
  { title: "Battery Saver", desc: "You haven't drained the battery... yet.", icon: "🔋" },
  { title: "Thumb Athlete", desc: "Your thumb moved. Olympic potential.", icon: "👍" },
];

// Random motivational messages that pop up
const RANDOM_ENCOURAGEMENT = [
  "You're doing amazing sweetie! ✨",
  "The walrus believes in you (even though he's just a PNG)",
  "Today's vibe check: PASSED",
  "Plot twist: you're the main character",
  "Your energy right now? *chef's kiss*",
  "Fun fact: you're literally crushing it",
  "Breaking news: local human is incredible",
  "Your serotonin is showing",
  "Quick reminder: you're that person",
  "The universe just winked at you",
];

// Get stored player stats (or defaults)
function getPlayerStats() {
  try {
    const stored = localStorage.getItem('nub_player_stats');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load player stats:', e);
  }
  return { xp: 0, level: 1, streak: 0, todayApprovals: 0 };
}

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

// The 4 core game modes
const GAME_MODES = [
  {
    id: 'schedule',
    title: 'Schedule It',
    description: 'Approve posts for the feed',
    icon: Calendar,
    color: 'pink',
    gradient: 'from-neon-pink to-pink-600',
    bgGlow: 'bg-neon-pink/20',
    xp: '+10 XP',
    route: '/play/schedule',
  },
  {
    id: 'email',
    title: 'Email Blast',
    description: 'Approve for newsletter',
    icon: Mail,
    color: 'cyan',
    gradient: 'from-neon-cyan to-cyan-600',
    bgGlow: 'bg-neon-cyan/20',
    xp: '+10 XP',
    route: '/play/email',
  },
  {
    id: 'replies',
    title: 'Reply Review',
    description: 'Approve response drafts',
    icon: MessageCircle,
    color: 'purple',
    gradient: 'from-neon-purple to-purple-600',
    bgGlow: 'bg-neon-purple/20',
    xp: '+15 XP',
    route: '/play/replies',
  },
  {
    id: 'train',
    title: 'Train the Brain',
    description: 'Make AI smarter',
    icon: Brain,
    color: 'orange',
    gradient: 'from-neon-orange to-orange-600',
    bgGlow: 'bg-neon-orange/20',
    xp: '+15 XP',
    route: '/train',
  },
];

// Silly achievement popup component
function SillyAchievement({ achievement, onDismiss }) {
  useEffect(() => {
    playSound('achievement');
    haptic?.('success');
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 rounded-2xl border-3 border-black shadow-brutal-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{achievement.icon}</span>
          <div>
            <p className="text-black font-black text-sm">ACHIEVEMENT UNLOCKED!</p>
            <p className="text-black font-bold">{achievement.title}</p>
            <p className="text-black/70 text-xs">{achievement.desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Random encouragement toast
function EncouragementToast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed bottom-24 right-4 z-50 max-w-xs"
    >
      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border-2 border-neon-pink shadow-lg">
        <p className="text-sm font-medium text-gray-800 dark:text-white">{message}</p>
      </div>
    </motion.div>
  );
}

// Game tile component
function GameTile({ game, pending, onClick, delay }) {
  const Icon = game.icon;
  const hasPending = pending > 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'relative w-full aspect-[4/3] rounded-2xl overflow-hidden',
        'border-3 border-black shadow-brutal',
        'hover:shadow-brutal-lg hover:-translate-y-1',
        'active:shadow-brutal-sm active:translate-y-0.5',
        'transition-shadow duration-150',
        `bg-gradient-to-br ${game.gradient}`
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-50">
        <div className={cn('absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl', game.bgGlow)} />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4 text-white">
        {/* Top: Icon + Badge */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon size={24} />
          </div>
          {hasPending && (
            <div className="px-2.5 py-1 bg-white text-black text-sm font-black rounded-full animate-pulse">
              {pending}
            </div>
          )}
        </div>

        {/* Bottom: Title + XP */}
        <div>
          <h3 className="text-lg font-black mb-0.5">{game.title}</h3>
          <p className="text-white/70 text-xs mb-2">{game.description}</p>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded text-xs font-bold">
            <Sparkles size={12} />
            {game.xp}
          </div>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
    </motion.button>
  );
}

export default function GameHub() {
  const navigate = useNavigate();
  const [sillyAchievement, setSillyAchievement] = useState(null);
  const [encouragement, setEncouragement] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const playerStats = useMemo(() => getPlayerStats(), []);
  const levelInfo = useMemo(() => getLevelInfo(playerStats.xp), [playerStats.xp]);

  // Mock pending counts (would come from API)
  const pendingCounts = {
    schedule: 5,
    email: 3,
    replies: 8,
    train: 4,
  };

  const totalPending = Object.values(pendingCounts).reduce((a, b) => a + b, 0);

  // Calculate XP progress
  const xpProgress = useMemo(() => {
    const currentLevelXp = playerStats.xp - levelInfo.minXp;
    const levelRange = levelInfo.maxXp - levelInfo.minXp;
    return Math.min((currentLevelXp / levelRange) * 100, 100);
  }, [playerStats.xp, levelInfo]);

  // Random silly achievement on page load (10% chance)
  useEffect(() => {
    const hasSeenToday = sessionStorage.getItem('silly_achievement_shown');
    if (!hasSeenToday && Math.random() < 0.4) {
      const randomAchievement = SILLY_ACHIEVEMENTS[Math.floor(Math.random() * SILLY_ACHIEVEMENTS.length)];
      setTimeout(() => {
        setSillyAchievement(randomAchievement);
        sessionStorage.setItem('silly_achievement_shown', 'true');
      }, 2000);
    }
  }, []);

  // Random encouragement every 30-60 seconds
  useEffect(() => {
    const showEncouragement = () => {
      if (Math.random() < 0.3) { // 30% chance when timer fires
        const randomMsg = RANDOM_ENCOURAGEMENT[Math.floor(Math.random() * RANDOM_ENCOURAGEMENT.length)];
        setEncouragement(randomMsg);
      }
    };

    const interval = setInterval(showEncouragement, 30000 + Math.random() * 30000);
    return () => clearInterval(interval);
  }, []);

  // Random confetti burst (very rare)
  useEffect(() => {
    const confettiBurst = () => {
      if (Math.random() < 0.05) { // 5% chance
        setConfettiActive(true);
        playSound('combo');
        haptic?.('success');
        setTimeout(() => setConfettiActive(false), 2000);
      }
    };

    const interval = setInterval(confettiBurst, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleGameSelect = (game) => {
    haptic?.('medium');
    playSound('tap');
    navigate(game.route);
  };

  const handleQuickPlay = () => {
    haptic?.('medium');
    playSound('success');
    // Find game with most pending items
    const maxGame = GAME_MODES.reduce((max, game) =>
      (pendingCounts[game.id] || 0) > (pendingCounts[max.id] || 0) ? game : max
    );
    navigate(maxGame.route);
  };

  return (
    <div className="relative min-h-full pb-24">
      <CosmicGlow />

      {/* Silly achievement popup */}
      <AnimatePresence>
        {sillyAchievement && (
          <SillyAchievement
            achievement={sillyAchievement}
            onDismiss={() => setSillyAchievement(null)}
          />
        )}
      </AnimatePresence>

      {/* Random encouragement toast */}
      <AnimatePresence>
        {encouragement && (
          <EncouragementToast
            message={encouragement}
            onDismiss={() => setEncouragement(null)}
          />
        )}
      </AnimatePresence>

      {/* Random confetti burst */}
      <AnimatePresence>
        {confettiActive && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  opacity: 0,
                  y: window.innerHeight + 50,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: 2 + Math.random(),
                  ease: 'linear',
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  background: ['#E91E8C', '#9B30FF', '#00D4D4', '#E6C700', '#FF6B35'][i % 5],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 px-4 py-6 max-w-lg mx-auto">
        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{levelInfo.badge}</span>
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white">
                  {levelInfo.title}
                </h2>
                <p className="text-xs text-gray-500">Level {levelInfo.level}</p>
              </div>
            </div>
            {playerStats.streak > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {playerStats.streak}
                </span>
              </div>
            )}
          </div>

          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-2 border-black">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: 'linear-gradient(90deg, #E91E8C 0%, #9B30FF 100%)' }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white drop-shadow-md">
                {playerStats.xp} / {levelInfo.maxXp === Infinity ? '∞' : levelInfo.maxXp} XP
              </span>
            </div>
          </div>
        </motion.div>

        {/* Walrus Companion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <WalrusCompanion
            mood={totalPending > 10 ? 'excited' : 'idle'}
            pendingCount={totalPending}
            size="md"
          />
        </motion.div>

        {/* 4 Game Tiles - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {GAME_MODES.map((game, i) => (
            <GameTile
              key={game.id}
              game={game}
              pending={pendingCounts[game.id]}
              onClick={() => handleGameSelect(game)}
              delay={0.15 + i * 0.05}
            />
          ))}
        </div>

        {/* Quick Play Button */}
        {totalPending > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleQuickPlay}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-purple
                       text-white font-bold text-lg rounded-xl
                       border-3 border-black shadow-brutal
                       hover:-translate-y-1 hover:shadow-brutal-lg
                       active:translate-y-0.5 active:shadow-brutal-sm
                       transition-all duration-150"
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Quick Play</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {totalPending} waiting
              </span>
            </div>
          </motion.button>
        )}

        {/* Daily Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-white/5 dark:bg-white/5 rounded-xl border-2 border-black/10 dark:border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">
              Today's Progress
            </h3>
            <span className="text-xs text-gray-500">
              {playerStats.todayApprovals || 0} decisions made
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {GAME_MODES.map((game) => {
              const Icon = game.icon;
              return (
                <div key={game.id} className="p-2">
                  <Icon size={20} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                    {pendingCounts[game.id]}
                  </p>
                  <p className="text-[10px] text-gray-400">pending</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
