import { useTheme } from '../../contexts/ThemeContext';

export function Skeleton({ className = '', ...props }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`animate-pulse ${isLight ? 'bg-gray-200' : 'bg-white/10'} ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`border-3 border-black shadow-brutal p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="border-3 border-black shadow-brutal p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="border-3 border-black shadow-brutal p-4">
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="flex items-end gap-2 h-48">
        {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonMessage() {
  return (
    <div className="border-3 border-black shadow-brutal p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-3 h-3 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export default Skeleton;
