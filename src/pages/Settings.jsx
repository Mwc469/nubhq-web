import { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Loader2, Sun, Moon, CreditCard, Key, Globe, Zap, Volume2, VolumeX, Vibrate, Sparkles, Gamepad2 } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import { useSettings, useUpdateSettings } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { playSound } from '../lib/soundSystem';
import { useInteraction } from '../hooks/useInteraction';

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
  const { tap } = useInteraction();

  // Local game settings (stored in localStorage)
  const [gameSettings, setGameSettings] = useState(() => {
    const saved = localStorage.getItem('nub_game_settings');
    return saved ? JSON.parse(saved) : {
      soundEnabled: true,
      hapticsEnabled: true,
      showPortal: true,
      cosmicBackground: 'subtle',
    };
  });

  useEffect(() => {
    localStorage.setItem('nub_game_settings', JSON.stringify(gameSettings));
  }, [gameSettings]);

  const handleToggle = (field, currentValue) => {
    tap();
    updateMutation.mutate({ [field]: !currentValue }, {
      onSuccess: () => toast.success('Settings updated'),
      onError: () => toast.error('Failed to update settings'),
    });
  };

  const handleGameToggle = (field, currentValue) => {
    playSound('tap');
    setGameSettings(prev => ({ ...prev, [field]: !currentValue }));
    toast.success(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${!currentValue ? 'enabled' : 'disabled'}`);
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
        tagline="Tweak Your Universe"
        title="Settings"
        subtitle="Customize your NUB experience"
      />

      {/* Game & Portal Settings - Featured at top */}
      <NeoBrutalCard accentColor="purple" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-pink/5" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
              <Gamepad2 size={24} className="text-neon-purple" />
            </div>
            <div className="flex-1">
              <h3 className={cn('text-lg font-black', isLight ? 'text-gray-900' : 'text-white')}>
                Portal & Game Settings
              </h3>
              <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/60')}>
                Make NUB as chaotic or calm as you desire
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                {gameSettings.soundEnabled ? <Volume2 size={20} className="text-neon-cyan" /> : <VolumeX size={20} className="text-white/40" />}
                <span className={cn('font-medium', isLight ? 'text-gray-700' : 'text-white/80')}>
                  Sound Effects
                </span>
              </div>
              <ToggleSwitch
                checked={gameSettings.soundEnabled}
                onChange={() => handleGameToggle('soundEnabled', gameSettings.soundEnabled)}
                isLight={isLight}
              />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Vibrate size={20} className={gameSettings.hapticsEnabled ? 'text-neon-pink' : 'text-white/40'} />
                <span className={cn('font-medium', isLight ? 'text-gray-700' : 'text-white/80')}>
                  Haptic Vibes
                </span>
              </div>
              <ToggleSwitch
                checked={gameSettings.hapticsEnabled}
                onChange={() => handleGameToggle('hapticsEnabled', gameSettings.hapticsEnabled)}
                isLight={isLight}
              />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className={gameSettings.showPortal ? 'text-neon-yellow' : 'text-white/40'} />
                <span className={cn('font-medium', isLight ? 'text-gray-700' : 'text-white/80')}>
                  Portal Entry
                </span>
              </div>
              <ToggleSwitch
                checked={gameSettings.showPortal}
                onChange={() => handleGameToggle('showPortal', gameSettings.showPortal)}
                isLight={isLight}
              />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Globe size={20} className={gameSettings.cosmicBackground !== 'off' ? 'text-neon-green' : 'text-white/40'} />
                <span className={cn('font-medium', isLight ? 'text-gray-700' : 'text-white/80')}>
                  Cosmic Glow
                </span>
              </div>
              <ToggleSwitch
                checked={gameSettings.cosmicBackground !== 'off'}
                onChange={() => {
                  playSound('tap');
                  setGameSettings(prev => ({
                    ...prev,
                    cosmicBackground: prev.cosmicBackground === 'off' ? 'subtle' : 'off'
                  }));
                }}
                isLight={isLight}
              />
            </label>
          </div>
        </div>
      </NeoBrutalCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingSection
          icon={User}
          title="Your Identity"
          description="Who are you in the NUB universe?"
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
          title="Pings & Dings"
          description="How do you want to be summoned?"
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
          title="Fort Knox"
          description="Keep the baddies out"
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
          title="The Vibes"
          description="Light side or dark side?"
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
          title="Money Things"
          description="Your subscription status"
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
          title="Secret Codes"
          description="API keys for the nerds"
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
      <NeoBrutalCard className="border-red-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-transparent" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-400/20 flex items-center justify-center animate-pulse">
            <Zap size={24} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className={cn('text-lg font-black', isLight ? 'text-gray-900' : 'text-white')}>
              ⚠️ The Nuclear Option
            </h3>
            <p className={cn('text-sm mb-4', isLight ? 'text-gray-500' : 'text-white/60')}>
              There's no coming back from these. The walrus will be sad.
            </p>
            <div className="flex gap-3">
              <NeoBrutalButton
                variant="outline"
                size="sm"
                className="text-red-400 border-red-400 hover:bg-red-400/10"
                onClick={() => {
                  playSound('error');
                  toast.error('Are you sure? This cannot be undone!');
                }}
              >
                Nuke All Data
              </NeoBrutalButton>
              <NeoBrutalButton
                variant="outline"
                size="sm"
                className="text-red-400 border-red-400 hover:bg-red-400/10"
                onClick={() => {
                  playSound('error');
                  toast.error('The walrus weeps at your decision');
                }}
              >
                Escape the Matrix
              </NeoBrutalButton>
            </div>
          </div>
        </div>
      </NeoBrutalCard>
    </div>
  );
};

export default Settings;
