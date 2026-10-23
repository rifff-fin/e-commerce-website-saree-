import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';

let openCount = 0;

/** Locks page scroll while any overlay is open (works with stacked overlays). */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    openCount += 1;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      openCount -= 1;
      if (openCount === 0) document.documentElement.style.overflow = '';
    };
  }, [active]);
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  label: string;
  /** 'drawer' slides in from the right; 'dialog' is centred; 'sheet' is full screen */
  variant?: 'drawer' | 'dialog' | 'sheet';
  className?: string;
  children: ReactNode;
}

/** An accessible modal: focus trapped, Escape and backdrop close it, focus returns after. */
export function Overlay({
  open,
  onClose,
  label,
  variant = 'dialog',
  className,
  children,
}: OverlayProps) {
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(open, panel, onClose);
  useScrollLock(open);

  if (!open) return null;
  return createPortal(
    <div className={`overlay overlay--${variant}`}>
      <div className="overlay-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        className={`overlay-panel${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
