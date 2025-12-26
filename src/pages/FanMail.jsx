import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Inbox, X, Circle, Loader2, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useFanMail, useMarkAsRead } from '../hooks/useApi';

const MessageRow = ({ message, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 border-b border-white/10 hover:bg-white/5 transition-colors flex items-start gap-3 ${
      isSelected ? 'bg-white/10' : ''
    }`}
  >
    <div className="pt-1">
      {!message.is_read ? (
        <Circle size={10} className="fill-brand-orange text-brand-orange" />
      ) : (
        <Circle size={10} className="text-white/20" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className={`font-medium truncate ${!message.is_read ? 'text-white' : 'text-white/70'}`}>
          {message.sender_name}
        </span>
        <span className="text-xs text-white/40 whitespace-nowrap">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
      <p className={`text-sm truncate mt-1 ${!message.is_read ? 'text-white/80' : 'text-white/50'}`}>
        {message.content}
      </p>
    </div>
  </button>
);

const MessageDetail = ({ message, onClose, onMarkAsRead, isMarking }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <button
        onClick={onClose}
        className="md:hidden p-2 hover:bg-white/10 rounded transition-colors"
      >
        <ArrowLeft size={20} className="text-white" />
      </button>
      <div className="flex-1 md:flex-none">
        <h3 className="font-bold text-white">{message.sender_name}</h3>
        <p className="text-xs text-white/50">@{message.sender_id}</p>
      </div>
      <div className="flex items-center gap-2">
        {!message.is_read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(message.id)}
            disabled={isMarking}
            className="text-xs"
          >
            {isMarking ? <Loader2 size={14} className="animate-spin" /> : 'Mark as read'}
          </Button>
        )}
        <button
          onClick={onClose}
          className="hidden md:block p-2 hover:bg-white/10 rounded transition-colors"
        >
          <X size={20} className="text-white/60" />
        </button>
      </div>
    </div>
    <div className="flex-1 p-4 overflow-auto">
      <p className="text-xs text-white/40 mb-4">
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </p>
      <p className="text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
    </div>
    <div className="p-4 border-t border-white/10">
      <textarea
        placeholder="Write a reply..."
        className="w-full bg-white/5 border-3 border-black p-3 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange"
        rows={3}
      />
      <div className="flex justify-end mt-3">
        <Button variant="primary" size="sm">
          Send Reply
        </Button>
      </div>
    </div>
  </div>
);

const FanMail = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { data: messages, isLoading, error } = useFanMail();
  const markAsReadMutation = useMarkAsRead();

  const selectedMessage = messages?.find((m) => m.id === selectedId);
  const unreadCount = messages?.filter((m) => !m.is_read).length ?? 0;

  const handleSelectMessage = (message) => {
    setSelectedId(message.id);
    if (!message.is_read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-400">Error loading messages</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fan Mail</h1>
          <p className="text-white/60 mt-1">
            {isLoading ? 'Loading...' : `${messages?.length ?? 0} messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-brand-orange mb-4 animate-spin" />
          <p className="text-white/60">Loading messages...</p>
        </Card>
      ) : messages?.length === 0 ? (
        <Card className="text-center py-16">
          <Inbox size={64} className="mx-auto text-brand-orange mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">No messages yet</h2>
          <p className="text-white/60 max-w-md mx-auto">
            When fans send you messages, they'll appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Message List */}
          <Card
            padding={false}
            className={`lg:col-span-1 overflow-hidden flex flex-col ${
              selectedMessage ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="p-3 border-b border-white/10 flex items-center gap-2">
              <Mail size={18} className="text-brand-orange" />
              <span className="font-medium text-white">Inbox</span>
              {unreadCount > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 bg-brand-orange text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              {messages?.map((message) => (
                <MessageRow
                  key={message.id}
                  message={message}
                  isSelected={message.id === selectedId}
                  onClick={() => handleSelectMessage(message)}
                />
              ))}
            </div>
          </Card>

          {/* Message Detail */}
          <Card
            padding={false}
            className={`lg:col-span-2 overflow-hidden ${
              selectedMessage ? 'flex flex-col' : 'hidden lg:flex lg:items-center lg:justify-center'
            }`}
          >
            {selectedMessage ? (
              <MessageDetail
                message={selectedMessage}
                onClose={() => setSelectedId(null)}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                isMarking={markAsReadMutation.isPending}
              />
            ) : (
              <div className="text-center text-white/40">
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a message to read</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default FanMail;
