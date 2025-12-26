import { User, Bell, Shield, Palette, Loader2, Sun, Moon, CreditCard, Key, Globe, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import { useSettings, useUpdateSettings } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const colorClasses = {
  pink: { bg: 'bg-neon-pink/20', text: 'text-neon-pink' },
  cyan: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan' },
  yellow: { bg: 'bg-neon-yellow/20', text: 'text-neon-yellow' },
  green: { bg: 'bg-neon-green/20', text: 'text-neon-green' },
  purple: { bg: 'bg-neon-purple/20', text: 'text-neon-purple' },
  orange: { bg: 'bg-neon-orange/20', text: 'text-neon-orange' },
};

const SettingSection = ({ icon: Icon, title, description, children, accentColor = 'pink', isLight }) => {
  const colors = colorClasses[accentColor];

  return (
    <NeoBrutalCard accentColor={accentColor} className="space-y-4">
      <div className="flex items-start gap-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.bg)}>
          <Icon size={24} className={colors.text} />
        </div>
        <div className="flex-1">
          <h3 className={cn('text-lg font-black', isLight ? 'text-gray-900' : 'text-white')}>
            {title}
          </h3>
          <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/60')}>
            {description}
          </p>
        </div>
      </div>
      {children && <div className="pt-2">{children}</div>}
    </NeoBrutalCard>
  );
};

const ToggleSwitch = ({ checked, onChange, disabled, isLight }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={cn(
      'relative w-12 h-6 rounded-full transition-colors',
      checked ? 'bg-neon-pink' : isLight ? 'bg-gray-200' : 'bg-white/20',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    <div
      className={cn(
        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-md',
        checked ? 'translate-x-7' : 'translate-x-1'
      )}
    />
  </button>
);

const Settings = () => {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const handleToggle = (field, currentValue) => {
    updateMutation.mutate({ [field]: !currentValue }, {
      onSuccess: () => toast.success('Settings updated'),
      onError: () => toast.error('Failed to update settings'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="text-neon-pink animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Control Room"
        title="Settings"
        subtitle="Manage your account preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingSection
          icon={User}
          title="Profile"
          description="Update your profile information and display name"
          accentColor="pink"
          isLight={isLight}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/60')}>Display name</p>
              <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                {settings?.display_name || 'Not set'}
              </p>
            </div>
            <NeoBrutalButton variant="outline" size="sm" accentColor="pink">
              Edit Profile
            </NeoBrutalButton>
          </div>
        </SettingSection>

        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Configure how you receive alerts and updates"
          accentColor="yellow"
          isLight={isLight}
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className={cn('font-medium', isLight ? 'text-gray-700' : 'text-white/80')}>
                Push notifications
              </span>
              <ToggleSwitch
                checked={settings?.push_notifications ?? true}
                onChange={() => handleToggle('push_notifications', settings?.push_notifications)}
                disabled={updateMutation.isPending}
                isLight={isLight}
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className={cn('font-medium', isLight ? 'text-gray-700' : 'text-white/80')}>
                Email notifications
              </span>
              <ToggleSwitch
                checked={settings?.email_notifications ?? true}
                onChange={() => handleToggle('email_notifications', settings?.email_notifications)}
                disabled={updateMutation.isPending}
                isLight={isLight}
              />
            </label>
          </div>
        </SettingSection>

        <SettingSection
          icon={Shield}
          title="Security"
          description="Manage your password and security settings"
          accentColor="green"
          isLight={isLight}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/60')}>Password</p>
              <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                ••••••••••••
              </p>
            </div>
            <NeoBrutalButton variant="outline" size="sm" accentColor="green">
              Change Password
            </NeoBrutalButton>
          </div>
        </SettingSection>

        <SettingSection
          icon={Palette}
          title="Appearance"
          description="Customize the look and feel of your dashboard"
          accentColor="purple"
          isLight={isLight}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-3 font-bold transition-all',
                theme === 'dark'
                  ? 'bg-neon-purple text-white border-neon-purple'
                  : isLight
                  ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                  : 'border-white/20 text-white/60 hover:border-white/40'
              )}
            >
              <Moon size={18} />
              <span>Dark</span>
            </button>
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-3 font-bold transition-all',
                theme === 'light'
                  ? 'bg-neon-purple text-white border-neon-purple'
                  : isLight
                  ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                  : 'border-white/20 text-white/60 hover:border-white/40'
              )}
            >
              <Sun size={18} />
              <span>Light</span>
            </button>
          </div>
        </SettingSection>

        <SettingSection
          icon={CreditCard}
          title="Billing"
          description="Manage your subscription and payment methods"
          accentColor="cyan"
          isLight={isLight}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/60')}>Current plan</p>
              <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                Pro <span className="text-neon-cyan text-xs ml-1">Active</span>
              </p>
            </div>
            <NeoBrutalButton variant="outline" size="sm" accentColor="cyan">
              Manage Plan
            </NeoBrutalButton>
          </div>
        </SettingSection>

        <SettingSection
          icon={Key}
          title="API Access"
          description="Manage your API keys and integrations"
          accentColor="orange"
          isLight={isLight}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/60')}>API Keys</p>
              <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                2 active keys
              </p>
            </div>
            <NeoBrutalButton variant="outline" size="sm" accentColor="orange">
              Manage Keys
            </NeoBrutalButton>
          </div>
        </SettingSection>
      </div>

      {/* Danger Zone */}
      <NeoBrutalCard className="border-red-400">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-400/20 flex items-center justify-center">
            <Zap size={24} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className={cn('text-lg font-black', isLight ? 'text-gray-900' : 'text-white')}>
              Danger Zone
            </h3>
            <p className={cn('text-sm mb-4', isLight ? 'text-gray-500' : 'text-white/60')}>
              Irreversible actions that affect your account
            </p>
            <div className="flex gap-3">
              <NeoBrutalButton
                variant="outline"
                size="sm"
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                Delete All Data
              </NeoBrutalButton>
              <NeoBrutalButton
                variant="outline"
                size="sm"
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                Delete Account
              </NeoBrutalButton>
            </div>
          </div>
        </div>
      </NeoBrutalCard>
    </div>
  );
};

export default Settings;
