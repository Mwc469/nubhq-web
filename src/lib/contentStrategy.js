// NubHQ Content Strategy Tools
// Track content mix, optimal posting times, and performance patterns

// ============================================================
// BEST POSTING TIMES
// ============================================================
// Based on aggregated music industry data for Instagram
// These are starting points - should be refined with actual analytics

export const BEST_POSTING_TIMES = {
  instagram: {
    // Best times by day (local time)
    monday: { best: ['12:00', '17:00'], good: ['11:00', '18:00', '19:00'] },
    tuesday: { best: ['09:00', '13:00', '17:00'], good: ['11:00', '18:00'] },
    wednesday: { best: ['11:00', '13:00'], good: ['09:00', '17:00', '18:00'] },
    thursday: { best: ['12:00', '17:00', '19:00'], good: ['11:00', '18:00'] },
    friday: { best: ['12:00', '13:00', '17:00'], good: ['11:00', '14:00', '18:00'] },
    saturday: { best: ['10:00', '11:00', '14:00'], good: ['09:00', '13:00', '15:00'] },
    sunday: { best: ['10:00', '11:00', '19:00'], good: ['09:00', '17:00', '18:00'] },
    
    // Overall best times across the week
    overallBest: ['12:00', '17:00', '19:00'],
    
    // Music-specific insights
    musicInsights: {
      showAnnouncements: { best: '17:00', reason: 'Catch people planning weekends' },
      dayOfShow: { best: '12:00', reason: 'Lunch break scrolling' },
      newRelease: { best: '00:00', reason: 'Midnight drop culture' },
      behindTheScenes: { best: '19:00', reason: 'Evening browsing time' },
      showRecap: { best: '11:00', reason: 'Morning after engagement' },
    },
  },
  
  tiktok: {
    // TikTok has different patterns - evening/night heavier
    monday: { best: ['12:00', '16:00', '21:00'], good: ['19:00', '22:00'] },
    tuesday: { best: ['09:00', '15:00', '18:00'], good: ['17:00', '21:00'] },
    wednesday: { best: ['07:00', '12:00', '19:00'], good: ['15:00', '21:00'] },
    thursday: { best: ['09:00', '12:00', '19:00'], good: ['15:00', '18:00'] },
    friday: { best: ['17:00', '21:00'], good: ['15:00', '18:00', '22:00'] },
    saturday: { best: ['11:00', '19:00', '21:00'], good: ['14:00', '17:00'] },
    sunday: { best: ['10:00', '19:00', '21:00'], good: ['14:00', '17:00'] },
    
    overallBest: ['19:00', '21:00', '12:00'],
  },
  
  facebook: {
    // Facebook skews older, more daytime activity
    monday: { best: ['09:00', '13:00'], good: ['11:00', '14:00'] },
    tuesday: { best: ['09:00', '13:00', '14:00'], good: ['11:00', '15:00'] },
    wednesday: { best: ['09:00', '12:00', '13:00'], good: ['11:00', '14:00'] },
    thursday: { best: ['09:00', '12:00', '14:00'], good: ['11:00', '13:00'] },
    friday: { best: ['09:00', '11:00', '13:00'], good: ['10:00', '14:00'] },
    saturday: { best: ['09:00', '10:00', '11:00'], good: ['12:00', '13:00'] },
    sunday: { best: ['09:00', '10:00', '11:00'], good: ['12:00', '13:00'] },
    
    overallBest: ['09:00', '13:00', '11:00'],
  },
  
  twitter: {
    // Twitter is news-driven, morning and lunch
    monday: { best: ['08:00', '12:00'], good: ['09:00', '13:00', '17:00'] },
    tuesday: { best: ['09:00', '12:00'], good: ['08:00', '13:00', '17:00'] },
    wednesday: { best: ['09:00', '12:00', '17:00'], good: ['08:00', '13:00'] },
    thursday: { best: ['09:00', '12:00'], good: ['08:00', '13:00', '17:00'] },
    friday: { best: ['09:00', '12:00'], good: ['08:00', '13:00'] },
    saturday: { best: ['09:00', '10:00'], good: ['11:00', '12:00'] },
    sunday: { best: ['09:00', '10:00'], good: ['11:00', '12:00'] },
    
    overallBest: ['09:00', '12:00', '17:00'],
  },
};

