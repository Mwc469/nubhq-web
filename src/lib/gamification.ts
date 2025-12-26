/**
 * NubHQ Gamification System
 * Turn approvals into an addictive game that trains the AI
 */

// ============================================================
// TYPES
// ============================================================

export interface PlayerStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  totalApprovals: number;
  totalSkips: number;
  voiceTrainingCount: number;
  mediaPicksCount: number;
  accuracy: number; // How often their picks match others
  todayApprovals: number;
  lastActiveDate: string;
  achievements: string[];
  dailyChallengeProgress: number;
  weeklyGoalProgress: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  perks: string[];
  badge: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (stats: PlayerStats) => boolean;
  hidden?: boolean; // Hidden achievements - not shown until unlocked
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  xpReward: number;
  type: 'approvals' | 'voice' | 'media' | 'streak' | 'speed';
}

// ============================================================
// LEVELS & XP
// ============================================================

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Intern Walrus", minXp: 0, maxXp: 100, badge: "🦭", perks: ["Basic approvals"] },
  { level: 2, title: "Junior Curator", minXp: 100, maxXp: 250, badge: "🦭✨", perks: ["Voice training unlocked"] },
  { level: 3, title: "Content Wrangler", minXp: 250, maxXp: 500, badge: "🦭🎯", perks: ["Media comparison unlocked"] },
  { level: 4, title: "Vibe Checker", minXp: 500, maxXp: 1000, badge: "🦭🔥", perks: ["Priority queue access"] },
  { level: 5, title: "Brand Guardian", minXp: 1000, maxXp: 2000, badge: "🦭👑", perks: ["AI suggestion weights increased"] },
  { level: 6, title: "Chaos Curator", minXp: 2000, maxXp: 4000, badge: "🦭⚡", perks: ["Bulk approval power"] },
  { level: 7, title: "Weird Wizard", minXp: 4000, maxXp: 7500, badge: "🦭🧙", perks: ["Custom presets"] },
  { level: 8, title: "Meme Lord", minXp: 7500, maxXp: 12000, badge: "🦭💎", perks: ["AI training multiplier 2x"] },
  { level: 9, title: "Content Deity", minXp: 12000, maxXp: 20000, badge: "🦭🌟", perks: ["All features unlocked"] },
  { level: 10, title: "The NUB Itself", minXp: 20000, maxXp: Infinity, badge: "🦭👽", perks: ["Legendary status", "Custom badge"] },
];

export const XP_REWARDS = {
  // Approvals
  approvePost: 10,
  rejectPost: 5,
  skipPost: 1,

  // Voice training
  voicePick: 15,
  voiceSkip: 2,

  // Media comparison
  mediaPick: 20,
  mediaSkip: 3,

  // Bonuses
  streakBonus: (streak: number) => Math.min(streak * 5, 50), // Up to 50 bonus per action
  speedBonus: 5, // Complete within 3 seconds
  comboBonus: (combo: number) => combo * 2, // Consecutive quick decisions
  perfectDay: 100, // Complete daily challenge
  weeklyGoal: 500, // Complete weekly goal

  // Achievements
  achievementCommon: 50,
  achievementRare: 150,
  achievementEpic: 500,
  achievementLegendary: 1000,
};

// ============================================================
// ACHIEVEMENTS
// ============================================================

