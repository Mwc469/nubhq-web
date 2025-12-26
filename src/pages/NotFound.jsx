import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import NeoBrutalButton from '@/components/ui/NeoBrutalButton';
import { NOT_FOUND, pick } from '@/lib/nubCopy';

const OTTER_MESSAGES = [
  "The otter searched everywhere. Nothing.",
  "Even the otter is confused. And otters are smart.",
  "The otter shrugs. This page doesn't exist.",
  "🦦 < 'I got nothing, chief.'",
];

const HELPFUL_SUGGESTIONS = [
  { text: "Go to Dashboard", path: "/" },
  { text: "Create a Post", path: "/post-studio" },
  { text: "Check Approvals", path: "/approvals" },
  { text: "Media Library", path: "/media" },
];

export default function NotFound() {
  const [title] = useState(() => pick(NOT_FOUND.titles));
  const [message] = useState(() => pick(NOT_FOUND.messages));
  const [otterMessage, setOtterMessage] = useState(() => pick(OTTER_MESSAGES));
  
  // Easter egg: click the otter to get new messages
  const shuffleOtter = () => {
    setOtterMessage(pick(OTTER_MESSAGES));
  };

  // Floating animation for the otter
  const [otterY, setOtterY] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setOtterY(Math.sin(Date.now() / 500) * 10);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Giant 404 with neon effect */}
      <div className="relative mb-8">
        <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#a76d24] via-[#f19b38] to-[#d4a017]">
          404
        </h1>
        <div className="absolute inset-0 text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-[#f19b38] opacity-20 blur-xl">
          404
        </div>
      </div>

      {/* Floating otter */}
      <button 
        onClick={shuffleOtter}
        className="text-6xl mb-6 cursor-pointer hover:scale-110 transition-transform focus:outline-none"
        style={{ transform: `translateY(${otterY}px)` }}
        title="Click me!"
      >
        🦦
      </button>

      {/* Title and message */}
      <h2 className="text-2xl md:text-3xl font-black mb-3">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-2">{message}</p>
      <p className="text-sm opacity-50 italic mb-8">{otterMessage}</p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <Link to="/">
          <NeoBrutalButton accentColor="pink">
            <Home className="w-4 h-4" />
            Back to HQ
          </NeoBrutalButton>
        </Link>
        <button onClick={() => window.history.back()}>
          <NeoBrutalButton variant="outline" accentColor="cyan">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </NeoBrutalButton>
        </button>
      </div>

      {/* Helpful suggestions */}
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-wider opacity-50 mb-4">Maybe you meant to go here?</p>
        <div className="grid grid-cols-2 gap-2">
          {HELPFUL_SUGGESTIONS.map((suggestion) => (
            <Link
              key={suggestion.path}
              to={suggestion.path}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-bold"
            >
              {suggestion.text}
            </Link>
          ))}
        </div>
      </div>

      {/* Easter egg hint */}
      <p className="text-xs opacity-30 mt-12">
        (Psst... click the otter)
      </p>
    </div>
  );
}
