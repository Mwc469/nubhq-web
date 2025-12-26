import { Check, X, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useApprovals, useApprove, useReject } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';

const ApprovalCard = ({ item, onApprove, onReject, isApproving, isRejecting }) => (
  <Card className="space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-brand-orange" />
        <span className="text-sm font-medium text-white/60">Message to {item.recipient}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-white/40">
        <Clock size={14} />
        <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
      </div>
    </div>

    <p className="text-white text-lg leading-relaxed">{item.content}</p>

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

const ApprovalQueue = () => {
  const toast = useToast();
  const { data: approvals, isLoading, error } = useApprovals('pending');
  const approveMutation = useApprove();
  const rejectMutation = useReject();

  const handleApprove = (id) => {
    approveMutation.mutate(id, {
      onSuccess: () => toast.success('Message approved'),
      onError: () => toast.error('Failed to approve message'),
    });
  };

  const handleReject = (id) => {
    rejectMutation.mutate(id, {
      onSuccess: () => toast.success('Message rejected'),
      onError: () => toast.error('Failed to reject message'),
    });
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
          <h1 className="text-3xl font-bold text-white">Approval Queue</h1>
          <p className="text-white/60 mt-1">
            {isLoading ? 'Loading...' : `${approvals?.length ?? 0} items pending review`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-brand-orange mb-4 animate-spin" />
          <p className="text-white/60">Loading approvals...</p>
        </Card>
      ) : approvals?.length === 0 ? (
        <Card className="text-center py-12">
          <Check size={48} className="mx-auto text-green-400 mb-4" />
          <h2 className="text-xl font-bold text-white">All caught up!</h2>
          <p className="text-white/60 mt-2">No pending approvals at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals?.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              isApproving={approveMutation.isPending && approveMutation.variables === item.id}
              isRejecting={rejectMutation.isPending && rejectMutation.variables === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
