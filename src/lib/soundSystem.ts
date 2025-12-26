/**
 * NUB Sound System - 8-bit style synthesized sounds
 * Uses Web Audio API to generate sounds on-the-fly
 * Now with unlockable sound packs!
 */

type SoundType = 'tap' | 'swipe' | 'success' | 'error' | 'approve' | 'reject' | 'levelUp' | 'achievement' | 'combo' | 'xp';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  attack?: number;
  decay?: number;
  sweep?: number; // frequency change over duration
}

// ============================================================
// SOUND PACKS
// ============================================================

export interface SoundPack {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  unlockCondition?: string;
  preview: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  configs: Record<SoundType, SoundConfig>;
}

// Default 8-bit chiptune pack
const CHIPTUNE_CONFIGS: Record<SoundType, SoundConfig> = {
  tap: { frequency: 800, duration: 0.05, type: 'square' },
  swipe: { frequency: 400, duration: 0.15, type: 'sawtooth', sweep: 200 },
  success: { frequency: 523, duration: 0.2, type: 'square', sweep: 261 },
  error: { frequency: 200, duration: 0.3, type: 'sawtooth', sweep: -100 },
  approve: { frequency: 659, duration: 0.15, type: 'square', sweep: 200 },
  reject: { frequency: 294, duration: 0.2, type: 'sawtooth', sweep: -147 },
  levelUp: { frequency: 440, duration: 0.5, type: 'square', sweep: 440 },
  achievement: { frequency: 523, duration: 0.4, type: 'triangle', sweep: 262 },
  combo: { frequency: 880, duration: 0.1, type: 'square', sweep: 220 },
  xp: { frequency: 1047, duration: 0.08, type: 'sine', sweep: 200 },
};

// Orchestral pack - smoother, more musical
const ORCHESTRAL_CONFIGS: Record<SoundType, SoundConfig> = {
  tap: { frequency: 440, duration: 0.08, type: 'sine' },
  swipe: { frequency: 330, duration: 0.2, type: 'triangle', sweep: 110 },
  success: { frequency: 523, duration: 0.3, type: 'sine', sweep: 131 },
  error: { frequency: 196, duration: 0.4, type: 'triangle', sweep: -49 },
  approve: { frequency: 659, duration: 0.2, type: 'sine', sweep: 110 },
  reject: { frequency: 262, duration: 0.25, type: 'triangle', sweep: -65 },
  levelUp: { frequency: 392, duration: 0.6, type: 'sine', sweep: 392 },
  achievement: { frequency: 523, duration: 0.5, type: 'sine', sweep: 196 },
  combo: { frequency: 784, duration: 0.12, type: 'triangle', sweep: 196 },
  xp: { frequency: 880, duration: 0.1, type: 'sine', sweep: 220 },
};

// Lo-fi pack - warm, muted, chill
const LOFI_CONFIGS: Record<SoundType, SoundConfig> = {
  tap: { frequency: 300, duration: 0.1, type: 'sine' },
  swipe: { frequency: 220, duration: 0.25, type: 'sine', sweep: 55 },
  success: { frequency: 392, duration: 0.35, type: 'sine', sweep: 98 },
  error: { frequency: 165, duration: 0.4, type: 'sine', sweep: -33 },
  approve: { frequency: 440, duration: 0.25, type: 'sine', sweep: 55 },
  reject: { frequency: 196, duration: 0.3, type: 'sine', sweep: -33 },
  levelUp: { frequency: 330, duration: 0.7, type: 'sine', sweep: 165 },
  achievement: { frequency: 392, duration: 0.6, type: 'sine', sweep: 98 },
  combo: { frequency: 523, duration: 0.15, type: 'sine', sweep: 65 },
  xp: { frequency: 659, duration: 0.12, type: 'sine', sweep: 82 },
};

// Chaos pack - random each time!
const CHAOS_CONFIGS: Record<SoundType, SoundConfig> = {
  tap: { frequency: 600, duration: 0.05, type: 'sawtooth' },
  swipe: { frequency: 500, duration: 0.12, type: 'square', sweep: 300 },
  success: { frequency: 700, duration: 0.18, type: 'sawtooth', sweep: 400 },
  error: { frequency: 150, duration: 0.35, type: 'square', sweep: -200 },
  approve: { frequency: 800, duration: 0.12, type: 'sawtooth', sweep: 300 },
  reject: { frequency: 250, duration: 0.22, type: 'square', sweep: -180 },
  levelUp: { frequency: 500, duration: 0.45, type: 'sawtooth', sweep: 600 },
  achievement: { frequency: 600, duration: 0.35, type: 'sawtooth', sweep: 400 },
  combo: { frequency: 1000, duration: 0.08, type: 'sawtooth', sweep: 350 },
  xp: { frequency: 1200, duration: 0.06, type: 'sawtooth', sweep: 300 },
};

