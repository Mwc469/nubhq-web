import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import NeoBrutalButton from '@/components/ui/NeoBrutalButton';
import { ONBOARDING, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

const TIPS = [
  { emoji: '🦦', text: "The weirder, the better. Always." },
  { emoji: '🔥', text: "Emojis are your friends. Use them wisely." },
  { emoji: '🚀', text: "Done is better than perfect. Ship it!" },
  { emoji: '🎸', text: "The algorithm loves consistency. Post often!" },
  { emoji: '✨', text: "Templates save time. Use them shamelessly." },
  { emoji: '👀', text: "Check your voice score before posting." },
];

export default function NubWelcome({ 
  userName,
  onDismiss,
  onGetStarted,
}) {
  const [currentTip, setCurrentTip] = useState(0);
  const [welcomeMessage] = useState(() => pick(ONBOARDING.welcome));

  // Rotate tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border-4 border-[#f19b38] shadow-[8px_8px_0_#a76d24] max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#a76d24] via-[#c37f2c] to-[#f19b38] p-6 text-white relative">
          <button 
            onClick={onDismiss}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-5xl mb-4">🦦</div>
          <h1 className="text-2xl font-black mb-2">{welcomeMessage}</h1>
          {userName && (
            <p className="opacity-80">Good to have you, {userName}.</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rotating tip */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--neon-yellow)]" />
              <span className="text-xs uppercase tracking-wider font-bold opacity-60">Pro Tip</span>
            </div>
            <p className="font-bold flex items-center gap-2">
              <span className="text-xl">{TIPS[currentTip].emoji}</span>
              <span>{TIPS[currentTip].text}</span>
            </p>
            {/* Tip indicator dots */}
            <div className="flex gap-1 mt-3 justify-center">
              {TIPS.map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    i === currentTip ? "bg-[var(--neon-pink)] w-3" : "bg-gray-300 dark:bg-gray-600"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Quick start options */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold opacity-60 mb-3">Jump right in:</p>
            <button 
              onClick={() => onGetStarted?.('post')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-2 border-gray-200 dark:border-gray-700"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">✍️</span>
                <span className="font-bold">Create your first post</span>
              </span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </button>
            <button 
              onClick={() => onGetStarted?.('templates')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-2 border-gray-200 dark:border-gray-700"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <span className="font-bold">Browse templates</span>
              </span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </button>
            <button 
              onClick={() => onGetStarted?.('tour')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-2 border-gray-200 dark:border-gray-700"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <span className="font-bold">Take a quick tour</span>
              </span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Skip button */}
          <div className="text-center">
            <button 
              onClick={onDismiss}
              className="text-sm opacity-50 hover:opacity-100 transition-opacity"
            >
              Skip for now — I'll figure it out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Smaller banner version for returning users
export function WelcomeBackBanner({ userName, onDismiss }) {
  const [tip] = useState(() => pick(TIPS));
  
  return (
    <div className="bg-gradient-to-r from-[#a76d24]/10 via-[#c37f2c]/10 to-[#f19b38]/10 border-2 border-[#f19b38]/30 rounded-2xl p-4 mb-6 relative">
      <button 
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
      
      <div className="flex items-center gap-3">
        <span className="text-3xl">🦦</span>
        <div>
          <p className="font-bold">
            Welcome back{userName ? `, ${userName}` : ''}! 
          </p>
          <p className="text-sm opacity-70 flex items-center gap-1">
            <span>{tip.emoji}</span>
            <span>{tip.text}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
