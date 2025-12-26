/**
 * Profile Card - Shareable player stats card
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Copy, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVELS, ACHIEVEMENTS } from '../../lib/gamification';
import { getEquippedSkin } from '../../lib/walrusSkins';
import { playSound } from '../../lib/soundSystem';
import { useToast } from '../../contexts/ToastContext';

function getPlayerStats() {
  try {
    const stored = localStorage.getItem('nub_player_stats');
    return stored ? JSON.parse(stored) : {
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      totalApprovals: 0,
      achievements: [],
    };
  } catch {
    return { xp: 0, level: 1, streak: 0, longestStreak: 0, totalApprovals: 0, achievements: [] };
  }
}

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export default function ProfileCard({ className }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const toast = useToast();

  const stats = useMemo(() => getPlayerStats(), []);
  const levelInfo = useMemo(() => getLevelInfo(stats.xp), [stats.xp]);
  const equippedSkin = useMemo(() => getEquippedSkin(), []);

  // Get top 3 achievements
  const unlockedAchievements = useMemo(() => {
    return ACHIEVEMENTS
      .filter(a => stats.achievements?.includes(a.id) || a.condition(stats))
      .slice(0, 3);
  }, [stats]);

  const xpProgress = useMemo(() => {
    const current = stats.xp - levelInfo.minXp;
    const range = levelInfo.maxXp - levelInfo.minXp;
    return Math.min((current / range) * 100, 100);
  }, [stats.xp, levelInfo]);

  const handleCopyLink = () => {
    // Generate shareable text (in a real app this would create a shareable image/link)
    const text = `Check out my NubHQ stats!\n${levelInfo.badge} ${levelInfo.title} | Level ${levelInfo.level}\n${stats.xp.toLocaleString()} XP | ${stats.totalApprovals} Approvals\nJoin the chaos at nubhq.com`;
    navigator.clipboard.writeText(text);
    playSound('success');
    toast.success('Copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My NubHQ Profile',
          text: `I'm a ${levelInfo.title} on NubHQ with ${stats.xp.toLocaleString()} XP!`,
          url: 'https://nubhq.com',
        });
        playSound('achievement');
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border-4 border-black',
        'bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900',
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-neon-pink rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-neon-cyan rounded-full blur-3xl" />
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{equippedSkin.preview}</div>
            <div>
              <h2 className="text-2xl font-black text-white">
                {levelInfo.title}
              </h2>
              <p className="text-white/60 text-sm">
                Level {levelInfo.level} | {stats.xp.toLocaleString()} XP
              </p>
            </div>
          </div>
          <div className="text-4xl">{levelInfo.badge}</div>
        </div>

        {/* XP Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Progress to Level {levelInfo.level + 1}</span>
            <span>{Math.round(xpProgress)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-neon-yellow" />
            </div>
            <div className="text-xl font-black text-white">
              {stats.totalApprovals || 0}
            </div>
            <div className="text-xs text-white/50">Approvals</div>
          </div>

          <div className="text-center p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-neon-orange" />
            </div>
            <div className="text-xl font-black text-white">
              {stats.streak || 0}
            </div>
            <div className="text-xs text-white/50">Day Streak</div>
          </div>

          <div className="text-center p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-neon-cyan" />
            </div>
            <div className="text-xl font-black text-white">
              {stats.longestStreak || 0}
            </div>
            <div className="text-xs text-white/50">Best Streak</div>
          </div>
        </div>

        {/* Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
              Top Achievements
            </h3>
            <div className="flex gap-2">
              {unlockedAchievements.map(a => (
                <div
                  key={a.id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10"
                  title={a.description}
                >
                  <span>{a.icon}</span>
                  <span className="text-xs text-white font-medium">{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          >
            <Copy size={16} />
            Copy Stats
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neon-pink text-white font-bold transition-colors hover:bg-neon-pink/80"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>

        {/* NubHQ Branding */}
        <div className="text-center mt-4 text-white/30 text-xs">
          nubhq.com
        </div>
      </div>
    </motion.div>
  );
}
