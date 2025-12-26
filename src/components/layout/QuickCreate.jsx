import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  PenTool,
  Calendar,
  Mail,
  Image,
  Video,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

const createOptions = [
  {
    label: 'New Post',
    icon: PenTool,
    color: 'text-neon-pink',
    bgColor: 'bg-neon-pink/20',
    path: '/post-studio',
    description: 'Create social content',
  },
  {
    label: 'New Event',
    icon: Calendar,
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
    path: '/calendar?newEvent=1',
    description: 'Schedule an event',
  },
  {
    label: 'Email Campaign',
    icon: Mail,
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/20',
    path: '/email-campaigns',
    description: 'Fan transmission',
  },
  {
    label: 'Upload Media',
    icon: Image,
    color: 'text-neon-cyan',
    bgColor: 'bg-neon-cyan/20',
    path: '/media',
    description: 'Add to library',
  },
  {
    label: 'Video Project',
    icon: Video,
    color: 'text-neon-orange',
    bgColor: 'bg-neon-orange/20',
    path: '/video-studio',
    description: 'Motion madness',
  },
  {
    label: 'New Template',
    icon: FileText,
    color: 'text-neon-yellow',
    bgColor: 'bg-neon-yellow/20',
    path: '/templates',
    description: 'Weird blueprint',
  },
];

export default function QuickCreate({ variant = 'default' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    navigate(option.path);
    setIsOpen(false);
  };

  // Compact variant for mobile
  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-xl border-3 transition-all',
            'bg-neon-pink text-white border-black shadow-[4px_4px_0_#000]',
            'hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]',
            'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
          )}
        >
          <Plus size={20} />
        </button>

        {isOpen && (
          <div className={cn(
            'absolute right-0 top-full mt-2 w-64 rounded-xl border-3 overflow-hidden z-50',
            isLight
              ? 'bg-white border-black shadow-[4px_4px_0_#000]'
              : 'bg-gray-900 border-black shadow-[4px_4px_0_#000]'
          )}>
            {createOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left transition-colors',
                    isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', option.bgColor)}>
                    <Icon size={16} className={option.color} />
                  </div>
                  <div>
                    <p className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                      {option.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl border-3 font-bold transition-all',
          'bg-neon-pink text-white border-black shadow-[4px_4px_0_#000]',
          'hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]',
          'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
        )}
      >
        <Plus size={18} />
        <span>Create</span>
        <ChevronDown size={16} className={cn('transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className={cn(
          'absolute right-0 top-full mt-2 w-72 rounded-2xl border-3 overflow-hidden z-50',
          isLight
            ? 'bg-white border-neon-pink shadow-[8px_8px_0_var(--neon-pink)]'
            : 'bg-gray-900 border-neon-pink shadow-[8px_8px_0_var(--neon-pink)]'
        )}>
          <div className="p-2">
            {createOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors',
                    isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', option.bgColor)}>
                    <Icon size={20} className={option.color} />
                  </div>
                  <div>
                    <p className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
                      {option.label}
                    </p>
                    <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
