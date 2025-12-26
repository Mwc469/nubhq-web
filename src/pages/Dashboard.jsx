import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import { useDashboard } from '../hooks/useApi';

const StatCard = ({ icon: Icon, label, value, trend, isLoading }) => (
  <Card className="flex items-center gap-4">
    <div className="p-3 bg-brand-orange/20 border-3 border-black">
      <Icon size={24} className="text-brand-orange" />
    </div>
    <div>
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-2xl font-bold text-white">
        {isLoading ? '...' : value}
      </p>
      {trend && (
        <p className="text-xs text-green-400 flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </p>
      )}
    </div>
  </Card>
);

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
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle}
          label="Pending Approvals"
          value={data?.pending_approvals ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          icon={Users}
          label="Active Fans"
          value={data?.active_fans?.toLocaleString() ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          icon={Clock}
          label="Avg Response Time"
          value={data?.avg_response_time ?? '-'}
          isLoading={isLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Engagement Rate"
          value={data?.engagement_rate ?? '-'}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <Card.Title>Recent Activity</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-white/50">Loading...</p>
              ) : data?.recent_activity?.length === 0 ? (
                <p className="text-white/50">No recent activity</p>
              ) : (
                data?.recent_activity?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                  >
                    <div>
                      <p className="text-white font-medium">{item.description}</p>
                      <p className="text-sm text-white/50">{item.time_ago}</p>
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
