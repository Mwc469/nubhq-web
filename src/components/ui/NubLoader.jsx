import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { LOADING_MESSAGES, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

// Animated otter emoji for extra NUB vibes
const OtterSpinner = ({ className }) => (
  <div className={cn("relative", className)}>
    <div className="text-4xl animate-bounce">🦦</div>
    <div className="absolute inset-0 text-4xl animate-ping opacity-30">🦦</div>
  </div>
);

export default function NubLoader({ 
  variant = 'default', // 'default' | 'otter' | 'minimal'
  message,
  rotateMessages = true,
  className 
}) {
  const [currentMessage, setCurrentMessage] = useState(message || pick(LOADING_MESSAGES));

  // Rotate messages every 2.5 seconds if enabled
  useEffect(() => {
    if (!rotateMessages || message) return;
    
    const interval = setInterval(() => {
      setCurrentMessage(pick(LOADING_MESSAGES));
    }, 2500);
    
    return () => clearInterval(interval);
  }, [rotateMessages, message]);

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Loader2 className="w-5 h-5 animate-spin text-[#f19b38]" />
        <span className="text-sm font-bold opacity-70">{currentMessage}</span>
      </div>
    );
  }

  if (variant === 'otter') {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <OtterSpinner className="mb-4" />
        <p className="font-bold text-lg">{currentMessage}</p>
        <p className="text-xs opacity-40 mt-1">Please hold...</p>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="relative mb-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#f19b38]" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-4 border-[#f19b38]/20 animate-pulse" />
      </div>
      <p className="font-bold text-lg">{currentMessage}</p>
      <p className="text-xs opacity-40 mt-1">Your weird is loading</p>
    </div>
  );
}

// Skeleton loader with NUB styling
export function NubSkeleton({ className, lines = 3 }) {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className="h-4 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
          style={{ 
            width: `${Math.random() * 30 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

// Page-level loading state
export function NubPageLoader({ title = "Loading..." }) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative mb-6">
        {/* Outer glow ring */}
        <div className="absolute inset-[-8px] rounded-full bg-[#f19b38]/20 animate-ping" />
        
        {/* Main spinner container */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#a76d24] to-[#f19b38] p-1">
          <div className="w-full h-full rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <span className="text-3xl animate-bounce">🦦</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-black mb-2">{title}{dots}</h2>
      <p className="text-sm opacity-60">{pick(LOADING_MESSAGES)}</p>
    </div>
  );
}