export const SOUND_PACKS: SoundPack[] = [
  {
    id: 'chiptune',
    name: 'Chiptune',
    description: 'Classic 8-bit sounds. The OG NUB vibes.',
    unlockLevel: 1,
    preview: '🎮',
    rarity: 'common',
    configs: CHIPTUNE_CONFIGS,
  },
  {
    id: 'orchestral',
    name: 'Orchestral',
    description: 'Smooth, musical tones. Fancy walrus energy.',
    unlockLevel: 5,
    preview: '🎻',
    rarity: 'rare',
    configs: ORCHESTRAL_CONFIGS,
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Chill',
    description: 'Warm and muted. Study beats to approve to.',
    unlockLevel: 7,
    preview: '🎧',
    rarity: 'rare',
    configs: LOFI_CONFIGS,
  },
  {
    id: 'chaos',
    name: 'Chaos Mode',
    description: 'Unpredictable and wild. For the truly chaotic.',
    unlockLevel: 0,
    unlockCondition: 'walrus_10_taps',
    preview: '🌀',
    rarity: 'epic',
    configs: CHAOS_CONFIGS,
  },
];

// Get unlocked sound packs
export function getUnlockedSoundPacks(level: number): SoundPack[] {
  const hiddenAchievements = JSON.parse(
    localStorage.getItem('nub_hidden_achievements') || '[]'
  ) as string[];

  return SOUND_PACKS.filter(pack => {
    if (pack.unlockLevel > 0 && level >= pack.unlockLevel) {
      return true;
    }
    if (pack.unlockCondition) {
      return hiddenAchievements.includes(pack.unlockCondition) ||
        hiddenAchievements.includes('walrus_whisperer'); // 10-tap unlock
    }
    return false;
  });
}

// Get all packs with status
export function getAllSoundPacksWithStatus(level: number): (SoundPack & { unlocked: boolean })[] {
  const unlocked = getUnlockedSoundPacks(level);
  const unlockedIds = new Set(unlocked.map(p => p.id));

  return SOUND_PACKS.map(pack => ({
    ...pack,
    unlocked: unlockedIds.has(pack.id),
  }));
}

// Get equipped sound pack
export function getEquippedSoundPack(): SoundPack {
  const equipped = localStorage.getItem('nub_equipped_soundpack');
  const pack = SOUND_PACKS.find(p => p.id === equipped);
  return pack || SOUND_PACKS[0]; // Default to chiptune
}

// Equip a sound pack
export function equipSoundPack(packId: string): boolean {
  const pack = SOUND_PACKS.find(p => p.id === packId);
  if (pack) {
    localStorage.setItem('nub_equipped_soundpack', packId);
    return true;
  }
  return false;
}

// Get current sound configs based on equipped pack
function getCurrentSoundConfigs(): Record<SoundType, SoundConfig> {
  const pack = getEquippedSoundPack();

  // Chaos mode: randomize some values!
  if (pack.id === 'chaos') {
    const randomized = { ...pack.configs };
    for (const key of Object.keys(randomized) as SoundType[]) {
      randomized[key] = {
        ...randomized[key],
        frequency: randomized[key].frequency * (0.8 + Math.random() * 0.4),
        sweep: randomized[key].sweep ? randomized[key].sweep * (0.7 + Math.random() * 0.6) : undefined,
      };
    }
    return randomized;
  }

  return pack.configs;
}

// Legacy: Keep SOUND_CONFIGS for backward compatibility
const SOUND_CONFIGS = CHIPTUNE_CONFIGS;

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _muted: boolean = false;
  private _volume: number = 0.3;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this._volume;
    }
    return this.audioContext;
  }

  play(sound: SoundType): void {
    if (this._muted) return;

    try {
      const ctx = this.getContext();
      const configs = getCurrentSoundConfigs();
      const config = configs[sound];

      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

      // Apply frequency sweep if configured
      if (config.sweep) {
        oscillator.frequency.linearRampToValueAtTime(
          config.frequency + config.sweep,
          ctx.currentTime + config.duration
        );
      }

      // Envelope: quick attack, smooth decay
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(this._volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain!);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration);
    } catch (e) {
      // Silently fail if audio not supported
      console.debug('Sound not available:', e);
    }
  }

  // Play a sequence of notes for special events
  playMelody(notes: Array<{ sound: SoundType; delay: number }>): void {
    notes.forEach(({ sound, delay }) => {
      setTimeout(() => this.play(sound), delay);
    });
  }

  // Special sound sequences
  playLevelUp(): void {
    this.playMelody([
      { sound: 'success', delay: 0 },
      { sound: 'levelUp', delay: 150 },
      { sound: 'achievement', delay: 400 },
    ]);
  }

  playComboBreak(): void {
    this.playMelody([
      { sound: 'combo', delay: 0 },
      { sound: 'combo', delay: 50 },
      { sound: 'combo', delay: 100 },
    ]);
  }

  setMuted(muted: boolean): void {
    this._muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : this._volume;
    }
  }

  setVolume(volume: number): void {
    this._volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && !this._muted) {
      this.masterGain.gain.value = this._volume;
    }
  }

  get muted(): boolean {
    return this._muted;
  }

  get volume(): number {
    return this._volume;
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (sound: SoundType) => soundManager.play(sound);
export const playLevelUp = () => soundManager.playLevelUp();
export const playComboBreak = () => soundManager.playComboBreak();
export const setSoundMuted = (muted: boolean) => soundManager.setMuted(muted);
export const setSoundVolume = (volume: number) => soundManager.setVolume(volume);
