import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Loader2, Mail, Calendar, CheckSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const typeIcons = {
  approval: CheckSquare,
  fan_mail: Mail,
  calendar: Calendar,
};

const typeColors = {
  approval: 'text-yellow-400',
  fan_mail: 'text-blue-400',
  calendar: 'text-green-400',
};

export default function Search() {
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 border-3 border-black transition-colors ${
          isLight
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            : 'bg-white/5 hover:bg-white/10 text-white/60'
        }`}
      >
        <SearchIcon size={18} />
        <span className="hidden sm:inline text-sm">Search...</span>
        <kbd className={`hidden sm:inline text-xs px-1.5 py-0.5 ml-2 ${isLight ? 'bg-gray-200' : 'bg-white/10'}`}>
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div className={`relative w-full max-w-lg border-3 border-black shadow-brutal ${isLight ? 'bg-white' : 'bg-brand-dark'}`}>
        <div className="flex items-center gap-3 p-4 border-b-3 border-black">
          <SearchIcon size={20} className={isLight ? 'text-gray-400' : 'text-white/40'} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, posts, approvals..."
            className={`flex-1 bg-transparent outline-none text-lg ${isLight ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-white/40'}`}
          />
          {isLoading && <Loader2 size={20} className="animate-spin text-brand-orange" />}
          <button onClick={() => setIsOpen(false)} className={isLight ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white'}>
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
                  className={`w-full flex items-start gap-3 p-4 text-left transition-colors ${
                    isLight
                      ? 'hover:bg-gray-100 border-b border-gray-100'
                      : 'hover:bg-white/5 border-b border-white/10'
                  }`}
                >
                  <Icon size={18} className={typeColors[result.type]} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {result.title}
                    </p>
                    <p className={`text-sm truncate ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                      {result.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {query.length >= 2 && !isLoading && results.length === 0 && (
          <div className={`p-8 text-center ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
            No results found for "{query}"
          </div>
        )}

        {query.length < 2 && (
          <div className={`p-8 text-center ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
            Type at least 2 characters to search
          </div>
        )}
      </div>
    </div>
  );
}
