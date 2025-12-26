/**
 * Achievements Gallery - View all achievements and progress
 */
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Star, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { ACHIEVEMENTS, LEVELS } from '../lib/gamification';
import { playSound } from '../lib/soundSystem';
import { PullToRefresh } from '../components/mobile/MobileComponents';

function getPlayerStats() {
  try {
    const stored = localStorage.getItem('nub_player_stats');
    return stored ? JSON.parse(stored) : {
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      totalApprovals: 0,
      totalSkips: 0,
      voiceTrainingCount: 0,
      mediaPicksCount: 0,
      accuracy: 0,
      todayApprovals: 0,
      achievements: [],
    };
  } catch {
    return { xp: 0, level: 1, achievements: [] };
  }
}

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

const RARITY_COLORS = {
  common: { bg: 'from-gray-400 to-gray-500', border: 'border-gray-400', text: 'text-gray-500' },
  rare: { bg: 'from-blue-400 to-cyan-500', border: 'border-blue-400', text: 'text-blue-400' },
  epic: { bg: 'from-purple-400 to-pink-500', border: 'border-purple-400', text: 'text-purple-400' },
  legendary: { bg: 'from-yellow-400 to-orange-500', border: 'border-yellow-400', text: 'text-yellow-400' },
};

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unlocked', label: 'Unlocked' },
  { id: 'locked', label: 'Locked' },
  { id: 'hidden', label: 'Hidden' },
];

export default function Achievements() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [filter, setFilter] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showHidden, setShowHidden] = useState(false);
  const [stats, setStats] = useState(() => getPlayerStats());

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setStats(getPlayerStats());
    playSound('success');
  };
  const levelInfo = useMemo(() => getLevelInfo(stats.xp), [stats.xp]);

  // Check which achievements are unlocked
  const achievementsWithStatus = useMemo(() => {
    return ACHIEVEMENTS.map(achievement => {
      const isUnlocked = stats.achievements?.includes(achievement.id) || achievement.condition(stats);
      return {
        ...achievement,
        unlocked: isUnlocked,
      };
    });
  }, [stats]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievementsWithStatus;

    switch (filter) {
      case 'unlocked':
        filtered = filtered.filter(a => a.unlocked);
        break;
      case 'locked':
        filtered = filtered.filter(a => !a.unlocked && !a.hidden);
        break;
      case 'hidden':
        filtered = filtered.filter(a => a.hidden);
        break;
    }

    // Hide hidden achievements unless toggled or unlocked
    if (!showHidden && filter !== 'hidden') {
      filtered = filtered.filter(a => !a.hidden || a.unlocked);
    }

    return filtered;
  }, [achievementsWithStatus, filter, showHidden]);

  const unlockedCount = achievementsWithStatus.filter(a => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.filter(a => !a.hidden).length;
  const hiddenUnlockedCount = achievementsWithStatus.filter(a => a.hidden && a.unlocked).length;

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn(
              'text-3xl font-black mb-2',
              isLight ? 'text-gray-900' : 'text-white'
            )}>
              Achievements
            </h1>
            <p className={cn(
              'text-sm',
              isLight ? 'text-gray-500' : 'text-white/60'
            )}>
              {unlockedCount} / {totalCount} unlocked
              {hiddenUnlockedCount > 0 && ` (+${hiddenUnlockedCount} hidden)`}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">
              <Trophy className="w-12 h-12 text-neon-yellow mx-auto" />
            </div>
            <p className="text-xs text-neon-yellow font-bold">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id);
                playSound('tap');
              }}
              className={cn(
                'px-4 py-3 min-h-[44px] rounded-xl border-2 font-bold transition-all whitespace-nowrap touch-target-sm',
                filter === tab.id
                  ? 'bg-neon-pink text-white border-black shadow-brutal-sm'
                  : isLight
                  ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 active:scale-95'
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20 active:scale-95'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowHidden(!showHidden)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl transition-colors touch-target-sm',
            showHidden
              ? 'bg-neon-purple/20 text-neon-purple'
              : isLight
              ? 'text-gray-400 hover:text-gray-600 active:scale-95'
              : 'text-white/40 hover:text-white/60 active:scale-95'
          )}
        >
          {showHidden ? <Eye size={20} /> : <EyeOff size={20} />}
          <span className="text-sm font-medium hidden sm:inline">Hidden</span>
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClick={() => setSelectedAchievement(achievement)}
            delay={index * 0.03}
            isLight={isLight}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className={cn(
          'text-center py-12',
          isLight ? 'text-gray-400' : 'text-white/40'
        )}>
          <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No achievements in this category</p>
        </div>
      )}

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <AchievementModal
            achievement={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
            isLight={isLight}
          />
        )}
      </AnimatePresence>
    </div>
    </PullToRefresh>
  );
}

function AchievementCard({ achievement, onClick, delay, isLight }) {
  const isLocked = !achievement.unlocked;
  const isHidden = achievement.hidden && isLocked;
  const colors = RARITY_COLORS[achievement.rarity];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-xl border-3 transition-all text-center',
        isLocked
          ? isLight
            ? 'bg-gray-100 border-gray-200 opacity-60'
            : 'bg-white/5 border-white/10 opacity-50'
          : `bg-gradient-to-br ${colors.bg} border-black shadow-[4px_4px_0_#000]`
      )}
    >
      {/* Rarity indicator */}
      {!isLocked && (
        <div className="absolute top-1 right-1">
          {achievement.rarity === 'legendary' && (
            <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
          )}
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        'text-4xl mb-2',
        isLocked && 'grayscale'
      )}>
        {isHidden ? '?' : achievement.icon}
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-bold text-sm',
        isLocked
          ? isLight ? 'text-gray-500' : 'text-white/50'
          : 'text-white'
      )}>
        {isHidden ? '???' : achievement.title}
      </h3>

      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
      )}

      {/* XP Badge */}
      {!isLocked && (
        <div className="mt-2 inline-block px-2 py-0.5 bg-white/20 rounded text-xs text-white font-bold">
          +{achievement.xpReward} XP
        </div>
      )}
    </motion.button>
  );
}

function AchievementModal({ achievement, onClose, isLight }) {
  const colors = RARITY_COLORS[achievement.rarity];
  const isLocked = !achievement.unlocked;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className={cn(
          'w-full max-w-sm p-6 rounded-2xl border-4 border-black',
          isLocked
            ? 'bg-gray-800'
            : `bg-gradient-to-br ${colors.bg}`
        )}
      >
        {/* Icon */}
        <div className="text-6xl text-center mb-4">
          {achievement.icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white text-center mb-2">
          {achievement.title}
        </h2>

        {/* Rarity Badge */}
        <div className="text-center mb-4">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-bold uppercase',
            isLocked ? 'bg-gray-600 text-gray-300' : 'bg-white/20 text-white'
          )}>
            {achievement.rarity}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/80 text-center mb-4">
          {achievement.description}
        </p>

        {/* XP Reward */}
        <div className={cn(
          'text-center py-3 rounded-xl mb-4',
          isLocked ? 'bg-white/10' : 'bg-white/20'
        )}>
          <span className="text-white font-black text-xl">
            +{achievement.xpReward} XP
          </span>
        </div>

        {/* Status */}
        <div className="text-center">
          {isLocked ? (
            <div className="flex items-center justify-center gap-2 text-white/60">
              <Lock size={16} />
              <span>Locked</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-neon-green">
              <Trophy size={16} />
              <span className="font-bold">Unlocked!</span>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
