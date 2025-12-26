import { useState, useRef } from 'react';
import { Upload, Image, Trash2, Grid, List, Plus, X, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Media Library</h1>
          <p className={`mt-1 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
            {media.length} files
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex border-3 border-black ${isLight ? 'bg-white' : 'bg-white/5'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-brand-orange text-white' : isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/60 hover:bg-white/10'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-brand-orange text-white' : isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/60 hover:bg-white/10'}`}
            >
              <List size={20} />
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
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Plus size={18} className="mr-2" />}
            Upload
          </Button>
        </div>
      </div>

      {/* Upload Zone */}
      <Card
        className={`border-dashed cursor-pointer transition-colors ${
          isLight ? 'hover:bg-gray-50' : 'hover:bg-white/10'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-8">
          <Upload size={48} className={`mb-4 ${isLight ? 'text-gray-400' : 'text-white/40'}`} />
          <p className={`text-lg font-medium ${isLight ? 'text-gray-700' : 'text-white/80'}`}>
            Drop files here or click to upload
          </p>
          <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
            Supports JPG, PNG, GIF up to 10MB
          </p>
        </div>
      </Card>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className={`group relative aspect-square border-3 border-black shadow-brutal cursor-pointer overflow-hidden transition-transform hover:scale-[1.02] ${
                isLight ? 'bg-white' : 'bg-white/5'
              }`}
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-medium px-2 text-center truncate">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card padding={false}>
          {media.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                isLight
                  ? 'hover:bg-gray-50 border-b border-gray-100'
                  : 'hover:bg-white/5 border-b border-white/10'
              }`}
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-16 h-16 object-cover border-2 border-black"
              />
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  {item.name}
                </p>
                <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                  {item.size} • {item.date}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </Card>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className={`relative max-w-3xl w-full border-3 border-black shadow-brutal ${isLight ? 'bg-white' : 'bg-brand-dark'}`}>
            <div className={`flex items-center justify-between p-4 border-b-3 border-black`}>
              <h3 className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{selectedMedia.name}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className={isLight ? 'text-gray-500 hover:text-gray-700' : 'text-white/60 hover:text-white'}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name}
                className="w-full max-h-[60vh] object-contain border-3 border-black"
              />
            </div>
            <div className={`flex items-center justify-between p-4 border-t-3 border-black`}>
              <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
                {selectedMedia.size} • {selectedMedia.date}
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(selectedMedia.id)}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
