import { cn } from '@/lib/utils';

// Base otter colors
const otterColors = {
  body: 'text-amber-600 dark:text-amber-500',
  belly: 'text-amber-200 dark:text-amber-300',
  dark: 'text-amber-700 dark:text-amber-600',
  eyes: 'text-gray-900 dark:text-gray-800',
};

// Otter with blank canvas - for "no posts" state
export function OtterWithCanvas({ className }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-32 h-28', className)}>
      {/* Canvas/Easel */}
      <rect x="55" y="15" width="50" height="40" rx="2" fill="currentColor" className="text-gray-200 dark:text-gray-700" stroke="currentColor" strokeWidth="2" />
      <line x1="80" y1="55" x2="70" y2="85" stroke="currentColor" strokeWidth="3" className="text-amber-800 dark:text-amber-700" />
      <line x1="80" y1="55" x2="90" y2="85" stroke="currentColor" strokeWidth="3" className="text-amber-800 dark:text-amber-700" />

      {/* Otter body */}
      <ellipse cx="30" cy="65" rx="20" ry="15" fill="currentColor" className={otterColors.body} />
      <ellipse cx="30" cy="68" rx="14" ry="10" fill="currentColor" className={otterColors.belly} />

      {/* Otter head */}
      <circle cx="30" cy="42" r="16" fill="currentColor" className={otterColors.body} />
      <ellipse cx="30" cy="45" rx="11" ry="9" fill="currentColor" className={otterColors.belly} />

      {/* Ears */}
      <circle cx="17" cy="32" r="4" fill="currentColor" className={otterColors.body} />
      <circle cx="43" cy="32" r="4" fill="currentColor" className={otterColors.body} />

      {/* Eyes - looking at canvas */}
      <circle cx="24" cy="40" r="3" fill="currentColor" className={otterColors.eyes} />
      <circle cx="36" cy="40" r="3" fill="currentColor" className={otterColors.eyes} />
      <circle cx="25" cy="39" r="1" fill="white" />
      <circle cx="37" cy="39" r="1" fill="white" />

      {/* Nose */}
      <ellipse cx="30" cy="48" rx="3" ry="2" fill="currentColor" className={otterColors.eyes} />

      {/* Arm holding paintbrush */}
      <ellipse cx="48" cy="58" rx="6" ry="4" fill="currentColor" className={otterColors.dark} transform="rotate(-30 48 58)" />
      <line x1="52" y1="54" x2="60" y2="35" stroke="currentColor" strokeWidth="2" className="text-amber-800" />
      <circle cx="60" cy="33" r="3" fill="currentColor" className="text-pink-500" />

      {/* Tail */}
      <ellipse cx="8" cy="70" rx="10" ry="5" fill="currentColor" className={otterColors.body} transform="rotate(-15 8 70)" />

      {/* Question marks on canvas */}
      <text x="72" y="38" fontSize="14" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontFamily="Space Grotesk">?</text>
      <text x="82" y="32" fontSize="10" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontFamily="Space Grotesk">?</text>
    </svg>
  );
}

