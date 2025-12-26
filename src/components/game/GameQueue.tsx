/**
 * NubHQ Game Queue Page
 * The main approval game experience
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { haptic, triggerConfetti } from '@/components/mobile/MobileComponents';
import {
  PostApprovalCard,
  XpBar,
  ComboDisplay,
  QueueStats,
  EmptyQueue,
} from './ApprovalGame';
import { VoiceTraining, VoiceTrainingIntro, SAMPLE_VOICE_PROMPTS, type VoiceOption, type VoicePrompt } from './VoiceTraining';
import { MediaComparisonPicker, SAMPLE_COMPARISONS, type MediaComparison } from './MediaComparison';
import {
  PlayerStats,
  DEFAULT_PLAYER_STATS,
  XP_REWARDS,
  MOTIVATION,
  getLevelInfo,
  checkNewAchievements,
  generateDailyChallenges,
  type DailyChallenge,
} from '@/lib/gamification';
import { toast, toastAchievement } from '@/lib/toast';
import {
  Flame,
  Target,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

type QueueItemType = 'post' | 'voice' | 'media';

interface QueueItem {
  id: string;
  type: QueueItemType;
  data: unknown;
  priority: number;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_POSTS = [
  {
    id: 'p1',
    caption: "POV: you're the wall watching us forget our own lyrics for 3 hours 🎤",
    platform: 'TikTok',
    scheduledFor: 'Today, 7pm',
    mediaUrl: 'https://picsum.photos/400/400?random=1',
    mediaType: 'image' as const,
    hashtags: ['NUB', 'bandlife', 'rehearsal'],
  },
  {
    id: 'p2',
    caption: "New merch because we need money and you need to look cool. Win-win. 🦭",
    platform: 'Instagram',
    scheduledFor: 'Tomorrow, 12pm',
    mediaUrl: 'https://picsum.photos/400/400?random=2',
    mediaType: 'image' as const,
    hashtags: ['merch', 'NUB', 'drip'],
  },
  {
    id: 'p3',
    caption: "When the moon aligns with the walrus constellation. Or like, next Friday. Same thing.",
    platform: 'Twitter',
    scheduledFor: 'Dec 27, 5pm',
    hashtags: ['showannouncement'],
  },
];

// ============================================================
// GAME QUEUE COMPONENT
// ============================================================

export function GameQueue() {
  // Player state
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('nubhq_player_stats');
    return saved ? JSON.parse(saved) : DEFAULT_PLAYER_STATS;
  });

  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Game state
  const [combo, setCombo] = useState(0);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [recentXp, setRecentXp] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  // Daily challenges
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [showChallenges, setShowChallenges] = useState(false);

  // Intro screens
  const [showVoiceIntro, setShowVoiceIntro] = useState(false);

  // Completed/skipped counts for stats
  const [sessionCompleted, setSessionCompleted] = useState(0);
  const [sessionSkipped, setSessionSkipped] = useState(0);

  // ============================================================
  // LOAD QUEUE
  // ============================================================

  useEffect(() => {
    loadQueue();
    loadDailyChallenges();
    checkStreak();
  }, []);

  const loadQueue = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(r => setTimeout(r, 500));

    // Build mixed queue
    const items: QueueItem[] = [
      // Posts to approve
      ...MOCK_POSTS.map((post, i) => ({
        id: `post-${post.id}`,
        type: 'post' as const,
        data: post,
        priority: 10 - i,
      })),

      // Voice training prompts
      ...SAMPLE_VOICE_PROMPTS.slice(0, 3).map((prompt, i) => ({
        id: `voice-${prompt.id}`,
        type: 'voice' as const,
        data: prompt,
        priority: 5 - i,
      })),

      // Media comparisons
      ...SAMPLE_COMPARISONS.slice(0, 2).map((comp, i) => ({
        id: `media-${comp.id}`,
        type: 'media' as const,
        data: comp,
        priority: 3 - i,
      })),
    ];

    // Sort by priority then shuffle slightly
    items.sort((a, b) => b.priority - a.priority + (Math.random() - 0.5));

    setQueue(items);
    setCurrentIndex(0);
    setIsLoading(false);
  };

  const loadDailyChallenges = () => {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('nubhq_challenge_date');

    if (savedDate !== today) {
      const challenges = generateDailyChallenges();
      setDailyChallenges(challenges);
      localStorage.setItem('nubhq_challenge_date', today);
      localStorage.setItem('nubhq_challenges', JSON.stringify(challenges));
    } else {
      const saved = localStorage.getItem('nubhq_challenges');
      if (saved) {
        setDailyChallenges(JSON.parse(saved));
      }
    }
  };

  const checkStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (stats.lastActiveDate === yesterday) {
      updateStats({ streak: stats.streak + 1 });
      if (stats.streak + 1 > stats.longestStreak) {
        updateStats({ longestStreak: stats.streak + 1 });
      }
      toast.success(MOTIVATION.onStreak(stats.streak + 1));
    } else if (stats.lastActiveDate !== today) {
      if (stats.streak > 0) {
        toast.warning("Streak lost! Start a new one today!");
      }
      updateStats({ streak: 1 });
    }

    updateStats({ lastActiveDate: today });
  };

  // ============================================================
  // SAVE STATS
  // ============================================================

  const updateStats = useCallback((updates: Partial<PlayerStats>) => {
    setStats(prev => {
      const newStats = { ...prev, ...updates };
      localStorage.setItem('nubhq_player_stats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  // ============================================================
  // XP & REWARDS
  // ============================================================

  const awardXp = useCallback((baseXp: number, action: string) => {
    const now = Date.now();
    const timeSinceLastAction = now - lastActionTime;

    let totalXp = baseXp;
    let newCombo = combo;

    // Speed bonus (under 3 seconds)
    if (timeSinceLastAction < 3000 && lastActionTime > 0) {
      totalXp += XP_REWARDS.speedBonus;
      newCombo++;

      // Combo bonus
      if (newCombo >= 2) {
        totalXp += XP_REWARDS.comboBonus(newCombo);
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1500);
      }
    } else {
      newCombo = 1;
    }

    // Streak bonus
    if (stats.streak > 1) {
      totalXp += XP_REWARDS.streakBonus(stats.streak);
    }

    setCombo(newCombo);
    setLastActionTime(now);
    setRecentXp(totalXp);
    setTimeout(() => setRecentXp(0), 2000);

    // Update stats
    const newXp = stats.xp + totalXp;
    const oldLevel = getLevelInfo(stats.xp).level;
    const newLevel = getLevelInfo(newXp).level;

    updateStats({
      xp: newXp,
      level: newLevel,
      totalApprovals: stats.totalApprovals + 1,
      todayApprovals: stats.todayApprovals + 1,
    });

    // Level up?
    if (newLevel > oldLevel) {
      const levelInfo = getLevelInfo(newXp);
      haptic('success');
      triggerConfetti();
      toast.success(MOTIVATION.onLevelUp(levelInfo));
    }

    // Check achievements
    const newAchievements = checkNewAchievements(
      { ...stats, xp: newXp, totalApprovals: stats.totalApprovals + 1 },
      stats.achievements
    );

    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        setTimeout(() => {
          haptic('success');
          toastAchievement(achievement.title, achievement.description);
          updateStats({
            achievements: [...stats.achievements, achievement.id],
            xp: stats.xp + achievement.xpReward,
          });
        }, 500);
      });
    }

    // Update daily challenges
    updateChallengeProgress(action);

  }, [combo, lastActionTime, stats, updateStats]);

  const updateChallengeProgress = (action: string) => {
    const updated = dailyChallenges.map(c => {
      if (action === 'approve' && c.type === 'approvals') {
        return { ...c, current: c.current + 1 };
      }
      if (action === 'voice' && c.type === 'voice') {
        return { ...c, current: c.current + 1 };
      }
      if (action === 'media' && c.type === 'media') {
        return { ...c, current: c.current + 1 };
      }
      return c;
    });

    // Check for completed challenges
    updated.forEach((c, i) => {
      if (c.current >= c.goal && dailyChallenges[i].current < c.goal) {
        haptic('success');
        toast.success(`Challenge complete: ${c.title}! +${c.xpReward} XP`);
        updateStats({ xp: stats.xp + c.xpReward });
      }
    });

    setDailyChallenges(updated);
    localStorage.setItem('nubhq_challenges', JSON.stringify(updated));
  };

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleApprove = () => {
    haptic('success');
    toast.success(MOTIVATION.onApprove[Math.floor(Math.random() * MOTIVATION.onApprove.length)]);
    awardXp(XP_REWARDS.approvePost, 'approve');
    setSessionCompleted(prev => prev + 1);
    nextItem();
  };

  const handleReject = () => {
    haptic('medium');
    toast.info(MOTIVATION.onReject[Math.floor(Math.random() * MOTIVATION.onReject.length)]);
    awardXp(XP_REWARDS.rejectPost, 'approve');
    setSessionCompleted(prev => prev + 1);
    nextItem();
  };

  const handleSkip = () => {
    haptic('light');
    updateStats({ totalSkips: stats.totalSkips + 1 });
    awardXp(XP_REWARDS.skipPost, 'skip');
    setSessionSkipped(prev => prev + 1);
    nextItem();
  };

  const handleVoicePick = (optionId: string, option: VoiceOption) => {
    haptic('success');
    awardXp(XP_REWARDS.voicePick, 'voice');
    updateStats({ voiceTrainingCount: stats.voiceTrainingCount + 1 });
    setSessionCompleted(prev => prev + 1);
    console.log('Voice pick:', optionId, option);
    nextItem();
  };

  const handleMediaPick = (optionId: string, settings: unknown) => {
    haptic('success');
    awardXp(XP_REWARDS.mediaPick, 'media');
    updateStats({ mediaPicksCount: stats.mediaPicksCount + 1 });
    setSessionCompleted(prev => prev + 1);
    console.log('Media pick:', optionId, settings);
    nextItem();
  };

  const nextItem = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // ============================================================
  // RENDER CURRENT ITEM
  // ============================================================

  const renderCurrentItem = () => {
    if (isLoading) {
      const loadingMessages = [
        { emoji: "🦭", text: "Summoning content from the walrus dimension..." },
        { emoji: "🐹", text: "Hamsters are running faster..." },
        { emoji: "🌌", text: "Downloading vibes from the cosmos..." },
        { emoji: "🎲", text: "Rolling for initiative on your queue..." },
        { emoji: "🔮", text: "Crystal ball buffering..." },
        { emoji: "🧙", text: "A wizard is organizing your content..." },
        { emoji: "🍕", text: "Content is being prepared fresh..." },
        { emoji: "🚀", text: "Launching content rockets..." },
      ];
      const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-5xl animate-bounce">{randomMessage.emoji}</div>
          <p className="mt-4 text-gray-500 text-center max-w-xs">{randomMessage.text}</p>
        </div>
      );
    }

    if (currentIndex >= queue.length) {
      return <EmptyQueue onRefresh={loadQueue} />;
    }

    const item = queue[currentIndex];

    switch (item.type) {
      case 'post':
        return (
          <PostApprovalCard
            post={item.data as any}
            onApprove={handleApprove}
            onReject={handleReject}
            onSkip={handleSkip}
          />
        );

      case 'voice':
        if (showVoiceIntro && stats.voiceTrainingCount === 0) {
          return <VoiceTrainingIntro onStart={() => setShowVoiceIntro(false)} />;
        }
        return (
          <VoiceTraining
            prompt={item.data as VoicePrompt}
            onSelect={handleVoicePick}
            onSkip={() => {
              awardXp(XP_REWARDS.voiceSkip, 'skip');
              setSessionSkipped(prev => prev + 1);
              nextItem();
            }}
          />
        );

      case 'media':
        return (
          <MediaComparisonPicker
            comparison={item.data as MediaComparison}
            onPickA={() => handleMediaPick((item.data as MediaComparison).optionA.id, (item.data as MediaComparison).optionA.settings)}
            onPickB={() => handleMediaPick((item.data as MediaComparison).optionB.id, (item.data as MediaComparison).optionB.settings)}
            onSkip={() => {
              awardXp(XP_REWARDS.mediaSkip, 'skip');
              setSessionSkipped(prev => prev + 1);
              nextItem();
            }}
          />
        );

      default:
        return null;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-brand-dark border-b-2 border-black p-4">
        <div className="max-w-lg mx-auto">
          <XpBar stats={stats} recentXp={recentXp} />
        </div>
      </header>

      {/* Daily Challenges Button */}
      <div className="max-w-lg mx-auto px-4 py-2">
        <button
          onClick={() => setShowChallenges(true)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Daily Challenges</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-600">
              {dailyChallenges.filter(c => c.current >= c.goal).length}/{dailyChallenges.length}
            </span>
            <ChevronRight className="w-4 h-4 text-yellow-600" />
          </div>
        </button>
      </div>

      {/* Queue Stats */}
      <div className="max-w-lg mx-auto px-4 py-2">
        <QueueStats
          remaining={queue.length - currentIndex}
          completed={sessionCompleted}
          skipped={sessionSkipped}
        />
      </div>

      {/* Main Content with card entrance animation */}
      <main className="max-w-lg mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={queue[currentIndex]?.id ?? 'empty'}
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: 0.1, // Brief pause after previous card exits
            }}
          >
            {renderCurrentItem()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Combo Display */}
      <ComboDisplay combo={combo} visible={showCombo} />

      {/* Daily Challenges Modal */}
      {showChallenges && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-brand-dark rounded-t-2xl sm:rounded-2xl border-2 border-black p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-pink" />
                Daily Challenges
              </h2>
              <button onClick={() => setShowChallenges(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {dailyChallenges.map(challenge => {
                const complete = challenge.current >= challenge.goal;
                return (
                  <div
                    key={challenge.id}
                    className={cn(
                      "p-3 rounded-xl border-2",
                      complete
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{challenge.title}</span>
                      <span className="text-sm text-neon-pink">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            complete ? "bg-green-500" : "bg-neon-pink"
                          )}
                          style={{ width: `${Math.min((challenge.current / challenge.goal) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {challenge.current}/{challenge.goal}
                      </span>
                      {complete && <span>✅</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowChallenges(false)}
              className="w-full mt-4 py-3 bg-neon-pink text-white font-bold rounded-xl"
            >
              Back to Queue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameQueue;
