/**
 * WalrusCompanion - The NUB brand character using real art assets
 * An interactive guide that appears on the hub and during games
 */
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_ASSETS, WALRUS_MOODS } from '../../lib/brandAssets';
import { playSound } from '../../lib/soundSystem';
import { haptic } from '../mobile/MobileComponents';

// Companion messages based on context - EXTRA SILLY EDITION
const COMPANION_MESSAGES = {
  greeting: [
    "Hey there, ya beautiful freak!",
    "Ready to make some chaos?",
    "The weird won't post itself!",
    "I've been waiting here for 84 years...",
    "Ahoy ya juicy nublet!",
    "I dreamt about spreadsheets again.",
    "My therapist says I need more approvals.",
    "I ate a fish today. It was mid.",
    "Quick, look busy - the algorithm is watching!",
    "I'm not crying, you're crying!",
    "Do you think clouds judge us?",
    "I have no arms but I must hug.",
    "Honestly? I'm just vibing here.",
    "My horoscope said today would be chaotic. Perfect.",
  ],
  pending: [
    "items need your wisdom",
    "decisions await your judgment",
    "things are waiting on you, chief",
    "lonely items crying in the queue",
    "things gathering dust (metaphorically)",
    "orphan approvals seeking a loving home",
    "items slowly losing hope",
    "potential posts withering away",
  ],
  empty: [
    "All caught up! I'm so proud I could cry.",
    "Nothing pending. Touch grass? ...nah, stay here with me.",
    "Queue's empty. The void stares back.",
    "Inbox zero. Achievement unlocked: Productivity God.",
    "Nothing to do. This is my nightmare.",
    "Empty queue. The walrus feels... empty too.",
    "Wow. Such empty. Much complete.",
    "You did it. You actually did it. I'm shook.",
  ],
  encouragement: [
    "You're killing it! (not literally please)",
    "That's the NUB way! (whatever that means)",
    "Chef's kiss, honestly. MWAH.",
    "The vibes? IMMACULATE.",
    "My faith in humanity: RESTORED.",
    "I'm gonna tell my mom about you.",
    "Hire this person. Oh wait, you are this person.",
    "Someone give this human a trophy!",
    "That was so good I forgot I'm a walrus.",
    "BRB crying happy tears into the ocean.",
  ],
  idle: [
    "Still here if you need me! (please need me)",
    "The walrus waits patiently... tick tock...",
    "Tap me. I dare you. I double dare you.",
    "I see you staring at me. It's okay. I like it.",
    "I've been idle for 3 seconds. This is concerning.",
    "*existential walrus noises*",
    "Plot twist: I've been judging you this whole time.",
    "Fun fact: I can hold my breath for 30 minutes. Useless here though.",
    "I wonder what the cactus is doing right now...",
    "Do these tusks make my face look fat?",
  ],
  celebration: [
    "YESSSS! MY EMOTIONAL SUPPORT HUMAN!",
    "That was beautiful! I'm not crying!",
    "The walrus approves! *aggressive clapping*",
    "ABSOLUTE LEGEND! GOAT! MVP! OTHER ACRONYMS!",
    "I just shed a single tear of joy. It was majestic.",
    "SOMEONE GET THE CONFETTI! Oh wait, that's me!",
    "This is the greatest moment of my walrus life!",
    "I BELIEVE IN YOU AND ALSO MAGIC NOW!",
    "Quick, someone screenshot this moment!",
    "You've peaked. It's all downhill from here. Worth it.",
  ],
  tap: [
    "*happy walrus noises*",
    "Hehe, that tickles!",
    "You found me! I wasn't hiding!",
    "Boop! The snoot has been booped!",
    "The walrus likes attention. The walrus NEEDS attention.",
    "Okay okay I'm working! (I'm not)",
    "AHHHH oh it's just you. Phew.",
    "Personal space? Never heard of her.",
    "Again! Again! ...okay maybe not again.",
    "You're obsessed with me and I respect that.",
    "*aggressive walrus purring*",
    "I felt that in my tusks.",
    "Stop it! ...don't actually stop.",
    "This is the most attention I've gotten all day.",
  ],
  random: [
    "Did you know walruses can whistle? I can't. I've tried.",
    "Plot twist: the cactus was the real hero all along.",
    "Sometimes I just scream into the void. The void says 'same.'",
    "My spirit animal is also a walrus. How convenient.",
    "I once fought a seagull. We don't talk about it.",
    "Hot take: Mondays aren't that bad. Jk they're terrible.",
    "Current mood: chaotic neutral with a hint of fabulous.",
    "I'm 90% blubber and 100% that friend.",
    "They say you are what you eat. I eat fish. I am fish??",
    "Fun fact: this fun fact is not fun. Neither is this one.",
  ],
  judgmental: [
    "Interesting choice. Bold. Questionable. I love it.",
    "I'm not saying it's wrong, but... actually yes I am.",
    "The walrus has concerns.",
    "My facial expression says it all. (It's always the same though)",
    "That's certainly... a decision.",
    "I've seen things. This is one of them.",
  ],
};

