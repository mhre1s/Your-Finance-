import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext({
  toast: {
    success: () => {},
    error: () => {},
    info: () => {},
  },
  showToast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((title, description = '', type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((title, description = '') => showToast(title, description, 'success'), [showToast]);
  const error = useCallback((title, description = '') => showToast(title, description, 'error'), [showToast]);
  const info = useCallback((title, description = '') => showToast(title, description, 'info'), [showToast]);

  const toast = { success, error, info };

  return (
    <ToastContext.Provider value={{ toast, showToast, success, error, info }}>
      {children}

      {/* Container de Toasts Flutuantes */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slideUp ${
              t.type === 'success'
                ? 'bg-emerald-600/95 dark:bg-emerald-950/95 border-emerald-400/40 text-white'
                : t.type === 'error'
                ? 'bg-rose-600/95 dark:bg-rose-950/95 border-rose-400/40 text-white'
                : 'bg-slate-900/95 dark:bg-gray-900/95 border-slate-700 text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              {t.type === 'success' && <CheckCircle2 size={20} className="shrink-0 text-emerald-200 mt-0.5" />}
              {t.type === 'error' && <AlertCircle size={20} className="shrink-0 text-rose-200 mt-0.5" />}
              {t.type === 'info' && <Info size={20} className="shrink-0 text-sky-200 mt-0.5" />}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold leading-tight">{t.title}</span>
                {t.description && (
                  <span className="text-xs opacity-90 leading-tight">{t.description}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white shrink-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
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