// Get best time to post right now
export function getBestTimeToPost(platform = 'instagram', date = new Date()) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = days[date.getDay()];
  const currentHour = date.getHours();
  
  const platformTimes = BEST_POSTING_TIMES[platform];
  if (!platformTimes) return null;
  
  const dayTimes = platformTimes[day];
  if (!dayTimes) return null;
  
  // Find next best time
  const allTimes = [...dayTimes.best, ...dayTimes.good];
  const upcomingTimes = allTimes
    .map(t => parseInt(t.split(':')[0]))
    .filter(h => h > currentHour)
    .sort((a, b) => a - b);
  
  if (upcomingTimes.length > 0) {
    const nextHour = upcomingTimes[0];
    const isBest = dayTimes.best.some(t => parseInt(t.split(':')[0]) === nextHour);
    return {
      time: `${nextHour}:00`,
      quality: isBest ? 'best' : 'good',
      hoursUntil: nextHour - currentHour,
      message: isBest 
        ? `🔥 Prime time at ${nextHour}:00!` 
        : `Good window at ${nextHour}:00`,
    };
  }
  
  // No more good times today
  return {
    time: null,
    quality: 'wait',
    message: "Best times have passed today. Post now or wait for tomorrow.",
  };
}

// ============================================================
// CONTENT MIX TRACKING
// ============================================================

export const CONTENT_CATEGORIES = {
  promo: {
    name: 'Promotional',
    description: 'Show announcements, ticket links, merch',
    examples: ['Show announcement', 'Ticket reminder', 'Merch drop'],
    targetRatio: 0.25, // 25% of content
    color: '#f19b38',
  },
  engagement: {
    name: 'Engagement',
    description: 'Questions, polls, fan interaction',
    examples: ['Q&A', 'This or that', 'Caption this', 'Fan shoutouts'],
    targetRatio: 0.25,
    color: '#6b8e5d',
  },
  personality: {
    name: 'Personality/BTS',
    description: 'Behind the scenes, band life, humor',
    examples: ['Rehearsal clips', 'Road trip content', 'Memes', 'Day in the life'],
    targetRatio: 0.30,
    color: '#2c3e50',
  },
  value: {
    name: 'Value/Entertainment',
    description: 'Music content, covers, tips, entertainment',
    examples: ['Live clips', 'Cover songs', 'Music tips', 'Gear talk'],
    targetRatio: 0.20,
    color: '#5d3a5d',
  },
};

// Analyze content mix from posts
export function analyzeContentMix(posts) {
  const counts = {
    promo: 0,
    engagement: 0,
    personality: 0,
    value: 0,
    uncategorized: 0,
  };
  
  posts.forEach(post => {
    const category = post.category || categorizePost(post);
    if (counts[category] !== undefined) {
      counts[category]++;
    } else {
      counts.uncategorized++;
    }
  });
  
  const total = posts.length || 1;
  const ratios = {};
  const recommendations = [];
  
  Object.entries(CONTENT_CATEGORIES).forEach(([key, cat]) => {
    const actual = counts[key] / total;
    ratios[key] = {
      count: counts[key],
      actual: (actual * 100).toFixed(1) + '%',
      target: (cat.targetRatio * 100) + '%',
      difference: ((actual - cat.targetRatio) * 100).toFixed(1),
      status: Math.abs(actual - cat.targetRatio) < 0.1 ? 'good' : 
              actual < cat.targetRatio ? 'low' : 'high',
    };
    
    if (actual < cat.targetRatio - 0.1) {
      recommendations.push({
        type: 'increase',
        category: key,
        message: `Post more ${cat.name.toLowerCase()} content (${cat.examples[0]}, etc.)`,
      });
    } else if (actual > cat.targetRatio + 0.15) {
      recommendations.push({
        type: 'decrease',
        category: key,
        message: `Ease up on ${cat.name.toLowerCase()} - it's overwhelming your feed`,
      });
    }
  });
  
  return {
    counts,
    ratios,
    total,
    recommendations,
    score: calculateMixScore(ratios),
  };
}

// Auto-categorize a post based on content
export function categorizePost(post) {
  const caption = (post.caption || '').toLowerCase();
  const tags = post.tags || [];
  
  // Promo indicators
  if (caption.includes('tickets') || caption.includes('show') || 
      caption.includes('merch') || caption.includes('link in bio') ||
      caption.includes('out now') || caption.includes('pre-order')) {
    return 'promo';
  }
  
  // Engagement indicators
  if (caption.includes('?') || caption.includes('comment') ||
      caption.includes('what do you') || caption.includes('who') ||
      caption.includes('vote') || caption.includes('poll')) {
    return 'engagement';
  }
  
  // Value/entertainment
  if (caption.includes('cover') || caption.includes('tip') ||
      caption.includes('how to') || caption.includes('lesson') ||
      tags.includes('coversong') || tags.includes('tutorial')) {
    return 'value';
  }
  
  // Default to personality/BTS
  return 'personality';
}

