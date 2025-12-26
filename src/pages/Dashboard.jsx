import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <Card className="flex items-center gap-4">
    <div className="p-3 bg-brand-orange/20 border-3 border-black">
      <Icon size={24} className="text-brand-orange" />
    </div>
    <div>
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend && (
        <p className="text-xs text-green-400 flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </p>
      )}
    </div>
  </Card>
);

const Dashboard = () => {
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
          value="12"
          trend="+3 today"
        />
        <StatCard
          icon={Users}
          label="Active Fans"
          value="1,234"
          trend="+5.2%"
        />
        <StatCard
          icon={Clock}
          label="Avg Response Time"
          value="2.4h"
        />
        <StatCard
          icon={TrendingUp}
          label="Engagement Rate"
          value="89%"
          trend="+12%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <Card.Title>Recent Activity</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">New message approved</p>
                    <p className="text-sm text-white/50">2 hours ago</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-white/5 border-3 border-black shadow-brutal hover:bg-white/10 transition-colors text-left">
                <CheckCircle size={24} className="text-brand-orange mb-2" />
                <p className="font-medium text-white">Review Queue</p>
                <p className="text-xs text-white/50">12 pending</p>
              </button>
              <button className="p-4 bg-white/5 border-3 border-black shadow-brutal hover:bg-white/10 transition-colors text-left">
                <Users size={24} className="text-brand-orange mb-2" />
                <p className="font-medium text-white">Fan Messages</p>
                <p className="text-xs text-white/50">5 unread</p>
              </button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
