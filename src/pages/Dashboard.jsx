import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
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
import Card from '../components/ui/Card';
import { Skeleton, SkeletonStatCard, SkeletonList } from '../components/ui/Skeleton';
import { useDashboard } from '../hooks/useApi';
import { useTheme } from '../contexts/ThemeContext';

const StatCard = ({ icon: Icon, label, value, trend }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-brand-orange/20 border-3 border-black">
        <Icon size={24} className="text-brand-orange" />
      </div>
      <div>
        <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/60'}`}>{label}</p>
        <p className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
          {value}
        </p>
        {trend && (
          <p className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`text-xs px-2 py-1 border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Dashboard</h1>
        <p className={`mt-1 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          <>
            <StatCard
              icon={CheckCircle}
              label="Pending Approvals"
              value={data?.pending_approvals ?? 0}
            />
            <StatCard
              icon={Users}
              label="Active Fans"
              value={data?.active_fans?.toLocaleString() ?? 0}
            />
            <StatCard
              icon={Clock}
              label="Avg Response Time"
              value={data?.avg_response_time ?? '-'}
            />
            <StatCard
              icon={TrendingUp}
              label="Engagement Rate"
              value={data?.engagement_rate ?? '-'}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <Card.Title>Engagement Rate</Card.Title>
          </Card.Header>
          <Card.Content>
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
                      <stop offset="5%" stopColor="#a76d24" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a76d24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke={isLight ? '#00000050' : '#ffffff50'} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={isLight ? '#00000050' : '#ffffff50'} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: isLight ? '#fff' : '#262729', border: '3px solid #000', borderRadius: 0 }}
                    labelStyle={{ color: isLight ? '#000' : '#fff' }}
                    itemStyle={{ color: '#a76d24' }}
                  />
                  <Area type="monotone" dataKey="prev" stroke={isLight ? '#00000030' : '#ffffff30'} fill="transparent" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="value" stroke="#a76d24" fill="url(#engagementGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Messages This Week</Card.Title>
          </Card.Header>
          <Card.Content>
            {isLoading ? (
              <div className="h-48 flex items-end gap-2">
                {[50, 75, 60, 90, 70, 85, 65].map((h, i) => (
                  <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.messages_chart || []}>
                  <XAxis dataKey="name" stroke={isLight ? '#00000050' : '#ffffff50'} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={isLight ? '#00000050' : '#ffffff50'} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: isLight ? '#fff' : '#262729', border: '3px solid #000', borderRadius: 0 }}
                    labelStyle={{ color: isLight ? '#000' : '#fff' }}
                    itemStyle={{ color: '#a76d24' }}
                  />
                  <Bar dataKey="value" fill="#a76d24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <Card.Title>Recent Activity</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {isLoading ? (
                <SkeletonList count={4} />
              ) : data?.recent_activity?.length === 0 ? (
                <p className={isLight ? 'text-gray-500' : 'text-white/50'}>No recent activity</p>
              ) : (
                data?.recent_activity?.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between py-2 border-b last:border-0 ${isLight ? 'border-gray-100' : 'border-white/10'}`}
                  >
                    <div>
                      <p className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>{item.description}</p>
                      <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/50'}`}>{item.time_ago}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))
              )}
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/approvals')}
                className="p-4 bg-white/5 border-3 border-black shadow-brutal hover:bg-white/10 transition-colors text-left"
              >
                <CheckCircle size={24} className="text-brand-orange mb-2" />
                <p className="font-medium text-white">Review Queue</p>
                <p className="text-xs text-white/50">
                  {data?.pending_approvals ?? 0} pending
                </p>
              </button>
              <button
                onClick={() => navigate('/fan-mail')}
                className="p-4 bg-white/5 border-3 border-black shadow-brutal hover:bg-white/10 transition-colors text-left"
              >
                <Users size={24} className="text-brand-orange mb-2" />
                <p className="font-medium text-white">Fan Messages</p>
                <p className="text-xs text-white/50">View all</p>
              </button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
