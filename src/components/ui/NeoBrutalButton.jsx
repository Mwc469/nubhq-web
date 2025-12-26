import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const accentStyles = {
  pink: {
    solid: 'bg-neon-pink text-white border-neon-pink shadow-brutal hover:shadow-brutal-lg',
    outline: 'bg-transparent text-neon-pink border-neon-pink shadow-brutal-pink hover:shadow-brutal-pink-lg hover:bg-neon-pink/10',
    ghost: 'bg-transparent text-neon-pink border-transparent hover:bg-neon-pink/10',
  },
  cyan: {
    solid: 'bg-neon-cyan text-white border-neon-cyan shadow-brutal hover:shadow-brutal-lg',
    outline: 'bg-transparent text-neon-cyan border-neon-cyan shadow-brutal-cyan hover:shadow-brutal-cyan-lg hover:bg-neon-cyan/10',
    ghost: 'bg-transparent text-neon-cyan border-transparent hover:bg-neon-cyan/10',
  },
  yellow: {
    solid: 'bg-neon-yellow text-black border-neon-yellow shadow-brutal hover:shadow-brutal-lg',
    outline: 'bg-transparent text-neon-yellow border-neon-yellow shadow-brutal-yellow hover:shadow-brutal-yellow-lg hover:bg-neon-yellow/10',
    ghost: 'bg-transparent text-neon-yellow border-transparent hover:bg-neon-yellow/10',
  },
  green: {
    solid: 'bg-neon-green text-white border-neon-green shadow-brutal hover:shadow-brutal-lg',
    outline: 'bg-transparent text-neon-green border-neon-green shadow-brutal-green hover:shadow-brutal-green-lg hover:bg-neon-green/10',
    ghost: 'bg-transparent text-neon-green border-transparent hover:bg-neon-green/10',
  },
  purple: {
    solid: 'bg-neon-purple text-white border-neon-purple shadow-brutal hover:shadow-brutal-lg',
    outline: 'bg-transparent text-neon-purple border-neon-purple shadow-brutal-purple hover:shadow-brutal-purple-lg hover:bg-neon-purple/10',
    ghost: 'bg-transparent text-neon-purple border-transparent hover:bg-neon-purple/10',
  },
  orange: {
    solid: 'bg-neon-orange text-white border-neon-orange shadow-brutal hover:shadow-brutal-lg',
    outline: 'bg-transparent text-neon-orange border-neon-orange shadow-brutal-orange hover:shadow-brutal-orange-lg hover:bg-neon-orange/10',
    ghost: 'bg-transparent text-neon-orange border-transparent hover:bg-neon-orange/10',
  },
  neutral: {
    solid: 'bg-gray-900 text-white border-gray-900 shadow-brutal hover:shadow-brutal-lg dark:bg-white dark:text-gray-900 dark:border-white',
    outline: 'bg-transparent text-gray-900 border-gray-900 shadow-brutal hover:shadow-brutal-lg hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-white/10',
    ghost: 'bg-transparent text-gray-900 border-transparent hover:bg-gray-100 dark:text-white dark:hover:bg-white/10',
  },
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

const NeoBrutalButton = forwardRef(({
  children,
  variant = 'solid',
  size = 'md',
  accentColor = 'pink',
  className,
  disabled,
  ...props
}, ref) => {
  const colors = accentStyles[accentColor] || accentStyles.pink;
  const variantStyle = colors[variant] || colors.solid;

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-xl border-3 transition-all duration-150',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2',
        'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        'hover:translate-x-[-2px] hover:translate-y-[-2px]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none',
        sizes[size],
        variantStyle,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

NeoBrutalButton.displayName = 'NeoBrutalButton';

export default NeoBrutalButton;
