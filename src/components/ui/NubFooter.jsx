import React, { useState, useEffect } from 'react';
import { FOOTER_QUIPS, pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

export default function NubFooter({ className }) {
  const [quip, setQuip] = useState(() => pick(FOOTER_QUIPS));

  // Change quip every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuip(pick(FOOTER_QUIPS));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className={cn(
      "py-6 px-4 text-center border-t-2 border-gray-200 dark:border-gray-800",
      className
    )}>
      <p className="text-xs opacity-50 hover:opacity-100 transition-opacity cursor-default">
        {quip}
      </p>
      <p className="text-[10px] opacity-30 mt-1">
        NubHQ v5.0 • {year} • Take Weird Seriously
      </p>
    </footer>
  );
}
