import { useEffect } from 'react';
import { useStore } from '../store/context';
import type { Toast as T } from '../store/reducer';

function ToastItem({ toast }: { toast: T }) {
  const { dispatch } = useStore();
  useEffect(() => {
    const t = window.setTimeout(() => dispatch({ type: 'DISMISS_TOAST', id: toast.id }), 4000);
    return () => window.clearTimeout(t);
  }, [toast.id, dispatch]);
  return (
    <div className="toast" role="status">
      <span>{toast.text}</span>
      {toast.actionLabel && (
        <button
          type="button"
          className="toast-action"
          data-tip={toast.actionTip}
          onClick={() => {
            toast.onAction?.();
            if (toast.onAction) dispatch({ type: 'DISMISS_TOAST', id: toast.id });
          }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
}

export function Toasts() {
  const { state } = useStore();
  return (
    <div className="toasts" aria-live="polite">
      {state.toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
