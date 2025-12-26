import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  PenTool,
  Calendar,
  Mail,
  Image,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { Skeleton, SkeletonStatCard, SkeletonList } from '../components/ui/Skeleton';
import { useDashboard } from '../hooks/useApi';
import { useTheme } from '../contexts/ThemeContext';

const statCards = [
  {
    key: 'pending_approvals',
    icon: CheckCircle,
    label: 'Pending Approvals',
    color: 'yellow',
    accentColor: 'yellow',
  },
  {
    key: 'active_fans',
    icon: Users,
    label: 'Active Fans',
    color: 'cyan',
    accentColor: 'cyan',
    format: (v) => v?.toLocaleString() ?? 0,
  },
  {
    key: 'avg_response_time',
    icon: Clock,
    label: 'Avg Response',
    color: 'purple',
    accentColor: 'purple',
  },
  {
    key: 'engagement_rate',
    icon: TrendingUp,
    label: 'Engagement',
    color: 'green',
    accentColor: 'green',
  },
];

const quickActions = [
  {
    label: 'Create Post',
    description: 'Craft something weird',
    icon: PenTool,
    path: '/post-studio',
    color: 'pink',
  },
  {
    label: 'Review Queue',
    description: 'Approve pending items',
    icon: CheckCircle,
    path: '/approvals',
    color: 'yellow',
  },
  {
    label: 'Schedule',
    description: 'Plan your chaos',
    icon: Calendar,
    path: '/calendar',
    color: 'purple',
  },
  {
    label: 'Media Library',
    description: 'Browse assets',
    icon: Image,
    path: '/media',
    color: 'cyan',
  },
];

