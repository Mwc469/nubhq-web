import { useState } from 'react';
import { Check, X, Clock, MessageSquare, Loader2, CheckSquare, Square } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useApprovals, useApprove, useReject } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const ApprovalCard = ({ item, onApprove, onReject, isApproving, isRejecting, isSelected, onToggleSelect }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleSelect(item.id)}
            className={`p-1 transition-colors ${isLight ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white'}`}
          >
            {isSelected ? (
              <CheckSquare size={20} className="text-brand-orange" />
            ) : (
              <Square size={20} />
            )}
          </button>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-brand-orange" />
            <span className={`text-sm font-medium ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
              Message to {item.recipient}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
          <Clock size={14} />
          <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
        </div>
      </div>

      <p className={`text-lg leading-relaxed ${isLight ? 'text-gray-900' : 'text-white'}`}>{item.content}</p>

      <div className="flex gap-3 pt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onApprove(item.id)}
          disabled={isApproving || isRejecting}
          className="flex items-center gap-2"
        >
          {isApproving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          Approve
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReject(item.id)}
          disabled={isApproving || isRejecting}
          className="flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          {isRejecting ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
          Reject
        </Button>
      </div>
    </Card>
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

  const handleApprove = (id) => {
    approveMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Message approved');
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
      onError: () => toast.error('Failed to approve message'),
    });
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Message rejected');
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
      onError: () => toast.error('Failed to reject message'),
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
    for (const id of ids) {
      await new Promise((resolve) => {
        approveMutation.mutate(id, {
          onSuccess: resolve,
          onError: resolve,
        });
      });
    }
    setSelectedIds(new Set());
    toast.success(`${ids.length} messages approved`);
  };

  const handleBulkReject = async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await new Promise((resolve) => {
        rejectMutation.mutate(id, {
          onSuccess: resolve,
          onError: resolve,
        });
      });
    }
    setSelectedIds(new Set());
    toast.success(`${ids.length} messages rejected`);
  };

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-400">Error loading approvals</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Approval Queue</h1>
          <p className={`mt-1 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
            {isLoading ? 'Loading...' : `${approvals?.length ?? 0} items pending review`}
          </p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className={`flex items-center justify-between p-4 border-3 border-black shadow-brutal ${isLight ? 'bg-white' : 'bg-brand-orange/20'}`}>
          <span className={`font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>
            {selectedIds.size} selected
          </span>
          <div className="flex gap-3">
            <Button variant="primary" size="sm" onClick={handleBulkApprove}>
              <Check size={16} className="mr-2" />
              Approve All
            </Button>
            <Button variant="danger" size="sm" onClick={handleBulkReject}>
              <X size={16} className="mr-2" />
              Reject All
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <Card className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-brand-orange mb-4 animate-spin" />
          <p className={isLight ? 'text-gray-600' : 'text-white/60'}>Loading approvals...</p>
        </Card>
      ) : approvals?.length === 0 ? (
        <Card className="text-center py-12">
          <Check size={48} className="mx-auto text-green-400 mb-4" />
          <h2 className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>All caught up!</h2>
          <p className={`mt-2 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>No pending approvals at the moment.</p>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                isLight ? 'text-gray-600 hover:text-gray-900' : 'text-white/60 hover:text-white'
              }`}
            >
              {selectedIds.size === approvals?.length ? (
                <CheckSquare size={18} className="text-brand-orange" />
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
