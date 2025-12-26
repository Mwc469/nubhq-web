/**
 * NubHQ Walrus Skin System
 * Unlock cosmetic skins for the walrus companion as you level up!
 */

export interface WalrusSkin {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  unlockCondition?: string; // For special unlocks
  preview: string; // Emoji representation
  cssClass?: string; // Optional CSS effects
  greetings: string[]; // Unique greetings for this skin
  celebrationEmoji: string; // Custom celebration
  particles?: string[]; // Custom particle emojis
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const WALRUS_SKINS: WalrusSkin[] = [
  {
    id: 'default',
    name: 'Classic Walrus',
    description: 'The OG. The legend. The tusked one.',
    unlockLevel: 1,
    preview: '🦭',
    greetings: [
      "Hey there, chief!",
      "Ready to make weird?",
      "Let's get NUB-tastic!",
    ],
    celebrationEmoji: '🎉',
    rarity: 'common',
  },
  {
    id: 'party',
    name: 'Party Walrus',
    description: 'Always ready to celebrate. Hat stays ON.',
    unlockLevel: 3,
    preview: '🦭🎉',
    cssClass: 'hue-rotate-15',
    greetings: [
      "PARTY TIME!",
      "Did someone say celebration?",
      "Let's get this party started!",
      "Wooooo!",
    ],
    celebrationEmoji: '🎊',
    particles: ['🎈', '🎉', '🎊', '🥳', '✨'],
    rarity: 'common',
  },
  {
    id: 'cool',
    name: 'Cool Walrus',
    description: 'Too cool for school. Shades never come off.',
    unlockLevel: 5,
    preview: '🦭😎',
    cssClass: 'contrast-110',
    greetings: [
      "Sup.",
      "*adjusts sunglasses* Nice.",
      "Cool cool cool.",
      "Chillll.",
    ],
    celebrationEmoji: '😎',
    particles: ['⭐', '✨', '💫', '🌟'],
    rarity: 'rare',
  },
  {
    id: 'wizard',
    name: 'Wizard Walrus',
    description: 'Master of the arcane arts. And content approval.',
    unlockLevel: 7,
    preview: '🦭🧙',
    cssClass: 'hue-rotate-270',
    greetings: [
      "A wizard is never late...",
      "*mystical walrus noises*",
      "The content flows through you.",
      "Alakazam! More content!",
    ],
    celebrationEmoji: '🔮',
    particles: ['✨', '🔮', '⚡', '🌙', '⭐'],
    rarity: 'rare',
  },
  {
    id: 'royal',
    name: 'Royal Walrus',
    description: 'All hail the Content King! Crown earned, not given.',
    unlockLevel: 10,
    preview: '🦭👑',
    cssClass: 'saturate-150 brightness-110',
    greetings: [
      "Your Majesty approves.",
      "A royal decree of content!",
      "The crown weighs heavy, but I bear it well.",
      "Bow before the NUB!",
    ],
    celebrationEmoji: '👑',
    particles: ['👑', '💎', '✨', '🏆', '⚜️'],
    rarity: 'legendary',
  },
  // SPECIAL UNLOCKS (not level-based)
  {
    id: 'retro',
    name: 'Retro Walrus',
    description: '8-bit nostalgia. Found the secret code!',
    unlockLevel: 0,
    unlockCondition: 'konami_code',
    preview: '🦭🕹️',
    cssClass: 'pixelated sepia-30',
    greetings: [
      "INSERT COIN",
      "PLAYER ONE READY",
      "PRESS START",
      "HIGH SCORE!",
    ],
    celebrationEmoji: '🕹️',
    particles: ['🎮', '👾', '🕹️', '⬆️', '⬇️'],
    rarity: 'epic',
  },
  {
    id: 'golden',
    name: 'Golden Walrus',
    description: 'Blessed by the RNG gods. Ultra rare lucky find!',
    unlockLevel: 0,
    unlockCondition: 'lucky_event',
    preview: '🦭🌟',
    cssClass: 'sepia-50 saturate-150 brightness-110',
    greetings: [
      "Fortune smiles upon you!",
      "Golden vibes only!",
      "Luck is on your side!",
      "The Midas touch!",
    ],
    celebrationEmoji: '🌟',
    particles: ['✨', '⭐', '🌟', '💫', '🏆'],
    rarity: 'legendary',
  },
  {
    id: 'night',
    name: 'Night Owl Walrus',
    description: 'Grinding after midnight. The true dedication.',
    unlockLevel: 0,
    unlockCondition: 'night_grinder',
    preview: '🦭🦉',
    cssClass: 'brightness-90 contrast-110',
    greetings: [
      "Who needs sleep anyway?",
      "*yawns* More content!",
      "The night is young...",
      "Nocturnal NUB life.",
    ],
    celebrationEmoji: '🌙',
    particles: ['🌙', '⭐', '🦉', '💤', '✨'],
    rarity: 'epic',
  },
];

// Get unlocked skins for a player
export function getUnlockedSkins(level: number): WalrusSkin[] {
  const hiddenAchievements = JSON.parse(
    localStorage.getItem('nub_hidden_achievements') || '[]'
  ) as string[];

  const konamiUnlocked = localStorage.getItem('nub_konami_unlocked') === 'true';
  const luckyEvent = localStorage.getItem('nub_lucky_event') === 'true';

  return WALRUS_SKINS.filter(skin => {
    // Level-based unlock
    if (skin.unlockLevel > 0 && level >= skin.unlockLevel) {
      return true;
    }

    // Special condition unlocks
    if (skin.unlockCondition) {
      switch (skin.unlockCondition) {
        case 'konami_code':
          return konamiUnlocked;
        case 'lucky_event':
          return luckyEvent;
        case 'night_grinder':
          return hiddenAchievements.includes('night_grinder');
        default:
          return hiddenAchievements.includes(skin.unlockCondition);
      }
    }

    return false;
  });
}

// Get all skins with unlock status
export function getAllSkinsWithStatus(level: number): (WalrusSkin & { unlocked: boolean })[] {
  const unlocked = getUnlockedSkins(level);
  const unlockedIds = new Set(unlocked.map(s => s.id));

  return WALRUS_SKINS.map(skin => ({
    ...skin,
    unlocked: unlockedIds.has(skin.id),
  }));
}

// Get currently equipped skin
export function getEquippedSkin(): WalrusSkin {
  const equipped = localStorage.getItem('nub_equipped_skin');
  const skin = WALRUS_SKINS.find(s => s.id === equipped);
  return skin || WALRUS_SKINS[0]; // Default to classic
}

// Equip a skin
export function equipSkin(skinId: string): boolean {
  const skin = WALRUS_SKINS.find(s => s.id === skinId);
  if (skin) {
    localStorage.setItem('nub_equipped_skin', skinId);
    return true;
  }
  return false;
}

export default {
  WALRUS_SKINS,
  getUnlockedSkins,
  getAllSkinsWithStatus,
  getEquippedSkin,
  equipSkin,
};
