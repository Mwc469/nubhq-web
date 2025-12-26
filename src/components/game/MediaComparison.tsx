/**
 * NubHQ Media Comparison Picker
 * Side-by-side video/image comparisons to train editing preferences
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { haptic } from '@/components/mobile/MobileComponents';
import { XP_REWARDS } from '@/lib/gamification';
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Check,
  Palette,
  Zap,
  Film,
  Type,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface MediaOption {
  id: string;
  thumbnailUrl: string;
  videoUrl?: string;
  label: string;
  description?: string;
  settings: Record<string, unknown>;
}

export interface MediaComparison {
  id: string;
  title: string;
  description: string;
  category: 'intro' | 'outro' | 'transition' | 'color' | 'pacing' | 'subtitle' | 'crop';
  optionA: MediaOption;
  optionB: MediaOption;
}

// ============================================================
// SAMPLE COMPARISONS
// ============================================================

export const SAMPLE_COMPARISONS: MediaComparison[] = [
  {
    id: 'm1',
    title: 'Intro Style',
    description: 'Which intro grabs attention better?',
    category: 'intro',
    optionA: {
      id: 'intro-full',
      thumbnailUrl: 'https://picsum.photos/300/400?random=10',
      label: 'Full Logo Animation',
      description: '3 second animated logo',
      settings: { intro_style: 'full', intro_duration: 3 },
    },
    optionB: {
      id: 'intro-quick',
      thumbnailUrl: 'https://picsum.photos/300/400?random=11',
      label: 'Quick Flash',
      description: '0.5 second logo flash',
      settings: { intro_style: 'quick', intro_duration: 0.5 },
    },
  },
  {
    id: 'm2',
    title: 'Subtitle Style',
    description: 'Which subtitles fit the vibe?',
    category: 'subtitle',
    optionA: {
      id: 'sub-karaoke',
      thumbnailUrl: 'https://picsum.photos/300/400?random=12',
      label: 'Karaoke Style',
      description: 'Word-by-word highlight',
      settings: { subtitle_style: 'karaoke', word_highlight: true },
    },
    optionB: {
      id: 'sub-minimal',
      thumbnailUrl: 'https://picsum.photos/300/400?random=13',
      label: 'Clean Minimal',
      description: 'Simple white text',
      settings: { subtitle_style: 'minimal', word_highlight: false },
    },
  },
];

// ============================================================
// CATEGORY ICONS
// ============================================================

const CATEGORY_ICONS: Record<MediaComparison['category'], React.ReactNode> = {
  intro: <Film className="w-5 h-5" />,
  outro: <Film className="w-5 h-5" />,
  transition: <Zap className="w-5 h-5" />,
  color: <Palette className="w-5 h-5" />,
  pacing: <Zap className="w-5 h-5" />,
  subtitle: <Type className="w-5 h-5" />,
  crop: <Film className="w-5 h-5" />,
};

// ============================================================
// MEDIA COMPARISON COMPONENT
// ============================================================

interface MediaComparisonPickerProps {
  comparison: MediaComparison;
  onPickA: () => void;
  onPickB: () => void;
  onSkip: () => void;
  showXp?: boolean;
}

export function MediaComparisonPicker({
  comparison,
  onPickA,
  onPickB,
  onSkip,
  showXp = true,
}: MediaComparisonPickerProps) {
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const handlePick = (choice: 'a' | 'b') => {
    setSelected(choice);
    haptic('success');

    // Visual feedback then callback
    setTimeout(() => {
      choice === 'a' ? onPickA() : onPickB();
      setSelected(null);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-brand-dark border-3 border-black rounded-2xl shadow-[4px_4px_0_#000] overflow-hidden max-w-lg mx-auto">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-2 mb-1">
          {CATEGORY_ICONS[comparison.category]}
          <span className="text-sm font-bold uppercase tracking-wide">{comparison.category}</span>
        </div>
        <h3 className="text-lg font-bold">{comparison.title}</h3>
        <p className="text-sm opacity-90">{comparison.description}</p>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {/* Option A */}
        <button
          onClick={() => handlePick('a')}
          disabled={selected !== null}
          className={cn(
            "relative rounded-xl overflow-hidden border-3 transition-all duration-200",
            selected === 'a'
              ? "border-green-500 ring-4 ring-green-200 scale-[1.02]"
              : selected === 'b'
                ? "border-gray-200 opacity-50 scale-95"
                : "border-gray-200 hover:border-neon-pink active:scale-95"
          )}
        >
          {/* Media */}
          <div className="aspect-[9/16] bg-gray-200">
            <img
              src={comparison.optionA.thumbnailUrl}
              alt={comparison.optionA.label}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Label */}
          <div className="p-3 bg-white dark:bg-brand-dark">
            <p className="font-bold text-sm">{comparison.optionA.label}</p>
            {comparison.optionA.description && (
              <p className="text-xs text-gray-500">{comparison.optionA.description}</p>
            )}
          </div>

          {/* Selected checkmark */}
          {selected === 'a' && (
            <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}

          {/* A badge */}
          <div className="absolute top-2 left-2 w-6 h-6 bg-neon-pink text-white rounded-full flex items-center justify-center text-xs font-bold">
            A
          </div>
        </button>

        {/* Option B */}
        <button
          onClick={() => handlePick('b')}
          disabled={selected !== null}
          className={cn(
            "relative rounded-xl overflow-hidden border-3 transition-all duration-200",
            selected === 'b'
              ? "border-green-500 ring-4 ring-green-200 scale-[1.02]"
              : selected === 'a'
                ? "border-gray-200 opacity-50 scale-95"
                : "border-gray-200 hover:border-neon-pink active:scale-95"
          )}
        >
          {/* Media */}
          <div className="aspect-[9/16] bg-gray-200">
            <img
              src={comparison.optionB.thumbnailUrl}
              alt={comparison.optionB.label}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Label */}
          <div className="p-3 bg-white dark:bg-brand-dark">
            <p className="font-bold text-sm">{comparison.optionB.label}</p>
            {comparison.optionB.description && (
              <p className="text-xs text-gray-500">{comparison.optionB.description}</p>
            )}
          </div>

          {/* Selected checkmark */}
          {selected === 'b' && (
            <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}

          {/* B badge */}
          <div className="absolute top-2 left-2 w-6 h-6 bg-neon-pink text-white rounded-full flex items-center justify-center text-xs font-bold">
            B
          </div>
        </button>
      </div>

      {/* Skip & XP info */}
      <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700">
        <button
          onClick={onSkip}
          disabled={selected !== null}
          className="w-full py-3 flex items-center justify-center gap-2 text-gray-500 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
          Skip this one
        </button>

        {showXp && (
          <p className="text-center text-xs text-gray-500 mt-2">
            +{XP_REWARDS.mediaPick} XP for picking | +{XP_REWARDS.mediaSkip} XP for skip
          </p>
        )}
      </div>
    </div>
  );
}

export default {
  MediaComparisonPicker,
  SAMPLE_COMPARISONS,
};
