import { useState } from 'react';
import { Mail, Send, Users, BarChart3, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';

const mockCampaigns = [
  {
    id: 1,
    name: 'Weekly Newsletter',
    status: 'sent',
    recipients: 2450,
    openRate: '68%',
    clickRate: '24%',
    sentAt: '2 days ago',
  },
  {
    id: 2,
    name: 'New Content Alert',
    status: 'scheduled',
    recipients: 1890,
    scheduledFor: 'Tomorrow, 9:00 AM',
  },
  {
    id: 3,
    name: 'Exclusive Offer',
    status: 'draft',
    recipients: 0,
    lastEdited: '5 hours ago',
  },
];

const stats = [
  { label: 'Total Sent', value: '12.4k', icon: Send, color: 'pink' },
  { label: 'Subscribers', value: '3,892', icon: Users, color: 'cyan' },
  { label: 'Avg Open Rate', value: '64%', icon: Mail, color: 'yellow' },
  { label: 'Avg Click Rate', value: '22%', icon: BarChart3, color: 'green' },
];

const colorClasses = {
  pink: { bg: 'bg-neon-pink/20', text: 'text-neon-pink' },
  cyan: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan' },
  yellow: { bg: 'bg-neon-yellow/20', text: 'text-neon-yellow' },
  green: { bg: 'bg-neon-green/20', text: 'text-neon-green' },
};

const EmailCampaigns = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-8">
      <PageHeader
        tagline="Fan Broadcaster"
        title="Email Campaigns"
        subtitle="Reach your fans directly in their inbox"
        actions={
          <NeoBrutalButton accentColor="pink">
            <Plus size={18} />
            New Campaign
          </NeoBrutalButton>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = colorClasses[stat.color];
          return (
            <NeoBrutalCard key={stat.label} accentColor={stat.color} hover={false}>
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
                    {stat.value}
                  </p>
                </div>
              </div>
            </NeoBrutalCard>
          );
        })}
      </div>

      {/* Campaigns List */}
      <NeoBrutalCard accentColor="purple">
        <div className="flex items-center justify-between mb-6">
          <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
            Your Campaigns
          </h3>
          <div className="flex gap-2">
            {['All', 'Sent', 'Scheduled', 'Drafts'].map((filter) => (
              <button
                key={filter}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                  filter === 'All'
                    ? 'bg-neon-purple text-white'
                    : isLight
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-white/60 hover:bg-white/10'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {mockCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer',
                'hover:translate-x-1',
                isLight
                  ? 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  campaign.status === 'sent' ? 'bg-neon-green/20' :
                  campaign.status === 'scheduled' ? 'bg-neon-yellow/20' : 'bg-white/10'
                )}>
                  {campaign.status === 'sent' ? (
                    <CheckCircle size={24} className="text-neon-green" />
                  ) : campaign.status === 'scheduled' ? (
                    <Clock size={24} className="text-neon-yellow" />
                  ) : (
                    <Mail size={24} className={isLight ? 'text-gray-400' : 'text-white/40'} />
                  )}
                </div>
                <div>
                  <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                    {campaign.name}
                  </p>
                  <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                    {campaign.status === 'sent' ? `Sent ${campaign.sentAt}` :
                     campaign.status === 'scheduled' ? campaign.scheduledFor :
                     `Last edited ${campaign.lastEdited}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {campaign.status === 'sent' && (
                  <>
                    <div className="text-right">
                      <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>Open Rate</p>
                      <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>{campaign.openRate}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>Click Rate</p>
                      <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>{campaign.clickRate}</p>
                    </div>
                  </>
                )}
                <StatusBadge status={campaign.status} />
              </div>
            </div>
          ))}
        </div>
      </NeoBrutalCard>
    </div>
  );
};

export default EmailCampaigns;
