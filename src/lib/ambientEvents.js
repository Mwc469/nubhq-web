/**
 * Ambient Events System
 * Random delightful moments that make the app feel alive
 */

import { pick } from './nubCopy';

// ============================================================
// WALRUS COMMENTS - Random thoughts from your walrus friend
// ============================================================

export const WALRUS_COMMENTS = [
  "The algorithm trembles at your presence...",
  "*stares at you approvingly*",
  "You're doing great, honestly.",
  "The vibes today? Immaculate.",
  "Fun fact: you're that person.",
  "*happy walrus noises*",
  "I believe in you. Probably.",
  "Keep being weird, friend.",
  "Your energy right now is *chef's kiss*",
  "Just checking in. You good?",
  "Plot twist: you're the main character.",
  "The chaos flows through you...",
  "Walrus wisdom: ship it.",
  "No thoughts, just vibes.",
  "*supportive flipper wave*",
  "You've got that look. The good one.",
  "Today's vibe check: PASSED",
  "Breaking news: local human is incredible",
  "Your serotonin is showing",
  "The universe just winked at you",
];

export const ENCOURAGEMENT_MESSAGES = [
  "You're doing amazing sweetie!",
  "The walrus believes in you (even though he's just a PNG)",
  "Quick reminder: you're that person",
  "Your energy right now? *chef's kiss*",
  "Fun fact: you're literally crushing it",
  "The fans don't know how lucky they are",
  "This is your sign to keep going",
  "Your weird is showing. We love it.",
  "The internet needs more of you",
  "Gold star energy today",
];

// ============================================================
// SILLY ACHIEVEMENTS - For doing absolutely nothing
// ============================================================

export const SILLY_ACHIEVEMENTS = [
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
  { title: "Existing Expert", desc: "You exist! That's like, really hard.", icon: "✨" },
  { title: "Professional Waiter", desc: "You waited for something to load. Patience!", icon: "⏳" },
];

// ============================================================
// RARE EVENTS - Super rare but exciting
// ============================================================

export const RARE_EVENTS = {
  luckyWalrus: {
    title: "LUCKY WALRUS!!!",
    message: "The walrus gods smile upon you! You feel extra lucky today...",
    icon: "🍀🦭",
    color: "from-green-400 to-emerald-500",
    xpReward: 25,
  },
  goldenConfetti: {
    title: "GOLDEN SHOWER!!!",
    message: "Wait, that came out wrong... It's GOLDEN CONFETTI! +50 bonus XP!",
    icon: "✨🪙✨",
    color: "from-yellow-400 to-amber-500",
    xpReward: 50,
  },
  cactusAppears: {
    title: "CACTUS FRIEND!",
    message: "A wild cactus appeared! It wants to hug you... carefully.",
    icon: "🌵💚",
    color: "from-green-500 to-lime-400",
    xpReward: 15,
  },
  cosmicBlessing: {
    title: "COSMIC BLESSING!",
    message: "The cosmos have noticed your dedication. Weird on, friend.",
    icon: "🌌✨",
    color: "from-purple-500 to-pink-500",
    xpReward: 30,
  },
};

// ============================================================
// EVENT CONFIGURATION
// ============================================================

export const AMBIENT_EVENT_CONFIG = {
  walrusComment: {
    chance: 0.15,        // 15% chance per interval
    interval: 30000,     // Check every 30 seconds
    cooldown: 60000,     // Minimum 60s between events
    type: 'bubble',
  },
  encouragement: {
    chance: 0.10,        // 10% chance
    interval: 45000,     // Check every 45 seconds
    cooldown: 90000,     // Minimum 90s between
    type: 'toast',
  },
  sillyAchievement: {
    chance: 0.05,        // 5% chance
    interval: 60000,     // Check every 60 seconds
    cooldown: 120000,    // Minimum 2 min between
    type: 'achievement',
  },
  confetti: {
    chance: 0.03,        // 3% chance
    interval: 90000,     // Check every 90 seconds
    cooldown: 180000,    // Minimum 3 min between
    type: 'overlay',
  },
  rareEvent: {
    chance: 0.005,       // 0.5% chance - very rare!
    interval: 120000,    // Check every 2 minutes
    cooldown: 600000,    // Minimum 10 min between
    type: 'modal',
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getRandomWalrusComment() {
  return pick(WALRUS_COMMENTS);
}

export function getRandomEncouragement() {
  return pick(ENCOURAGEMENT_MESSAGES);
}

export function getRandomSillyAchievement() {
  return pick(SILLY_ACHIEVEMENTS);
}

export function getRandomRareEvent() {
  const events = Object.values(RARE_EVENTS);
  return events[Math.floor(Math.random() * events.length)];
}

// Check if enough time has passed since last event
export function canTriggerEvent(eventType) {
  try {
    const lastTrigger = localStorage.getItem(`nub_ambient_${eventType}_last`);
    if (!lastTrigger) return true;

    const config = AMBIENT_EVENT_CONFIG[eventType];
    const elapsed = Date.now() - parseInt(lastTrigger, 10);
    return elapsed >= config.cooldown;
  } catch {
    return true;
  }
}

// Mark event as triggered
export function markEventTriggered(eventType) {
  try {
    localStorage.setItem(`nub_ambient_${eventType}_last`, Date.now().toString());
  } catch {
    // Storage might be full, that's okay
  }
}

// Roll for event trigger
export function shouldTriggerEvent(eventType) {
  const config = AMBIENT_EVENT_CONFIG[eventType];
  if (!config) return false;

  if (!canTriggerEvent(eventType)) return false;

  return Math.random() < config.chance;
}
