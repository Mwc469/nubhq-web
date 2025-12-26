/**
 * useKonamiCode - Easter egg hook for the classic cheat code
 * ↑↑↓↓←→←→BA
 */
import { useState, useEffect, useCallback } from 'react';
import { playSound } from '../lib/soundSystem';
import { haptic } from '../components/mobile/MobileComponents';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export default function useKonamiCode(onSuccess) {
  const [inputSequence, setInputSequence] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('nub_konami_unlocked') === 'true';
  });

  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase() === 'b' || event.key.toLowerCase() === 'a'
      ? event.key.toLowerCase()
      : event.key;

    setInputSequence(prev => {
      const newSequence = [...prev, key].slice(-KONAMI_CODE.length);

      // Check if sequence matches
      if (newSequence.length === KONAMI_CODE.length) {
        const matches = newSequence.every((k, i) =>
          k.toLowerCase() === KONAMI_CODE[i].toLowerCase()
        );

        if (matches && !isUnlocked) {
          // SUCCESS!
          setIsUnlocked(true);
          localStorage.setItem('nub_konami_unlocked', 'true');
          playSound('levelUp');
          playSound('achievement');
          haptic?.('success');
          haptic?.('success');
          onSuccess?.();
        }
      }

      return newSequence;
    });
  }, [isUnlocked, onSuccess]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    setIsUnlocked(false);
    localStorage.removeItem('nub_konami_unlocked');
  }, []);

  return { isUnlocked, reset };
}