const colorClasses = {
  pink: { bg: 'bg-neon-pink/20', text: 'text-neon-pink', border: 'border-neon-pink' },
  cyan: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan', border: 'border-neon-cyan' },
  yellow: { bg: 'bg-neon-yellow/20', text: 'text-neon-yellow', border: 'border-neon-yellow' },
  green: { bg: 'bg-neon-green/20', text: 'text-neon-green', border: 'border-neon-green' },
  purple: { bg: 'bg-neon-purple/20', text: 'text-neon-purple', border: 'border-neon-purple' },
  orange: { bg: 'bg-neon-orange/20', text: 'text-neon-orange', border: 'border-neon-orange' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-8">
      <PageHeader
        tagline="The Weird HQ"
        title="Dashboard"
        subtitle={today}
        actions={
          <NeoBrutalButton accentColor="pink" onClick={() => navigate('/post-studio')}>
            <Sparkles size={18} />
            Create Something
          </NeoBrutalButton>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon;
            const colors = colorClasses[stat.color];
            const value = stat.format
              ? stat.format(data?.[stat.key])
              : data?.[stat.key] ?? 0;

            return (
              <NeoBrutalCard key={stat.key} accentColor={stat.accentColor} hover={false}>
                <div className="flex items-center gap-4">
                  <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', colors.bg)}>
                    <Icon size={28} className={colors.text} />
                  </div>
                  <div>
                    <p className={cn(
                      'text-xs uppercase tracking-wider font-bold',
                      isLight ? 'text-gray-500' : 'text-white/50'
                    )}>
                      {stat.label}
                    </p>
                    <p className={cn(
                      'text-3xl font-black',
                      isLight ? 'text-gray-900' : 'text-white'
                    )}>
                      {value}
                    </p>
                  </div>
                </div>
              </NeoBrutalCard>
            );
          })
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeoBrutalCard accentColor="pink">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
                Engagement Rate
              </h3>
              <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                Last 7 days vs previous
              </p>
            </div>
            <div className={cn(
              'px-3 py-1 rounded-lg text-xs font-bold',
              'bg-neon-green/20 text-neon-green'
            )}>
              +12.5%
            </div>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-end gap-2">
              {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data?.engagement_chart || []}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E91E8C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke={isLight ? '#00000040' : '#ffffff40'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isLight ? '#00000040' : '#ffffff40'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#fff' : '#1a1a1b',
                    border: '3px solid #E91E8C',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 0 #E91E8C',
                  }}
                  labelStyle={{ color: isLight ? '#000' : '#fff', fontWeight: 'bold' }}
                  itemStyle={{ color: '#E91E8C' }}
                />
                <Area
                  type="monotone"
                  dataKey="prev"
                  stroke={isLight ? '#00000020' : '#ffffff20'}
                  fill="transparent"
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#E91E8C"
                  fill="url(#engagementGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </NeoBrutalCard>

        <NeoBrutalCard accentColor="cyan">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
                Messages This Week
              </h3>
              <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                Daily message volume
              </p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-end gap-2">
              {[50, 75, 60, 90, 70, 85, 65].map((h, i) => (
                <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data?.messages_chart || []}>
                <XAxis
                  dataKey="name"
                  stroke={isLight ? '#00000040' : '#ffffff40'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isLight ? '#00000040' : '#ffffff40'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#fff' : '#1a1a1b',
                    border: '3px solid #00D4D4',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 0 #00D4D4',
                  }}
                  labelStyle={{ color: isLight ? '#000' : '#fff', fontWeight: 'bold' }}
                  itemStyle={{ color: '#00D4D4' }}
                />
                <Bar dataKey="value" fill="#00D4D4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </NeoBrutalCard>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <NeoBrutalCard accentColor="purple">
            <h3 className={cn('font-black text-lg mb-4', isLight ? 'text-gray-900' : 'text-white')}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const colors = colorClasses[action.color];
                return (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                      'hover:translate-x-1',
                      isLight
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.bg)}>
                      <Icon size={20} className={colors.text} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                        {action.label}
                      </p>
                      <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight size={16} className={cn(isLight ? 'text-gray-400' : 'text-white/40')} />
                  </button>
                );
              })}
            </div>
          </NeoBrutalCard>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <NeoBrutalCard accentColor="green">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-neon-green" />
                <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
                  Recent Activity
                </h3>
              </div>
              <button
                onClick={() => navigate('/activity')}
                className="text-xs font-bold text-neon-green hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                <SkeletonList count={4} />
              ) : data?.recent_activity?.length === 0 ? (
                <div className={cn(
                  'text-center py-8',
                  isLight ? 'text-gray-500' : 'text-white/50'
                )}>
                  <Activity size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="font-bold">No recent activity</p>
                  <p className="text-xs opacity-60">Get started by creating some content</p>
                </div>
              ) : (
                data?.recent_activity?.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl',
                      isLight ? 'bg-gray-50' : 'bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        item.status === 'Completed' ? 'bg-neon-green' :
                        item.status === 'Pending' ? 'bg-neon-yellow' : 'bg-red-400'
                      )} />
                      <div>
                        <p className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                          {item.description}
                        </p>
                        <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                          {item.time_ago}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={item.status?.toLowerCase()} showIcon={false} />
                  </div>
                ))
              )}
            </div>
          </NeoBrutalCard>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <NeoBrutalCard accentColor="orange">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-neon-orange" />
            <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
              Upcoming This Week
            </h3>
          </div>
          <NeoBrutalButton
            variant="outline"
            size="sm"
            accentColor="orange"
            onClick={() => navigate('/calendar')}
          >
            View Calendar
          </NeoBrutalButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { day: 'Today', items: 3, color: 'pink' },
            { day: 'Tomorrow', items: 2, color: 'cyan' },
            { day: 'This Week', items: 7, color: 'purple' },
          ].map((period) => {
            const colors = colorClasses[period.color];
            return (
              <div
                key={period.day}
                className={cn(
                  'p-4 rounded-xl border-2',
                  isLight ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/5'
                )}
              >
                <p className={cn('text-xs uppercase tracking-wider font-bold mb-1', colors.text)}>
                  {period.day}
                </p>
                <p className={cn('text-2xl font-black', isLight ? 'text-gray-900' : 'text-white')}>
                  {period.items} <span className="text-sm font-bold opacity-50">items</span>
                </p>
              </div>
            );
          })}
        </div>
      </NeoBrutalCard>
    </div>
  );
};

export default Dashboard;
