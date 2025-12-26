import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_DURATION = 4000;

const toastStyles = {
  success: {
    bg: 'bg-green-500/20 border-green-500/50',
    icon: CheckCircle,
    iconColor: 'text-green-400',
  },
  error: {
    bg: 'bg-red-500/20 border-red-500/50',
    icon: XCircle,
    iconColor: 'text-red-400',
  },
  info: {
    bg: 'bg-blue-500/20 border-blue-500/50',
    icon: AlertCircle,
    iconColor: 'text-blue-400',
  },
};

const Toast = ({ toast, onDismiss }) => {
  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 border-2 shadow-brutal ${style.bg} animate-slide-in`}
    >
      <Icon size={20} className={style.iconColor} />
      <p className="flex-1 text-white text-sm">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X size={16} className="text-white/60" />
      </button>
    </div>
  );
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-20 md:bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
