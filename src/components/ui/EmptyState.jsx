import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EMPTY_STATES, pick } from '@/lib/nubCopy';
import {
  OtterWithCanvas,
  OtterRelaxing,
  OtterWithCamera,
  OtterCelebrating,
  OtterConfused,
  OtterWithInbox,
} from './OtterIllustrations';

// Map types to default illustrations
const TYPE_ILLUSTRATIONS = {
  drafts: OtterWithCanvas,
  posts: OtterWithCanvas,
  approvals: OtterCelebrating,
  media: OtterWithCamera,
  templates: OtterConfused,
  events: OtterRelaxing,
  activity: OtterRelaxing,
  search: OtterConfused,
  inbox: OtterWithInbox,
};

// Walrus reactions for empty states
const WALRUS_REACTIONS = [
  "The walrus is also confused...",
  "*patient walrus waiting*",
  "Nothing to see here. Yet!",
  "The void is cozy, actually.",
  "*supportive flipper wave*",
];

export default function EmptyState({
  icon: Icon,
  illustration: Illustration, // OtterIllustration component
  imageSrc, // PNG/JPG asset path
  title,
  description,
  action,
  type, // 'drafts' | 'posts' | 'approvals' | 'media' | 'templates' | 'events' | 'activity' | 'search' | 'inbox'
  showWalrusReaction = true,
  className
}) {
  // Get a random roast if type is provided and no custom title/description
  const roast = useMemo(() => {
    if (type && EMPTY_STATES[type] && !title && !description) {
      return pick(EMPTY_STATES[type]);
    }
    return null;
  }, [type, title, description]);

  // Get random walrus reaction
  const walrusReaction = useMemo(() => {
    return WALRUS_REACTIONS[Math.floor(Math.random() * WALRUS_REACTIONS.length)];
  }, []);

  const displayTitle = title || roast?.title || "Nothing here";
  const displayDescription = description || roast?.message || "It's looking a bit empty...";

  // Determine which illustration to show
  const IllustrationComponent = Illustration || (type && TYPE_ILLUSTRATIONS[type]);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-8 text-center",
      className
    )}>
      {/* Animated illustration */}
      {(IllustrationComponent || imageSrc) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Empty state illustration"
                className="w-32 h-32 object-contain"
              />
            ) : IllustrationComponent ? (
              <IllustrationComponent className="w-32 h-32" />
            ) : null}
          </motion.div>
        </motion.div>
      )}

      {/* Fallback to icon if no illustration */}
      {!IllustrationComponent && !imageSrc && Icon && (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#a76d24]/20 to-[#f19b38]/20 flex items-center justify-center mb-6 border-3 border-dashed border-[#f19b38]/30 animate-pulse">
          <Icon className="w-10 h-10 text-[#f19b38]" />
        </div>
      )}

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold mb-2 text-gray-900 dark:text-white"
      >
        {displayTitle}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-300 text-sm max-w-sm mb-4"
      >
        {displayDescription}
      </motion.p>

      {/* Walrus reaction */}
      {showWalrusReaction && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-400 dark:text-gray-500 italic mb-6"
        >
          🦭 {walrusReaction}
        </motion.p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
