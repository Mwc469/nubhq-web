import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const accentStyles = {
  pink: {
    solid: 'bg-neon-pink text-white border-neon-pink shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]',
    outline: 'bg-transparent text-neon-pink border-neon-pink shadow-[4px_4px_0_var(--neon-pink)] hover:shadow-[6px_6px_0_var(--neon-pink)] hover:bg-neon-pink/10',
    ghost: 'bg-transparent text-neon-pink border-transparent hover:bg-neon-pink/10',
  },
  cyan: {
    solid: 'bg-neon-cyan text-white border-neon-cyan shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]',
    outline: 'bg-transparent text-neon-cyan border-neon-cyan shadow-[4px_4px_0_var(--neon-cyan)] hover:shadow-[6px_6px_0_var(--neon-cyan)] hover:bg-neon-cyan/10',
    ghost: 'bg-transparent text-neon-cyan border-transparent hover:bg-neon-cyan/10',
  },
  yellow: {
    solid: 'bg-neon-yellow text-black border-neon-yellow shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]',
    outline: 'bg-transparent text-neon-yellow border-neon-yellow shadow-[4px_4px_0_var(--neon-yellow)] hover:shadow-[6px_6px_0_var(--neon-yellow)] hover:bg-neon-yellow/10',
    ghost: 'bg-transparent text-neon-yellow border-transparent hover:bg-neon-yellow/10',
  },
  green: {
    solid: 'bg-neon-green text-white border-neon-green shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]',
    outline: 'bg-transparent text-neon-green border-neon-green shadow-[4px_4px_0_var(--neon-green)] hover:shadow-[6px_6px_0_var(--neon-green)] hover:bg-neon-green/10',
    ghost: 'bg-transparent text-neon-green border-transparent hover:bg-neon-green/10',
  },
  purple: {
    solid: 'bg-neon-purple text-white border-neon-purple shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]',
    outline: 'bg-transparent text-neon-purple border-neon-purple shadow-[4px_4px_0_var(--neon-purple)] hover:shadow-[6px_6px_0_var(--neon-purple)] hover:bg-neon-purple/10',
    ghost: 'bg-transparent text-neon-purple border-transparent hover:bg-neon-purple/10',
  },
  orange: {
    solid: 'bg-neon-orange text-white border-neon-orange shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]',
    outline: 'bg-transparent text-neon-orange border-neon-orange shadow-[4px_4px_0_var(--neon-orange)] hover:shadow-[6px_6px_0_var(--neon-orange)] hover:bg-neon-orange/10',
    ghost: 'bg-transparent text-neon-orange border-transparent hover:bg-neon-orange/10',
  },
  neutral: {
    solid: 'bg-gray-900 text-white border-gray-900 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] dark:bg-white dark:text-gray-900 dark:border-white',
    outline: 'bg-transparent text-gray-900 border-gray-900 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-white/10',
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