// Relaxing otter - for "approval queue empty" state
export function OtterRelaxing({ className }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-32 h-24', className)}>
      {/* Water */}
      <ellipse cx="60" cy="60" rx="55" ry="15" fill="currentColor" className="text-cyan-400/30 dark:text-cyan-500/20" />

      {/* Otter body - floating on back */}
      <ellipse cx="60" cy="45" rx="30" ry="12" fill="currentColor" className={otterColors.body} />
      <ellipse cx="60" cy="45" rx="22" ry="8" fill="currentColor" className={otterColors.belly} />

      {/* Head */}
      <circle cx="28" cy="40" r="14" fill="currentColor" className={otterColors.body} />
      <ellipse cx="28" cy="42" rx="10" ry="7" fill="currentColor" className={otterColors.belly} />

      {/* Closed happy eyes */}
      <path d="M22 38 Q25 35 28 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" className={otterColors.eyes} />
      <path d="M28 38 Q31 35 34 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" className={otterColors.eyes} />

      {/* Smile */}
      <path d="M24 44 Q28 48 32 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" className={otterColors.eyes} />

      {/* Nose */}
      <ellipse cx="28" cy="42" rx="2" ry="1.5" fill="currentColor" className={otterColors.eyes} />

      {/* Ears */}
      <circle cx="17" cy="32" r="3" fill="currentColor" className={otterColors.body} />
      <circle cx="39" cy="32" r="3" fill="currentColor" className={otterColors.body} />

      {/* Paws on belly */}
      <ellipse cx="55" cy="40" rx="5" ry="4" fill="currentColor" className={otterColors.dark} />
      <ellipse cx="65" cy="40" rx="5" ry="4" fill="currentColor" className={otterColors.dark} />

      {/* Tail */}
      <ellipse cx="95" cy="48" rx="10" ry="4" fill="currentColor" className={otterColors.body} />

      {/* Sunglasses */}
      <rect x="20" y="35" width="7" height="5" rx="1" fill="currentColor" className="text-gray-900" />
      <rect x="29" y="35" width="7" height="5" rx="1" fill="currentColor" className="text-gray-900" />
      <line x1="27" y1="37" x2="29" y2="37" stroke="currentColor" strokeWidth="1" className="text-gray-900" />

      {/* Z's for sleeping/relaxing */}
      <text x="40" y="25" fontSize="10" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontFamily="Space Grotesk">z</text>
      <text x="48" y="18" fontSize="12" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontFamily="Space Grotesk">Z</text>
      <text x="58" y="10" fontSize="14" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontFamily="Space Grotesk">Z</text>
    </svg>
  );
}

// Otter with camera - for "no media" state
export function OtterWithCamera({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-28 h-28', className)}>
      {/* Otter body */}
      <ellipse cx="50" cy="70" rx="22" ry="16" fill="currentColor" className={otterColors.body} />
      <ellipse cx="50" cy="73" rx="16" ry="11" fill="currentColor" className={otterColors.belly} />

      {/* Head */}
      <circle cx="50" cy="45" r="18" fill="currentColor" className={otterColors.body} />
      <ellipse cx="50" cy="48" rx="13" ry="10" fill="currentColor" className={otterColors.belly} />

      {/* Ears */}
      <circle cx="35" cy="33" r="4" fill="currentColor" className={otterColors.body} />
      <circle cx="65" cy="33" r="4" fill="currentColor" className={otterColors.body} />

      {/* Eyes - peeking over camera */}
      <circle cx="42" cy="40" r="4" fill="currentColor" className={otterColors.eyes} />
      <circle cx="58" cy="40" r="4" fill="currentColor" className={otterColors.eyes} />
      <circle cx="43" cy="39" r="1.5" fill="white" />
      <circle cx="59" cy="39" r="1.5" fill="white" />

      {/* Camera body */}
      <rect x="30" y="52" width="40" height="25" rx="3" fill="currentColor" className="text-gray-700 dark:text-gray-600" />
      <rect x="33" y="55" width="34" height="19" rx="2" fill="currentColor" className="text-gray-800 dark:text-gray-700" />

      {/* Camera lens */}
      <circle cx="50" cy="64" r="10" fill="currentColor" className="text-gray-600 dark:text-gray-500" />
      <circle cx="50" cy="64" r="7" fill="currentColor" className="text-gray-900 dark:text-gray-800" />
      <circle cx="50" cy="64" r="4" fill="currentColor" className="text-cyan-400" />
      <circle cx="48" cy="62" r="1.5" fill="white" opacity="0.6" />

      {/* Flash */}
      <rect x="58" y="49" width="8" height="5" rx="1" fill="currentColor" className="text-gray-600 dark:text-gray-500" />

      {/* Paws holding camera */}
      <ellipse cx="28" cy="65" rx="5" ry="4" fill="currentColor" className={otterColors.dark} />
      <ellipse cx="72" cy="65" rx="5" ry="4" fill="currentColor" className={otterColors.dark} />

      {/* Tail */}
      <ellipse cx="78" cy="78" rx="10" ry="5" fill="currentColor" className={otterColors.body} transform="rotate(-20 78 78)" />
    </svg>
  );
}

