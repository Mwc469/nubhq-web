import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bot,
  Mail,
  Settings,
} from 'lucide-react';
import MobileNav from '../components/mobile/MobileNav';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/approvals', icon: CheckSquare, label: 'Approval Queue' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/ai-trainer', icon: Bot, label: 'AI Trainer' },
  { to: '/fan-mail', icon: Mail, label: 'Fan Mail' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-brand-dark border-r-3 border-black flex-col z-50">
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
                    : 'text-white/70 border-transparent hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;
