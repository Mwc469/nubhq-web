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
  ClipboardCheck,
  Gamepad2,
  Zap,
  Flame,
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../lib/utils';
import GlobalSearch from '../components/layout/GlobalSearch';
import QuickCreate from '../components/layout/QuickCreate';
import ThemeToggle from '../components/layout/ThemeToggle';
import DryRunBadge from '../components/ui/DryRunBadge';
import Notifications from '../components/Notifications';
import MobileNav from '../components/mobile/MobileNav';
import { CosmicGlow } from '../components/ui/CosmicBackground';
import { BRAND_ASSETS } from '../lib/brandAssets';
import { LEVELS } from '../lib/gamification';
import { playSound } from '../lib/soundSystem';
import { haptic } from '../components/mobile/MobileComponents';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Get player stats from localStorage
function getPlayerStats() {
  try {
    const stored = localStorage.getItem('nub_player_stats');
    return stored ? JSON.parse(stored) : { xp: 0, level: 1, streak: 0 };
  } catch { return { xp: 0, level: 1, streak: 0 }; }
}

// Get game settings from localStorage
function getGameSettings() {
  try {
    const stored = localStorage.getItem('nub_game_settings');
    return stored ? JSON.parse(stored) : {
      soundEnabled: true,
      hapticsEnabled: true,
      showPortal: true,
      cosmicBackground: 'subtle'
    };
  } catch {
    return { soundEnabled: true, hapticsEnabled: true, showPortal: true, cosmicBackground: 'subtle' };
  }
}

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Hub', tagline: 'Command Center', color: 'pink' },
  { to: '/game-queue', icon: Gamepad2, label: 'Play', tagline: 'Swipe & Decide', color: 'purple' },
  { to: '/post-studio', icon: PenTool, label: 'Create', tagline: 'Make Weird Stuff', color: 'cyan' },
  { to: '/calendar', icon: Calendar, label: 'Calendar', tagline: 'Plot the Chaos', color: 'yellow' },
  { to: '/approvals', icon: CheckSquare, label: 'Approvals', tagline: 'Judge the Queue', color: 'green' },
  { to: '/media', icon: Image, label: 'Media', tagline: 'Visual Vault', color: 'orange' },
  { to: '/ai-trainer', icon: Bot, label: 'Train AI', tagline: 'Teach the Weird', color: 'purple' },
  { to: '/analytics', icon: BarChart3, label: 'Stats', tagline: 'Measure Chaos', color: 'cyan' },
  { to: '/video-studio', icon: Video, label: 'Video', tagline: 'Motion Magic', color: 'pink' },
  { to: '/email-campaigns', icon: Mail, label: 'Email', tagline: 'Fan Signals', color: 'yellow' },
  { to: '/templates', icon: FileText, label: 'Templates', tagline: 'Weird Blueprints', color: 'green' },
  { to: '/activity', icon: Activity, label: 'Activity', tagline: 'Chaos Trail', color: 'orange' },
  { to: '/settings', icon: Settings, label: 'Settings', tagline: 'Tune the Weird', color: 'neutral' },
];