// Otter celebrating - for success states
export function OtterCelebrating({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-28 h-28', className)}>
      {/* Confetti */}
      <rect x="15" y="10" width="4" height="4" fill="currentColor" className="text-pink-500" transform="rotate(15 15 10)" />
      <rect x="80" y="15" width="4" height="4" fill="currentColor" className="text-cyan-400" transform="rotate(-20 80 15)" />
      <rect x="25" y="20" width="3" height="3" fill="currentColor" className="text-yellow-400" transform="rotate(45 25 20)" />
      <rect x="70" y="8" width="3" height="3" fill="currentColor" className="text-green-400" transform="rotate(30 70 8)" />
      <circle cx="85" cy="30" r="2" fill="currentColor" className="text-purple-400" />
      <circle cx="12" cy="25" r="2" fill="currentColor" className="text-orange-400" />

      {/* Otter body */}
      <ellipse cx="50" cy="70" rx="20" ry="15" fill="currentColor" className={otterColors.body} />
      <ellipse cx="50" cy="72" rx="14" ry="10" fill="currentColor" className={otterColors.belly} />

      {/* Head */}
      <circle cx="50" cy="45" r="16" fill="currentColor" className={otterColors.body} />
      <ellipse cx="50" cy="48" rx="11" ry="8" fill="currentColor" className={otterColors.belly} />

      {/* Ears */}
      <circle cx="37" cy="34" r="4" fill="currentColor" className={otterColors.body} />
      <circle cx="63" cy="34" r="4" fill="currentColor" className={otterColors.body} />

      {/* Happy eyes */}
      <path d="M42 44 Q45 40 48 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" className={otterColors.eyes} />
      <path d="M52 44 Q55 40 58 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" className={otterColors.eyes} />

      {/* Big smile */}
      <path d="M42 50 Q50 58 58 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" className={otterColors.eyes} />

      {/* Nose */}
      <ellipse cx="50" cy="48" rx="2.5" ry="1.5" fill="currentColor" className={otterColors.eyes} />

      {/* Arms raised */}
      <ellipse cx="28" cy="50" rx="6" ry="4" fill="currentColor" className={otterColors.dark} transform="rotate(-45 28 50)" />
      <ellipse cx="72" cy="50" rx="6" ry="4" fill="currentColor" className={otterColors.dark} transform="rotate(45 72 50)" />

      {/* Paws */}
      <ellipse cx="22" cy="44" rx="4" ry="3" fill="currentColor" className={otterColors.dark} />
      <ellipse cx="78" cy="44" rx="4" ry="3" fill="currentColor" className={otterColors.dark} />

      {/* Tail wagging */}
      <ellipse cx="75" cy="78" rx="10" ry="4" fill="currentColor" className={otterColors.body} transform="rotate(-30 75 78)" />
    </svg>
  );
}

