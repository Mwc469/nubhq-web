import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

export default function PageHeader({
  tagline,
  title,
  subtitle,
  actions,
  className,
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {tagline && (
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-neon-pink mb-1">
              {tagline}
            </p>
          )}
          <h1 className={cn(
            'text-3xl md:text-4xl font-black tracking-tight',
            isLight ? 'text-gray-900' : 'text-white'
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              'mt-2 text-base',
              isLight ? 'text-gray-600' : 'text-white/60'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