// Easter egg: Konami code sequence
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const isLight = theme === 'light';

  const playerStats = useMemo(() => getPlayerStats(), []);
  const gameSettings = useMemo(() => getGameSettings(), []);
  const levelInfo = useMemo(() => getLevelInfo(playerStats.xp), [playerStats.xp]);
  const xpProgress = useMemo(() => {
    const current = playerStats.xp - levelInfo.minXp;
    const range = levelInfo.maxXp - levelInfo.minXp;
    return Math.min((current / range) * 100, 100);
  }, [playerStats.xp, levelInfo]);

  // Easter egg: Logo tap
  const handleLogoTap = useCallback(() => {
    if (gameSettings.hapticsEnabled) haptic?.('light');
    if (gameSettings.soundEnabled) playSound('tap');
    setLogoTaps(prev => {
      if (prev >= 4) {
        // 5 taps triggers easter egg
        if (gameSettings.soundEnabled) playSound('achievement');
        if (gameSettings.hapticsEnabled) haptic?.('success');
        setEasterEggActive(true);
        setTimeout(() => setEasterEggActive(false), 3000);
        return 0;
      }
      return prev + 1;
    });
  }, [gameSettings.hapticsEnabled, gameSettings.soundEnabled]);

  // Easter egg: Konami code
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === KONAMI_CODE[konamiIndex]) {
        if (konamiIndex === KONAMI_CODE.length - 1) {
          // Konami code complete!
          if (gameSettings.soundEnabled) playSound('levelUp');
          if (gameSettings.hapticsEnabled) haptic?.('success');
          setEasterEggActive(true);
          setTimeout(() => setEasterEggActive(false), 5000);
          setKonamiIndex(0);
        } else {
          setKonamiIndex(prev => prev + 1);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, gameSettings.soundEnabled, gameSettings.hapticsEnabled]);

  // Reset logo taps after delay
  useEffect(() => {
    if (logoTaps > 0) {
      const timer = setTimeout(() => setLogoTaps(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [logoTaps]);

  return (
    <div className={cn('min-h-screen transition-colors relative', isLight ? 'bg-brand-light' : 'bg-brand-dark')}>
      {/* Cosmic background glow - respects user settings */}
      {gameSettings.cosmicBackground !== 'off' && (
        <CosmicGlow className="fixed inset-0 pointer-events-none" />
      )}

      {/* Easter egg celebration overlay */}
      {easterEggActive && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="text-6xl animate-level-up">🦭✨</div>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/20 via-neon-purple/20 to-neon-cyan/20 animate-pulse" />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 bottom-0 w-72 border-r-3 border-black flex-col z-50 transition-colors',
          isLight ? 'bg-white/95 backdrop-blur-sm' : 'bg-brand-dark/95 backdrop-blur-sm'
        )}
      >
        {/* Logo - Interactive */}
        <div className="p-6 border-b-3 border-black">
          <button
            onClick={handleLogoTap}
            className="flex items-center gap-3 group cursor-pointer w-full text-left"
          >
            <div className={cn(
              'w-12 h-12 rounded-xl overflow-hidden border-2 border-black transition-transform',
              'group-hover:scale-105 group-active:scale-95',
              easterEggActive && 'animate-wiggle'
            )}>
              <img
                src={BRAND_ASSETS.logos.screaming}
                alt="NUB"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-neon-pink group-hover:text-neon-purple transition-colors">
                NubHQ
              </h1>
              <p className={cn('text-[10px] uppercase tracking-widest', isLight ? 'text-gray-500' : 'text-white/50')}>
                Take Weird Seriously
              </p>
            </div>
          </button>
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
          isLight ? 'bg-white/95 backdrop-blur-sm' : 'bg-brand-dark/95 backdrop-blur-sm'
        )}
      >
        {/* Top row with XP */}
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

          {/* Center: Logo + XP */}
          <button onClick={handleLogoTap} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-black">
              <img src={BRAND_ASSETS.logos.screaming} alt="NUB" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{levelInfo.badge}</span>
              <div className="w-16">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${xpProgress}%`,
                      background: 'linear-gradient(90deg, #E91E8C, #9B30FF)',
                    }}
                  />
                </div>
              </div>
              {playerStats.streak > 0 && (
                <span className="text-xs text-orange-500">🔥{playerStats.streak}</span>
              )}
            </div>
          </button>

          <div className="flex items-center gap-2">
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

      {/* Desktop Top Bar with XP */}
      <div
        className={cn(
          'hidden lg:flex fixed top-0 left-72 right-0 h-16 items-center justify-between px-6 border-b-3 border-black z-40',
          isLight ? 'bg-white/95 backdrop-blur-sm' : 'bg-brand-dark/95 backdrop-blur-sm'
        )}
      >
        {/* Left: XP Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{levelInfo.badge}</span>
            <div className="hidden xl:block">
              <p className="text-xs font-bold text-gray-800 dark:text-white leading-none">
                {levelInfo.title}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Lvl {levelInfo.level}
              </p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="w-32 xl:w-48">
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-black/20">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${xpProgress}%`,
                  background: 'linear-gradient(90deg, #E91E8C 0%, #9B30FF 100%)',
                }}
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5 text-center">
              {playerStats.xp} XP
            </p>
          </div>

          {/* Streak */}
          {playerStats.streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {playerStats.streak}
              </span>
            </div>
          )}

          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />
          <GlobalSearch />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
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
