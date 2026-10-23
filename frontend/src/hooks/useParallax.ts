import { useEffect, type RefObject } from 'react';
import { isReducedMotion } from '../lib/motion';

/**
 * Gentle parallax: moves the element by up to `range` px as its section scrolls through
 * the viewport (sets `--py`). Off with reduced motion.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, range = 40) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      if (isReducedMotion()) {
        el.style.setProperty('--py', '0px');
        return;
      }
      const rect = el.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2) / (window.innerHeight + rect.height) - 0.5;
      el.style.setProperty('--py', `${(-progress * range * 2).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, range]);
}
