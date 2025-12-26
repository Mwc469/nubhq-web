/**
 * GameTile - Interactive game action tiles for the hub
 * Neo-brutal style cards that invite interaction
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../../lib/soundSystem';
import { haptic } from '../mobile/MobileComponents';

const COLOR_VARIANTS = {
  pink: {
    bg: 'bg-neon-pink',
    shadow: 'shadow-brutal-pink',
    hoverShadow: 'hover:shadow-brutal-pink',
    glow: 'rgba(233, 30, 140, 0.4)',
  },
  cyan: {
    bg: 'bg-neon-cyan',
    shadow: 'shadow-brutal-cyan',
    hoverShadow: 'hover:shadow-brutal-cyan',
    glow: 'rgba(0, 212, 212, 0.4)',
  },
  purple: {
    bg: 'bg-neon-purple',
    shadow: 'shadow-brutal-purple',
    hoverShadow: 'hover:shadow-brutal-purple',
    glow: 'rgba(155, 48, 255, 0.4)',
  },
  orange: {
    bg: 'bg-brand-orange',
    shadow: 'shadow-brutal-orange',
    hoverShadow: 'hover:shadow-brutal-orange',
    glow: 'rgba(167, 109, 36, 0.4)',
  },
  yellow: {
    bg: 'bg-neon-yellow',
    shadow: 'shadow-brutal-yellow',
    hoverShadow: 'hover:shadow-brutal-yellow',
    glow: 'rgba(230, 199, 0, 0.4)',
  },
  green: {
    bg: 'bg-neon-green',
    shadow: 'shadow-brutal-green',
    hoverShadow: 'hover:shadow-brutal-green',
    glow: 'rgba(50, 205, 50, 0.4)',
  },
};

export default function GameTile({
  title,
  count = 0,
  icon: Icon,
  color = 'pink',
  xpReward = 10,
  route,
  description,
  disabled = false,
  onClick,
}) {
  const navigate = useNavigate();
  const colorConfig = COLOR_VARIANTS[color] || COLOR_VARIANTS.pink;

  const handleClick = () => {
    if (disabled) return;

    haptic?.('medium');
    playSound('tap');

    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative w-full p-4 md:p-5 rounded-xl
        bg-white dark:bg-brand-dark
        border-3 border-black
        ${colorConfig.shadow}
        transition-all duration-150 ease-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        text-left overflow-hidden group
      `}
      whileHover={disabled ? {} : {
        y: -4,
        x: -4,
        transition: { duration: 0.15 },
      }}
      whileTap={disabled ? {} : {
        y: 2,
        x: 2,
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
    >
      {/* Background accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${colorConfig.bg} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-300`}
      />

      {/* Icon */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-2 rounded-lg ${colorConfig.bg} border-2 border-black`}
        >
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>

        {/* Count badge */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              px-2.5 py-1 rounded-full
              ${colorConfig.bg} border-2 border-black
              text-white font-bold text-sm
            `}
          >
            {count}
          </motion.div>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-lg font-bold text-gray-900 dark:text-white mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {description}
        </p>
      )}

      {/* XP reward hint */}
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <span className="text-yellow-500">⚡</span>
        <span>+{xpReward} XP per action</span>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          boxShadow: `inset 0 0 30px ${colorConfig.glow}`,
        }}
      />
    </motion.button>
  );
}

// Compact version for secondary actions
export function GameTileCompact({
  title,
  icon: Icon,
  color = 'orange',
  route,
  onClick,
}) {
  const navigate = useNavigate();
  const colorConfig = COLOR_VARIANTS[color] || COLOR_VARIANTS.orange;

  const handleClick = () => {
    haptic?.('light');
    playSound('tap');

    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        flex items-center gap-3 w-full p-3 rounded-lg
        bg-white dark:bg-brand-dark
        border-2 border-black shadow-brutal-sm
        transition-all duration-150
      `}
      whileHover={{ y: -2, x: -2 }}
      whileTap={{ y: 1, x: 1, scale: 0.98 }}
    >
      <div className={`p-1.5 rounded ${colorConfig.bg}`}>
        {Icon && <Icon className="w-4 h-4 text-white" />}
      </div>
      <span
        className="font-medium text-gray-800 dark:text-white text-sm"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {title}
      </span>
    </motion.button>
  );
}
