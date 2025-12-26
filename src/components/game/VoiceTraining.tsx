/**
 * NubHQ Voice Training Prompts
 * Word bubbles to train AI on brand voice
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { haptic } from '@/components/mobile/MobileComponents';
import { XP_REWARDS } from '@/lib/gamification';
import { SkipForward, Sparkles, MessageCircle, Volume2 } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface VoiceOption {
  id: string;
  text: string;
  tone: 'weird' | 'corporate' | 'casual' | 'chaotic' | 'sincere' | 'sarcastic';
  attributes: string[];
}

export interface VoicePrompt {
  id: string;
  scenario: string;
  context?: string;
  category: 'caption' | 'reply' | 'bio' | 'cta' | 'hashtag' | 'story';
  options: VoiceOption[];
}

// ============================================================
// SAMPLE PROMPTS
// ============================================================

export const SAMPLE_VOICE_PROMPTS: VoicePrompt[] = [
  {
    id: 'v1',
    scenario: "Someone comments 'When's your next show?' on a post",
    context: "Replying to a fan asking about upcoming shows",
    category: 'reply',
    options: [
      { id: 'a', text: "Check our bio for dates! 📅", tone: 'corporate', attributes: ['direct', 'informative'] },
      { id: 'b', text: "Soon™ 🦭 (but actually check the link in bio)", tone: 'chaotic', attributes: ['playful', 'absurd', 'helpful'] },
      { id: 'c', text: "When the moon aligns with the walrus constellation. Or like, next Friday. Same thing.", tone: 'weird', attributes: ['absurd', 'funny', 'helpful'] },
      { id: 'd', text: "We'll be there when we get there bestie", tone: 'casual', attributes: ['casual', 'friendly'] },
    ],
  },
  {
    id: 'v2',
    scenario: "Writing a caption for a behind-the-scenes rehearsal video",
    category: 'caption',
    options: [
      { id: 'a', text: "Rehearsal footage! Getting ready for the big show 🎸", tone: 'corporate', attributes: ['straightforward', 'professional'] },
      { id: 'b', text: "POV: you're the wall watching us forget our own lyrics for 3 hours", tone: 'chaotic', attributes: ['self-deprecating', 'funny', 'relatable'] },
      { id: 'c', text: "This is what practice looks like. Mostly arguing about snacks.", tone: 'casual', attributes: ['honest', 'funny', 'behind-the-scenes'] },
      { id: 'd', text: "Rehearsal day which means organized chaos and at least one existential crisis 🎭", tone: 'weird', attributes: ['absurd', 'honest', 'relatable'] },
    ],
  },
  {
    id: 'v3',
    scenario: "Someone asks 'What kind of music do you make?'",
    category: 'reply',
    options: [
      { id: 'a', text: "We're an indie comedy band mixing music with absurdist humor!", tone: 'corporate', attributes: ['professional', 'informative'] },
      { id: 'b', text: "Imagine if a fever dream started a band. That, but with better merch.", tone: 'weird', attributes: ['absurd', 'playful', 'memorable'] },
      { id: 'c', text: "Songs. Sometimes good ones. Mostly weird ones. Always loud.", tone: 'chaotic', attributes: ['honest', 'self-deprecating', 'punchy'] },
      { id: 'd', text: "The kind that makes you laugh, cry, and question everything. In that order.", tone: 'sincere', attributes: ['honest', 'emotional', 'intriguing'] },
    ],
  },
];

// ============================================================
// VOICE TRAINING COMPONENT
// ============================================================

interface VoiceTrainingProps {
  prompt: VoicePrompt;
  onSelect: (optionId: string, option: VoiceOption) => void;
  onSkip: () => void;
  showXp?: boolean;
}

export function VoiceTraining({ prompt, onSelect, onSkip, showXp = true }: VoiceTrainingProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (option: VoiceOption) => {
    if (selected) return;

    setSelected(option.id);
    haptic('medium');

    setTimeout(() => {
      setRevealed(true);
      setTimeout(() => {
        onSelect(option.id, option);
        setSelected(null);
        setRevealed(false);
      }, 800);
    }, 300);
  };

  const getCategoryIcon = () => {
    switch (prompt.category) {
      case 'caption': return '📝';
      case 'reply': return '💬';
      case 'bio': return '👤';
      case 'cta': return '📢';
      case 'hashtag': return '#️⃣';
      case 'story': return '📖';
      default: return '🎤';
    }
  };

  return (
    <div className="bg-white dark:bg-brand-dark border-3 border-black rounded-2xl shadow-[4px_4px_0_#000] overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-neon-pink to-neon-orange text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wide">Voice Training</span>
          <span className="ml-auto text-xl">{getCategoryIcon()}</span>
        </div>
        <p className="text-sm opacity-90">{prompt.context || "Pick the response that sounds most like NUB"}</p>
      </div>

      {/* Scenario */}
      <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 mt-1 text-gray-500" />
          <p className="text-base font-medium">{prompt.scenario}</p>
        </div>
      </div>

      {/* Options as word bubbles */}
      <div className="p-4 space-y-3">
        {prompt.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            disabled={!!selected}
            className={cn(
              "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200",
              "active:scale-[0.98]",
              selected === option.id
                ? "border-neon-pink bg-neon-pink/10 scale-[1.02]"
                : selected
                  ? "border-gray-200 opacity-50"
                  : "border-gray-200 hover:border-neon-pink hover:bg-neon-pink/5",
            )}
          >
            <div className="flex items-start gap-3">
              {/* Option letter bubble */}
              <span className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                selected === option.id
                  ? "bg-neon-pink text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              )}>
                {String.fromCharCode(65 + index)}
              </span>

              {/* Text */}
              <p className="flex-1 text-base leading-relaxed">
                {option.text}
              </p>
            </div>

            {/* Reveal tone on selection */}
            {revealed && selected === option.id && (
              <div className="mt-2 ml-11 flex items-center gap-2 text-sm text-neon-pink">
                <Volume2 className="w-4 h-4" />
                <span className="font-medium capitalize">{option.tone} vibes</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Skip button */}
      <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700">
        <button
          onClick={onSkip}
          disabled={!!selected}
          className="w-full py-3 flex items-center justify-center gap-2 text-gray-500 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
          Skip this one
        </button>

        {showXp && (
          <p className="text-center text-xs text-gray-500 mt-2">
            +{XP_REWARDS.voicePick} XP for picking | +{XP_REWARDS.voiceSkip} XP for skip
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// VOICE TRAINING INTRO
// ============================================================

export function VoiceTrainingIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="text-6xl mb-4">🦭🎤</div>
      <h2 className="text-2xl font-bold mb-2">Voice Training Time!</h2>
      <p className="text-gray-500 mb-6 max-w-[300px]">
        Help us sound more like us. Pick the responses that feel the most NUB.
        Your choices train the AI to write better captions.
      </p>

      <div className="space-y-2 mb-6 text-left text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Takes 30 seconds</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Makes AI smarter</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Earns XP & achievements</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-neon-pink text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all"
      >
        Let's Go! 🚀
      </button>
    </div>
  );
}

export default {
  VoiceTraining,
  VoiceTrainingIntro,
  SAMPLE_VOICE_PROMPTS,
};
