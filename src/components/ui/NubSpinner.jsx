import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Silly loading messages - because waiting should be fun
const SILLY_LOADING_MESSAGES = [
  { message: "Consulting the walrus...", submessage: "He's very wise (and slow)" },
  { message: "Warming up the chaos engine...", submessage: "Chaotic neutral engaged" },
  { message: "Summoning content from the void...", submessage: "The void says 'one sec'" },
  { message: "Teaching hamsters to type faster...", submessage: "They're trying their best" },
  { message: "Downloading more RAM...", submessage: "Just kidding, that's not how it works" },
  { message: "Convincing pixels to behave...", submessage: "They're being difficult today" },
  { message: "Reticulating splines...", submessage: "Whatever that means" },
  { message: "Bribing the servers with fish...", submessage: "They drive a hard bargain" },
  { message: "Asking nicely...", submessage: "Please please please" },
  { message: "Brewing digital coffee...", submessage: "The code needs caffeine too" },
  { message: "Performing interpretive dance...", submessage: "For the algorithm gods" },
  { message: "Untangling spaghetti code...", submessage: "It's a mess in here" },
  { message: "Charging the vibe crystals...", submessage: "Mercury is in retrograde" },
  { message: "Asking ChatGPT to ask Claude...", submessage: "It's AIs all the way down" },
  { message: "Loading loading screen...", submessage: "Very meta, I know" },
  { message: "Buffering the buffer...", submessage: "Bufferception" },
  { message: "Waking up the intern...", submessage: "They were napping" },
  { message: "Converting coffee to code...", submessage: "Standard programming procedure" },
  { message: "Negotiating with cloud gods...", submessage: "They want a sacrifice" },
  { message: "Poking the database gently...", submessage: "Don't want to startle it" },
];

function getRandomLoadingMessage() {
  return SILLY_LOADING_MESSAGES[Math.floor(Math.random() * SILLY_LOADING_MESSAGES.length)];
}

export default function NubSpinner({
  size = 'md',
  color = 'pink',
  message,
  submessage,
  className,
  silly = true, // Enable silly messages by default
}) {
  const [sillyMessage, setSillyMessage] = useState(getRandomLoadingMessage);

  // Rotate through silly messages while loading
  useEffect(() => {
    if (!silly || message) return; // Don't rotate if custom message provided

    const interval = setInterval(() => {
      setSillyMessage(getRandomLoadingMessage());
    }, 3000);

    return () => clearInterval(interval);
  }, [silly, message]);
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colors = {
    pink: 'text-neon-pink',
    cyan: 'text-neon-cyan',
    yellow: 'text-neon-yellow',
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    orange: 'text-neon-orange',
  };

  // Determine which message to show
  const displayMessage = message || (silly ? sillyMessage.message : null);
  const displaySubmessage = submessage || (silly && !message ? sillyMessage.submessage : null);

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Loader2 className={cn(sizes[size], colors[color])} />
      </motion.div>
      {displayMessage && (
        <motion.p
          key={displayMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 font-bold text-lg text-center"
        >
          {displayMessage}
        </motion.p>
      )}
      {displaySubmessage && (
        <motion.p
          key={displaySubmessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-sm text-center"
        >
          {displaySubmessage}
        </motion.p>
      )}
    </div>
  );
}
