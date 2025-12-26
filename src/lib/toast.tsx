/**
 * NubHQ Toast System
 * Notifications that spark joy
 */

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { getSuccessMessage, getErrorMessage, getWalrusReaction } from '@/lib/personality';

// ============================================================
// TYPES
// ============================================================

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'walrus';

interface ToastOptions {
  duration?: number;
  description?: string;
  id?: string;
}

// ============================================================
// EMOJIS
// ============================================================

const TOAST_EMOJIS: Record<ToastType, string[]> = {
  success: ['✅', '🎉', '✨', '🦭👍', '💪'],
  error: ['❌', '😬', '💥', '🦭😢', '🙈'],
  warning: ['⚠️', '👀', '🦭🤔', '⏰', '📢'],
  info: ['ℹ️', '💡', '🦭', '📝', '🔔'],
  loading: ['🦭', '⏳', '🔄'],
  walrus: ['🦭'],
};

function getEmoji(type: ToastType): string {
  const emojis = TOAST_EMOJIS[type];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// ============================================================
// CORE TOAST FUNCTION
// ============================================================

function showToast(type: ToastType, message: string, options: ToastOptions = {}) {
  const emoji = getEmoji(type);
  const fullMessage = `${emoji} ${message}`;

  const baseOptions = {
    duration: options.duration || 4000,
    description: options.description,
    id: options.id,
  };

  switch (type) {
    case 'success':
      return sonnerToast.success(fullMessage, baseOptions);
    case 'error':
      return sonnerToast.error(fullMessage, baseOptions);
    case 'warning':
      return sonnerToast.warning(fullMessage, baseOptions);
    case 'info':
      return sonnerToast.info(fullMessage, baseOptions);
    case 'loading':
      return sonnerToast.loading(fullMessage, baseOptions);
    case 'walrus':
      return sonnerToast(fullMessage, { ...baseOptions, icon: '🦭' });
    default:
      return sonnerToast(fullMessage, baseOptions);
  }
}

// ============================================================
// TOAST OBJECT
// ============================================================

export const toast = {
  // Basic toasts
  success: (message: string, options?: ToastOptions) => showToast('success', message, options),
  error: (message: string, options?: ToastOptions) => showToast('error', message, options),
  warning: (message: string, options?: ToastOptions) => showToast('warning', message, options),
  info: (message: string, options?: ToastOptions) => showToast('info', message, options),
  loading: (message: string, options?: ToastOptions) => showToast('loading', message, options),
  walrus: (message: string, options?: ToastOptions) => showToast('walrus', message, options),

  // Contextual success
  saved: (options?: ToastOptions) => showToast('success', getSuccessMessage('save'), options),
  created: (options?: ToastOptions) => showToast('success', getSuccessMessage('create'), options),
  updated: (options?: ToastOptions) => showToast('success', getSuccessMessage('update'), options),
  deleted: (options?: ToastOptions) => showToast('success', getSuccessMessage('delete'), options),
  uploaded: (options?: ToastOptions) => showToast('success', getSuccessMessage('upload'), options),
  approved: (options?: ToastOptions) => showToast('success', getSuccessMessage('approve'), options),
  posted: (options?: ToastOptions) => showToast('success', getSuccessMessage('post'), options),
  copied: (options?: ToastOptions) => showToast('success', getSuccessMessage('copy'), options),
  exported: (options?: ToastOptions) => showToast('success', getSuccessMessage('export'), options),

  // Errors
  apiError: (status: number, options?: ToastOptions) => showToast('error', getErrorMessage(status), options),
  networkError: (options?: ToastOptions) => showToast('error', getErrorMessage('network'), options),

  // Walrus reactions
  walrusHappy: (options?: ToastOptions) => showToast('walrus', getWalrusReaction('approve'), options),
  walrusSad: (options?: ToastOptions) => showToast('walrus', getWalrusReaction('reject'), options),
  walrusExcited: (options?: ToastOptions) => showToast('walrus', getWalrusReaction('excited'), options),
  walrusCelebrate: (options?: ToastOptions) => showToast('walrus', getWalrusReaction('celebrate'), options),

  // Promise toast
  promise: (promise: Promise<unknown>, messages: { loading: string; success: string; error: string }) => {
    return sonnerToast.promise(promise, {
      loading: `🦭 ${messages.loading}`,
      success: `${getEmoji('success')} ${messages.success}`,
      error: `${getEmoji('error')} ${messages.error}`,
    });
  },

  // Dismiss
  dismiss: (id?: string) => sonnerToast.dismiss(id),
};

// ============================================================
// ACTION TOASTS
// ============================================================

export const toastActions = {
  draftSaved: () => toast.success("Draft saved! The walrus remembers. 📝"),
  scheduleSet: (date: string) => toast.success(`Scheduled for ${date}! ⏰`),
  sentForApproval: () => toast.info("Sent for approval! Now we wait... 🦭⏳"),
  approvalReceived: () => toast.success("Approved! Time to shine! ✨"),
  rejectionReceived: (reason?: string) => toast.warning(reason || "Rejected. Back to the drawing board! 🎨"),
  uploadComplete: (filename: string) => toast.success(`${filename} uploaded! 📁`),
  uploadFailed: () => toast.error("Upload failed. The tubes are clogged. 🔧"),
  analysisComplete: (count: number) => toast.success(`Found ${count} highlight${count === 1 ? '' : 's'}! 🔥`),
  exportComplete: () => toast.walrusCelebrate(),
  exportFailed: () => toast.error("Export failed. The render gremlins struck again. 👾"),
  copiedToClipboard: () => toast.copied(),
  linkCopied: () => toast.success("Link copied! Share the chaos! 🔗"),
};

// ============================================================
// ACHIEVEMENT TOAST
// ============================================================

export function toastAchievement(title: string, description: string) {
  const AchievementComponent = () => (
    <div className="bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-orange)] text-white p-4 rounded-xl border-2 border-black shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏆</span>
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );

  return sonnerToast.custom(AchievementComponent, { duration: 5000 });
}

export default toast;
