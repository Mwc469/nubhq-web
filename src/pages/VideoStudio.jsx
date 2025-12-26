import { Video, Film, Scissors, Music, Type, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { useTheme } from '../contexts/ThemeContext';

const tools = [
  { icon: Scissors, label: 'Trim & Cut', description: 'Edit video length', color: 'pink' },
  { icon: Music, label: 'Add Audio', description: 'Background music', color: 'cyan' },
  { icon: Type, label: 'Captions', description: 'Auto-generate text', color: 'yellow' },
  { icon: Film, label: 'Filters', description: 'Apply effects', color: 'purple' },
];

const colorClasses = {
  pink: { bg: 'bg-neon-pink/20', text: 'text-neon-pink' },
  cyan: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan' },
  yellow: { bg: 'bg-neon-yellow/20', text: 'text-neon-yellow' },
  purple: { bg: 'bg-neon-purple/20', text: 'text-neon-purple' },
};

const VideoStudio = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-8">
      <PageHeader
        tagline="Director Mode"
        title="Video Studio"
        subtitle="Create scroll-stopping video content"
        actions={
          <NeoBrutalButton accentColor="pink">
            <Video size={18} />
            New Project
          </NeoBrutalButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <NeoBrutalCard accentColor="cyan">
            <h3 className={cn('font-black text-lg mb-4', isLight ? 'text-gray-900' : 'text-white')}>
              Editing Tools
            </h3>
            <div className="space-y-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const colors = colorClasses[tool.color];
                return (
                  <button
                    key={tool.label}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                      'hover:translate-x-1',
                      isLight
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.bg)}>
                      <Icon size={20} className={colors.text} />
                    </div>
                    <div className="text-left">
                      <p className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                        {tool.label}
                      </p>
                      <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                        {tool.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </NeoBrutalCard>
        </div>

        {/* Main Editor Area */}
        <div className="lg:col-span-3">
          <NeoBrutalCard accentColor="purple" className="min-h-[500px]">
            <EmptyState
              icon={Video}
              title="No video loaded"
              description="Upload a video or start a new project to begin editing"
              action={{
                label: 'Upload Video',
                onClick: () => {},
              }}
              accentColor="purple"
            />
          </NeoBrutalCard>
        </div>
      </div>

      {/* Recent Projects */}
      <NeoBrutalCard accentColor="green">
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn('font-black text-lg', isLight ? 'text-gray-900' : 'text-white')}>
            Recent Projects
          </h3>
          <NeoBrutalButton variant="outline" size="sm" accentColor="green">
            View All
          </NeoBrutalButton>
        </div>
        <div className={cn(
          'text-center py-8',
          isLight ? 'text-gray-500' : 'text-white/50'
        )}>
          <Film size={32} className="mx-auto mb-2 opacity-40" />
          <p className="font-bold">No projects yet</p>
          <p className="text-xs opacity-60">Your video projects will appear here</p>
        </div>
      </NeoBrutalCard>
    </div>
  );
};

export default VideoStudio;
