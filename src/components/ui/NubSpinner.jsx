import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function NubSpinner({
  size = 'md',
  color = 'pink',
  message,
  submessage,
  className,
}) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colors = {
    pink: 'text-neon-pink',
    cyan: 'text-neon-cyan',
    yellow: 'text-neon-yellow',
    green: 'text-neon-green',
    purple: 'text-neon-purple',
    orange: 'text-neon-orange',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Loader2 className={cn(sizes[size], colors[color])} />
      </motion.div>
      {message && (
        <p className="mt-4 font-bold text-lg">{message}</p>
      )}
      {submessage && (
        <p className="text-sm opacity-60">{submessage}</p>
      )}
    </div>
  );
}
