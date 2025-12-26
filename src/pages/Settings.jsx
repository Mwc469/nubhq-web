import { User, Bell, Shield, Palette, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSettings, useUpdateSettings } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <Card className="space-y-4">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-brand-orange/20 border-2 border-black">
        <Icon size={20} className="text-brand-orange" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </div>
    {children && <div className="pt-2">{children}</div>}
  </Card>
);

const Settings = () => {
  const toast = useToast();
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
        <Loader2 size={32} className="text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/60 mt-1">Manage your account preferences</p>
      </div>

      <div className="space-y-4">
        <SettingSection
          icon={User}
          title="Profile"
          description="Update your profile information and display name"
        >
          <div className="flex items-center gap-4">
            <span className="text-white/80">Display name: {settings?.display_name || 'Not set'}</span>
            <Button variant="secondary" size="sm">Edit Profile</Button>
          </div>
        </SettingSection>

        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Configure how you receive alerts and updates"
        >
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white/80">Push notifications</span>
              <input
                type="checkbox"
                checked={settings?.push_notifications ?? true}
                onChange={() => handleToggle('push_notifications', settings?.push_notifications)}
                disabled={updateMutation.isPending}
                className="w-5 h-5 accent-brand-orange cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white/80">Email notifications</span>
              <input
                type="checkbox"
                checked={settings?.email_notifications ?? true}
                onChange={() => handleToggle('email_notifications', settings?.email_notifications)}
                disabled={updateMutation.isPending}
                className="w-5 h-5 accent-brand-orange cursor-pointer"
              />
            </label>
          </div>
        </SettingSection>

        <SettingSection
          icon={Shield}
          title="Security"
          description="Manage your password and security settings"
        >
          <Button variant="secondary" size="sm">Change Password</Button>
        </SettingSection>

        <SettingSection
          icon={Palette}
          title="Appearance"
          description="Customize the look and feel of your dashboard"
        >
          <p className="text-sm text-white/50">Dark mode is enabled by default</p>
        </SettingSection>
      </div>
    </div>
  );
};

export default Settings;
