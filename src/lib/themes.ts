/**
 * NubHQ Theme System
 * Unlockable color themes earned through gameplay!
 */

export interface UnlockableTheme {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  unlockCondition?: string;
  preview: string; // Gradient preview for UI
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const UNLOCKABLE_THEMES: UnlockableTheme[] = [
  {
    id: 'cosmic',
    name: 'Cosmic Pink',
    description: 'The classic NUB vibes. Pink and purple cosmic energy.',
    unlockLevel: 1,
    preview: 'from-neon-pink via-neon-purple to-neon-cyan',
    colors: {
      primary: '#E91E8C',
      secondary: '#9B30FF',
      accent: '#00FFFF',
      background: '#0D0D1A',
    },
    rarity: 'common',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Cool and calm. Like a walrus in its natural habitat.',
    unlockLevel: 4,
    preview: 'from-blue-400 via-cyan-500 to-teal-600',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#2DD4BF',
      background: '#0C1929',
    },
    rarity: 'rare',
  },
  {
    id: 'sunset',
    name: 'Sunset Blaze',
    description: 'Warm vibes for hot content. Orange you glad?',
    unlockLevel: 6,
    preview: 'from-orange-400 via-red-500 to-pink-600',
    colors: {
      primary: '#F97316',
      secondary: '#EF4444',
      accent: '#EC4899',
      background: '#1A0F0C',
    },
    rarity: 'rare',
  },
  {
    id: 'neon',
    name: 'Neon Matrix',
    description: 'Pure cyberpunk energy. Green means approved.',
    unlockLevel: 8,
    preview: 'from-green-400 via-emerald-500 to-lime-500',
    colors: {
      primary: '#22C55E',
      secondary: '#10B981',
      accent: '#84CC16',
      background: '#0A1A0C',
    },
    rarity: 'epic',
  },
  {
    id: 'midnight',
    name: 'Midnight Purple',
    description: 'Deep, mysterious, powerful. For the true night owls.',
    unlockLevel: 9,
    preview: 'from-purple-600 via-violet-700 to-indigo-900',
    colors: {
      primary: '#9333EA',
      secondary: '#7C3AED',
      accent: '#6366F1',
      background: '#0F0A1A',
    },
    rarity: 'epic',
  },
  // SPECIAL UNLOCKS
  {
    id: 'retro',
    name: 'Retro 8-Bit',
    description: 'Found the Konami code! Classic gaming vibes.',
    unlockLevel: 0,
    unlockCondition: 'konami_code',
    preview: 'from-yellow-400 via-orange-500 to-red-600',
    colors: {
      primary: '#FACC15',
      secondary: '#F97316',
      accent: '#EF4444',
      background: '#1A1A0C',
    },
    rarity: 'epic',
  },
  {
    id: 'gold',
    name: 'Golden Walrus',
    description: 'Ultra rare! Blessed by fortune and good RNG.',
    unlockLevel: 0,
    unlockCondition: 'lucky_event',
    preview: 'from-yellow-300 via-amber-400 to-orange-500',
    colors: {
      primary: '#FCD34D',
      secondary: '#FBBF24',
      accent: '#F59E0B',
      background: '#1A160A',
    },
    rarity: 'legendary',
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Reached max level. The ultimate achievement.',
    unlockLevel: 10,
    preview: 'from-rose-400 via-fuchsia-500 to-violet-600',
    colors: {
      primary: '#FB7185',
      secondary: '#D946EF',
      accent: '#8B5CF6',
      background: '#1A0A14',
    },
    rarity: 'legendary',
  },
];

// Get unlocked themes
export function getUnlockedThemes(level: number): UnlockableTheme[] {
  const konamiUnlocked = localStorage.getItem('nub_konami_unlocked') === 'true';
  const luckyEvent = localStorage.getItem('nub_lucky_event') === 'true';

  return UNLOCKABLE_THEMES.filter(theme => {
    // Level-based unlock
    if (theme.unlockLevel > 0 && level >= theme.unlockLevel) {
      return true;
    }

    // Special condition unlocks
    if (theme.unlockCondition) {
      switch (theme.unlockCondition) {
        case 'konami_code':
          return konamiUnlocked;
        case 'lucky_event':
          return luckyEvent;
        default:
          return false;
      }
    }

    return false;
  });
}

// Get all themes with status
export function getAllThemesWithStatus(level: number): (UnlockableTheme & { unlocked: boolean })[] {
  const unlocked = getUnlockedThemes(level);
  const unlockedIds = new Set(unlocked.map(t => t.id));

  return UNLOCKABLE_THEMES.map(theme => ({
    ...theme,
    unlocked: unlockedIds.has(theme.id),
  }));
}

// Get equipped theme
export function getEquippedTheme(): UnlockableTheme {
  const equipped = localStorage.getItem('nub_equipped_theme');
  const theme = UNLOCKABLE_THEMES.find(t => t.id === equipped);
  return theme || UNLOCKABLE_THEMES[0]; // Default to cosmic
}

// Equip a theme
export function equipTheme(themeId: string): boolean {
  const theme = UNLOCKABLE_THEMES.find(t => t.id === themeId);
  if (theme) {
    localStorage.setItem('nub_equipped_theme', themeId);
    // Dispatch event for theme context to pick up
    window.dispatchEvent(new CustomEvent('nub-theme-change', { detail: theme }));
    return true;
  }
  return false;
}

export default {
  UNLOCKABLE_THEMES,
  getUnlockedThemes,
  getAllThemesWithStatus,
  getEquippedTheme,
  equipTheme,
};
