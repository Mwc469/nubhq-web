import React, { useState } from 'react';
import { 
  Music, Ticket, ShoppingBag, Mail, Instagram, 
  Twitter, Youtube, ExternalLink, Calendar, Disc,
  Headphones, MapPin, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// LINK CONFIGURATION
// ============================================================

const DEFAULT_LINKS = [
  {
    id: 'tickets',
    label: 'Get Tickets',
    description: 'Upcoming shows',
    url: '#',
    icon: Ticket,
    featured: true,
    category: 'primary',
  },
  {
    id: 'spotify',
    label: 'Listen on Spotify',
    description: 'Stream our music',
    url: 'https://open.spotify.com/artist/nub',
    icon: Headphones,
    category: 'music',
  },
  {
    id: 'apple',
    label: 'Apple Music',
    description: 'Stream our music',
    url: 'https://music.apple.com/artist/nub',
    icon: Music,
    category: 'music',
  },
  {
    id: 'bandcamp',
    label: 'Bandcamp',
    description: 'Buy our albums',
    url: 'https://nub.bandcamp.com',
    icon: Disc,
    category: 'music',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Watch videos',
    url: 'https://youtube.com/@nub',
    icon: Youtube,
    category: 'social',
  },
  {
    id: 'merch',
    label: 'Merch Store',
    description: 'T-shirts, stickers, vinyl',
    url: '#',
    icon: ShoppingBag,
    category: 'shop',
  },
  {
    id: 'newsletter',
    label: 'Join the Nublet List',
    description: 'Get updates + exclusive stuff',
    url: '#',
    icon: Mail,
    category: 'signup',
  },
];

const SOCIAL_LINKS = [
  { id: 'instagram', url: 'https://instagram.com/nubtheband', icon: Instagram },
  { id: 'twitter', url: 'https://twitter.com/nubtheband', icon: Twitter },
  { id: 'youtube', url: 'https://youtube.com/@nub', icon: Youtube },
];

// ============================================================
// LINK-IN-BIO COMPONENT
// ============================================================

export default function LinkInBio({ 
  links = DEFAULT_LINKS,
  socialLinks = SOCIAL_LINKS,
  bandName = 'NUB',
  tagline = 'Take Weird Seriously 🦦',
  showHeader = true,
  onLinkClick,
}) {
  const [clickedLink, setClickedLink] = useState(null);

  const handleClick = (link) => {
    setClickedLink(link.id);
    onLinkClick?.(link);
    
    // Track click (would send to analytics)
    console.log('Link clicked:', link.id, link.url);
    
    // Reset visual feedback
    setTimeout(() => setClickedLink(null), 300);
  };

  const featuredLinks = links.filter(l => l.featured);
  const regularLinks = links.filter(l => !l.featured);

  return (
    <div className="min-h-screen bg-[#262729] text-white py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-8">
            {/* Profile Image */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#a76d24] to-[#f19b38] p-1">
              <div className="w-full h-full rounded-full bg-[#262729] flex items-center justify-center text-4xl">
                🦦
              </div>
            </div>
            
            {/* Band Name */}
            <h1 className="text-3xl font-black tracking-tight">
              {bandName}
            </h1>
            
            {/* Tagline */}
            <p className="text-sm opacity-70 mt-1">
              {tagline}
            </p>
            
            {/* Social Icons */}
            <div className="flex justify-center gap-4 mt-4">
              {socialLinks.map(social => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Featured Links */}
        {featuredLinks.length > 0 && (
          <div className="space-y-3 mb-6">
            {featuredLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(link)}
                  className={cn(
                    "block w-full p-4 rounded-2xl transition-all duration-200",
                    "bg-gradient-to-r from-[#a76d24] to-[#f19b38]",
                    "border-3 border-[#f19b38] shadow-[4px_4px_0_#f19b38]",
                    "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#f19b38]",
                    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#f19b38]",
                    clickedLink === link.id && "scale-95"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{link.label}</p>
                      {link.description && (
                        <p className="text-sm opacity-80">{link.description}</p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Regular Links */}
        <div className="space-y-3">
          {regularLinks.map(link => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(link)}
                className={cn(
                  "block w-full p-4 rounded-2xl transition-all duration-200",
                  "bg-white/5 border-2 border-white/20",
                  "hover:bg-white/10 hover:border-[#f19b38]",
                  "active:scale-[0.98]",
                  clickedLink === link.id && "scale-95 border-[#f19b38]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{link.label}</p>
                    {link.description && (
                      <p className="text-xs opacity-60">{link.description}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-40" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 opacity-40">
          <p className="text-xs">
            Made with 🦦 by NubHQ
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LINK EDITOR COMPONENT (for admin)
// ============================================================

export function LinkEditor({ links, onUpdate }) {
  const [editingId, setEditingId] = useState(null);

  const handleUpdate = (id, updates) => {
    const newLinks = links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    onUpdate(newLinks);
    setEditingId(null);
  };

  const handleAdd = () => {
    const newLink = {
      id: `link_${Date.now()}`,
      label: 'New Link',
      url: '#',
      icon: ExternalLink,
      category: 'other',
    };
    onUpdate([...links, newLink]);
    setEditingId(newLink.id);
  };

  const handleDelete = (id) => {
    onUpdate(links.filter(l => l.id !== id));
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newLinks = [...links];
    const [moved] = newLinks.splice(fromIndex, 1);
    newLinks.splice(toIndex, 0, moved);
    onUpdate(newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Link-in-Bio Links</h3>
        <button 
          onClick={handleAdd}
          className="px-3 py-1 bg-[#f19b38] text-white rounded-lg font-bold text-sm"
        >
          + Add Link
        </button>
      </div>

      <div className="space-y-2">
        {links.map((link, index) => (
          <div 
            key={link.id}
            className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl"
          >
            <div className="cursor-move opacity-50">⋮⋮</div>
            
            {editingId === link.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdate(link.id, { label: e.target.value })}
                  className="w-full p-2 rounded border"
                  placeholder="Label"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleUpdate(link.id, { url: e.target.value })}
                  className="w-full p-2 rounded border"
                  placeholder="URL"
                />
              </div>
            ) : (
              <div className="flex-1" onClick={() => setEditingId(link.id)}>
                <p className="font-bold">{link.label}</p>
                <p className="text-xs opacity-60 truncate">{link.url}</p>
              </div>
            )}
            
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={link.featured}
                onChange={(e) => handleUpdate(link.id, { featured: e.target.checked })}
              />
              Featured
            </label>
            
            <button 
              onClick={() => handleDelete(link.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
