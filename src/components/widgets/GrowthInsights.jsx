import React, { useMemo } from 'react';
import { 
  TrendingUp, Clock, Zap, Target, Calendar,
  AlertTriangle, CheckCircle, ArrowRight, Flame
} from 'lucide-react';
import NeoBrutalCard from '@/components/ui/NeoBrutalCard';
import NeoBrutalButton from '@/components/ui/NeoBrutalButton';
import { 
  getBestTimeToPost, 
  analyzeContentMix, 
  analyzeFrequency,
  calculatePostingStreak,
  CONTENT_CATEGORIES 
} from '@/lib/contentStrategy';
import { cn } from '@/lib/utils';

// ============================================================
// GROWTH INSIGHTS WIDGET
// ============================================================

export default function GrowthInsights({ posts = [], onAction }) {
  // Calculate insights
  const insights = useMemo(() => {
    const bestTime = getBestTimeToPost('instagram');
    const contentMix = analyzeContentMix(posts);
    const frequency = analyzeFrequency(posts, 'instagram', 7);
    const streak = calculatePostingStreak(posts);
    
    return { bestTime, contentMix, frequency, streak };
  }, [posts]);

  const { bestTime, contentMix, frequency, streak } = insights;

  // Generate action items
  const actionItems = useMemo(() => {
    const items = [];
    
    // Check posting time
    if (bestTime?.quality === 'best') {
      items.push({
        type: 'opportunity',
        icon: Clock,
        title: `Prime time at ${bestTime.time}!`,
        description: `${bestTime.hoursUntil}h from now. Have something ready?`,
        action: { label: 'Create Post', onClick: () => onAction?.('create') },
        priority: 'high',
      });
    }
    
    // Check frequency
    if (frequency?.status === 'low') {
      items.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Posting frequency low',
        description: frequency.message,
        action: { label: 'Post Now', onClick: () => onAction?.('create') },
        priority: 'high',
      });
    }
    
    // Check streak
    if (!streak.isActive && streak.longest > 0) {
      items.push({
        type: 'warning',
        icon: Flame,
        title: 'Streak broken!',
        description: `You had a ${streak.longest} day streak. Post today to start a new one!`,
        action: { label: 'Revive Streak', onClick: () => onAction?.('create') },
        priority: 'medium',
      });
    } else if (streak.current >= 7) {
      items.push({
        type: 'success',
        icon: Flame,
        title: `🔥 ${streak.current} day streak!`,
        description: "You're on fire! Keep it going!",
        priority: 'low',
      });
    }
    
    // Check content mix
    contentMix.recommendations.forEach(rec => {
      items.push({
        type: rec.type === 'increase' ? 'suggestion' : 'warning',
        icon: Target,
        title: rec.type === 'increase' ? 'Content gap' : 'Content overload',
        description: rec.message,
        action: { label: 'View Mix', onClick: () => onAction?.('contentMix') },
        priority: 'medium',
      });
    });
    
    return items.slice(0, 3); // Limit to top 3
  }, [bestTime, frequency, streak, contentMix, onAction]);

  return (
    <NeoBrutalCard accentColor="orange" className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#f19b38]" />
        <h2 className="font-bold text-lg">Growth Insights</h2>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Streak */}
        <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <p className="text-2xl font-black text-[#f19b38]">
            {streak.current}
          </p>
          <p className="text-[10px] uppercase tracking-wider opacity-60">
            Day Streak
          </p>
        </div>
        
        {/* Posts This Week */}
        <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <p className="text-2xl font-black">
            {frequency?.count || 0}
          </p>
          <p className="text-[10px] uppercase tracking-wider opacity-60">
            Posts/Week
          </p>
        </div>
        
        {/* Content Score */}
        <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <p className={cn(
            "text-2xl font-black",
            contentMix.score >= 80 ? "text-[#6b8e5d]" : 
            contentMix.score >= 60 ? "text-[#d4a017]" : "text-[#b44a1c]"
          )}>
            {contentMix.score}
          </p>
          <p className="text-[10px] uppercase tracking-wider opacity-60">
            Mix Score
          </p>
        </div>
      </div>

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div className="space-y-3 mb-4">
          {actionItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border-2",
                  item.type === 'opportunity' && "bg-[#6b8e5d]/10 border-[#6b8e5d]/30",
                  item.type === 'warning' && "bg-[#d4a017]/10 border-[#d4a017]/30",
                  item.type === 'success' && "bg-[#6b8e5d]/10 border-[#6b8e5d]/30",
                  item.type === 'suggestion' && "bg-[#2c3e50]/10 border-[#2c3e50]/30",
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 mt-0.5 flex-shrink-0",
                  item.type === 'opportunity' && "text-[#6b8e5d]",
                  item.type === 'warning' && "text-[#d4a017]",
                  item.type === 'success' && "text-[#6b8e5d]",
                  item.type === 'suggestion' && "text-[#2c3e50]",
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs opacity-70">{item.description}</p>
                </div>
                {item.action && (
                  <button 
                    onClick={item.action.onClick}
                    className="text-xs font-bold text-[#f19b38] hover:underline flex-shrink-0"
                  >
                    {item.action.label} →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Best Time Indicator */}
      {bestTime && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#a76d24]/10 to-[#f19b38]/10 border border-[#f19b38]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f19b38]" />
              <span className="text-sm font-bold">
                {bestTime.quality === 'best' ? '🔥' : '👍'} {bestTime.message}
              </span>
            </div>
            {bestTime.hoursUntil && (
              <span className="text-xs opacity-60">
                in {bestTime.hoursUntil}h
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content Mix Preview */}
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wider opacity-60 mb-2">Content Mix (last 30 days)</p>
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {Object.entries(CONTENT_CATEGORIES).map(([key, cat]) => {
            const ratio = contentMix.ratios[key];
            const width = ratio ? parseFloat(ratio.actual) : 0;
            return (
              <div 
                key={key}
                style={{ 
                  width: `${width}%`,
                  backgroundColor: cat.color,
                }}
                className="transition-all duration-500"
                title={`${cat.name}: ${ratio?.actual || '0%'}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {Object.entries(CONTENT_CATEGORIES).map(([key, cat]) => (
            <div key={key} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-[10px] opacity-60">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </NeoBrutalCard>
  );
}

// ============================================================
// COMPACT VERSION FOR SIDEBAR
// ============================================================

export function GrowthInsightsCompact({ posts = [] }) {
  const streak = useMemo(() => calculatePostingStreak(posts), [posts]);
  const bestTime = useMemo(() => getBestTimeToPost('instagram'), []);

  return (
    <div className="space-y-3">
      {/* Streak */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Flame className={cn(
            "w-4 h-4",
            streak.isActive ? "text-[#f19b38]" : "text-gray-400"
          )} />
          <span className="text-sm font-bold">Streak</span>
        </div>
        <span className={cn(
          "font-black",
          streak.isActive ? "text-[#f19b38]" : "text-gray-400"
        )}>
          {streak.current} days
        </span>
      </div>

      {/* Best Time */}
      {bestTime?.quality === 'best' && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#f19b38]/10 border border-[#f19b38]/30">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#f19b38]" />
            <span className="text-sm font-bold">Post now!</span>
          </div>
          <span className="text-xs opacity-70">
            {bestTime.time}
          </span>
        </div>
      )}
    </div>
  );
}
