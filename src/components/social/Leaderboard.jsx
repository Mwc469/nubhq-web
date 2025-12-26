/**
 * Leaderboard Component - Weekly rankings
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Zap, Crown, Medal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { playSound } from '../../lib/soundSystem';

// Mock leaderboard data (would come from API in production)
const MOCK_LEADERBOARDS = {
  xp: [
    { rank: 1, name: 'ChaosWalrus42', score: 15420, badge: '🦭👑' },
    { rank: 2, name: 'NubMaster', score: 12300, badge: '🦭🧙' },
    { rank: 3, name: 'WeirdVibes', score: 9850, badge: '🦭⚡' },
    { rank: 4, name: 'ContentKing', score: 8200, badge: '🦭🔥' },
    { rank: 5, name: 'ApprovalBot', score: 7100, badge: '🦭🎯' },
    { rank: 6, name: 'You', score: 0, badge: '🦭', isCurrentUser: true },
    { rank: 7, name: 'NightOwl99', score: 5200, badge: '🦭✨' },
    { rank: 8, name: 'WalrusWhisperer', score: 4800, badge: '🦭' },
    { rank: 9, name: 'VibeChecker', score: 4100, badge: '🦭' },
    { rank: 10, name: 'ChaosCurator', score: 3500, badge: '🦭' },
  ],
  streak: [
    { rank: 1, name: 'StreakGod', score: 47, badge: '🔥🔥🔥' },
    { rank: 2, name: 'Consistent', score: 32, badge: '🔥🔥' },
    { rank: 3, name: 'NeverMiss', score: 28, badge: '🔥' },
    { rank: 4, name: 'DailyGrinder', score: 21, badge: '⚡' },
    { rank: 5, name: 'You', score: 0, badge: '🦭', isCurrentUser: true },
  ],
  speedRush: [
    { rank: 1, name: 'SpeedDemon', score: 8420, badge: '⚡⚡' },
    { rank: 2, name: 'QuickFingers', score: 7800, badge: '⚡' },
    { rank: 3, name: 'FastApprover', score: 6500, badge: '🏃' },
    { rank: 4, name: 'RapidFire', score: 5900, badge: '🔥' },
    { rank: 5, name: 'You', score: 0, badge: '🦭', isCurrentUser: true },
  ],
  approvals: [
    { rank: 1, name: 'ApprovalMachine', score: 2847, badge: '🤖' },
    { rank: 2, name: 'ContentCrusher', score: 2100, badge: '💪' },
    { rank: 3, name: 'DecisionMaker', score: 1850, badge: '⚡' },
    { rank: 4, name: 'QualityControl', score: 1600, badge: '✅' },
    { rank: 5, name: 'You', score: 0, badge: '🦭', isCurrentUser: true },
  ],
};

const TABS = [
  { id: 'xp', label: 'XP This Week', icon: Trophy, color: 'neon-yellow' },
  { id: 'streak', label: 'Longest Streak', icon: Flame, color: 'neon-orange' },
  { id: 'speedRush', label: 'Speed Rush', icon: Zap, color: 'neon-cyan' },
  { id: 'approvals', label: 'Total Approvals', icon: Crown, color: 'neon-pink' },
];

const RANK_STYLES = {
  1: { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', text: 'text-black', icon: '🥇' },
  2: { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-black', icon: '🥈' },
  3: { bg: 'bg-gradient-to-r from-amber-600 to-amber-700', text: 'text-white', icon: '🥉' },
};

export default function Leaderboard({ className }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState('xp');

  // Get current user stats to populate "You" entries
  const playerStats = useMemo(() => {
    try {
      const stored = localStorage.getItem('nub_player_stats');
      return stored ? JSON.parse(stored) : { xp: 0, streak: 0, totalApprovals: 0 };
    } catch {
      return { xp: 0, streak: 0, totalApprovals: 0 };
    }
  }, []);

  // Get Speed Rush high score
  const speedRushScore = useMemo(() => {
    try {
      const scores = JSON.parse(localStorage.getItem('nub_speed_rush_scores') || '[]');
      return scores[0]?.score || 0;
    } catch {
      return 0;
    }
  }, []);

  // Update mock data with actual user stats
  const leaderboardData = useMemo(() => {
    const data = JSON.parse(JSON.stringify(MOCK_LEADERBOARDS));

    // Update user scores
    const userXp = data.xp.find(e => e.isCurrentUser);
    if (userXp) userXp.score = playerStats.xp || 0;

    const userStreak = data.streak.find(e => e.isCurrentUser);
    if (userStreak) userStreak.score = playerStats.streak || 0;

    const userSpeed = data.speedRush.find(e => e.isCurrentUser);
    if (userSpeed) userSpeed.score = speedRushScore;

    const userApprovals = data.approvals.find(e => e.isCurrentUser);
    if (userApprovals) userApprovals.score = playerStats.totalApprovals || 0;

    // Re-sort and re-rank each leaderboard
    Object.keys(data).forEach(key => {
      data[key].sort((a, b) => b.score - a.score);
      data[key].forEach((entry, i) => {
        entry.rank = i + 1;
      });
    });

    return data;
  }, [playerStats, speedRushScore]);

  const currentLeaderboard = leaderboardData[activeTab];
  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div className={className}>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                playSound('tap');
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold transition-all whitespace-nowrap',
                isActive
                  ? `bg-${tab.color} text-white border-black shadow-[3px_3px_0_#000]`
                  : isLight
                  ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Leaderboard List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          {currentLeaderboard.map((entry, index) => {
            const rankStyle = RANK_STYLES[entry.rank];
            const isTopThree = entry.rank <= 3;

            return (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all',
                  entry.isCurrentUser
                    ? 'bg-neon-pink/20 border-2 border-neon-pink'
                    : isTopThree
                    ? 'border-2 border-black'
                    : isLight
                    ? 'bg-white border border-gray-200'
                    : 'bg-white/5 border border-white/10'
                )}
              >
                {/* Rank */}
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm',
                  rankStyle?.bg || (isLight ? 'bg-gray-100' : 'bg-white/10'),
                  rankStyle?.text || (isLight ? 'text-gray-600' : 'text-white/60')
                )}>
                  {rankStyle?.icon || entry.rank}
                </div>

                {/* Badge */}
                <span className="text-xl">{entry.badge}</span>

                {/* Name */}
                <div className="flex-1">
                  <span className={cn(
                    'font-bold',
                    entry.isCurrentUser
                      ? 'text-neon-pink'
                      : isLight
                      ? 'text-gray-900'
                      : 'text-white'
                  )}>
                    {entry.name}
                  </span>
                  {entry.isCurrentUser && (
                    <span className="ml-2 text-xs text-neon-pink">(You)</span>
                  )}
                </div>

                {/* Score */}
                <div className={cn(
                  'text-right font-black',
                  isTopThree
                    ? `text-${currentTab.color}`
                    : isLight
                    ? 'text-gray-700'
                    : 'text-white/80'
                )}>
                  {entry.score.toLocaleString()}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className={cn(
        'mt-6 p-4 rounded-xl text-center text-sm',
        isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/5 text-white/50'
      )}>
        Leaderboards reset every week. Keep grinding!
      </div>
    </div>
  );
}
