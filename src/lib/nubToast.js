// NUB-style toast notifications
// Use with sonner or your preferred toast library

import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, pick } from '@/lib/nubCopy';

// Success toasts
export const nubToast = {
  success: (type = 'saved', customMessage) => {
    const messages = SUCCESS_MESSAGES[type] || SUCCESS_MESSAGES.saved;
    toast.success(customMessage || pick(messages), {
      className: 'border-2 border-[var(--neon-green)] bg-[var(--neon-green)]/10',
    });
  },
  
  error: (type = 'generic', customMessage) => {
    const errors = ERROR_MESSAGES[type] || ERROR_MESSAGES.generic;
    const error = pick(errors);
    toast.error(customMessage || error.title, {
      description: error.message,
      className: 'border-2 border-[var(--neon-pink)] bg-[var(--neon-pink)]/10',
    });
  },
  
  // Specific success types
  saved: (custom) => nubToast.success('saved', custom),
  approved: (custom) => nubToast.success('approved', custom),
  rejected: (custom) => nubToast.success('rejected', custom),
  scheduled: (custom) => nubToast.success('scheduled', custom),
  posted: (custom) => nubToast.success('posted', custom),
  uploaded: (custom) => nubToast.success('uploaded', custom),
  deleted: (custom) => nubToast.success('deleted', custom),
  
  // Info/warning
  info: (message, description) => {
    toast.info(message, {
      description,
      className: 'border-2 border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10',
    });
  },
  
  warning: (message, description) => {
    toast.warning(message, {
      description,
      className: 'border-2 border-[var(--neon-yellow)] bg-[var(--neon-yellow)]/10',
    });
  },
  
  // Celebration toast (with emoji explosion effect)
  celebrate: (message) => {
    toast.success(message || "YEAHHHHHH! 🎉", {
      className: 'border-2 border-[var(--neon-green)] bg-gradient-to-r from-[var(--neon-pink)]/20 to-[var(--neon-purple)]/20',
      duration: 4000,
    });
  },
  
  // Roast toast (for gentle user roasts)
  roast: (message) => {
    toast(message, {
      icon: '🦦',
      className: 'border-2 border-[var(--neon-orange)] bg-[var(--neon-orange)]/10',
    });
  },
};

export default nubToast;
