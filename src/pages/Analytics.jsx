import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import { useTheme } from '../contexts/ThemeContext';

const timeRanges = ['7D', '30D', '90D', '1Y'];

const stats = [
  { label: 'Total Followers', value: '24.5K', change: '+12.3%', trend: 'up', icon: Users, color: 'pink' },
  { label: 'Total Revenue', value: '$8,420', change: '+8.7%', trend: 'up', icon: DollarSign, color: 'green' },
  { label: 'Post Impressions', value: '156K', change: '+24.1%', trend: 'up', icon: Eye, color: 'cyan' },
  { label: 'Engagement Rate', value: '8.4%', change: '-2.1%', trend: 'down', icon: Heart, color: 'yellow' },
];

const engagementData = [
  { name: 'Mon', likes: 2400, comments: 400, shares: 240 },
  { name: 'Tue', likes: 1398, comments: 310, shares: 139 },
  { name: 'Wed', likes: 9800, comments: 900, shares: 980 },
  { name: 'Thu', likes: 3908, comments: 480, shares: 390 },
  { name: 'Fri', likes: 4800, comments: 580, shares: 480 },
  { name: 'Sat', likes: 3800, comments: 430, shares: 380 },
  { name: 'Sun', likes: 4300, comments: 520, shares: 430 },
];

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

const platformData = [
  { name: 'Instagram', value: 45, color: '#E91E8C' },
  { name: 'Twitter', value: 25, color: '#00D4D4' },
  { name: 'YouTube', value: 20, color: '#E6C700' },
  { name: 'TikTok', value: 10, color: '#9B30FF' },
];

const colorClasses = {
  pink: { bg: 'bg-neon-pink/20', text: 'text-neon-pink' },
  cyan: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan' },
  yellow: { bg: 'bg-neon-yellow/20', text: 'text-neon-yellow' },
  green: { bg: 'bg-neon-green/20', text: 'text-neon-green' },
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30D');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-8">
      <PageHeader
        tagline="Data Dive"
        title="Analytics"
        subtitle="Track your growth and performance"
        actions={
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex rounded-xl border-2 overflow-hidden',
              isLight ? 'border-gray-200' : 'border-white/20'
            )}>
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold transition-colors',
                    timeRange === range
                      ? 'bg-neon-pink text-white'
                      : isLight ? 'text-gray-500 hover:bg-gray-100' : 'text-white/50 hover:bg-white/10'
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
            <NeoBrutalButton variant="outline" accentColor="pink">
              <Calendar size={18} />
              Custom Range
            </NeoBrutalButton>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = colorClasses[stat.color];
          return (
            <NeoBrutalCard key={stat.label} accentColor={stat.color} hover={false}>
              <div className="flex items-start justify-between">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.bg)}>
                  <Icon size={24} className={colors.text} />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg',
                  stat.trend === 'up' ? 'bg-neon-green/20 text-neon-green' : 'bg-red-400/20 text-red-400'
                )}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className={cn('text-3xl font-black', isLight ? 'text-gray-900' : 'text-white')}>
                  {stat.value}
                </p>
                <p className={cn('text-xs uppercase tracking-wider font-bold', isLight ? 'text-gray-500' : 'text-white/50')}>
                  {stat.label}
                </p>
              </div>
            </NeoBrutalCard>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <NeoBrutalCard accentColor="pink">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
                Engagement Overview
              </h3>
              <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                Likes, comments, and shares
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.3} />
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
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#E91E8C"
                fill="url(#likesGradient)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="comments"
                stroke="#00D4D4"
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="shares"
                stroke="#E6C700"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-pink" />
              <span className={cn('text-xs font-bold', isLight ? 'text-gray-600' : 'text-white/60')}>Likes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-cyan" />
              <span className={cn('text-xs font-bold', isLight ? 'text-gray-600' : 'text-white/60')}>Comments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-yellow" />
              <span className={cn('text-xs font-bold', isLight ? 'text-gray-600' : 'text-white/60')}>Shares</span>
            </div>
          </div>
        </NeoBrutalCard>

        {/* Revenue Chart */}
        <NeoBrutalCard accentColor="green">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
                Revenue Growth
              </h3>
              <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                Monthly earnings trend
              </p>
            </div>
            <div className={cn(
              'px-3 py-1 rounded-lg text-xs font-bold',
              'bg-neon-green/20 text-neon-green'
            )}>
              +24.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
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
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isLight ? '#fff' : '#1a1a1b',
                  border: '3px solid #32CD32',
                  borderRadius: '12px',
                  boxShadow: '4px 4px 0 #32CD32',
                }}
                labelStyle={{ color: isLight ? '#000' : '#fff', fontWeight: 'bold' }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Bar dataKey="value" fill="#32CD32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </NeoBrutalCard>
      </div>

      {/* Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeoBrutalCard accentColor="purple">
          <h3 className={cn('font-black text-lg mb-4', isLight ? 'text-gray-900' : 'text-white')}>
            Platform Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {platformData.map((platform) => (
              <div key={platform.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                <span className={cn('text-xs font-bold', isLight ? 'text-gray-600' : 'text-white/60')}>
                  {platform.name} ({platform.value}%)
                </span>
              </div>
            ))}
          </div>
        </NeoBrutalCard>

        <div className="lg:col-span-2">
          <NeoBrutalCard accentColor="cyan">
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
                Top Performing Posts
              </h3>
              <NeoBrutalButton variant="outline" size="sm" accentColor="cyan">
                View All
              </NeoBrutalButton>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Behind the scenes 📸', engagement: '12.4K', platform: 'Instagram' },
                { title: 'Q&A Session highlights', engagement: '8.9K', platform: 'Twitter' },
                { title: 'New collection reveal!', engagement: '7.2K', platform: 'TikTok' },
              ].map((post, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl',
                    isLight ? 'bg-gray-50' : 'bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center font-black',
                      'bg-neon-pink/20 text-neon-pink'
                    )}>
                      #{i + 1}
                    </div>
                    <div>
                      <p className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                        {post.title}
                      </p>
                      <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                        {post.platform}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-neon-green font-bold">
                    <Heart size={14} />
                    {post.engagement}
                  </div>
                </div>
              ))}
            </div>
          </NeoBrutalCard>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
