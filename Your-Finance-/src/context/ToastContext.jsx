import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, message = '', duration = 4000 }) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);

      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (title, message, duration) =>
      showToast({ type: 'success', title, message, duration }),
    error: (title, message, duration) =>
      showToast({ type: 'error', title, message, duration }),
    info: (title, message, duration) =>
      showToast({ type: 'info', title, message, duration }),
    dismiss: removeToast,
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} strokeWidth={2.2} />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle size={18} strokeWidth={2.2} />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Info size={18} strokeWidth={2.2} />
          </div>
        );
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}

      {/* Container de Toasts flutuante no canto inferior direito */}
      <aside
        aria-live="polite"
        aria-label="Notificações do sistema"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-950/5 dark:shadow-zinc-950/30 transition-all duration-300 animate-slideUp"
          >
            {getIcon(item.type)}

            <div className="flex-1 min-w-0 pt-0.5">
              <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                {item.title}
              </h5>
              {item.message && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
                  {item.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shrink-0 cursor-pointer"
              aria-label="Fechar notificação"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser utilizado dentro de um ToastProvider');
  }
  return context;
};
