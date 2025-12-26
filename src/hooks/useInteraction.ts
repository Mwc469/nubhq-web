/**
 * useInteraction - Unified hook for game-like interactions
 * Combines sound, haptics, and visual feedback for every action
 */
import { useCallback, useState } from 'react';
import { playSound, playLevelUp, playComboBreak } from '../lib/soundSystem';
import { haptic } from '../components/mobile/MobileComponents';

export interface UseInteractionOptions {
  sound?: boolean;
  haptics?: boolean;
}

export function useInteraction(options: UseInteractionOptions = {}) {
  const { sound = true, haptics = true } = options;
  const [lastAction, setLastAction] = useState<number>(0);

  // Basic tap feedback
  const tap = useCallback(() => {
    if (haptics) haptic?.('light');
    if (sound) playSound('tap');
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Success feedback (approve, complete, etc.)
  const success = useCallback(() => {
    if (haptics) haptic?.('success');
    if (sound) playSound('success');
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Error feedback
  const error = useCallback(() => {
    if (haptics) haptic?.('error');
    if (sound) playSound('error');
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Swipe feedback
  const swipe = useCallback(() => {
    if (haptics) haptic?.('light');
    if (sound) playSound('swipe');
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Approve action
  const approve = useCallback(() => {
    if (haptics) haptic?.('medium');
    if (sound) playSound('approve');
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Reject action
  const reject = useCallback(() => {
    if (haptics) haptic?.('medium');
    if (sound) playSound('reject');
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Level up celebration
  const levelUp = useCallback(() => {
    if (haptics) haptic?.('success');
    if (sound) playLevelUp();
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Achievement unlocked
  const achievement = useCallback(() => {
    if (haptics) haptic?.('success');
    if (sound) playSound('achievement');
    setLastAction(Date.now());
  }, [sound, haptics]);

  // Combo feedback
  const combo = useCallback(() => {
    if (haptics) haptic?.('light');
    if (sound) playComboBreak();
    setLastAction(Date.now());
  }, [sound, haptics]);

  // XP gain
  const xpGain = useCallback(() => {
    if (haptics) haptic?.('light');
    if (sound) playSound('xp');
    setLastAction(Date.now());
  }, [sound, haptics]);

  return {
    tap,
    success,
    error,
    swipe,
    approve,
    reject,
    levelUp,
    achievement,
    combo,
    xpGain,
    lastAction,
  };
}

// Convenience: Check if action was recent (for debouncing)
export function useRecentAction(threshold = 300) {
  const { lastAction } = useInteraction();
  return Date.now() - lastAction < threshold;
}
