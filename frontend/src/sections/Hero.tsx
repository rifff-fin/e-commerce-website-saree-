import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { brand, hero } from '../content/copy';
import { demoBanners } from '../lib/demoStore';
import { fullOf } from '../lib/images';
import { isReducedMotion, subscribeMotion } from '../lib/motion';
import { getBanners } from '../services/storeService';
import { Icon } from '../components/ui/Icon';
import type { Banner } from '../types';

const SLIDE_MS = 6500;

/**
 * Editorial hero: one strong serif line beside a tall portrait that slowly cross-fades
 * between the admin's banners. The headline follows the current banner.
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

  const count = banners.length;
  const playing = count > 1 && !paused && !reduced;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [playing, count]);

  const current = banners[index % count] ?? banners[0];

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
            {banners.map((banner, i) => (
              <img
                key={banner._id}
                src={i === 0 ? '/hero-saree.jpg' : fullOf(banner.image)}
                alt={i === 0 ? 'Woman wearing a rose pink saree in a sunlit room' : banner.alt}
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
                {banners.map((banner, i) => (
                  <button
                    key={banner._id}
                    type="button"
                    className={i === index % count ? 'is-active' : ''}
                    onClick={() => setIndex(i)}
                    aria-label={`Show look ${i + 1}: ${banner.title}`}
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
