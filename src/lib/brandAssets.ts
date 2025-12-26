/**
 * NUB Brand Assets - Centralized references to all brand art
 * These assets are used throughout the portal experience
 */

export const BRAND_ASSETS = {
  logos: {
    screaming: '/assets/nublogoFACEclear.png',
    face: '/assets/nubface2.png',
  },
  characters: {
    glamorousWalrus: '/assets/walrusthevibeissensuous.png',
    rocketWalrus: '/assets/pinupwalrus.png',
    cactusHug: '/assets/cactusnub.png',
  },
  buttons: {
    cactus: '/assets/cactusbuttonclear.png',
  },
  backgrounds: {
    cosmicThrone: '/assets/cosmic-throne.png',
    psychedelic: '/assets/touchthenubComicReach.png',
  },
} as const;

export type WalrusMood = 'idle' | 'excited' | 'thinking' | 'celebrating' | 'sleeping';

export const WALRUS_MOODS: Record<WalrusMood, { asset: keyof typeof BRAND_ASSETS.characters; animation: string }> = {
  idle: { asset: 'glamorousWalrus', animation: 'cosmic-float' },
  excited: { asset: 'glamorousWalrus', animation: 'nub-wiggle' },
  thinking: { asset: 'glamorousWalrus', animation: 'portal-breathe' },
  celebrating: { asset: 'rocketWalrus', animation: 'rocket-launch' },
  sleeping: { asset: 'glamorousWalrus', animation: 'portal-breathe' },
};

// Cosmic color palette from the brand art
export const COSMIC_COLORS = {
  purple: '#9B30FF',
  pink: '#E91E8C',
  deepPurple: '#4B0082',
  nebulaPink: '#FF69B4',
  cosmicBlue: '#1E90FF',
  starWhite: '#FFFAFA',
  orange: '#a76d24',
  neonCyan: '#00D4D4',
} as const;

// Gradient presets for cosmic backgrounds
export const COSMIC_GRADIENTS = {
  portal: `radial-gradient(ellipse at center, ${COSMIC_COLORS.deepPurple} 0%, ${COSMIC_COLORS.purple} 30%, ${COSMIC_COLORS.pink} 60%, ${COSMIC_COLORS.nebulaPink} 100%)`,
  subtle: `linear-gradient(135deg, rgba(75, 0, 130, 0.1) 0%, rgba(155, 48, 255, 0.05) 50%, rgba(233, 30, 140, 0.1) 100%)`,
  intense: `radial-gradient(ellipse at 30% 20%, ${COSMIC_COLORS.nebulaPink} 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${COSMIC_COLORS.purple} 0%, transparent 50%), linear-gradient(180deg, ${COSMIC_COLORS.deepPurple} 0%, #1a0a2e 100%)`,
} as const;
