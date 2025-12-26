import { useState } from 'react';
import { Check, X, Clock, MessageSquare } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const mockApprovals = [
  {
    id: 1,
    type: 'message',
    content: 'Hey! Thanks for subscribing. I really appreciate your support!',
    recipient: 'user_123',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'pending',
  },
  {
    id: 2,
    type: 'message',
    content: 'Special content coming your way this weekend!',
    recipient: 'user_456',
    createdAt: '2024-01-15T09:15:00Z',
    status: 'pending',
  },
  {
    id: 3,
    type: 'message',
    content: 'Thanks for the tip! You are amazing.',
    recipient: 'user_789',
    createdAt: '2024-01-15T08:00:00Z',
    status: 'pending',
  },
];

const ApprovalCard = ({ item, onApprove, onReject }) => (
  <Card className="space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-brand-orange" />
        <span className="text-sm font-medium text-white/60">Message to {item.recipient}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-white/40">
        <Clock size={14} />
        <span>2h ago</span>
      </div>
    </div>

    <p className="text-white text-lg leading-relaxed">{item.content}</p>

    <div className="flex gap-3 pt-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => onApprove(item.id)}
        className="flex items-center gap-2"
      >
        <Check size={16} />
        Approve
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onReject(item.id)}
        className="flex items-center gap-2 text-red-400 hover:text-red-300"
      >
        <X size={16} />
        Reject
      </Button>
    </div>
  </Card>
);

const ApprovalQueue = () => {
  const [approvals, setApprovals] = useState(mockApprovals);

  const handleApprove = (id) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReject = (id) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Approval Queue</h1>
          <p className="text-white/60 mt-1">{approvals.length} items pending review</p>
        </div>
        <Button variant="secondary" size="sm">
          Approve All
        </Button>
      </div>

      {approvals.length === 0 ? (
        <Card className="text-center py-12">
          <Check size={48} className="mx-auto text-green-400 mb-4" />
          <h2 className="text-xl font-bold text-white">All caught up!</h2>
          <p className="text-white/60 mt-2">No pending approvals at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
