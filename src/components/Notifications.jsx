import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, Mail, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

const typeIcons = {
  approval: CheckCircle,
  fan_mail: Mail,
  calendar: Calendar,
  alert: AlertCircle,
};

const typeColors = {
  approval: 'text-neon-yellow',
  fan_mail: 'text-neon-cyan',
  calendar: 'text-neon-purple',
  alert: 'text-red-400',
};

const typeBgColors = {
  approval: 'bg-neon-yellow/20',
  fan_mail: 'bg-neon-cyan/20',
  calendar: 'bg-neon-purple/20',
  alert: 'bg-red-400/20',
};

// Mock notifications
const mockNotifications = [
  { id: 1, type: 'approval', title: 'New approval request', message: 'Message to @user123 needs review', time: '2m ago', read: false, url: '/approvals' },
  { id: 2, type: 'fan_mail', title: 'New fan message', message: 'Sarah sent you a message', time: '15m ago', read: false, url: '/fan-mail' },
  { id: 3, type: 'calendar', title: 'Scheduled post', message: 'Post going live in 1 hour', time: '1h ago', read: true, url: '/calendar' },
  { id: 4, type: 'approval', title: 'Approval completed', message: 'Message to @fanclub approved', time: '3h ago', read: true, url: '/approvals' },
];

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    navigate(notification.url);
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-xl border-3 transition-all',
          'hover:translate-x-[-2px] hover:translate-y-[-2px]',
          isLight
            ? 'bg-gray-100 border-gray-300 text-gray-600 shadow-[4px_4px_0_#d1d5db] hover:shadow-[6px_6px_0_#d1d5db]'
            : 'bg-white/5 border-white/20 text-white/60 shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0_rgba(255,255,255,0.1)]'
        )}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink text-white text-[10px] font-black flex items-center justify-center rounded-lg border-2 border-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-80 rounded-2xl border-3 overflow-hidden z-50',
            isLight
              ? 'bg-white border-neon-cyan shadow-[8px_8px_0_var(--neon-cyan)]'
              : 'bg-gray-900 border-neon-cyan shadow-[8px_8px_0_var(--neon-cyan)]'
          )}
        >
          <div className={cn(
            'flex items-center justify-between p-4 border-b-3',
            isLight ? 'border-gray-200' : 'border-white/10'
          )}>
            <h3 className={cn('font-black', isLight ? 'text-gray-900' : 'text-white')}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-neon-pink hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-auto">
            {notifications.length === 0 ? (
              <div className={cn('p-8 text-center', isLight ? 'text-gray-500' : 'text-white/50')}>
                <Bell size={32} className="mx-auto mb-2 opacity-40" />
                <p className="font-bold">No notifications</p>
                <p className="text-xs opacity-60">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Bell;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 text-left transition-colors',
                      !notification.read && (isLight ? 'bg-neon-pink/5' : 'bg-neon-pink/10'),
                      isLight ? 'hover:bg-gray-50 border-b border-gray-100' : 'hover:bg-white/5 border-b border-white/5'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      typeBgColors[notification.type]
                    )}>
                      <Icon size={18} className={typeColors[notification.type]} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-bold text-sm', isLight ? 'text-gray-900' : 'text-white')}>
                        {notification.title}
                      </p>
                      <p className={cn('text-xs truncate', isLight ? 'text-gray-500' : 'text-white/50')}>
                        {notification.message}
                      </p>
                      <p className={cn('text-[10px] mt-1 uppercase tracking-wider', isLight ? 'text-gray-400' : 'text-white/30')}>
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-neon-pink rounded-full mt-2 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
