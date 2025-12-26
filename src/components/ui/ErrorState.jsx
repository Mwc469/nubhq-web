/**
 * ErrorState - Snarky error display with retry action
 */
import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { ERROR_MESSAGES, pick } from '@/lib/nubCopy';
import { useNavigate } from 'react-router-dom';

const ERROR_ICONS = ['😵', '💀', '🔥', '😱', '🙈', '💥'];

export default function ErrorState({
  error,
  onRetry,
  type = 'generic', // 'generic' | 'network' | 'save' | 'upload' | 'auth'
  title,
  message,
  showHomeButton = true,
  className,
}) {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  // Get random error message if not provided
  const errorContent = useMemo(() => {
    if (title && message) {
      return { title, message };
    }
    const messages = ERROR_MESSAGES[type] || ERROR_MESSAGES.generic;
    return pick(messages);
  }, [type, title, message]);

  // Random error icon
  const errorIcon = useMemo(() => {
    return ERROR_ICONS[Math.floor(Math.random() * ERROR_ICONS.length)];
  }, []);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-8 text-center",
      className
    )}>
      {/* Animated error icon */}
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-6 border-3 border-dashed border-red-400/50 animate-pulse">
        <span className="text-5xl animate-bounce">{errorIcon}</span>
      </div>

      {/* Error title */}
      <h3 className="text-xl font-black mb-2 text-gray-900 dark:text-white">
        {errorContent.title}
      </h3>

      {/* Error message */}
      <p className="text-gray-600 dark:text-gray-300 text-sm max-w-sm mb-2">
        {errorContent.message}
      </p>

      {/* Technical details (if error object provided) */}
      {error?.message && error.message !== errorContent.message && (
        <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mb-6 font-mono">
          {error.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold",
              "bg-neon-pink text-white border-3 border-black",
              "shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000]",
              "hover:translate-x-[-2px] hover:translate-y-[-2px]",
              "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#000]",
              "transition-all duration-150",
              isRetrying && "opacity-70 cursor-not-allowed"
            )}
          >
            <RefreshCw className={cn("w-4 h-4", isRetrying && "animate-spin")} />
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>
        )}

        {showHomeButton && (
          <button
            onClick={() => navigate('/')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold",
              "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200",
              "border-3 border-black shadow-[4px_4px_0_#000]",
              "hover:shadow-[6px_6px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]",
              "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#000]",
              "transition-all duration-150"
            )}
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        )}
      </div>
    </div>
  );
}
