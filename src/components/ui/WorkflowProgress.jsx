import { cn } from '@/lib/utils';
import { Check, Clock, Send, Calendar, Eye } from 'lucide-react';

const statusConfig = {
  draft: {
    label: 'Draft',
    icon: Clock,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400',
    neonColor: 'bg-gray-400',
  },
  pending_approval: {
    label: 'Pending Approval',
    icon: Eye,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    neonColor: 'bg-yellow-400',
  },
  approved: {
    label: 'Approved',
    icon: Check,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    neonColor: 'bg-green-400',
  },
  scheduled: {
    label: 'Scheduled',
    icon: Calendar,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    neonColor: 'bg-cyan-400',
  },
  posted: {
    label: 'Posted',
    icon: Send,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500',
    neonColor: 'bg-pink-400',
  },
};

const workflowSteps = ['draft', 'pending_approval', 'approved', 'scheduled', 'posted'];

export function WorkflowProgress({
  currentStatus,
  className,
  compact = false,
}) {
  const currentIndex = workflowSteps.indexOf(currentStatus);

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {workflowSteps.map((step, index) => {
          const isComplete = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const config = statusConfig[step];

          return (
            <div
              key={step}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                isComplete ? config.bgColor : 'bg-gray-300 dark:bg-gray-600',
                isCurrent && 'ring-2 ring-offset-2 ring-offset-background',
                isCurrent && config.color.replace('text-', 'ring-')
              )}
              title={config.label}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Progress line filled */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-pink-500 via-cyan-500 to-green-500 transition-all duration-500"
          style={{
            width: `${(currentIndex / (workflowSteps.length - 1)) * 100}%`,
          }}
        />

        {workflowSteps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const config = statusConfig[step];
          const Icon = config.icon;

          return (
            <div
              key={step}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  isComplete && `${config.bgColor} border-transparent text-white`,
                  isCurrent && `bg-background border-2 ${config.color.replace('text-', 'border-')} ${config.color}`,
                  isPending && 'bg-background border-gray-300 dark:border-gray-600 text-gray-400',
                  isCurrent && 'shadow-lg animate-neon-pulse'
                )}
                style={isCurrent ? {
                  boxShadow: `0 0 20px ${config.color.includes('pink') ? 'rgba(236, 72, 153, 0.4)' :
                    config.color.includes('cyan') ? 'rgba(34, 211, 238, 0.4)' :
                    config.color.includes('yellow') ? 'rgba(250, 204, 21, 0.4)' :
                    config.color.includes('green') ? 'rgba(34, 197, 94, 0.4)' :
                    'rgba(156, 163, 175, 0.4)'
                  }`
                } : undefined}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-2 font-medium whitespace-nowrap',
                  isCurrent ? config.color : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Inline status badge with workflow context
export function WorkflowBadge({ status, showNext = false }) {
  const config = statusConfig[status];
  const currentIndex = workflowSteps.indexOf(status);
  const nextStep = workflowSteps[currentIndex + 1];
  const nextConfig = nextStep ? statusConfig[nextStep] : null;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
          config.color,
          config.color.replace('text-', 'border-').replace('500', '500/30'),
          config.color.replace('text-', 'bg-').replace('500', '500/10')
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
      {showNext && nextConfig && (
        <span className="text-xs text-muted-foreground">
          Next: {nextConfig.label}
        </span>
      )}
    </div>
  );
}

export default WorkflowProgress;
