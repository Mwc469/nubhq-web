import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, Mail, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const typeIcons = {
  approval: CheckCircle,
  fan_mail: Mail,
  calendar: Calendar,
  alert: AlertCircle,
};

const typeColors = {
  approval: 'text-yellow-400',
  fan_mail: 'text-blue-400',
  calendar: 'text-green-400',
  alert: 'text-red-400',
};

// Mock notifications for now
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
        className={`relative p-2 border-3 border-black transition-colors ${
          isLight
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            : 'bg-white/5 hover:bg-white/10 text-white/60'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-80 border-3 border-black shadow-brutal z-50 ${isLight ? 'bg-white' : 'bg-brand-dark'}`}>
          <div className={`flex items-center justify-between p-3 border-b-3 border-black`}>
            <h3 className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-orange hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-auto">
            {notifications.length === 0 ? (
              <div className={`p-8 text-center ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Bell;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full flex items-start gap-3 p-3 text-left transition-colors ${
                      !notification.read
                        ? isLight
                          ? 'bg-orange-50'
                          : 'bg-brand-orange/10'
                        : ''
                    } ${
                      isLight
                        ? 'hover:bg-gray-100 border-b border-gray-100'
                        : 'hover:bg-white/5 border-b border-white/10'
                    }`}
                  >
                    <Icon size={18} className={typeColors[notification.type]} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs truncate ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${isLight ? 'text-gray-400' : 'text-white/30'}`}>
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-brand-orange rounded-full mt-1" />
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
