import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const accentColors = {
  pink: {
    border: 'border-neon-pink',
    shadow: 'shadow-brutal-pink',
    hoverShadow: 'hover:shadow-brutal-pink-lg',
  },
  cyan: {
    border: 'border-neon-cyan',
    shadow: 'shadow-brutal-cyan',
    hoverShadow: 'hover:shadow-brutal-cyan-lg',
  },
  yellow: {
    border: 'border-neon-yellow',
    shadow: 'shadow-brutal-yellow',
    hoverShadow: 'hover:shadow-brutal-yellow-lg',
  },
  green: {
    border: 'border-neon-green',
    shadow: 'shadow-brutal-green',
    hoverShadow: 'hover:shadow-brutal-green-lg',
  },
  purple: {
    border: 'border-neon-purple',
    shadow: 'shadow-brutal-purple',
    hoverShadow: 'hover:shadow-brutal-purple-lg',
  },
  orange: {
    border: 'border-neon-orange',
    shadow: 'shadow-brutal-orange',
    hoverShadow: 'hover:shadow-brutal-orange-lg',
  },
  neutral: {
    border: 'border-black dark:border-white/20',
    shadow: 'shadow-brutal dark:shadow-[4px_4px_0_rgba(255,255,255,0.2)]',
    hoverShadow: 'hover:shadow-brutal-lg dark:hover:shadow-[6px_6px_0_rgba(255,255,255,0.2)]',
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
