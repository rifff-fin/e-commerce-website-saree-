import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { finCredit } from '../../content/copy';
import { isReducedMotion, setMotionPref, subscribeMotion } from '../../lib/motion';
import { Icon } from '../ui/Icon';

/** "Built by Fin Projukti" corner badge; tapping it opens a small contact card. */
export function FinCredit() {
  const [open, setOpen] = useState(false);
  const [motionOpen, setMotionOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, isReducedMotion);

  useEffect(() => {
    if (!open && !motionOpen) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
        setMotionOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setMotionOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, motionOpen]);

  return (
    <div
      className={`fin-credit${open ? ' is-open' : ''}${motionOpen ? ' is-motion-open' : ''}`}
      ref={root}
      onMouseLeave={() => setOpen(false)}
    >
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
        </div>
      )}
      <button
        type="button"
        className="fin-badge"
        onClick={() => {
          setOpen((value) => !value);
          setMotionOpen(true);
        }}
        onMouseEnter={() => setMotionOpen(true)}
        onFocus={() => setMotionOpen(true)}
        aria-expanded={open}
        aria-controls="fin-card"
      >
        {finCredit.badge}
      </button>
      <div className="fin-motion-widget">
        <div className="fin-motion-card" role="group" aria-label={finCredit.motionLabel}>
          <button
            type="button"
            className="fin-motion"
            aria-pressed={!reduced}
            onClick={() => {
              setMotionPref(reduced ? 'on' : 'off');
              setMotionOpen(false);
            }}
          >
            {reduced ? finCredit.turnOnMotion : finCredit.turnOffMotion}
          </button>
        </div>
      </div>
    </div>
  );
}
