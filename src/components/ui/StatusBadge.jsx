import { cn } from '../../lib/utils';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  FileText,
  Loader2
} from 'lucide-react';

const statusConfig = {
  // Post/Content statuses
  draft: {
    label: 'Draft',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: FileText,
  },
  pending: {
    label: 'Pending',
    color: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
    icon: Clock,
  },
  pending_approval: {
    label: 'Pending Approval',
    color: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    icon: Clock,
  },
  published: {
    label: 'Published',
    color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    icon: CheckCircle,
  },
  sent: {
    label: 'Sent',
    color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    icon: Send,
  },

  // Video project statuses
  concept: {
    label: 'Concept',
    color: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    icon: FileText,
  },
  pre_production: {
    label: 'Pre-Production',
    color: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    icon: Clock,
  },
  filming: {
    label: 'Filming',
    color: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
    icon: Loader2,
  },
  editing: {
    label: 'Editing',
    color: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
    icon: Loader2,
  },
  review: {
    label: 'Review',
    color: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
    icon: Clock,
  },
  final: {
    label: 'Final',
    color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    icon: CheckCircle,
  },

  // Priority levels
  high: {
    label: 'High',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: AlertTriangle,
  },
  medium: {
    label: 'Medium',
    color: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
    icon: AlertTriangle,
  },
  low: {
    label: 'Low',
    color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    icon: null,
  },

  // Render job statuses
  queued: {
    label: 'Queued',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    color: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    icon: Loader2,
  },
  completed: {
    label: 'Completed',
    color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
  },

  // Event statuses
  planned: {
    label: 'Planned',
    color: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    icon: Clock,
  },
  active: {
    label: 'Active',
    color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
    icon: CheckCircle,
  },
};

export default function StatusBadge({
  status,
  showIcon = true,
  className
}) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: null,
  };

  const Icon = config.icon;
  const isSpinning = Icon === Loader2;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border',
        config.color,
        className
      )}
    >
      {showIcon && Icon && (
        <Icon
          size={12}
          className={isSpinning ? 'animate-spin' : ''}
        />
      )}
      {config.label}
    </span>
  );
}
