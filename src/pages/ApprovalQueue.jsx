import { useState } from 'react';
import { Check, X, Clock, MessageSquare, Loader2, CheckSquare, Square, Sparkles, Gamepad2, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton, SkeletonList } from '../components/ui/Skeleton';
import { useApprovals, useApprove, useReject } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { useInteraction } from '../hooks/useInteraction';
import { useFloatingXp } from '../components/ui/FloatingXp';
import { playSound } from '../lib/soundSystem';

const ApprovalCard = ({ item, onApprove, onReject, isApproving, isRejecting, isSelected, onToggleSelect }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { tap } = useInteraction();

  return (
    <NeoBrutalCard accentColor="yellow" className="space-y-4 hover:scale-[1.01] transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleSelect(item.id)}
            className={cn(
              'p-1 transition-colors rounded-lg',
              isLight ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-white/40 hover:text-white hover:bg-white/10'
            )}
          >
            {isSelected ? (
              <CheckSquare size={20} className="text-neon-pink" />
            ) : (
              <Square size={20} />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
              <MessageSquare size={16} className="text-neon-cyan" />
            </div>
            <span className={cn('text-sm font-bold', isLight ? 'text-gray-600' : 'text-white/60')}>
              Message to {item.recipient}
            </span>
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-1 text-xs px-2 py-1 rounded-lg',
          isLight ? 'text-gray-400 bg-gray-100' : 'text-white/40 bg-white/5'
        )}>
          <Clock size={12} />
          <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
        </div>
      </div>

      <p className={cn('text-lg leading-relaxed', isLight ? 'text-gray-900' : 'text-white')}>
        {item.content}
      </p>

      <div className="flex gap-3 pt-2">
        <NeoBrutalButton
          accentColor="green"
          size="sm"
          onClick={(e) => {
            playSound('approve');
            onApprove(item.id, e);
          }}
          disabled={isApproving || isRejecting}
          className="active:scale-95 transition-transform"
        >
          {isApproving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          Ship It!
        </NeoBrutalButton>
        <NeoBrutalButton
          variant="outline"
          accentColor="pink"
          size="sm"
          onClick={() => {
            playSound('reject');
            onReject(item.id);
          }}
          disabled={isApproving || isRejecting}
          className="text-red-400 border-red-400 hover:bg-red-400/10 active:scale-95 transition-transform"
        >
          {isRejecting ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
          Nope
        </NeoBrutalButton>
      </div>
    </NeoBrutalCard>
  );
};

const ApprovalQueue = () => {
  const toast = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedIds, setSelectedIds] = useState(new Set());
  const { data: approvals, isLoading, error } = useApprovals('pending');
  const approveMutation = useApprove();
  const rejectMutation = useReject();
  const { showXp } = useFloatingXp();
  const { success, error: errorFeedback } = useInteraction();

  const handleApprove = (id, event) => {
    approveMutation.mutate(id, {
      onSuccess: () => {
        success();
        // Show floating XP at click position
        if (event?.clientX && event?.clientY) {
          showXp(10, { x: `${event.clientX}px`, y: `${event.clientY}px` });
        } else {
          showXp(10);
        }
        toast.success('Shipped! +10 XP 🚀');
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
      onError: () => {
        errorFeedback();
        toast.error('Failed to ship that one');
      },
    });
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Rejected! The walrus approves your taste');
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
      onError: () => {
        errorFeedback();
        toast.error('Failed to reject');
      },
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === approvals?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(approvals?.map((a) => a.id) || []));
    }
  };

  const handleBulkApprove = async () => {
    const ids = Array.from(selectedIds);
    playSound('combo');
    for (const id of ids) {
      await new Promise((resolve) => {
        approveMutation.mutate(id, {
          onSuccess: resolve,
          onError: resolve,
        });
      });
    }
    setSelectedIds(new Set());
    showXp(ids.length * 10);
    toast.success(`🔥 COMBO! ${ids.length} shipped! +${ids.length * 10} XP`);
  };

  const handleBulkReject = async () => {
    const ids = Array.from(selectedIds);
    playSound('reject');
    for (const id of ids) {
      await new Promise((resolve) => {
        rejectMutation.mutate(id, {
          onSuccess: resolve,
          onError: resolve,
        });
      });
    }
    setSelectedIds(new Set());
    toast.success(`${ids.length} items banished to the void`);
  };

  if (error) {
    return (
      <NeoBrutalCard accentColor="pink" className="text-center py-12">
        <p className="text-red-400 font-bold">Error loading approvals</p>
      </NeoBrutalCard>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Judge Thy Content"
        title="Approval Queue"
        subtitle={isLoading ? 'Summoning items...' : approvals?.length ? `${approvals.length} items await your wisdom (+${approvals.length * 10} XP potential)` : 'The queue is empty...'}
      />

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <NeoBrutalCard accentColor="pink" className="flex items-center justify-between">
          <span className={cn('font-bold', isLight ? 'text-gray-900' : 'text-white')}>
            {selectedIds.size} selected
          </span>
          <div className="flex gap-3">
            <NeoBrutalButton accentColor="green" size="sm" onClick={handleBulkApprove} className="active:scale-95 transition-transform">
              <Zap size={16} />
              Ship All! (+{selectedIds.size * 10} XP)
            </NeoBrutalButton>
            <NeoBrutalButton
              variant="outline"
              size="sm"
              onClick={handleBulkReject}
              className="text-red-400 border-red-400 active:scale-95 transition-transform"
            >
              <X size={16} />
              Nuke 'Em
            </NeoBrutalButton>
            <NeoBrutalButton variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
              Nevermind
            </NeoBrutalButton>
          </div>
        </NeoBrutalCard>
      )}

      {isLoading ? (
        <NeoBrutalCard accentColor="yellow">
          <div className="text-center py-8">
            <Loader2 size={48} className="mx-auto text-neon-yellow mb-4 animate-spin" />
            <p className={cn('font-bold', isLight ? 'text-gray-500' : 'text-white/60')}>
              Summoning content from the void...
            </p>
          </div>
        </NeoBrutalCard>
      ) : approvals?.length === 0 ? (
        <NeoBrutalCard accentColor="green" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent" />
          <div className="relative text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neon-green/20 flex items-center justify-center animate-[portal-breathe_3s_ease-in-out_infinite]">
              <Sparkles size={40} className="text-neon-green" />
            </div>
            <h3 className={cn('text-2xl font-black mb-2', isLight ? 'text-gray-900' : 'text-white')}>
              Victory is yours!
            </h3>
            <p className={cn('text-lg', isLight ? 'text-gray-500' : 'text-white/60')}>
              The queue bows before your judgment. Go forth and create chaos elsewhere.
            </p>
            <div className="mt-6">
              <NeoBrutalButton accentColor="green" onClick={() => window.location.href = '/game-queue'}>
                <Gamepad2 size={18} />
                Find More Quests
              </NeoBrutalButton>
            </div>
          </div>
        </NeoBrutalCard>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors',
                isLight ? 'text-gray-600 hover:bg-gray-100' : 'text-white/60 hover:bg-white/10'
              )}
            >
              {selectedIds.size === approvals?.length ? (
                <CheckSquare size={18} className="text-neon-pink" />
              ) : (
                <Square size={18} />
              )}
              Select All
            </button>
          </div>
          <div className="space-y-4">
            {approvals?.map((item) => (
              <ApprovalCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                isApproving={approveMutation.isPending && approveMutation.variables === item.id}
                isRejecting={rejectMutation.isPending && rejectMutation.variables === item.id}
                isSelected={selectedIds.has(item.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApprovalQueue;
