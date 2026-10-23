import { Link } from 'react-router';
import { useUi } from '../../store/uiStore';
import { Icon } from './Icon';

/** Short confirmations ("Added to your bag"), announced politely to screen readers. */
export function Toasts() {
  const toasts = useUi((s) => s.toasts);
  const dismiss = useUi((s) => s.dismiss);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <Icon name="check" />
          <span>{toast.message}</span>
          {toast.action && (
            <Link to={toast.action.to} className="toast-action" onClick={() => dismiss(toast.id)}>
              {toast.action.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