// Otter looking sad/confused - for error states
export function OtterConfused({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-28 h-28', className)}>
      {/* Otter body */}
      <ellipse cx="50" cy="70" rx="20" ry="15" fill="currentColor" className={otterColors.body} />
      <ellipse cx="50" cy="72" rx="14" ry="10" fill="currentColor" className={otterColors.belly} />

      {/* Head tilted */}
      <circle cx="50" cy="45" r="16" fill="currentColor" className={otterColors.body} />
      <ellipse cx="50" cy="48" rx="11" ry="8" fill="currentColor" className={otterColors.belly} />

      {/* Ears */}
      <circle cx="37" cy="34" r="4" fill="currentColor" className={otterColors.body} />
      <circle cx="63" cy="34" r="4" fill="currentColor" className={otterColors.body} />

      {/* Worried eyes */}
      <circle cx="44" cy="43" r="3.5" fill="currentColor" className={otterColors.eyes} />
      <circle cx="56" cy="43" r="3.5" fill="currentColor" className={otterColors.eyes} />
      <circle cx="45" cy="42" r="1" fill="white" />
      <circle cx="57" cy="42" r="1" fill="white" />

      {/* Worried eyebrows */}
      <path d="M40 38 L48 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={otterColors.eyes} />
      <path d="M60 38 L52 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={otterColors.eyes} />

      {/* Small frown */}
      <path d="M46 52 Q50 50 54 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" className={otterColors.eyes} />

      {/* Nose */}
      <ellipse cx="50" cy="48" rx="2.5" ry="1.5" fill="currentColor" className={otterColors.eyes} />

      {/* Question mark */}
      <text x="68" y="30" fontSize="18" fontWeight="bold" fill="currentColor" className="text-pink-500" fontFamily="Space Grotesk">?</text>

      {/* Paws together */}
      <ellipse cx="42" cy="62" rx="5" ry="4" fill="currentColor" className={otterColors.dark} />
      <ellipse cx="58" cy="62" rx="5" ry="4" fill="currentColor" className={otterColors.dark} />

      {/* Tail drooped */}
      <ellipse cx="75" cy="80" rx="10" ry="4" fill="currentColor" className={otterColors.body} transform="rotate(10 75 80)" />
    </svg>
  );
}

// Otter with inbox - for "inbox empty" state
export function OtterWithInbox({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-28 h-28', className)}>
      {/* Mailbox */}
      <rect x="55" y="35" width="30" height="20" rx="2" fill="currentColor" className="text-gray-600 dark:text-gray-500" />
      <path d="M55 40 L70 50 L85 40" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-400" fill="none" />
      <rect x="65" y="55" width="10" height="25" fill="currentColor" className="text-amber-800 dark:text-amber-700" />

      {/* Otter body */}
      <ellipse cx="35" cy="70" rx="20" ry="15" fill="currentColor" className={otterColors.body} />
      <ellipse cx="35" cy="72" rx="14" ry="10" fill="currentColor" className={otterColors.belly} />

      {/* Head looking at mailbox */}
      <circle cx="38" cy="45" r="16" fill="currentColor" className={otterColors.body} />
      <ellipse cx="40" cy="48" rx="11" ry="8" fill="currentColor" className={otterColors.belly} />

      {/* Ears */}
      <circle cx="26" cy="34" r="4" fill="currentColor" className={otterColors.body} />
      <circle cx="50" cy="34" r="4" fill="currentColor" className={otterColors.body} />

      {/* Eyes looking at mailbox */}
      <circle cx="36" cy="43" r="3" fill="currentColor" className={otterColors.eyes} />
      <circle cx="46" cy="43" r="3" fill="currentColor" className={otterColors.eyes} />
      <circle cx="37.5" cy="42" r="1" fill="white" />
      <circle cx="47.5" cy="42" r="1" fill="white" />

      {/* Hopeful expression */}
      <path d="M38 52 Q42 54 46 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" className={otterColors.eyes} />

      {/* Nose */}
      <ellipse cx="42" cy="48" rx="2.5" ry="1.5" fill="currentColor" className={otterColors.eyes} />

      {/* Paw reaching toward mailbox */}
      <ellipse cx="52" cy="58" rx="5" ry="4" fill="currentColor" className={otterColors.dark} transform="rotate(-30 52 58)" />

      {/* Tail */}
      <ellipse cx="12" cy="75" rx="10" ry="4" fill="currentColor" className={otterColors.body} transform="rotate(-10 12 75)" />
    </svg>
  );
}

export default {
  OtterWithCanvas,
  OtterRelaxing,
  OtterWithCamera,
  OtterCelebrating,
  OtterConfused,
  OtterWithInbox,
};
