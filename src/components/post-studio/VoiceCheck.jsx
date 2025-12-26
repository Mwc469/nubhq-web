import React, { useState, useEffect } from 'react';
import { voice } from '@/api/nubhqClient';
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2, RefreshCw, Flame } from 'lucide-react';
import NeoBrutalCard from '@/components/ui/NeoBrutalCard';
import NeoBrutalButton from '@/components/ui/NeoBrutalButton';
import { VOICE_SCORE_FEEDBACK, CONTEXTUAL_ROASTS, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

function getScoreFeedback(score) {
  if (score >= 9) return pick(VOICE_SCORE_FEEDBACK.perfect);
  if (score >= 7) return pick(VOICE_SCORE_FEEDBACK.good);
  if (score >= 5) return pick(VOICE_SCORE_FEEDBACK.okay);
  if (score >= 3) return pick(VOICE_SCORE_FEEDBACK.weak);
  return pick(VOICE_SCORE_FEEDBACK.bad);
}

function getScoreEmoji(score) {
  if (score >= 9) return '🔥';
  if (score >= 7) return '👍';
  if (score >= 5) return '😐';
  if (score >= 3) return '😬';
  return '💀';
}

export default function VoiceCheck({ content }) {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [lastCheckedContent, setLastCheckedContent] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const runCheck = async () => {
    if (!content?.trim()) return;
    
    setIsChecking(true);
    try {
      const checkResult = await voice.check(content);
      setResult(checkResult);
      setLastCheckedContent(content);
      setFeedbackMessage(getScoreFeedback(checkResult.score || 5));
    } catch (error) {
      console.error('Voice check failed:', error);
      setResult(null);
    }
    setIsChecking(false);
  };

  // Auto-check when content changes significantly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content?.trim() && content !== lastCheckedContent && content.length > 20) {
        runCheck();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [content]);

  // Contextual roasts based on content
  const getContextualRoast = () => {
    if (!content) return null;
    if (content.length < 30) return CONTEXTUAL_ROASTS.shortCaption;
    if (content.length > 800) return CONTEXTUAL_ROASTS.longCaption;
    if (!content.includes('#')) return CONTEXTUAL_ROASTS.noHashtags;
    return null;
  };

  const contextualRoast = getContextualRoast();
  const score = result?.score || 0;
  const flags = result?.flags || [];
  const suggestions = result?.suggestions || [];
  
  const hasWarnings = flags.length > 0;
  const scoreColor = score >= 8 ? 'green' : score >= 6 ? 'yellow' : score >= 4 ? 'orange' : 'pink';

  return (
    <NeoBrutalCard 
      accentColor={hasWarnings ? 'orange' : score >= 7 ? 'green' : 'yellow'} 
      className="p-4"
      hover={false}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isChecking ? (
            <Loader2 className="w-4 h-4 animate-spin opacity-40" />
          ) : score >= 7 ? (
            <Flame className="w-4 h-4 text-[var(--neon-green)]" />
          ) : hasWarnings ? (
            <ShieldAlert className="w-4 h-4 text-[var(--neon-orange)]" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[var(--neon-yellow)]" />
          )}
          <span className="text-xs uppercase tracking-wider font-bold opacity-60">Voice Check</span>
        </div>
        
        {result && !isChecking && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{getScoreEmoji(score)}</span>
            <span className={cn(
              "text-sm font-black px-2 py-0.5 rounded-full",
              `bg-[var(--neon-${scoreColor})]/20 text-[var(--neon-${scoreColor})]`
            )}>
              {score}/10
            </span>
            <button 
              onClick={runCheck}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Re-check"
            >
              <RefreshCw className="w-3 h-3 opacity-50" />
            </button>
          </div>
        )}
      </div>

      {isChecking ? (
        <div className="space-y-2">
          <p className="text-xs opacity-60">Scanning your weird...</p>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] animate-pulse" />
          </div>
        </div>
      ) : !content?.trim() ? (
        <p className="text-xs opacity-40">Write something and I'll tell you if it sounds like NUB... or a press release. 📝</p>
      ) : !result ? (
        <div className="text-center py-2">
          <NeoBrutalButton 
            variant="ghost" 
            size="sm" 
            onClick={runCheck}
            accentColor="green"
          >
            <ShieldCheck className="w-4 h-4" /> Check Voice
          </NeoBrutalButton>
          <p className="text-xs opacity-40 mt-2">Let's see how weird this is...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Main feedback message - the roast */}
          <div className={cn(
            "p-3 rounded-lg border-2",
            score >= 7 
              ? "bg-[var(--neon-green)]/10 border-[var(--neon-green)]/30"
              : score >= 5
              ? "bg-[var(--neon-yellow)]/10 border-[var(--neon-yellow)]/30"
              : "bg-[var(--neon-orange)]/10 border-[var(--neon-orange)]/30"
          )}>
            <p className={cn(
              "text-sm font-bold",
              score >= 7 ? "text-[var(--neon-green)]" : score >= 5 ? "text-[var(--neon-yellow)]" : "text-[var(--neon-orange)]"
            )}>
              {feedbackMessage}
            </p>
          </div>

          {/* Contextual roast */}
          {contextualRoast && (
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-xs opacity-70 flex items-center gap-2">
                <span>🦦</span>
                <span>{contextualRoast}</span>
              </p>
            </div>
          )}

          {/* Specific flags/warnings */}
          {flags.map((flag, i) => (
            <div 
              key={i}
              className="p-2 rounded-lg bg-[var(--neon-orange)]/10 border border-[var(--neon-orange)]/30"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-[var(--neon-orange)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[var(--neon-orange)]">
                    {flag.issue || flag}
                  </p>
                  {flag.suggestion && (
                    <p className="text-xs opacity-70 mt-0.5">
                      Try: <span className="font-bold text-[var(--neon-green)]">{flag.suggestion}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Suggestions for improvement */}
          {suggestions.length > 0 && score < 8 && (
            <div className="mt-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-xs font-bold opacity-60 mb-1">How to be more NUB:</p>
              <ul className="text-xs opacity-70 space-y-1">
                {suggestions.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Perfect score celebration */}
          {score >= 9 && !hasWarnings && (
            <div className="text-center py-2">
              <p className="text-xs opacity-50">NUB-certified weird 🦦✨</p>
            </div>
          )}
        </div>
      )}
    </NeoBrutalCard>
  );
}
