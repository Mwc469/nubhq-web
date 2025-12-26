/**
 * Leaderboard Page - Weekly rankings and profile
 */
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import Leaderboard from '../components/social/Leaderboard';
import ProfileCard from '../components/social/ProfileCard';

export default function LeaderboardPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={cn(
          'text-3xl font-black mb-2',
          isLight ? 'text-gray-900' : 'text-white'
        )}>
          Leaderboards
        </h1>
        <p className={cn(
          'text-sm',
          isLight ? 'text-gray-500' : 'text-white/60'
        )}>
          Compete with the community for weekly glory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
