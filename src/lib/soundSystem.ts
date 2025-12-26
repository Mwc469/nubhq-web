/**
 * NUB Sound System - 8-bit style synthesized sounds
 * Uses Web Audio API to generate sounds on-the-fly
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

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
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
      const config = SOUND_CONFIGS[sound];

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
