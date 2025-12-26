import { useState, useRef } from 'react';
import { Upload, Image, Trash2, Grid, List, Plus, X, Loader2, Film, FileImage } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

// Mock media data
const initialMedia = [
  { id: 1, name: 'banner.jpg', url: 'https://picsum.photos/400/300?random=1', type: 'image', size: '245 KB', date: '2024-01-15' },
  { id: 2, name: 'profile.png', url: 'https://picsum.photos/400/300?random=2', type: 'image', size: '128 KB', date: '2024-01-14' },
  { id: 3, name: 'post-1.jpg', url: 'https://picsum.photos/400/300?random=3', type: 'image', size: '512 KB', date: '2024-01-13' },
  { id: 4, name: 'thumbnail.jpg', url: 'https://picsum.photos/400/300?random=4', type: 'image', size: '89 KB', date: '2024-01-12' },
  { id: 5, name: 'cover.png', url: 'https://picsum.photos/400/300?random=5', type: 'image', size: '324 KB', date: '2024-01-11' },
  { id: 6, name: 'story.jpg', url: 'https://picsum.photos/400/300?random=6', type: 'image', size: '198 KB', date: '2024-01-10' },
];

export default function MediaLibrary() {
  const [media, setMedia] = useState(initialMedia);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const { showToast } = useToast();
  const isLight = theme === 'light';

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newMedia = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: `${Math.round(file.size / 1024)} KB`,
      date: new Date().toISOString().split('T')[0],
    }));

    setMedia((prev) => [...newMedia, ...prev]);
    setIsUploading(false);
    showToast(`${files.length} file(s) uploaded successfully`, 'success');
    e.target.value = '';
  };

  const handleDelete = (id) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    setSelectedMedia(null);
    showToast('File deleted', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Asset Vault"
        title="Media Library"
        subtitle={`${media.length} files`}
        actions={
          <div className="flex items-center gap-3">
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
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <NeoBrutalButton accentColor="pink" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Upload
            </NeoBrutalButton>
          </div>
        }
      />

      {/* Upload Zone */}
      <NeoBrutalCard
        accentColor="cyan"
        className="cursor-pointer transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl border-neon-cyan/50">
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/20 flex items-center justify-center mb-4">
            <Upload size={32} className="text-neon-cyan" />
          </div>
          <p className={cn('text-lg font-bold', isLight ? 'text-gray-700' : 'text-white/80')}>
            Drop files here or click to upload
          </p>
          <p className={cn('text-sm mt-1', isLight ? 'text-gray-500' : 'text-white/50')}>
            Supports JPG, PNG, GIF up to 10MB
          </p>
        </div>
      </NeoBrutalCard>

      {/* Media Grid/List */}
      {media.length === 0 ? (
        <NeoBrutalCard accentColor="purple">
          <EmptyState
            icon={FileImage}
            title="No media yet"
            description="Upload some images or videos to get started"
            action={{
              label: 'Upload Files',
              onClick: () => fileInputRef.current?.click(),
            }}
            accentColor="purple"
          />
        </NeoBrutalCard>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className={cn(
                'group relative aspect-square rounded-2xl border-3 cursor-pointer overflow-hidden transition-all',
                'hover:translate-x-[-2px] hover:translate-y-[-2px]',
                isLight
                  ? 'border-gray-200 bg-white shadow-[4px_4px_0_#d1d5db] hover:shadow-[6px_6px_0_#d1d5db]'
                  : 'border-white/20 bg-white/5 shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0_rgba(255,255,255,0.1)]'
              )}
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-bold px-2 text-center truncate">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NeoBrutalCard accentColor="purple" className="p-0 overflow-hidden">
          {media.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className={cn(
                'flex items-center gap-4 p-4 cursor-pointer transition-colors',
                isLight
                  ? 'hover:bg-gray-50'
                  : 'hover:bg-white/5',
                index !== media.length - 1 && (isLight ? 'border-b border-gray-100' : 'border-b border-white/10')
              )}
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl border-2 border-neon-pink"
              />
              <div className="flex-1 min-w-0">
                <p className={cn('font-bold truncate', isLight ? 'text-gray-900' : 'text-white')}>
                  {item.name}
                </p>
                <p className={cn('text-sm', isLight ? 'text-gray-500' : 'text-white/50')}>
                  {item.size} • {item.date}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  'text-red-400 hover:text-red-300',
                  isLight ? 'hover:bg-red-50' : 'hover:bg-red-500/10'
                )}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </NeoBrutalCard>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <NeoBrutalCard accentColor="pink" className="relative max-w-3xl w-full p-0 overflow-hidden">
            <div className={cn(
              'flex items-center justify-between p-4',
              isLight ? 'border-b border-gray-200' : 'border-b border-white/10'
            )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-pink/20 flex items-center justify-center">
                  <Image size={18} className="text-neon-pink" />
                </div>
                <h3 className={cn('font-black', isLight ? 'text-gray-900' : 'text-white')}>
                  {selectedMedia.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isLight ? 'text-gray-500 hover:bg-gray-100' : 'text-white/60 hover:bg-white/10'
                )}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name}
                className="w-full max-h-[60vh] object-contain rounded-xl border-3 border-neon-pink"
              />
            </div>
            <div className={cn(
              'flex items-center justify-between p-4',
              isLight ? 'border-t border-gray-200' : 'border-t border-white/10'
            )}>
              <div className={cn('text-sm font-bold', isLight ? 'text-gray-600' : 'text-white/60')}>
                {selectedMedia.size} • {selectedMedia.date}
              </div>
              <NeoBrutalButton
                variant="outline"
                size="sm"
                onClick={() => handleDelete(selectedMedia.id)}
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                <Trash2 size={16} />
                Delete
              </NeoBrutalButton>
            </div>
          </NeoBrutalCard>
        </div>
      )}
    </div>
  );
}
