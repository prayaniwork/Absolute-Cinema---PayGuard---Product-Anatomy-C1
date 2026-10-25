import React from 'react';
import { useProject } from '../context/ProjectContext';
import { X } from 'lucide-react';
import { Buddy } from './buddy/Buddy';
import type { BuddyName } from './buddy/buddyMeta';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProject();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const buddyFor: Record<string, BuddyName> = {
          success: 'thumbs-up',
          warning: 'thinking',
          error: 'worried',
          info: 'waving',
        };
        const getIcon = () => (
          <span className="buddy-chip">
            <Buddy name={buddyFor[toast.type] ?? "waving"} height={40} pop />
          </span>
        );

        return (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="toast-icon-slot">{getIcon()}</div>
            <div className="toast-content-slot">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        .toast-icon-slot {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .toast-content-slot {
          flex: 1;
        }
        .toast-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .toast-message {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
          line-height: 1.4;
        }
        .toast-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
        }
        .toast-close-btn:hover {
          color: var(--text-primary);
        }
        .text-rose { color: var(--accent-rose); }
      `}</style>
    </div>
  );
};
