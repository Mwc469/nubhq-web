/**
 * useAmbientEvents - Hook for managing random ambient events
 * Makes the app feel alive with random delights
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  AMBIENT_EVENT_CONFIG,
  getRandomWalrusComment,
  getRandomEncouragement,
  getRandomSillyAchievement,
  getRandomRareEvent,
  shouldTriggerEvent,
  markEventTriggered,
} from '../lib/ambientEvents';
import { playSound } from '../lib/soundSystem';

export function useAmbientEvents() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventHistory, setEventHistory] = useState([]);
  const intervalsRef = useRef({});

  // Clear current event
  const dismissEvent = useCallback(() => {
    setCurrentEvent(null);
  }, []);

  // Trigger a specific event type
  const triggerEvent = useCallback((eventType, data = null) => {
    let eventData;

    switch (eventType) {
      case 'walrusComment':
        eventData = {
          type: 'bubble',
          message: getRandomWalrusComment(),
          duration: 4000,
        };
        break;

      case 'encouragement':
        eventData = {
          type: 'toast',
          message: getRandomEncouragement(),
          duration: 3500,
        };
        playSound('success');
        break;

      case 'sillyAchievement':
        eventData = {
          type: 'achievement',
          ...getRandomSillyAchievement(),
          duration: 4000,
        };
        playSound('achievement');
        break;

      case 'confetti':
        eventData = {
          type: 'confetti',
          duration: 3000,
        };
        playSound('combo');
        break;

      case 'rareEvent':
        const rareEvent = data || getRandomRareEvent();
        eventData = {
          type: 'modal',
          ...rareEvent,
          duration: 5000,
        };
        playSound('levelUp');
        break;

      default:
        return;
    }

    markEventTriggered(eventType);
    setCurrentEvent(eventData);
    setEventHistory(prev => [...prev.slice(-9), { ...eventData, timestamp: Date.now() }]);

    // Auto-dismiss after duration
    if (eventData.duration) {
      setTimeout(() => {
        setCurrentEvent(prev => (prev === eventData ? null : prev));
      }, eventData.duration);
    }
  }, []);

  // Check and maybe trigger each event type
  const checkEvents = useCallback(() => {
    // Check in order of rarity (rarest first to not overshadow)
    const eventTypes = ['rareEvent', 'confetti', 'sillyAchievement', 'encouragement', 'walrusComment'];

    for (const eventType of eventTypes) {
      if (shouldTriggerEvent(eventType)) {
        triggerEvent(eventType);
        break; // Only trigger one event at a time
      }
    }
  }, [triggerEvent]);

  // Set up intervals for each event type
  useEffect(() => {
    // Start intervals for each event type
    Object.entries(AMBIENT_EVENT_CONFIG).forEach(([eventType, config]) => {
      intervalsRef.current[eventType] = setInterval(() => {
        if (shouldTriggerEvent(eventType) && !currentEvent) {
          triggerEvent(eventType);
        }
      }, config.interval);
    });

    // Cleanup
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, [triggerEvent, currentEvent]);

  // Manual trigger for testing or specific moments
  const forceEvent = useCallback((eventType, data = null) => {
    triggerEvent(eventType, data);
  }, [triggerEvent]);

  return {
    currentEvent,
    dismissEvent,
    forceEvent,
    eventHistory,
  };
}

export default useAmbientEvents;