export const ACHIEVEMENTS: Achievement[] = [
  // Approval milestones
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Make your first approval decision',
    icon: '🎯',
    xpReward: 50,
    rarity: 'common',
    condition: (s) => s.totalApprovals >= 1,
  },
  {
    id: 'ten_down',
    title: 'Getting Warmed Up',
    description: 'Complete 10 approvals',
    icon: '🔥',
    xpReward: 100,
    rarity: 'common',
    condition: (s) => s.totalApprovals >= 10,
  },
  {
    id: 'fifty_club',
    title: 'Fifty Club',
    description: 'Complete 50 approvals',
    icon: '5️⃣0️⃣',
    xpReward: 250,
    rarity: 'rare',
    condition: (s) => s.totalApprovals >= 50,
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Complete 100 approvals',
    icon: '💯',
    xpReward: 500,
    rarity: 'epic',
    condition: (s) => s.totalApprovals >= 100,
  },
  {
    id: 'approval_machine',
    title: 'Approval Machine',
    description: 'Complete 500 approvals',
    icon: '🤖',
    xpReward: 1000,
    rarity: 'legendary',
    condition: (s) => s.totalApprovals >= 500,
  },

  // Streaks
  {
    id: 'on_fire',
    title: 'On Fire',
    description: '3 day streak',
    icon: '🔥',
    xpReward: 75,
    rarity: 'common',
    condition: (s) => s.streak >= 3,
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: '7 day streak',
    icon: '⚔️',
    xpReward: 200,
    rarity: 'rare',
    condition: (s) => s.streak >= 7,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: '30 day streak',
    icon: '🚀',
    xpReward: 1000,
    rarity: 'legendary',
    condition: (s) => s.streak >= 30,
  },

  // Voice training
  {
    id: 'voice_student',
    title: 'Voice Student',
    description: 'Complete 10 voice training prompts',
    icon: '🎤',
    xpReward: 100,
    rarity: 'common',
    condition: (s) => s.voiceTrainingCount >= 10,
  },
  {
    id: 'voice_master',
    title: 'Voice Master',
    description: 'Complete 100 voice training prompts',
    icon: '🎭',
    xpReward: 500,
    rarity: 'epic',
    condition: (s) => s.voiceTrainingCount >= 100,
  },

  // Media picks
  {
    id: 'eye_for_detail',
    title: 'Eye for Detail',
    description: 'Complete 25 media comparisons',
    icon: '👁️',
    xpReward: 150,
    rarity: 'rare',
    condition: (s) => s.mediaPicksCount >= 25,
  },
  {
    id: 'visual_virtuoso',
    title: 'Visual Virtuoso',
    description: 'Complete 100 media comparisons',
    icon: '🎬',
    xpReward: 500,
    rarity: 'epic',
    condition: (s) => s.mediaPicksCount >= 100,
  },

  // Speed & accuracy
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 10 approvals in under 30 seconds',
    icon: '⚡',
    xpReward: 200,
    rarity: 'rare',
    condition: (s) => s.todayApprovals >= 10,
  },
  {
    id: 'taste_maker',
    title: 'Taste Maker',
    description: 'Achieve 90% accuracy on picks',
    icon: '🎯',
    xpReward: 500,
    rarity: 'epic',
    condition: (s) => s.accuracy >= 90,
  },

  // Special
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Make approvals after midnight',
    icon: '🦉',
    xpReward: 75,
    rarity: 'common',
    condition: () => new Date().getHours() < 5,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Make approvals before 7am',
    icon: '🐦',
    xpReward: 75,
    rarity: 'common',
    condition: () => new Date().getHours() < 7 && new Date().getHours() >= 5,
  },
  {
    id: 'walrus_whisperer',
    title: 'Walrus Whisperer',
    description: 'Reach max level',
    icon: '🦭👑',
    xpReward: 2000,
    rarity: 'legendary',
    condition: (s) => s.level >= 10,
  },

  // HIDDEN ACHIEVEMENTS - Shhh! These are secrets!
  {
    id: 'quality_control',
    title: 'Quality Control',
    description: 'Reject 5 items in a row. Standards!',
    icon: '🚫',
    xpReward: 150,
    rarity: 'rare',
    hidden: true,
    condition: () => {
      const streak = localStorage.getItem('nub_reject_streak');
      return parseInt(streak || '0') >= 5;
    },
  },
  {
    id: 'ultra_walrus',
    title: 'Ultra Walrus Whisperer',
    description: 'Found the 10-tap walrus secret!',
    icon: '🦭✨',
    xpReward: 200,
    rarity: 'epic',
    hidden: true,
    condition: () => {
      const achievements = JSON.parse(localStorage.getItem('nub_hidden_achievements') || '[]');
      return achievements.includes('walrus_whisperer');
    },
  },
  {
    id: 'speed_freak',
    title: 'Speed Freak',
    description: '3 approvals in under 10 seconds. ZOOM!',
    icon: '💨',
    xpReward: 200,
    rarity: 'epic',
    hidden: true,
    condition: () => {
      const speedAchieved = localStorage.getItem('nub_speed_freak');
      return speedAchieved === 'true';
    },
  },
  {
    id: 'night_grinder',
    title: 'Night Grinder',
    description: 'Complete 20 items after midnight',
    icon: '🌙',
    xpReward: 300,
    rarity: 'epic',
    hidden: true,
    condition: () => {
      const count = parseInt(localStorage.getItem('nub_night_approvals') || '0');
      return count >= 20;
    },
  },
  {
    id: 'lucky_one',
    title: 'The Lucky One',
    description: 'Triggered a rare lucky event!',
    icon: '🍀',
    xpReward: 100,
    rarity: 'rare',
    hidden: true,
    condition: () => {
      return localStorage.getItem('nub_lucky_event') === 'true';
    },
  },
];

