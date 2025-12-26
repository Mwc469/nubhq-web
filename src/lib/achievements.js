import { toast } from 'sonner';
import { ACHIEVEMENTS } from '@/lib/nubCopy';

// Achievement toast with special styling
export function showAchievement(achievementKey, customMessage) {
  const achievement = ACHIEVEMENTS[achievementKey];
  
  if (!achievement && !customMessage) {
    console.warn(`Unknown achievement: ${achievementKey}`);
    return;
  }

  toast.custom((t) => (
    <div className="bg-gradient-to-r from-[#a76d24] via-[#c37f2c] to-[#f19b38] p-[3px] rounded-2xl animate-in slide-in-from-right duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center gap-4">
        <div className="text-4xl animate-bounce">🏆</div>
        <div>
          <p className="font-black text-lg">
            {achievement?.title || 'Achievement Unlocked!'}
          </p>
          <p className="text-sm opacity-70">
            {customMessage || achievement?.message || 'You did something cool!'}
          </p>
        </div>
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'top-center',
  });
}

// Check and show achievements based on stats
export function checkAchievements(stats, previousStats) {
  // First post
  if (previousStats?.posted === 0 && stats?.posted > 0) {
    showAchievement('firstPost');
  }
  
  // 10 posts
  if (previousStats?.posted < 10 && stats?.posted >= 10) {
    showAchievement('tenPosts');
  }
  
  // Draft hoarder (10 drafts, no posts)
  if (stats?.draft >= 10 && stats?.posted === 0) {
    showAchievement('draftHoarder');
  }
  
  // Night owl (posting between 1am-5am)
  const hour = new Date().getHours();
  if (hour >= 1 && hour < 5 && stats?.posted > previousStats?.posted) {
    showAchievement('nightOwl');
  }
  
  // Weekend warrior
  const day = new Date().getDay();
  if ((day === 0 || day === 6) && stats?.posted > previousStats?.posted) {
    showAchievement('weekendWarrior');
  }
}

// Quick achievements for specific actions
export const achievements = {
  firstPost: () => showAchievement('firstPost'),
  firstApproval: () => showAchievement('firstApproval'),
  speedApproval: () => showAchievement('speedApproval'),
  nightOwl: () => showAchievement('nightOwl'),
  weekendWarrior: () => showAchievement('weekendWarrior'),
  draftHoarder: () => showAchievement('draftHoarder'),
  tenPosts: () => showAchievement('tenPosts'),
  
  // Custom achievement
  custom: (title, message) => showAchievement(null, message),
};

export default achievements;
