import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Video,
  Image,
  Hash,
  Calendar,
  Clock,
  Send,
  Save,
  Sparkles,
  Eye,
  Wand2,
  Smile,
  Quote,
  Loader2,
  X,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
  { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: 'bg-sky-500' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-500' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'tiktok', label: 'TikTok', icon: Video, color: 'bg-black' },
];

const POST_TYPES = [
  { id: 'image', label: 'Image Post', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'story', label: 'Story', icon: Instagram },
  { id: 'reel', label: 'Reel/Short', icon: Video },
];

const CHARACTER_LIMITS = {
  instagram: 2200,
  twitter: 280,
  youtube: 5000,
  facebook: 63206,
  tiktok: 2200,
};

export default function PostStudio() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platforms: ['instagram'],
    post_type: 'image',
    hashtags: [],
    scheduled_date: '',
    scheduled_time: '',
    media_urls: [],
  });

  const [hashtagInput, setHashtagInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPlatform = formData.platforms[0] || 'instagram';
  const charLimit = CHARACTER_LIMITS[selectedPlatform];
  const charCount = formData.content.length;
  const isOverLimit = charCount > charLimit;

  const togglePlatform = (platformId) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const addHashtag = (e) => {
    e.preventDefault();
    if (hashtagInput.trim() && !formData.hashtags.includes(hashtagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim().replace(/^#/, '')],
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((t) => t !== tag),
    }));
  };

  const handleAiRewrite = async (mode) => {
    if (!formData.content) return;
    setIsAiLoading(mode);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1500));

    const variations = {
      regenerate: `${formData.content} ✨ (Regenerated with extra weird energy)`,
      funnier: `${formData.content} 😂 (Now 47% funnier, scientifically proven)`,
      pun: `${formData.content} 🎯 (Pun intended, as always)`,
    };

    setFormData((prev) => ({ ...prev, content: variations[mode] || prev.content }));
    setIsAiLoading(null);
    toast.success('Caption updated!');
  };

  const handleSave = async (status = 'draft') => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success(status === 'draft' ? 'Draft saved!' : 'Post scheduled!');
    if (status === 'scheduled') {
      navigate('/calendar');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Craft the Strange"
        title="Post Studio"
        subtitle="Create content that makes the algorithm confused"
        actions={
          <div className="flex items-center gap-3">
            <NeoBrutalButton
              variant="outline"
              accentColor="cyan"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={18} />
              {showPreview ? 'Hide' : 'Preview'}
            </NeoBrutalButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selector */}
          <NeoBrutalCard accentColor="pink">
            <h3 className={cn('font-black mb-4', isLight ? 'text-gray-900' : 'text-white')}>
              Target Platforms
            </h3>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl border-3 font-bold transition-all',
                      isSelected
                        ? 'border-neon-pink bg-neon-pink/20 text-neon-pink shadow-[4px_4px_0_var(--neon-pink)]'
                        : isLight
                        ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                        : 'border-white/20 text-white/60 hover:border-white/40'
                    )}
                  >
                    <Icon size={18} />
                    {platform.label}
                  </button>
                );
              })}
            </div>
          </NeoBrutalCard>

          {/* Post Type */}
          <NeoBrutalCard accentColor="cyan">
            <h3 className={cn('font-black mb-4', isLight ? 'text-gray-900' : 'text-white')}>
              Post Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {POST_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.post_type === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormData((prev) => ({ ...prev, post_type: type.id }))}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-3 transition-all',
                      isSelected
                        ? 'border-neon-cyan bg-neon-cyan/20 shadow-[4px_4px_0_var(--neon-cyan)]'
                        : isLight
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-white/20 hover:border-white/40'
                    )}
                  >
                    <Icon size={24} className={isSelected ? 'text-neon-cyan' : ''} />
                    <span className={cn('text-sm font-bold', isSelected ? 'text-neon-cyan' : '')}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </NeoBrutalCard>

          {/* Caption Editor */}
          <NeoBrutalCard accentColor="purple">
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn('font-black', isLight ? 'text-gray-900' : 'text-white')}>
                Caption
              </h3>
              <div className={cn(
                'text-sm font-bold',
                isOverLimit ? 'text-red-500' : isLight ? 'text-gray-500' : 'text-white/50'
              )}>
                {charCount} / {charLimit}
              </div>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write something weird and wonderful..."
              className={cn(
                'w-full h-40 p-4 rounded-xl border-3 resize-none transition-colors font-medium',
                isLight
                  ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-neon-purple'
                  : 'bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-neon-purple',
                'outline-none'
              )}
            />

            {/* Hashtags */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash size={16} className="text-neon-purple" />
                <span className={cn('text-sm font-bold', isLight ? 'text-gray-700' : 'text-white/70')}>
                  Hashtags
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-neon-purple/20 text-neon-purple text-sm font-bold"
                  >
                    #{tag}
                    <button onClick={() => removeHashtag(tag)} className="hover:text-white">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={addHashtag} className="flex gap-2">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  placeholder="Add hashtag..."
                  className={cn(
                    'flex-1 px-4 py-2 rounded-xl border-2 transition-colors',
                    isLight
                      ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      : 'bg-white/5 border-white/20 text-white placeholder-white/40',
                    'outline-none focus:border-neon-purple'
                  )}
                />
                <NeoBrutalButton type="submit" size="sm" accentColor="purple">
                  <Plus size={16} />
                </NeoBrutalButton>
              </form>
            </div>
          </NeoBrutalCard>

          {/* Schedule */}
          <NeoBrutalCard accentColor="yellow">
            <h3 className={cn('font-black mb-4', isLight ? 'text-gray-900' : 'text-white')}>
              Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn('text-xs uppercase tracking-wider font-bold mb-2 block', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Date
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-yellow" />
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, scheduled_date: e.target.value }))}
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-xl border-2',
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-gray-900'
                        : 'bg-white/5 border-white/20 text-white',
                      'outline-none focus:border-neon-yellow'
                    )}
                  />
                </div>
              </div>
              <div>
                <label className={cn('text-xs uppercase tracking-wider font-bold mb-2 block', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Time
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-yellow" />
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, scheduled_time: e.target.value }))}
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-xl border-2',
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-gray-900'
                        : 'bg-white/5 border-white/20 text-white',
                      'outline-none focus:border-neon-yellow'
                    )}
                  />
                </div>
              </div>
            </div>
          </NeoBrutalCard>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <NeoBrutalButton
              variant="outline"
              accentColor="cyan"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Draft
            </NeoBrutalButton>
            <NeoBrutalButton
              accentColor="green"
              onClick={() => handleSave('scheduled')}
              disabled={isSaving || !formData.scheduled_date}
            >
              <Send size={18} />
              Schedule Post
            </NeoBrutalButton>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <NeoBrutalCard accentColor="pink">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-neon-pink" />
              <h3 className={cn('font-black', isLight ? 'text-gray-900' : 'text-white')}>
                AI Assistant
              </h3>
            </div>
            <p className={cn('text-xs mb-4', isLight ? 'text-gray-500' : 'text-white/50')}>
              Draft-only changes. No auto-save.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleAiRewrite('regenerate')}
                disabled={!formData.content || isAiLoading}
                className={cn(
                  'w-full p-3 rounded-xl border-2 text-left transition-all',
                  'bg-neon-pink/10 border-neon-pink/30 hover:border-neon-pink',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <div className="flex items-center gap-2">
                  {isAiLoading === 'regenerate' ? (
                    <Loader2 size={16} className="text-neon-pink animate-spin" />
                  ) : (
                    <Wand2 size={16} className="text-neon-pink" />
                  )}
                  <span className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                    Regenerate
                  </span>
                </div>
                <p className={cn('text-xs mt-1', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Fresh take, same vibe
                </p>
              </button>

              <button
                onClick={() => handleAiRewrite('funnier')}
                disabled={!formData.content || isAiLoading}
                className={cn(
                  'w-full p-3 rounded-xl border-2 text-left transition-all',
                  'bg-neon-yellow/10 border-neon-yellow/30 hover:border-neon-yellow',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <div className="flex items-center gap-2">
                  {isAiLoading === 'funnier' ? (
                    <Loader2 size={16} className="text-neon-yellow animate-spin" />
                  ) : (
                    <Smile size={16} className="text-neon-yellow" />
                  )}
                  <span className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                    Make Funnier
                  </span>
                </div>
                <p className={cn('text-xs mt-1', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Add more weird humor
                </p>
              </button>

              <button
                onClick={() => handleAiRewrite('pun')}
                disabled={!formData.content || isAiLoading}
                className={cn(
                  'w-full p-3 rounded-xl border-2 text-left transition-all',
                  'bg-neon-cyan/10 border-neon-cyan/30 hover:border-neon-cyan',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <div className="flex items-center gap-2">
                  {isAiLoading === 'pun' ? (
                    <Loader2 size={16} className="text-neon-cyan animate-spin" />
                  ) : (
                    <Quote size={16} className="text-neon-cyan" />
                  )}
                  <span className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                    Add Pun
                  </span>
                </div>
                <p className={cn('text-xs mt-1', isLight ? 'text-gray-500' : 'text-white/50')}>
                  Wordplay makes it stay
                </p>
              </button>
            </div>
          </NeoBrutalCard>

          {/* Platform Preview */}
          {showPreview && (
            <NeoBrutalCard accentColor="cyan">
              <h3 className={cn('font-black mb-4', isLight ? 'text-gray-900' : 'text-white')}>
                Preview
              </h3>
              <div className={cn(
                'p-4 rounded-xl border-2',
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/20'
              )}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple" />
                  <div>
                    <p className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                      NUB
                    </p>
                    <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                      Just now
                    </p>
                  </div>
                </div>
                <div className={cn(
                  'aspect-square rounded-lg mb-3 flex items-center justify-center',
                  isLight ? 'bg-gray-200' : 'bg-white/10'
                )}>
                  <Image size={48} className="opacity-30" />
                </div>
                <p className={cn(
                  'text-sm whitespace-pre-wrap',
                  isLight ? 'text-gray-900' : 'text-white'
                )}>
                  {formData.content || 'Your caption will appear here...'}
                </p>
                {formData.hashtags.length > 0 && (
                  <p className="text-sm text-neon-cyan mt-2">
                    {formData.hashtags.map((t) => `#${t}`).join(' ')}
                  </p>
                )}
              </div>
            </NeoBrutalCard>
          )}

          {/* Tips */}
          <NeoBrutalCard accentColor="green" hover={false}>
            <h3 className={cn('font-black mb-3', isLight ? 'text-gray-900' : 'text-white')}>
              Pro Tips
            </h3>
            <ul className={cn('space-y-2 text-sm', isLight ? 'text-gray-600' : 'text-white/60')}>
              <li className="flex items-start gap-2">
                <span className="text-neon-green">•</span>
                Post at peak hours (11am-1pm, 7-9pm)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green">•</span>
                Use 3-5 relevant hashtags
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green">•</span>
                Keep captions under 125 chars for best engagement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green">•</span>
                Include a call-to-action
              </li>
            </ul>
          </NeoBrutalCard>
        </div>
      </div>
    </div>
  );
}
