import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      {Icon && (
        <div className="mb-4">
          <Icon
            size={48}
            className="text-neon-pink opacity-60"
          />
        </div>
      )}
      <h3
        className={cn(
          'text-xl font-bold mb-2',
          isLight ? 'text-gray-900' : 'text-white'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'text-sm max-w-md mb-6',
            isLight ? 'text-gray-600' : 'text-white/60'
          )}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
