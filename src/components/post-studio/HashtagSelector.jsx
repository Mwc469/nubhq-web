import React, { useState, useMemo } from 'react';
import { Hash, Plus, X, AlertTriangle, Wand2, Copy, Check } from 'lucide-react';
import NeoBrutalCard from '@/components/ui/NeoBrutalCard';
import NeoBrutalButton from '@/components/ui/NeoBrutalButton';
import { 
  HASHTAG_SETS, 
  getHashtags, 
  suggestHashtags, 
  analyzeHashtags,
  formatForFirstComment,
  isBannedHashtag 
} from '@/lib/hashtagLibrary';
import { cn } from '@/lib/utils';

export default function HashtagSelector({ 
  caption = '',
  selectedTags = [],
  onChange,
  platform = 'instagram',
  venue = null,
  className,
}) {
  const [showSets, setShowSets] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [copied, setCopied] = useState(false);

  // Analyze current caption for hashtags
  const captionAnalysis = useMemo(() => {
    return analyzeHashtags(caption);
  }, [caption]);

  // Get AI suggestions based on caption
  const suggestions = useMemo(() => {
    if (!caption || caption.length < 20) return [];
    return suggestHashtags(caption, { 
      includeLocal: true, 
      max: 15,
    }).filter(tag => !selectedTags.includes(tag));
  }, [caption, selectedTags]);

  const handleAddTag = (tag) => {
    const cleanTag = tag.replace('#', '').toLowerCase().trim();
    if (!cleanTag || selectedTags.includes(cleanTag)) return;
    
    if (isBannedHashtag(cleanTag)) {
      alert(`"#${cleanTag}" may be shadowbanned. Consider using a different tag.`);
      return;
    }
    
    onChange([...selectedTags, cleanTag]);
  };

  const handleRemoveTag = (tag) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag) {
      handleAddTag(customTag);
      setCustomTag('');
    }
  };

  const handleAddSet = (setName) => {
    const tags = getHashtags(setName, { venue, max: 10 });
    const newTags = tags.filter(t => !selectedTags.includes(t));
    onChange([...selectedTags, ...newTags]);
    setShowSets(false);
  };

  const handleCopyForComment = () => {
    const formatted = formatForFirstComment(selectedTags);
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maxTags = platform === 'instagram' ? 30 : platform === 'tiktok' ? 5 : 30;
  const isOverLimit = selectedTags.length > maxTags;

  return (
    <NeoBrutalCard accentColor="cyan" className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#2c3e50]" />
          <span className="text-xs uppercase tracking-wider font-bold opacity-60">
            Hashtags
          </span>
        </div>
        <span className={cn(
          "text-xs font-bold px-2 py-0.5 rounded-full",
          isOverLimit 
            ? "bg-[#b44a1c]/20 text-[#b44a1c]" 
            : "bg-gray-100 dark:bg-gray-800"
        )}>
          {selectedTags.length}/{maxTags}
        </span>
      </div>

      {/* Warning for banned hashtags in caption */}
      {captionAnalysis.hasBanned && (
        <div className="mb-3 p-2 rounded-lg bg-[#b44a1c]/10 border border-[#b44a1c]/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#b44a1c] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#b44a1c]">
                Potentially shadowbanned hashtags detected:
              </p>
              <p className="text-xs opacity-70">
                {captionAnalysis.banned.map(t => `#${t}`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map(tag => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#2c3e50]/10 border border-[#2c3e50]/30 rounded-full text-xs font-bold"
            >
              #{tag}
              <button 
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-[#b44a1c] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add Custom Tag */}
      <form onSubmit={handleAddCustomTag} className="flex gap-2 mb-4">
        <input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
          placeholder="Add custom tag..."
          className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-[#2c3e50] outline-none"
        />
        <button 
          type="submit"
          className="px-3 py-2 rounded-lg bg-[#2c3e50] text-white font-bold text-sm hover:bg-[#2c3e50]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="w-3 h-3 text-[#f19b38]" />
            <span className="text-xs font-bold opacity-60">Suggested for this caption</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#f19b38]/20 hover:text-[#f19b38] transition-colors"
              >
                +#{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hashtag Sets */}
      <div className="mb-4">
        <button 
          onClick={() => setShowSets(!showSets)}
          className="text-xs font-bold text-[#2c3e50] hover:underline"
        >
          {showSets ? 'Hide sets ▲' : 'Browse hashtag sets ▼'}
        </button>
        
        {showSets && (
          <div className="mt-2 space-y-2">
            {Object.entries(HASHTAG_SETS)
              .filter(([key]) => key !== 'venues')
              .map(([key, set]) => (
                <button
                  key={key}
                  onClick={() => handleAddSet(key)}
                  className="w-full text-left p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="font-bold text-sm">{set.name}</p>
                  <p className="text-xs opacity-60">{set.description}</p>
                  <p className="text-xs text-[#2c3e50] mt-1">
                    {set.tags?.slice(0, 5).map(t => `#${t}`).join(' ')}...
                  </p>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Copy for First Comment */}
      {selectedTags.length > 0 && platform === 'instagram' && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCopyForComment}
            className={cn(
              "w-full flex items-center justify-center gap-2 p-2 rounded-lg transition-colors font-bold text-sm",
              copied 
                ? "bg-[#6b8e5d]/20 text-[#6b8e5d]" 
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied for first comment!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy for first comment (IG best practice)
              </>
            )}
          </button>
          <p className="text-[10px] text-center opacity-40 mt-1">
            Putting hashtags in the first comment can improve reach
          </p>
        </div>
      )}
    </NeoBrutalCard>
  );
}

// ============================================================
// COMPACT HASHTAG PILLS (for display only)
// ============================================================

export function HashtagPills({ tags = [], max = 5, className }) {
  const displayTags = tags.slice(0, max);
  const remaining = tags.length - max;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayTags.map(tag => (
        <span 
          key={tag}
          className="px-2 py-0.5 bg-[#2c3e50]/10 rounded-full text-xs"
        >
          #{tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs opacity-60">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
