import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const otterColors = {
  body: '#d97706',
  belly: '#fde68a',
  dark: '#b45309',
  eyes: '#1f2937',
};

export function NubMascot({
  mood = 'happy',
  size = 'md',
  animate = true,
  className,
}) {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        animate: mood === 'happy' ? { y: [0, -5, 0] } : undefined,
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  return (
    <Wrapper className={cn(sizeClasses[size], className)} {...wrapperProps}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="32" cy="42" rx="18" ry="14" fill={otterColors.body} />
        {/* Belly */}
        <ellipse cx="32" cy="44" rx="12" ry="9" fill={otterColors.belly} />
        {/* Head */}
        <circle cx="32" cy="24" r="16" fill={otterColors.body} />
        {/* Face */}
        <ellipse cx="32" cy="26" rx="11" ry="9" fill={otterColors.belly} />
        {/* Ears */}
        <circle cx="18" cy="14" r="4" fill={otterColors.body} />
        <circle cx="46" cy="14" r="4" fill={otterColors.body} />

        {/* Eyes based on mood */}
        {mood === 'happy' || mood === 'excited' ? (
          <>
            <path
              d="M24 22 Q27 19 30 22"
              stroke={otterColors.eyes}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M34 22 Q37 19 40 22"
              stroke={otterColors.eyes}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="26" cy="20" r="3" fill={otterColors.eyes} />
            <circle cx="38" cy="20" r="3" fill={otterColors.eyes} />
            <circle cx="27" cy="18" r="1" fill="white" />
            <circle cx="39" cy="18" r="1" fill="white" />
          </>
        ) : mood === 'sleepy' ? (
          <>
            <path
              d="M23 22 L29 22"
              stroke={otterColors.eyes}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M35 22 L41 22"
              stroke={otterColors.eyes}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="26" cy="22" r="3" fill={otterColors.eyes} />
            <circle cx="38" cy="22" r="3" fill={otterColors.eyes} />
            <circle cx="27" cy="21" r="1" fill="white" />
            <circle cx="39" cy="21" r="1" fill="white" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="32" cy="28" rx="3" ry="2" fill={otterColors.eyes} />

        {/* Mouth based on mood */}
        {mood === 'happy' || mood === 'excited' ? (
          <path
            d="M28 32 Q32 36 36 32"
            stroke={otterColors.eyes}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === 'thinking' ? (
          <circle
            cx="35"
            cy="32"
            r="2"
            fill={otterColors.eyes}
            opacity="0.3"
          />
        ) : (
          <path
            d="M29 32 Q32 33 35 32"
            stroke={otterColors.eyes}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Whiskers */}
        <g stroke={otterColors.dark} strokeWidth="0.75" opacity="0.6">
          <line x1="20" y1="26" x2="12" y2="24" />
          <line x1="20" y1="28" x2="12" y2="28" />
          <line x1="44" y1="26" x2="52" y2="24" />
          <line x1="44" y1="28" x2="52" y2="28" />
        </g>

        {/* Tail */}
        <ellipse
          cx="52"
          cy="48"
          rx="10"
          ry="4"
          fill={otterColors.body}
          transform="rotate(-20 52 48)"
        />

        {/* Paws */}
        <ellipse cx="22" cy="52" rx="5" ry="3" fill={otterColors.dark} />
        <ellipse cx="42" cy="52" rx="5" ry="3" fill={otterColors.dark} />

        {/* Mood additions */}
        {mood === 'excited' && (
          <>
            <circle cx="12" cy="16" r="2" fill="#facc15" />
            <circle cx="52" cy="12" r="1.5" fill="#ec4899" />
            <circle cx="8" cy="28" r="1.5" fill="#22d3ee" />
          </>
        )}

        {mood === 'thinking' && (
          <>
            <circle cx="52" cy="8" r="2" fill="#9ca3af" />
            <circle cx="48" cy="12" r="1.5" fill="#9ca3af" />
            <circle cx="45" cy="15" r="1" fill="#9ca3af" />
          </>
        )}

        {mood === 'sleepy' && (
          <>
            <text
              x="46"
              y="10"
              fontSize="8"
              fill="#9ca3af"
              fontFamily="sans-serif"
            >
              z
            </text>
            <text
              x="52"
              y="6"
              fontSize="10"
              fill="#9ca3af"
              fontFamily="sans-serif"
            >
              Z
            </text>
          </>
        )}
      </svg>
    </Wrapper>
  );
}

export function NubTip({ children, mood = 'happy', className }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl',
        'bg-amber-50 dark:bg-amber-950/30',
        'border-2 border-amber-200 dark:border-amber-800',
        className
      )}
    >
      <NubMascot mood={mood} size="sm" animate={false} />
      <div className="flex-1 text-sm text-amber-900 dark:text-amber-100">
        {children}
      </div>
    </div>
  );
}

export function NubCelebration({ message, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex flex-col items-center gap-4 p-8', className)}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <NubMascot mood="excited" size="lg" animate={false} />
      </motion.div>
      <p className="text-lg font-semibold text-center">{message}</p>
    </motion.div>
  );
}

export function NubError({ title, message, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 p-8 text-center',
        className
      )}
    >
      <NubMascot mood="thinking" size="lg" />
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {message}
        </p>
        {action}
      </div>
    </div>
  );
}

export default NubMascot;
