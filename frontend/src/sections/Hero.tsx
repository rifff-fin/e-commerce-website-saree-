import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { brand, hero } from '../content/copy';
import { demoBanners } from '../lib/demoStore';
import { isReducedMotion, subscribeMotion } from '../lib/motion';
import { getBanners } from '../services/storeService';
import { Icon } from '../components/ui/Icon';
import type { Banner } from '../types';

const SLIDE_MS = 6500;
const HERO_IMAGES = [
  {
    src: '/hero/hero-look-1.jpg',
    alt: 'Woman wearing a dusty rose saree in a sunlit room',
  },
  {
    src: '/hero/hero-look-2.jpg',
    alt: 'Woman wearing a dark burgundy saree in a garden courtyard',
  },
  {
    src: '/hero/hero-look-3.jpg',
    alt: 'Woman wearing a pastel pink saree with a gold border',
  },
  {
    src: '/hero/hero-look-4.jpg',
    alt: 'Woman wearing an olive green saree in a warm interior',
  },
] as const;

/**
 * Editorial hero: one strong serif line beside a tall portrait that cross-fades through four
 * local photos. The headline follows the current banner.
 */
export function Hero() {
  const [banners, setBanners] = useState<Banner[]>(demoBanners);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, isReducedMotion);

  useEffect(() => {
    let alive = true;
    getBanners()
      .then((list) => {
        if (alive && list.length) setBanners(list);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const count = HERO_IMAGES.length;
  const playing = count > 1 && !paused && !reduced;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [playing, count]);

  const current = banners[index % banners.length] ?? banners[0];

  return (
    <section className="hero" aria-label="Featured">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-accent bn-display" lang="bn" aria-hidden="true">
            {hero.accent}
          </p>
          <h1 className="hero-title" key={current?._id} aria-live="polite">
            {current?.title ?? brand.tagline}
          </h1>
          {current?.subtitle && <p className="hero-sub">{current.subtitle}</p>}
          <div className="hero-actions">
            <Link to={hero.primaryHref} className="btn">
              {hero.primary}
            </Link>
            <Link to={hero.secondaryHref} className="link-arrow">
              {hero.secondary} <Icon name="arrowRight" />
            </Link>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-frame">
            {HERO_IMAGES.map((image, i) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={i === index % count ? 'is-active' : ''}
                aria-hidden={i !== index % count}
                width={1200}
                height={1600}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
              />
            ))}
          </div>
          <div className="hero-caption">
            {current?.ctaHref && current.ctaLabel ? (
              <Link to={current.ctaHref} className="link">
                {current.ctaLabel}
              </Link>
            ) : (
              <span />
            )}
            {count > 1 && (
              <div className="hero-dots">
                <span className="hero-count" aria-hidden="true">
                  {String((index % count) + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
                {HERO_IMAGES.map((image, i) => (
                  <button
                    key={image.src}
                    type="button"
                    className={i === index % count ? 'is-active' : ''}
                    onClick={() => setIndex(i)}
                    aria-label={`Show hero photo ${i + 1}`}
                    aria-current={i === index % count}
                  />
                ))}
                {!reduced && (
                  <button
                    type="button"
                    className="hero-pause"
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? hero.play : hero.pause}
                  >
                    <Icon name={paused ? 'play' : 'pause'} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
