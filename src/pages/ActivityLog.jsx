import { useState } from 'react';
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Bot,
  Filter,
  Search,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';

const activityTypes = ['All', 'Posts', 'Messages', 'Approvals', 'AI Actions', 'System'];

const mockActivities = [
  {
    id: 1,
    type: 'approval',
    action: 'Message approved',
    description: 'Reply to @superfan123 approved and sent',
    actor: 'You',
    actorType: 'user',
    status: 'completed',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    type: 'ai',
    action: 'AI generated response',
    description: 'Created reply for message from @newbie_fan',
    actor: 'Nub AI',
    actorType: 'ai',
    status: 'pending',
    timestamp: '15 minutes ago',
  },
  {
    id: 3,
    type: 'post',
    action: 'Post scheduled',
    description: 'Instagram post scheduled for tomorrow at 2:00 PM',
    actor: 'You',
    actorType: 'user',
    status: 'scheduled',
    timestamp: '1 hour ago',
  },
  {
    id: 4,
    type: 'message',
    action: 'New fan message',
    description: 'Received message from @loyal_supporter',
    actor: 'System',
    actorType: 'system',
    status: 'completed',
    timestamp: '2 hours ago',
  },
  {
    id: 5,
    type: 'approval',
    action: 'Message rejected',
    description: 'Reply to @spam_user rejected',
    actor: 'You',
    actorType: 'user',
    status: 'rejected',
    timestamp: '3 hours ago',
  },
  {
    id: 6,
    type: 'ai',
    action: 'AI training updated',
    description: 'Voice profile updated with 5 new samples',
    actor: 'Nub AI',
    actorType: 'ai',
    status: 'completed',
    timestamp: '5 hours ago',
  },
  {
    id: 7,
    type: 'post',
    action: 'Post published',
    description: 'Twitter post "Behind the scenes 📸" went live',
    actor: 'System',
    actorType: 'system',
    status: 'completed',
    timestamp: '1 day ago',
  },
  {
    id: 8,
    type: 'system',
    action: 'System backup',
    description: 'Daily backup completed successfully',
    actor: 'System',
    actorType: 'system',
    status: 'completed',
    timestamp: '1 day ago',
  },
];

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  rejected: XCircle,
  scheduled: Calendar,
};

const statusColors = {
  completed: 'text-neon-green',
  pending: 'text-neon-yellow',
  rejected: 'text-red-400',
  scheduled: 'text-neon-purple',
};

const actorIcons = {
  user: User,
  ai: Bot,
  system: Activity,
};

const ActivityLog = () => {
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesType = activeType === 'All' ||
      (activeType === 'Posts' && activity.type === 'post') ||
      (activeType === 'Messages' && activity.type === 'message') ||
      (activeType === 'Approvals' && activity.type === 'approval') ||
      (activeType === 'AI Actions' && activity.type === 'ai') ||
      (activeType === 'System' && activity.type === 'system');

    const matchesSearch = activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        tagline="Time Machine"
        title="Activity Log"
        subtitle="Everything that's happened in your world"
        actions={
          <NeoBrutalButton variant="outline" accentColor="green">
            <Calendar size={18} />
            Export Log
          </NeoBrutalButton>
        }
      />

      {/* Filters */}
      <NeoBrutalCard accentColor="green">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all border-2',
                  activeType === type
                    ? 'bg-neon-green text-black border-neon-green'
                    : isLight
                    ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                    : 'border-white/20 text-white/60 hover:border-white/40'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border-2',
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
          )}>
            <Search size={18} className={isLight ? 'text-gray-400' : 'text-white/40'} />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'bg-transparent outline-none text-sm w-48',
                isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-white/40'
              )}
            />
          </div>
        </div>
      </NeoBrutalCard>

      {/* Activity List */}
      <NeoBrutalCard accentColor="purple">
        <div className="space-y-1">
          {filteredActivities.map((activity, index) => {
            const StatusIcon = statusIcons[activity.status];
            const ActorIcon = actorIcons[activity.actorType];
            const isLast = index === filteredActivities.length - 1;

            return (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    activity.actorType === 'ai' ? 'bg-neon-pink/20' :
                    activity.actorType === 'user' ? 'bg-neon-cyan/20' : 'bg-white/10'
                  )}>
                    <ActorIcon
                      size={20}
                      className={
                        activity.actorType === 'ai' ? 'text-neon-pink' :
                        activity.actorType === 'user' ? 'text-neon-cyan' :
                        isLight ? 'text-gray-400' : 'text-white/40'
                      }
                    />
                  </div>
                  {!isLast && (
                    <div className={cn(
                      'w-0.5 flex-1 my-2',
                      isLight ? 'bg-gray-200' : 'bg-white/10'
                    )} />
                  )}
                </div>

                {/* Content */}
                <div className={cn(
                  'flex-1 pb-6',
                  isLast && 'pb-0'
                )}>
                  <div className={cn(
                    'p-4 rounded-xl border-2 transition-all',
                    isLight
                      ? 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  )}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                            {activity.action}
                          </p>
                          <StatusIcon size={16} className={statusColors[activity.status]} />
                        </div>
                        <p className={cn('text-sm', isLight ? 'text-gray-600' : 'text-white/70')}>
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={cn('text-xs', isLight ? 'text-gray-400' : 'text-white/40')}>
                            by {activity.actor}
                          </span>
                          <span className={cn('text-xs', isLight ? 'text-gray-400' : 'text-white/40')}>
                            •
                          </span>
                          <span className={cn('text-xs', isLight ? 'text-gray-400' : 'text-white/40')}>
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={activity.status} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className={cn('text-center py-12', isLight ? 'text-gray-500' : 'text-white/50')}>
            <Activity size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-bold text-lg mb-1">No activity found</p>
            <p className="text-sm opacity-60">Try adjusting your filters</p>
          </div>
        )}

        {filteredActivities.length > 0 && (
          <div className="mt-6 text-center">
            <NeoBrutalButton variant="outline" accentColor="purple">
              <ChevronDown size={18} />
              Load More
            </NeoBrutalButton>
          </div>
        )}
      </NeoBrutalCard>
    </div>
  );
};

export default ActivityLog;
