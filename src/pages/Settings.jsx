import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

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
          <Button variant="secondary" size="sm">Edit Profile</Button>
        </SettingSection>

        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Configure how you receive alerts and updates"
        >
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-white/80">Push notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-orange" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white/80">Email notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-orange" />
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
