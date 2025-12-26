import { useState } from 'react';
import { FileText, Copy, Sparkles, Search, Grid, List, Plus, Heart, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import { useTheme } from '../contexts/ThemeContext';

const categories = ['All', 'Captions', 'Responses', 'Promotions', 'Greetings', 'Custom'];

const mockTemplates = [
  {
    id: 1,
    name: 'Flirty Response',
    category: 'Responses',
    content: 'Hey cutie! Thanks for the love 💕 You always know how to make my day...',
    uses: 234,
    isFavorite: true,
    color: 'pink',
  },
  {
    id: 2,
    name: 'New Post Alert',
    category: 'Captions',
    content: '🔥 Something spicy just dropped! Check my latest...',
    uses: 189,
    isFavorite: true,
    color: 'cyan',
  },
  {
    id: 3,
    name: 'Thank You Message',
    category: 'Greetings',
    content: 'You are amazing! Thank you so much for your support...',
    uses: 156,
    isFavorite: false,
    color: 'yellow',
  },
  {
    id: 4,
    name: 'Special Offer',
    category: 'Promotions',
    content: '🎉 Exclusive deal just for you! For the next 24 hours...',
    uses: 98,
    isFavorite: false,
    color: 'purple',
  },
  {
    id: 5,
    name: 'Welcome New Fan',
    category: 'Greetings',
    content: 'Welcome to the crew! 🎉 So happy to have you here...',
    uses: 312,
    isFavorite: true,
    color: 'green',
  },
  {
    id: 6,
    name: 'Content Teaser',
    category: 'Captions',
    content: 'Something big is coming... 👀 Stay tuned...',
    uses: 145,
    isFavorite: false,
    color: 'orange',
  },
];

const colorClasses = {
  pink: 'border-neon-pink',
  cyan: 'border-neon-cyan',
  yellow: 'border-neon-yellow',
  purple: 'border-neon-purple',
  green: 'border-neon-green',
  orange: 'border-neon-orange',
};

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        tagline="Word Wizardry"
        title="Templates"
        subtitle="Pre-written magic for every occasion"
        actions={
          <NeoBrutalButton accentColor="pink">
            <Plus size={18} />
            New Template
          </NeoBrutalButton>
        }
      />

      {/* Filters */}
      <NeoBrutalCard accentColor="cyan">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all border-2',
                  activeCategory === category
                    ? 'bg-neon-cyan text-black border-neon-cyan'
                    : isLight
                    ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                    : 'border-white/20 text-white/60 hover:border-white/40'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border-2',
              isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
            )}>
              <Search size={18} className={isLight ? 'text-gray-400' : 'text-white/40'} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'bg-transparent outline-none text-sm w-40',
                  isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-white/40'
                )}
              />
            </div>

            <div className={cn(
              'flex rounded-xl border-2 overflow-hidden',
              isLight ? 'border-gray-200' : 'border-white/20'
            )}>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-neon-pink text-white'
                    : isLight ? 'text-gray-400 hover:bg-gray-100' : 'text-white/40 hover:bg-white/10'
                )}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-neon-pink text-white'
                    : isLight ? 'text-gray-400 hover:bg-gray-100' : 'text-white/40 hover:bg-white/10'
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </NeoBrutalCard>

      {/* Templates Grid */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
      )}>
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              'p-4 rounded-2xl border-3 transition-all cursor-pointer group',
              'hover:translate-x-[-2px] hover:translate-y-[-2px]',
              colorClasses[template.color],
              isLight
                ? 'bg-white shadow-[4px_4px_0_#d1d5db] hover:shadow-[6px_6px_0_#d1d5db]'
                : 'bg-gray-900 shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0_rgba(255,255,255,0.1)]'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className={cn('font-black', isLight ? 'text-gray-900' : 'text-white')}>
                  {template.name}
                </p>
                <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                  {template.category}
                </p>
              </div>
              <button className={cn(
                'p-1 rounded-lg transition-colors',
                template.isFavorite ? 'text-neon-pink' : isLight ? 'text-gray-300' : 'text-white/20'
              )}>
                <Heart size={18} fill={template.isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className={cn(
              'text-sm line-clamp-2 mb-4',
              isLight ? 'text-gray-600' : 'text-white/70'
            )}>
              {template.content}
            </p>

            <div className="flex items-center justify-between">
              <p className={cn('text-xs', isLight ? 'text-gray-400' : 'text-white/40')}>
                Used {template.uses} times
              </p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className={cn(
                  'p-2 rounded-lg transition-colors',
                  isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                )}>
                  <Copy size={16} className={isLight ? 'text-gray-500' : 'text-white/60'} />
                </button>
                <button className={cn(
                  'p-2 rounded-lg transition-colors',
                  isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                )}>
                  <Sparkles size={16} className="text-neon-pink" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <NeoBrutalCard accentColor="yellow">
          <div className={cn('text-center py-12', isLight ? 'text-gray-500' : 'text-white/50')}>
            <FileText size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-bold text-lg mb-1">No templates found</p>
            <p className="text-sm opacity-60">Try adjusting your filters or create a new template</p>
          </div>
        </NeoBrutalCard>
      )}
    </div>
  );
};

export default Templates;