// ============================================================
// DAILY CHALLENGES
// ============================================================

export function generateDailyChallenges(): DailyChallenge[] {
  const challenges: DailyChallenge[] = [
    {
      id: 'daily_approvals',
      title: 'Daily Dose',
      description: 'Complete 10 approvals today',
      goal: 10,
      current: 0,
      xpReward: 100,
      type: 'approvals',
    },
    {
      id: 'voice_training',
      title: 'Voice Check',
      description: 'Complete 5 voice training prompts',
      goal: 5,
      current: 0,
      xpReward: 75,
      type: 'voice',
    },
    {
      id: 'media_picks',
      title: 'Visual Vibes',
      description: 'Pick 3 preferred media edits',
      goal: 3,
      current: 0,
      xpReward: 60,
      type: 'media',
    },
  ];

  // Shuffle and pick 2-3
  return challenges.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXpProgress(xp: number): { current: number; max: number; percent: number } {
  const level = getLevelInfo(xp);
  const current = xp - level.minXp;
  const max = level.maxXp - level.minXp;
  const percent = Math.min((current / max) * 100, 100);
  return { current, max, percent };
}

export function checkNewAchievements(
  stats: PlayerStats,
  unlockedIds: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    a => !unlockedIds.includes(a.id) && a.condition(stats)
  );
}

export function calculateStreakBonus(streak: number): number {
  if (streak <= 1) return 0;
  return XP_REWARDS.streakBonus(streak);
}

// ============================================================
// MOTIVATIONAL MESSAGES
// ============================================================

export const MOTIVATION = {
  onApprove: [
    "Nice choice! 🦭",
    "The walrus approves your approval!",
    "Content: approved. Vibes: immaculate.",
    "You're on fire! 🔥",
    "That's the NUB way!",
    "Approved and vibing!",
  ],

  onReject: [
    "Fair call! ✋",
    "Not everything makes the cut.",
    "Quality control in action!",
    "The walrus respects your standards.",
    "Keeping it weird, but not THAT weird.",
  ],

  onStreak: (days: number) => [
    `${days} days strong! 🔥`,
    `Streak: ${days}! The walrus is impressed.`,
    `${days} days of chaos curation!`,
    `You're unstoppable! Day ${days}!`,
  ][Math.floor(Math.random() * 4)],

  onLevelUp: (level: LevelInfo) => [
    `LEVEL UP! You're now a ${level.title}! ${level.badge}`,
    `${level.badge} Welcome to level ${level.level}: ${level.title}!`,
    `The walrus promotes you to ${level.title}! ${level.badge}`,
  ][Math.floor(Math.random() * 3)],

  onAchievement: (achievement: Achievement) =>
    `🏆 Achievement Unlocked: ${achievement.title}! +${achievement.xpReward} XP`,

  onCombo: (combo: number) => [
    `${combo}x COMBO! 🔥`,
    `${combo} in a row!`,
    `Combo x${combo}!`,
  ][Math.floor(Math.random() * 3)],

  onPerfectDay: "🌟 PERFECT DAY! All challenges complete!",

  encouragement: [
    "Keep going, you're doing great!",
    "The AI is getting smarter thanks to you!",
    "Every pick trains the walrus brain 🧠",
    "You're shaping the NUB voice!",
    "Quality curation in progress...",
  ],
};

// ============================================================
// SOUND EFFECTS (for haptic/audio feedback)
// ============================================================

export const SOUNDS = {
  approve: '/sounds/approve.mp3',
  reject: '/sounds/reject.mp3',
  skip: '/sounds/skip.mp3',
  levelUp: '/sounds/levelup.mp3',
  achievement: '/sounds/achievement.mp3',
  combo: '/sounds/combo.mp3',
  streak: '/sounds/streak.mp3',
};

// ============================================================
// DEFAULT PLAYER STATE
// ============================================================

export const DEFAULT_PLAYER_STATS: PlayerStats = {
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
  lastActiveDate: new Date().toISOString().split('T')[0],
  achievements: [],
  dailyChallengeProgress: 0,
  weeklyGoalProgress: 0,
};

export default {
  LEVELS,
  XP_REWARDS,
  ACHIEVEMENTS,
  MOTIVATION,
  SOUNDS,
  DEFAULT_PLAYER_STATS,
  getLevelInfo,
  getXpProgress,
  checkNewAchievements,
  calculateStreakBonus,
  generateDailyChallenges,
};