function getRandomMessage(category) {
  const messages = COMPANION_MESSAGES[category] || COMPANION_MESSAGES.greeting;
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function WalrusCompanion({
  mood = 'idle',
  pendingCount = 0,
  message: customMessage,
  size = 'md',
  showSpeechBubble = true,
  onTap,
  className = '',
}) {
  const [currentMood, setCurrentMood] = useState(mood);
  const [message, setMessage] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const moodConfig = WALRUS_MOODS[currentMood] || WALRUS_MOODS.idle;
  const assetPath = BRAND_ASSETS.characters[moodConfig.asset];

  // Generate contextual message
  useEffect(() => {
    if (customMessage) {
      setMessage(customMessage);
      return;
    }

    if (pendingCount > 0) {
      setMessage(`${pendingCount} ${getRandomMessage('pending')}`);
    } else {
      setMessage(getRandomMessage('greeting'));
    }
  }, [customMessage, pendingCount]);

  // Random idle chatter - walrus says random things occasionally
  useEffect(() => {
    const idleChatter = setInterval(() => {
      // 15% chance every 8 seconds to say something random
      if (Math.random() < 0.15 && currentMood !== 'celebrating') {
        const category = Math.random() < 0.5 ? 'random' : 'idle';
        setMessage(getRandomMessage(category));

        // Reset back to normal message after a bit
        setTimeout(() => {
          if (pendingCount > 0) {
            setMessage(`${pendingCount} ${getRandomMessage('pending')}`);
          } else {
            setMessage(getRandomMessage('greeting'));
          }
        }, 4000);
      }
    }, 8000);

    return () => clearInterval(idleChatter);
  }, [currentMood, pendingCount]);

  // Update mood based on props
  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  const handleTap = useCallback(() => {
    haptic?.('light');
    playSound('tap');
    setIsAnimating(true);

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Easter egg: 5 rapid taps
    if (newTapCount >= 5) {
      setCurrentMood('celebrating');
      setMessage(getRandomMessage('celebration'));
      haptic?.('success');
      playSound('achievement');
      setTimeout(() => {
        setTapCount(0);
        setCurrentMood(mood);
      }, 2000);
    } else {
      setMessage(getRandomMessage('tap'));
      setTimeout(() => {
        setMessage(pendingCount > 0
          ? `${pendingCount} ${getRandomMessage('pending')}`
          : getRandomMessage('greeting'));
      }, 2000);
    }

    setTimeout(() => setIsAnimating(false), 300);
    onTap?.();
  }, [tapCount, mood, pendingCount, onTap]);

  // Reset tap count after inactivity
  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showSpeechBubble && message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-3 max-w-xs"
          >
            <div
              className="relative px-4 py-2 bg-white dark:bg-brand-dark rounded-2xl
                         border-2 border-black shadow-brutal-sm"
            >
              <p
                className="text-sm md:text-base font-medium text-gray-800 dark:text-white text-center"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {message}
              </p>

              {/* Speech bubble tail */}
              <div
                className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid black',
                }}
              />
              <div
                className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid white',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Walrus character */}
      <motion.div
        className={`relative cursor-pointer ${sizeClasses[size]}`}
        onClick={handleTap}
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.img
          src={assetPath}
          alt="NUB Walrus"
          className={`w-full h-full object-contain ${moodConfig.animation ? `animate-${moodConfig.animation}` : 'animate-cosmic-float'}`}
          style={{
            filter: currentMood === 'celebrating'
              ? 'drop-shadow(0 0 20px rgba(233, 30, 140, 0.6))'
              : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
          draggable={false}
        />

        {/* Celebration particles */}
        <AnimatePresence>
          {currentMood === 'celebrating' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: (Math.random() - 0.5) * 100,
                    y: -50 - Math.random() * 50,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: ['#E91E8C', '#9B30FF', '#00D4D4', '#E6C700'][i % 4],
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Smaller version for use in headers/corners
export function WalrusMini({ onClick, className = '' }) {
  return (
    <motion.img
      src={BRAND_ASSETS.characters.glamorousWalrus}
      alt="NUB"
      className={`w-10 h-10 object-contain cursor-pointer ${className}`}
      onClick={() => {
        haptic?.('light');
        playSound('tap');
        onClick?.();
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
      }}
    />
  );
}
