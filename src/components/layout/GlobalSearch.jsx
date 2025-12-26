import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Loader2, Mail, Calendar, CheckSquare, FileText, Image } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const typeIcons = {
  approval: CheckSquare,
  fan_mail: Mail,
  calendar: Calendar,
  post: FileText,
  media: Image,
};

const typeColors = {
  approval: 'text-neon-yellow',
  fan_mail: 'text-neon-cyan',
  calendar: 'text-neon-purple',
  post: 'text-neon-pink',
  media: 'text-neon-green',
};

export default function GlobalSearch({ compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };

  // Compact trigger for mobile
  if (compact) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-colors',
            isLight
              ? 'bg-gray-100 border-gray-200 text-gray-500'
              : 'bg-white/5 border-white/10 text-white/50'
          )}
        >
          <SearchIcon size={16} />
          <span className="text-sm">Search...</span>
        </button>
        {isOpen && <SearchModal isOpen={isOpen} setIsOpen={setIsOpen} query={query} setQuery={setQuery} results={results} isLoading={isLoading} handleSelect={handleSelect} inputRef={inputRef} isLight={isLight} />}
      </>
    );
  }

  // Desktop trigger
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl border-3 transition-all',
          'hover:translate-x-[-2px] hover:translate-y-[-2px]',
          isLight
            ? 'bg-gray-100 border-gray-300 text-gray-500 hover:border-gray-400 shadow-[4px_4px_0_#d1d5db] hover:shadow-[6px_6px_0_#d1d5db]'
            : 'bg-white/5 border-white/20 text-white/50 hover:border-white/40 shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0_rgba(255,255,255,0.1)]'
        )}
      >
        <SearchIcon size={18} />
        <span className="text-sm font-medium">Search...</span>
        <kbd className={cn(
          'text-xs px-2 py-1 rounded-lg font-bold ml-4',
          isLight ? 'bg-gray-200 text-gray-500' : 'bg-white/10 text-white/40'
        )}>
          ⌘K
        </kbd>
      </button>
    );
  }

  return <SearchModal isOpen={isOpen} setIsOpen={setIsOpen} query={query} setQuery={setQuery} results={results} isLoading={isLoading} handleSelect={handleSelect} inputRef={inputRef} isLight={isLight} />;
}

function SearchModal({ isOpen, setIsOpen, query, setQuery, results, isLoading, handleSelect, inputRef, isLight }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className={cn(
        'relative w-full max-w-lg rounded-2xl border-3 overflow-hidden',
        isLight
          ? 'bg-white border-neon-cyan shadow-[8px_8px_0_var(--neon-cyan)]'
          : 'bg-gray-900 border-neon-cyan shadow-[8px_8px_0_var(--neon-cyan)]'
      )}>
        <div className={cn(
          'flex items-center gap-3 p-4 border-b-3',
          isLight ? 'border-gray-200' : 'border-white/10'
        )}>
          <SearchIcon size={20} className="text-neon-cyan" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything..."
            className={cn(
              'flex-1 bg-transparent outline-none text-lg font-medium',
              isLight ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-white/40'
            )}
          />
          {isLoading && <Loader2 size={20} className="animate-spin text-neon-pink" />}
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              'p-1 rounded-lg transition-colors',
              isLight ? 'text-gray-400 hover:bg-gray-100' : 'text-white/40 hover:bg-white/10'
            )}
          >
            <X size={20} />
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-80 overflow-auto">
            {results.map((result) => {
              const Icon = typeIcons[result.type] || SearchIcon;
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 text-left transition-colors',
                    isLight
                      ? 'hover:bg-gray-50 border-b border-gray-100'
                      : 'hover:bg-white/5 border-b border-white/5'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    isLight ? 'bg-gray-100' : 'bg-white/10'
                  )}>
                    <Icon size={18} className={typeColors[result.type]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-bold truncate',
                      isLight ? 'text-gray-900' : 'text-white'
                    )}>
                      {result.title}
                    </p>
                    <p className={cn(
                      'text-sm truncate',
                      isLight ? 'text-gray-500' : 'text-white/50'
                    )}>
                      {result.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {query.length >= 2 && !isLoading && results.length === 0 && (
          <div className={cn(
            'p-8 text-center',
            isLight ? 'text-gray-500' : 'text-white/50'
          )}>
            <p className="font-bold mb-1">No results found</p>
            <p className="text-sm opacity-70">Try a different search term</p>
          </div>
        )}

        {query.length < 2 && (
          <div className={cn(
            'p-8 text-center',
            isLight ? 'text-gray-400' : 'text-white/40'
          )}>
            <p className="text-sm">Type at least 2 characters to search</p>
          </div>
        )}
      </div>
    </div>
  );
}
