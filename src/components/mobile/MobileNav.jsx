import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bot,
  Mail,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/ai-trainer', icon: Bot, label: 'AI' },
  { to: '/fan-mail', icon: Mail, label: 'Mail' },
];

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-dark border-t-3 border-black z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-brand-orange'
                  : 'text-white/60 hover:text-white'
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
