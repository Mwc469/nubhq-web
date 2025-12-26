import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const accentColors = {
  pink: {
    border: 'border-neon-pink',
    shadow: 'shadow-[4px_4px_0_var(--neon-pink)]',
    hoverShadow: 'hover:shadow-[6px_6px_0_var(--neon-pink)]',
  },
  cyan: {
    border: 'border-neon-cyan',
    shadow: 'shadow-[4px_4px_0_var(--neon-cyan)]',
    hoverShadow: 'hover:shadow-[6px_6px_0_var(--neon-cyan)]',
  },
  yellow: {
    border: 'border-neon-yellow',
    shadow: 'shadow-[4px_4px_0_var(--neon-yellow)]',
    hoverShadow: 'hover:shadow-[6px_6px_0_var(--neon-yellow)]',
  },
  green: {
    border: 'border-neon-green',
    shadow: 'shadow-[4px_4px_0_var(--neon-green)]',
    hoverShadow: 'hover:shadow-[6px_6px_0_var(--neon-green)]',
  },
  purple: {
    border: 'border-neon-purple',
    shadow: 'shadow-[4px_4px_0_var(--neon-purple)]',
    hoverShadow: 'hover:shadow-[6px_6px_0_var(--neon-purple)]',
  },
  orange: {
    border: 'border-neon-orange',
    shadow: 'shadow-[4px_4px_0_var(--neon-orange)]',
    hoverShadow: 'hover:shadow-[6px_6px_0_var(--neon-orange)]',
  },
  neutral: {
    border: 'border-black dark:border-white/20',
    shadow: 'shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_rgba(255,255,255,0.2)]',
    hoverShadow: 'hover:shadow-[6px_6px_0_#000] dark:hover:shadow-[6px_6px_0_rgba(255,255,255,0.2)]',
  },
};

export default function NeoBrutalCard({
  children,
  className,
  accentColor = 'pink',
  hover = true,
  onClick,
  ...props
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const colors = accentColors[accentColor] || accentColors.pink;

  return (
    <div
      className={cn(
        'rounded-2xl border-3 p-6 transition-all duration-200',
        isLight ? 'bg-white text-gray-900' : 'bg-gray-900 text-white',
        colors.border,
        colors.shadow,
        hover && [
          'hover:translate-x-[-2px] hover:translate-y-[-2px]',
          colors.hoverShadow,
        ],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
