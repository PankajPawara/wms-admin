import React, { createContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info as InfoIcon } from 'lucide-react';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
      }}>
        {toasts.map((t) => {
          let bgColor = 'var(--color-surface)';
          let borderColor = 'var(--color-border)';
          let textColor = 'var(--color-text-primary)';
          let Icon = InfoIcon;
          let iconColor = 'var(--color-info)';

          if (t.type === 'success') {
            iconColor = 'var(--color-success)';
            Icon = CheckCircle;
          } else if (t.type === 'error') {
            iconColor = 'var(--color-danger)';
            Icon = AlertCircle;
          }

          return (
            <div
              key={t.id}
              className="page-enter"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                boxShadow: 'var(--shadow-lg)',
                minWidth: '300px',
                maxWidth: '450px',
                pointerEvents: 'auto',
                animation: 'fadeSlideUp 0.3s ease-out'
              }}
            >
              <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: textColor, flex: 1, fontWeight: 500 }}>
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
