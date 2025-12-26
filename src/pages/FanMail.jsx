import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Inbox, X, Circle, Loader2, ArrowLeft, Send, Check, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import NeoBrutalCard from '../components/ui/NeoBrutalCard';
import NeoBrutalButton from '../components/ui/NeoBrutalButton';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { useFanMail, useMarkAsRead, useReplyToMessage } from '../hooks/useApi';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const MessageRow = ({ message, isSelected, onClick, isLight }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full text-left p-4 transition-colors flex items-start gap-3',
      isSelected
        ? isLight ? 'bg-neon-pink/10' : 'bg-neon-pink/20'
        : isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5',
      isLight ? 'border-b border-gray-100' : 'border-b border-white/10'
    )}
  >
    <div className="pt-1">
      {message.reply ? (
        <Check size={10} className="text-neon-green" />
      ) : !message.is_read ? (
        <Circle size={10} className="fill-neon-pink text-neon-pink" />
      ) : (
        <Circle size={10} className={isLight ? 'text-gray-200' : 'text-white/20'} />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className={cn(
          'font-bold truncate',
          !message.is_read
            ? isLight ? 'text-gray-900' : 'text-white'
            : isLight ? 'text-gray-600' : 'text-white/70'
        )}>
          {message.sender_name}
        </span>
        <span className={cn('text-xs whitespace-nowrap', isLight ? 'text-gray-400' : 'text-white/40')}>
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
      <p className={cn(
        'text-sm truncate mt-1',
        !message.is_read
          ? isLight ? 'text-gray-700' : 'text-white/80'
          : isLight ? 'text-gray-500' : 'text-white/50'
      )}>
        {message.content}
      </p>
    </div>
  </button>
);

const MessageDetail = ({ message, onClose, onMarkAsRead, isMarking, onSendReply, isSendingReply, isLight }) => {
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (replyText.trim()) {
      onSendReply(message.id, replyText.trim());
      setReplyText('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        'flex items-center justify-between p-4',
        isLight ? 'border-b border-gray-200' : 'border-b border-white/10'
      )}>
        <button
          onClick={onClose}
          className={cn(
            'md:hidden p-2 rounded-xl transition-colors',
            isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
          )}
        >
          <ArrowLeft size={20} className={isLight ? 'text-gray-600' : 'text-white'} />
        </button>
        <div className="flex-1 md:flex-none">
          <h3 className={cn('font-black', isLight ? 'text-gray-900' : 'text-white')}>
            {message.sender_name}
          </h3>
          <p className={cn('text-xs', isLight ? 'text-gray-500' : 'text-white/50')}>
            @{message.sender_id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!message.is_read && (
            <NeoBrutalButton
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(message.id)}
              disabled={isMarking}
            >
              {isMarking ? <Loader2 size={14} className="animate-spin" /> : 'Mark as read'}
            </NeoBrutalButton>
          )}
          <button
            onClick={onClose}
            className={cn(
              'hidden md:block p-2 rounded-xl transition-colors',
              isLight ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-white/60'
            )}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <p className={cn('text-xs mb-4', isLight ? 'text-gray-400' : 'text-white/40')}>
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </p>
        <p className={cn('leading-relaxed whitespace-pre-wrap', isLight ? 'text-gray-900' : 'text-white')}>
          {message.content}
        </p>

        {message.reply && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-neon-green/20 flex items-center justify-center">
                <Check size={12} className="text-neon-green" />
              </div>
              <span className="text-xs text-neon-green font-bold">Replied</span>
              <span className={cn('text-xs', isLight ? 'text-gray-400' : 'text-white/40')}>
                {message.replied_at && formatDistanceToNow(new Date(message.replied_at), { addSuffix: true })}
              </span>
            </div>
            <div className={cn(
              'rounded-xl p-4 border-l-4 border-neon-pink',
              isLight ? 'bg-neon-pink/5' : 'bg-neon-pink/10'
            )}>
              <p className={cn('whitespace-pre-wrap', isLight ? 'text-gray-800' : 'text-white/90')}>
                {message.reply}
              </p>
            </div>
          </div>
        )}
      </div>

      {!message.reply && (
        <div className={cn(
          'p-4',
          isLight ? 'border-t border-gray-200' : 'border-t border-white/10'
        )}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className={cn(
              'w-full p-3 rounded-xl border-3 resize-none focus:outline-none focus:ring-2 focus:ring-neon-pink',
              isLight
                ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                : 'bg-white/5 border-white/20 text-white placeholder:text-white/40'
            )}
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <NeoBrutalButton
              accentColor="pink"
              size="sm"
              onClick={handleSendReply}
              disabled={!replyText.trim() || isSendingReply}
            >
              {isSendingReply ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Send Reply
            </NeoBrutalButton>
          </div>
        </div>
      )}
    </div>
  );
};

