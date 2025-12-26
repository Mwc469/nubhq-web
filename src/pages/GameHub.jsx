/**
 * GameHub - The game-like dashboard replacing traditional stats
 * A fun command center where all actions feel like games
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Brain,
  Image,
  PenTool,
  Calendar,
  Zap,
  Flame,
  Trophy,
} from 'lucide-react';

import { CosmicGlow } from '../components/ui/CosmicBackground';
import WalrusCompanion from '../components/companion/WalrusCompanion';
import GameTile, { GameTileCompact } from '../components/hub/GameTile';
import { useApprovals, useDashboard } from '../hooks/useApi';
import { LEVELS, XP_REWARDS } from '../lib/gamification';
import { playSound } from '../lib/soundSystem';
import { haptic } from '../components/mobile/MobileComponents';

// Get stored player stats (or defaults)
function getPlayerStats() {
  try {
    const stored = localStorage.getItem('nub_player_stats');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load player stats:', e);
  }
  return {
    xp: 0,
    level: 1,
    streak: 0,
    todayApprovals: 0,
  };
}

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export default function GameHub() {
  const navigate = useNavigate();
  const { data: approvals } = useApprovals('pending');
  const { data: dashboard } = useDashboard();

  const playerStats = useMemo(() => getPlayerStats(), []);
  const levelInfo = useMemo(() => getLevelInfo(playerStats.xp), [playerStats.xp]);

  const pendingCount = approvals?.length || 0;
  const totalPending = pendingCount + (dashboard?.pendingVoicePrompts || 3) + (dashboard?.pendingMediaPicks || 2);

  // Calculate XP progress to next level
  const xpProgress = useMemo(() => {
    const currentLevelXp = playerStats.xp - levelInfo.minXp;
    const levelRange = levelInfo.maxXp - levelInfo.minXp;
    return Math.min((currentLevelXp / levelRange) * 100, 100);
  }, [playerStats.xp, levelInfo]);

  // Mock daily challenges (would come from API/gamification system)
  const dailyChallenges = [
    { id: '1', title: 'Approve 10', progress: Math.min(playerStats.todayApprovals, 10), goal: 10, xp: 100 },
    { id: '2', title: 'Train AI 5x', progress: 2, goal: 5, xp: 75 },
    { id: '3', title: '3-day streak', progress: playerStats.streak, goal: 3, xp: 150 },
  ];

  const handleGameStart = () => {
    haptic?.('medium');
    playSound('success');
    navigate('/game-queue');
  };

  return (
    <div className="relative min-h-full pb-24">
      {/* Subtle cosmic background */}
      <CosmicGlow />

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        {/* XP Bar Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{levelInfo.badge}</span>
              <div>
                <h2
                  className="text-sm font-bold text-gray-800 dark:text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {levelInfo.title}
                </h2>
                <p className="text-xs text-gray-500">Level {levelInfo.level}</p>
              </div>
            </div>

            {/* Streak */}
            {playerStats.streak > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {playerStats.streak}
                </span>
              </div>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-2 border-black">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #E91E8C 0%, #9B30FF 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
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
            mood={pendingCount > 5 ? 'excited' : 'idle'}
            pendingCount={totalPending}
            size="md"
          />
        </motion.div>

        {/* Main Game Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <GameTile
            title="Approve"
            count={pendingCount}
            icon={CheckCircle}
            color="pink"
            xpReward={XP_REWARDS.approvePost}
            route="/game-queue"
            description="Swipe to decide"
          />

          <GameTile
            title="Train AI"
            count={dashboard?.pendingVoicePrompts || 3}
            icon={Brain}
            color="purple"
            xpReward={XP_REWARDS.voicePick}
            route="/game-queue?type=voice"
            description="Teach your voice"
          />

          <GameTile
            title="Pick Media"
            count={dashboard?.pendingMediaPicks || 2}
            icon={Image}
            color="cyan"
            xpReward={XP_REWARDS.mediaPick}
            route="/game-queue?type=media"
            description="Choose the vibe"
          />

          <GameTile
            title="Create"
            icon={PenTool}
            color="orange"
            xpReward={0}
            route="/post-studio"
            description="Make something weird"
          />
        </motion.div>

        {/* Quick Play Button */}
        {totalPending > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleGameStart}
            className="w-full mb-6 py-4 bg-gradient-to-r from-neon-pink to-neon-purple
                       text-white font-bold text-lg rounded-xl
                       border-3 border-black shadow-brutal
                       hover:-translate-y-1 hover:-translate-x-1 hover:shadow-brutal-lg
                       active:translate-y-0.5 active:translate-x-0.5 active:shadow-brutal-sm
                       transition-all duration-150"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Play Now</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {totalPending}
              </span>
            </div>
          </motion.button>
        )}

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="font-bold text-gray-800 dark:text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Daily Challenges
            </h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {dailyChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex-shrink-0 w-36 p-3 bg-white dark:bg-brand-dark
                           rounded-lg border-2 border-black shadow-brutal-sm"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                  {challenge.title}
                </p>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-neon-green rounded-full"
                    style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {challenge.progress}/{challenge.goal}
                  </span>
                  <span className="text-xs text-yellow-600">+{challenge.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Secondary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <GameTileCompact
            title="Content Calendar"
            icon={Calendar}
            color="cyan"
            route="/calendar"
          />
        </motion.div>
      </div>
    </div>
  );
}
