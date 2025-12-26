import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bot,
  Mail,
  Settings,
  LogOut,
  Image,
} from 'lucide-react';
import MobileNav from '../components/mobile/MobileNav';
import Search from '../components/Search';
import Notifications from '../components/Notifications';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/approvals', icon: CheckSquare, label: 'Approval Queue' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/ai-trainer', icon: Bot, label: 'AI Trainer' },
  { to: '/fan-mail', icon: Mail, label: 'Fan Mail' },
  { to: '/media', icon: Image, label: 'Media Library' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen transition-colors ${isLight ? 'bg-brand-light' : 'bg-brand-dark'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r-3 border-black flex-col z-50 transition-colors ${isLight ? 'bg-white' : 'bg-brand-dark'}`}>
        <div className="p-6 border-b-3 border-black">
          <h1 className="text-2xl font-bold text-brand-orange">NubHQ</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-none border-3 transition-all ${
                  isActive
                    ? 'bg-brand-orange text-white border-black shadow-brutal'
                    : isLight
                    ? 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/70 border-transparent hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="p-4 border-t-3 border-black">
            <div className={`text-sm mb-2 truncate ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
              {user.display_name || user.email}
            </div>
            <button
              onClick={logout}
              className={`flex items-center gap-2 w-full px-4 py-2 transition-colors ${isLight ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 md:p-6">
          <div className="flex justify-end gap-3 mb-4">
            <Search />
            <Notifications />
          </div>
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;
