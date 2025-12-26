import React, { useState, useEffect, useCallback } from 'react';
import { IDLE_PROMPTS, ENCOURAGEMENT, pick } from '@/lib/nubCopy';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Time-based greetings
const TIME_GREETINGS = {
  lateNight: [ // 12am - 5am
    "It's past midnight. Go to bed, ya weirdo. (But also, respect.) 🌙",
    "Burning the midnight oil? The chaos never sleeps.",
    "3am content hits different. Proceed with caution.",
  ],
  earlyMorning: [ // 5am - 9am
    "Early bird gets the... engagement? Sure, let's go with that.",
    "Up early! Your dedication to weird is admirable.",
    "Morning! Coffee first, chaos second.",
  ],
  morning: [ // 9am - 12pm
    "Good morning! Time to confuse the algorithm.",
    "Peak posting hours approaching. Lock and load.",
  ],
  afternoon: [ // 12pm - 5pm
    "Afternoon grind! The content won't create itself.",
    "Post-lunch creativity time. Let's get weird.",
  ],
  evening: [ // 5pm - 9pm
    "Evening session! Prime time for chaos.",
    "The fans are scrolling. Give them something good.",
  ],
  night: [ // 9pm - 12am
    "Night owl mode activated. 🦉",
    "Late night content planning? We love the dedication.",
  ],
};

const MONDAY_ROASTS = [
  "Monday. Ugh. Let's make it weird at least.",
  "Ah, Monday. The alarm clock of the week.",
  "Monday vibes: caffeinated and chaotic.",
];

const FRIDAY_ROASTS = [
  "FRIDAY! Post something chaotic! 🎉",
  "It's Friday! The algorithm is ready for your weirdness.",
  "Weekend's almost here. One more banger for the fans?",
];

function getTimeGreeting() {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  
  // Special day overrides
  if (day === 1) return pick(MONDAY_ROASTS); // Monday
  if (day === 5) return pick(FRIDAY_ROASTS); // Friday
  
  if (hour >= 0 && hour < 5) return pick(TIME_GREETINGS.lateNight);
  if (hour >= 5 && hour < 9) return pick(TIME_GREETINGS.earlyMorning);
  if (hour >= 9 && hour < 12) return pick(TIME_GREETINGS.morning);
  if (hour >= 12 && hour < 17) return pick(TIME_GREETINGS.afternoon);
  if (hour >= 17 && hour < 21) return pick(TIME_GREETINGS.evening);
  return pick(TIME_GREETINGS.night);
}

export default function IdleRoaster({ 
  idleTimeout = 45000, // 45 seconds
  enabled = true,
  position = 'bottom-right' // 'bottom-right' | 'bottom-left' | 'top-right'
}) {
  const [showRoast, setShowRoast] = useState(false);
  const [roastMessage, setRoastMessage] = useState('');
  const [roastCount, setRoastCount] = useState(0);

  const triggerRoast = useCallback(() => {
    // After 3 roasts, switch to encouragement
    const messages = roastCount >= 3 ? ENCOURAGEMENT : IDLE_PROMPTS;
    setRoastMessage(pick(messages));
    setShowRoast(true);
    setRoastCount(prev => prev + 1);
  }, [roastCount]);

  const dismissRoast = () => {
    setShowRoast(false);
  };

  useEffect(() => {
    if (!enabled) return;

    let idleTimer;
    
    const resetTimer = () => {
      clearTimeout(idleTimer);
      setShowRoast(false);
      idleTimer = setTimeout(triggerRoast, idleTimeout);
    };

    // Events that reset the idle timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initial timer
    idleTimer = setTimeout(triggerRoast, idleTimeout);

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [enabled, idleTimeout, triggerRoast]);

  if (!showRoast || !enabled) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-24 right-4',
  };

  return (
    <div 
      className={cn(
        "fixed z-50 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300",
        positionClasses[position]
      )}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl border-3 border-[#f19b38] shadow-[4px_4px_0_#a76d24] p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🦦</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {roastMessage}
            </p>
          </div>
          <button 
            onClick={dismissRoast}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Export time greeting for use elsewhere
export { getTimeGreeting };
