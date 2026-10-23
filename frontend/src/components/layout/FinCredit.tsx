import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { finCredit } from '../../content/copy';
import { isReducedMotion, setMotionPref, subscribeMotion } from '../../lib/motion';
import { Icon } from '../ui/Icon';

/** "Built by Fin Projukti" corner badge; tapping it opens a small contact card. */
export function FinCredit() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, isReducedMotion);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="fin-credit" ref={root} onMouseLeave={() => setOpen(false)}>
      {open && (
        <div className="fin-card" id="fin-card" role="region" aria-label={finCredit.badge}>
          <button
            type="button"
            className="fin-close"
            onClick={() => setOpen(false)}
            aria-label={finCredit.close}
          >
            <Icon name="close" />
          </button>
          <p className="fin-title">{finCredit.title}</p>
          <p>
            {finCredit.body}{' '}
            <a href={finCredit.href} target="_blank" rel="noopener">
              {finCredit.link}
            </a>
          </p>
          <button
            type="button"
            className="fin-motion"
            aria-pressed={!reduced}
            onClick={() => setMotionPref(reduced ? 'on' : 'off')}
          >
            {reduced ? finCredit.turnOnMotion : finCredit.turnOffMotion}
          </button>
        </div>
      )}
      <button
        type="button"
        className="fin-badge"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="fin-card"
      >
        {finCredit.badge}
      </button>
    </div>
  );
}
