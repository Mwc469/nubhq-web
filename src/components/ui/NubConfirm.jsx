import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { pick } from '@/lib/nubCopy';
import { cn } from '@/lib/utils';

// Confirmation messages by action type
const CONFIRM_MESSAGES = {
  delete: {
    titles: [
      "Yeet this into the void?",
      "Delete forever?",
      "Say goodbye?",
      "Send it to the shadow realm?",
    ],
    descriptions: [
      "This will be gone forever. Like our dignity at most shows.",
      "No take-backs. This is permanent. Are you SURE?",
      "Once it's gone, it's gone. Like free beer at our shows.",
      "This action cannot be undone. (Unlike our questionable fashion choices.)",
    ],
    confirmText: "Yeet It",
    cancelText: "Nah, Keep It",
    accentColor: "pink",
  },
  reject: {
    titles: [
      "Send it back?",
      "Needs more weird?",
      "Not quite ready?",
    ],
    descriptions: [
      "This will go back to drafts for more work. Be constructive in your feedback!",
      "They'll get another shot. Make sure to tell them WHY.",
      "Back to the drawing board. Hopefully they'll nail it next time.",
    ],
    confirmText: "Send Back",
    cancelText: "Wait, Let Me Think",
    accentColor: "orange",
  },
  approve: {
    titles: [
      "Bless this mess?",
      "Ship it?",
      "Ready for the world?",
    ],
    descriptions: [
      "Once approved, this can be scheduled and posted. No pressure.",
      "You're saying this is good enough for the fans. Big responsibility!",
      "The chaos is about to be unleashed. Are you ready?",
    ],
    confirmText: "Ship It! 🚀",
    cancelText: "Hmm, Let Me Review Again",
    accentColor: "green",
  },
  schedule: {
    titles: [
      "Lock it in?",
      "Set it and forget it?",
      "Schedule the chaos?",
    ],
    descriptions: [
      "This will be posted at the scheduled time. Future you better not forget.",
      "The algorithm awaits your chaos. Confirm the time.",
      "Scheduling content like a responsible adult. Who are you?",
    ],
    confirmText: "Schedule It",
    cancelText: "Wait, When?",
    accentColor: "purple",
  },
  post: {
    titles: [
      "Post it NOW?",
      "Release the chaos?",
      "Let it fly?",
    ],
    descriptions: [
      "This is going live IMMEDIATELY. No take-backs. The fans will see it.",
      "The internet is about to receive your weird. Are you ready?",
      "Once posted, it's out there forever. (Well, until you delete it.)",
    ],
    confirmText: "POST IT! 🔥",
    cancelText: "Wait, I'm Scared",
    accentColor: "cyan",
  },
  discard: {
    titles: [
      "Throw away your work?",
      "Abandon ship?",
      "Lose all this?",
    ],
    descriptions: [
      "You have unsaved changes. They will be lost forever. Like our van keys that one time.",
      "All your beautiful weird will disappear. Sure about that?",
      "Unsaved work = gone. This is your last warning.",
    ],
    confirmText: "Yeah, Toss It",
    cancelText: "Oh No, Save First!",
    accentColor: "yellow",
  },
};

export default function NubConfirm({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  type = 'delete', // 'delete' | 'reject' | 'approve' | 'schedule' | 'post' | 'discard'
  customTitle,
  customDescription,
  confirmText,
  cancelText,
  loading = false,
}) {
  const config = CONFIRM_MESSAGES[type] || CONFIRM_MESSAGES.delete;
  
  const title = customTitle || pick(config.titles);
  const description = customDescription || pick(config.descriptions);
  const confirmLabel = confirmText || config.confirmText;
  const cancelLabel = cancelText || config.cancelText;
  const accentColor = config.accentColor;

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const colorClasses = {
    pink: 'bg-[var(--neon-pink)] hover:bg-[var(--neon-pink)]/90 border-[var(--neon-pink)]',
    orange: 'bg-[var(--neon-orange)] hover:bg-[var(--neon-orange)]/90 border-[var(--neon-orange)]',
    green: 'bg-[var(--neon-green)] hover:bg-[var(--neon-green)]/90 border-[var(--neon-green)]',
    purple: 'bg-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/90 border-[var(--neon-purple)]',
    cyan: 'bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/90 border-[var(--neon-cyan)]',
    yellow: 'bg-[var(--neon-yellow)] hover:bg-[var(--neon-yellow)]/90 border-[var(--neon-yellow)] text-gray-900',
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-3 border-gray-900 dark:border-white rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black flex items-center gap-2">
            <span className="text-2xl">🦦</span>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm opacity-70">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={handleCancel}
            className="font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "font-bold rounded-xl border-2 text-white transition-all",
              colorClasses[accentColor],
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? "Working..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
