import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CLIPBOARD_MESSAGES, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

export default function NubCopyButton({ 
  text, 
  onCopy,
  className,
  showToast = true,
  variant = 'icon' // 'icon' | 'button'
}) {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      const newMessage = pick(CLIPBOARD_MESSAGES);
      setMessage(newMessage);
      setCopied(true);
      onCopy?.(text);
      
      setTimeout(() => {
        setCopied(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
          copied 
            ? "bg-[var(--neon-green)]/20 text-[var(--neon-green)] border-2 border-[var(--neon-green)]"
            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent",
          className
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            {message || 'Copied!'}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy
          </>
        )}
      </button>
    );
  }

  // Icon variant (default)
  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className={cn(
          "p-1.5 rounded-lg transition-all",
          copied 
            ? "text-[var(--neon-green)]"
            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
          className
        )}
        title={copied ? message : "Copy to clipboard"}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      
      {/* Tooltip with message */}
      {copied && showToast && message && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-[var(--neon-green)]/20 border border-[var(--neon-green)] text-[var(--neon-green)] text-xs font-bold whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
          {message}
        </div>
      )}
    </div>
  );
}