function calculateMixScore(ratios) {
  let score = 100;
  Object.entries(ratios).forEach(([key, data]) => {
    const diff = Math.abs(parseFloat(data.difference));
    score -= diff * 2; // Penalize deviation from target
  });
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================
// POSTING FREQUENCY RECOMMENDATIONS
// ============================================================

export const FREQUENCY_RECOMMENDATIONS = {
  instagram: {
    feed: { min: 3, ideal: 5, max: 7, period: 'week' },
    stories: { min: 3, ideal: 7, max: 14, period: 'week' },
    reels: { min: 2, ideal: 4, max: 7, period: 'week' },
  },
  tiktok: {
    videos: { min: 3, ideal: 7, max: 14, period: 'week' },
  },
  facebook: {
    posts: { min: 2, ideal: 4, max: 7, period: 'week' },
  },
  twitter: {
    tweets: { min: 7, ideal: 14, max: 28, period: 'week' },
  },
};

// Analyze posting frequency
export function analyzeFrequency(posts, platform = 'instagram', days = 7) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const recentPosts = posts.filter(p => new Date(p.posted_at || p.created_at) >= cutoff);
  const count = recentPosts.length;
  
  const recs = FREQUENCY_RECOMMENDATIONS[platform];
  if (!recs) return null;
  
  const idealDaily = recs.feed?.ideal / 7 || 1;
  const actualDaily = count / days;
  
  let status, message;
  if (count < recs.feed?.min) {
    status = 'low';
    message = `Only ${count} posts in ${days} days. Aim for at least ${recs.feed.min}.`;
  } else if (count > recs.feed?.max) {
    status = 'high';
    message = `${count} posts in ${days} days might be overwhelming. Quality > quantity.`;
  } else {
    status = 'good';
    message = `${count} posts in ${days} days. You're in the sweet spot! 🔥`;
  }
  
  return {
    count,
    days,
    dailyAverage: actualDaily.toFixed(1),
    status,
    message,
    recommendation: recs.feed,
  };
}

// ============================================================
// STREAK TRACKING
// ============================================================

export function calculatePostingStreak(posts) {
  if (!posts.length) return { current: 0, longest: 0, message: "Start posting to build a streak!" };
  
  // Sort by date descending
  const sorted = [...posts].sort((a, b) => 
    new Date(b.posted_at || b.created_at) - new Date(a.posted_at || a.created_at)
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = null;
  
  sorted.forEach(post => {
    const postDate = new Date(post.posted_at || post.created_at);
    postDate.setHours(0, 0, 0, 0);
    
    if (!lastDate) {
      // First post
      const daysDiff = Math.floor((today - postDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        currentStreak = 1;
        tempStreak = 1;
      }
    } else {
      const daysDiff = Math.floor((lastDate - postDate) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        tempStreak++;
      } else if (daysDiff > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
      // daysDiff === 0 means same day, don't increment
    }
    
    lastDate = postDate;
  });
  
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Check if streak is still active
  const mostRecentPost = new Date(sorted[0].posted_at || sorted[0].created_at);
  mostRecentPost.setHours(0, 0, 0, 0);
  const daysSincePost = Math.floor((today - mostRecentPost) / (1000 * 60 * 60 * 24));
  
  if (daysSincePost > 1) {
    currentStreak = 0;
  }
  
  let message;
  if (currentStreak === 0) {
    message = "Streak broken! Post today to start a new one.";
  } else if (currentStreak < 7) {
    message = `${currentStreak} day streak! Keep it going!`;
  } else if (currentStreak < 30) {
    message = `🔥 ${currentStreak} day streak! You're on fire!`;
  } else {
    message = `🏆 LEGENDARY ${currentStreak} day streak!`;
  }
  
  return {
    current: currentStreak,
    longest: longestStreak,
    daysSincePost,
    isActive: daysSincePost <= 1,
    message,
  };
}

export default {
  BEST_POSTING_TIMES,
  getBestTimeToPost,
  CONTENT_CATEGORIES,
  analyzeContentMix,
  categorizePost,
  FREQUENCY_RECOMMENDATIONS,
  analyzeFrequency,
  calculatePostingStreak,
};
