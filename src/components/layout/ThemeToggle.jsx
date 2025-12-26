import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle({ variant = 'default' }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all',
          isLight
            ? 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
        )}
        title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {isLight ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-xl border-3 transition-all',
        'hover:translate-x-[-2px] hover:translate-y-[-2px]',
        isLight
          ? 'bg-gray-100 border-gray-300 text-gray-600 shadow-[4px_4px_0_#d1d5db] hover:shadow-[6px_6px_0_#d1d5db]'
          : 'bg-white/5 border-white/20 text-white/60 shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0_rgba(255,255,255,0.1)]'
      )}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
