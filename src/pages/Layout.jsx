import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bot,
  Mail,
  Settings,
  LogOut,
  Image,
  PenTool,
  Video,
  FileText,
  Activity,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import GlobalSearch from '../components/layout/GlobalSearch';
import QuickCreate from '../components/layout/QuickCreate';
import ThemeToggle from '../components/layout/ThemeToggle';
import DryRunBadge from '../components/ui/DryRunBadge';
import Notifications from '../components/Notifications';
import MobileNav from '../components/mobile/MobileNav';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', tagline: 'The Weird HQ' },
  { to: '/calendar', icon: Calendar, label: 'Content Calendar', tagline: 'Plot the chaos' },
  { to: '/post-studio', icon: PenTool, label: 'Post Studio', tagline: 'Craft the strange' },
  { to: '/approvals', icon: CheckSquare, label: 'Approval Queue', tagline: 'Greenlight weirdness' },
  { to: '/media', icon: Image, label: 'Media Library', tagline: 'Visual chaos vault' },
  { to: '/video-studio', icon: Video, label: 'Video Studio', tagline: 'Motion madness' },
  { to: '/email-campaigns', icon: Mail, label: 'Email Campaigns', tagline: 'Fan transmissions' },
  { to: '/templates', icon: FileText, label: 'Templates', tagline: 'Weird blueprints' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', tagline: 'Measure the weird' },
  { to: '/activity', icon: Activity, label: 'Activity Log', tagline: 'The chaos trail' },
  { to: '/ai-trainer', icon: Bot, label: 'AI Trainer', tagline: 'Train the weird' },
  { to: '/settings', icon: Settings, label: 'Settings', tagline: 'Configure chaos' },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = theme === 'light';

  return (
    <div className={cn('min-h-screen transition-colors', isLight ? 'bg-brand-light' : 'bg-brand-dark')}>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 bottom-0 w-72 border-r-3 border-black flex-col z-50 transition-colors',
          isLight ? 'bg-white' : 'bg-brand-dark'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b-3 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-pink flex items-center justify-center">
              <span className="text-white font-black text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-neon-pink">NubHQ</h1>
              <p className={cn('text-[10px] uppercase tracking-widest', isLight ? 'text-gray-500' : 'text-white/50')}>
                Take Weird Seriously
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, tagline }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border-3 transition-all group',
                  isActive
                    ? 'bg-neon-pink text-white border-black shadow-[4px_4px_0_#000]'
                    : isLight
                    ? 'text-gray-600 border-transparent hover:bg-gray-100 hover:border-gray-200'
                    : 'text-white/70 border-transparent hover:bg-white/5 hover:border-white/10'
                )}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-neon-pink'} />
                <div className="flex-1 min-w-0">
                  <span className="font-bold block">{label}</span>
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider block',
                      isActive ? 'text-white/70' : isLight ? 'text-gray-400' : 'text-white/40'
                    )}
                  >
                    {tagline}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        {user && (
          <div className="p-4 border-t-3 border-black">
            <div className={cn('text-sm mb-3 font-bold truncate', isLight ? 'text-gray-900' : 'text-white')}>
              {user.display_name || user.email}
            </div>
            <button
              onClick={logout}
              className={cn(
                'flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 font-medium transition-colors',
                isLight
                  ? 'text-gray-600 border-gray-200 hover:bg-gray-100'
                  : 'text-white/70 border-white/10 hover:bg-white/5'
              )}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header
        className={cn(
          'lg:hidden fixed top-0 left-0 right-0 z-50 border-b-3 border-black',
          isLight ? 'bg-white' : 'bg-brand-dark'
        )}
      >
        {/* Top row */}
        <div className="flex items-center justify-between p-3 border-b border-black/10">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'p-2 rounded-xl',
              isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            )}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-pink flex items-center justify-center">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-black text-neon-pink">NubHQ</span>
          </div>

          <div className="flex items-center gap-2">
            <DryRunBadge variant="compact" />
            <ThemeToggle variant="compact" />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-2 p-3">
          <GlobalSearch compact />
          <QuickCreate variant="compact" />
          <Notifications />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div
            className={cn(
              'absolute left-0 top-0 bottom-0 w-72 border-r-3 border-black overflow-y-auto',
              isLight ? 'bg-white' : 'bg-brand-dark'
            )}
            style={{ paddingTop: '120px' }}
          >
            <nav className="p-3 space-y-1">
              {navItems.map(({ to, icon: Icon, label, tagline }) => {
                const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive
                        ? 'bg-neon-pink text-white'
                        : isLight
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-white/70 hover:bg-white/5'
                    )}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-neon-pink'} />
                    <div>
                      <span className="font-bold block">{label}</span>
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-wider',
                          isActive ? 'text-white/70' : isLight ? 'text-gray-400' : 'text-white/40'
                        )}
                      >
                        {tagline}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Top Bar */}
      <div
        className={cn(
          'hidden lg:flex fixed top-0 left-72 right-0 h-16 items-center justify-between px-6 border-b-3 border-black z-40',
          isLight ? 'bg-white' : 'bg-brand-dark'
        )}
      >
        <GlobalSearch />
        <div className="flex items-center gap-4">
          <DryRunBadge />
          <QuickCreate />
          <Notifications />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all',
          'pt-[140px] lg:pt-16', // Mobile: 2-row header, Desktop: single row
          'lg:ml-72',
          'pb-20 lg:pb-0'
        )}
      >
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;
