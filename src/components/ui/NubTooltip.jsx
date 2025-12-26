import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TOOLTIPS } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

// Pre-defined tooltip content with personality
const TOOLTIP_CONTENT = {
  save: {
    text: "Save your weird before it escapes",
    emoji: "💾",
  },
  delete: {
    text: "Yeet this into the void",
    emoji: "🗑️",
  },
  approve: {
    text: "Bless this content with your approval",
    emoji: "✅",
  },
  reject: {
    text: "Send it back for more weird",
    emoji: "↩️",
  },
  upload: {
    text: "Feed the media machine",
    emoji: "📤",
  },
  schedule: {
    text: "Set it and forget it (but don't actually forget it)",
    emoji: "📅",
  },
  generate: {
    text: "Let the AI cook",
    emoji: "🤖",
  },
  preview: {
    text: "See how the sausage looks before serving",
    emoji: "👀",
  },
  copy: {
    text: "Yoink! (Copy to clipboard)",
    emoji: "📋",
  },
  edit: {
    text: "Time to tinker",
    emoji: "✏️",
  },
  refresh: {
    text: "Give it another go",
    emoji: "🔄",
  },
  settings: {
    text: "Tune the machine",
    emoji: "⚙️",
  },
  help: {
    text: "We got you, fam",
    emoji: "❓",
  },
  info: {
    text: "Here's the deal...",
    emoji: "ℹ️",
  },
  warning: {
    text: "Heads up!",
    emoji: "⚠️",
  },
  voiceCheck: {
    text: "How NUB does this sound? (Be honest)",
    emoji: "🎤",
  },
  aiPanel: {
    text: "Let the robots help",
    emoji: "🦾",
  },
  mediaLibrary: {
    text: "Where all your pics live",
    emoji: "🖼️",
  },
  templates: {
    text: "Work smarter, not harder",
    emoji: "📝",
  },
  calendar: {
    text: "Plot your chaos",
    emoji: "📆",
  },
  analytics: {
    text: "Numbers and stuff",
    emoji: "📊",
  },
};

export default function NubTooltip({ 
  children, 
  content,  // string or key from TOOLTIP_CONTENT
  side = 'top',
  showEmoji = true,
  className,
}) {
  // Get content - either from predefined or custom
  const tooltipData = typeof content === 'string' && TOOLTIP_CONTENT[content] 
    ? TOOLTIP_CONTENT[content]
    : { text: content, emoji: null };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className={cn(
            "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs border-2 border-gray-800 dark:border-gray-200 rounded-lg px-3 py-2",
            className
          )}
        >
          <span className="flex items-center gap-1.5">
            {showEmoji && tooltipData.emoji && <span>{tooltipData.emoji}</span>}
            <span>{tooltipData.text}</span>
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper for quick tooltips on buttons
export function TooltipButton({ 
  tooltip, 
  children, 
  onClick, 
  className,
  disabled,
  ...props 
}) {
  return (
    <NubTooltip content={tooltip}>
      <button 
        onClick={onClick} 
        className={className} 
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </NubTooltip>
  );
}