const FanMail = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { data: messages, isLoading, error } = useFanMail();
  const markAsReadMutation = useMarkAsRead();
  const replyMutation = useReplyToMessage();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const selectedMessage = messages?.find((m) => m.id === selectedId);
  const unreadCount = messages?.filter((m) => !m.is_read).length ?? 0;

  const handleSelectMessage = (message) => {
    setSelectedId(message.id);
    if (!message.is_read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleSendReply = (id, reply) => {
    replyMutation.mutate(
      { id, reply },
      {
        onSuccess: () => {
          showToast('Reply sent successfully!', 'success');
        },
        onError: () => {
          showToast('Failed to send reply', 'error');
        },
      }
    );
  };

  if (error) {
    return (
      <NeoBrutalCard accentColor="pink" className="text-center py-12">
        <p className="text-red-400 font-bold">Error loading messages</p>
      </NeoBrutalCard>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Love Letters"
        title="Fan Mail"
        subtitle={isLoading ? 'Loading...' : `${messages?.length ?? 0} messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      />

      {isLoading ? (
        <NeoBrutalCard accentColor="cyan">
          <div className="text-center py-12">
            <Loader2 size={48} className="mx-auto text-neon-cyan mb-4 animate-spin" />
            <p className={cn('font-bold', isLight ? 'text-gray-500' : 'text-white/60')}>
              Loading messages...
            </p>
          </div>
        </NeoBrutalCard>
      ) : messages?.length === 0 ? (
        <NeoBrutalCard accentColor="pink">
          <EmptyState
            icon={Heart}
            title="No messages yet"
            description="When fans send you messages, they'll appear here. Time to go viral!"
            accentColor="pink"
          />
        </NeoBrutalCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Message List */}
          <NeoBrutalCard
            accentColor="cyan"
            className={cn(
              'lg:col-span-1 overflow-hidden flex flex-col p-0',
              selectedMessage ? 'hidden lg:flex' : 'flex'
            )}
          >
            <div className={cn(
              'p-4 flex items-center gap-3',
              isLight ? 'border-b border-gray-200' : 'border-b border-white/10'
            )}>
              <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                <Mail size={18} className="text-neon-cyan" />
              </div>
              <span className={cn('font-black', isLight ? 'text-gray-900' : 'text-white')}>Inbox</span>
              {unreadCount > 0 && (
                <span className="ml-auto text-xs px-2.5 py-1 bg-neon-pink text-white font-bold rounded-lg">
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
                  isLight={isLight}
                />
              ))}
            </div>
          </NeoBrutalCard>

          {/* Message Detail */}
          <NeoBrutalCard
            accentColor="pink"
            className={cn(
              'lg:col-span-2 overflow-hidden p-0',
              selectedMessage ? 'flex flex-col' : 'hidden lg:flex lg:items-center lg:justify-center'
            )}
          >
            {selectedMessage ? (
              <MessageDetail
                message={selectedMessage}
                onClose={() => setSelectedId(null)}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                isMarking={markAsReadMutation.isPending}
                onSendReply={handleSendReply}
                isSendingReply={replyMutation.isPending}
                isLight={isLight}
              />
            ) : (
              <div className={cn('text-center p-8', isLight ? 'text-gray-400' : 'text-white/40')}>
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-bold">Select a message to read</p>
              </div>
            )}
          </NeoBrutalCard>
        </div>
      )}
    </div>
  );
};

export default FanMail;
