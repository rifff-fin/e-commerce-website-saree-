import { useRef } from 'react';
import { Link } from 'react-router';
import { sections } from '../content/copy';
import { useProducts } from '../hooks/useProducts';
import { isReducedMotion } from '../lib/motion';
import { ProductCard } from '../components/product/ProductCard';
import { Icon } from '../components/ui/Icon';

/** A horizontal, snap-scrolling row with previous / next buttons. */
export function BestSellers() {
  const { data } = useProducts({ best: 'true', sort: 'popular', limit: '12' });
  const track = useRef<HTMLUListElement>(null);
  const products = data?.products ?? [];

  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: isReducedMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="best" aria-labelledby="best-title">
      <div className="wrap">
        <div className="row-head" data-reveal>
          <h2 id="best-title">{sections.bestSellers.title}</h2>
          <div className="row-tools">
            <button
              type="button"
              className="icon-btn ring"
              onClick={() => scroll(-1)}
              aria-label={sections.bestSellers.prev}
            >
              <Icon name="chevronLeft" />
            </button>
            <button
              type="button"
              className="icon-btn ring"
              onClick={() => scroll(1)}
              aria-label={sections.bestSellers.next}
            >
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
        <ul className="carousel" ref={track} aria-label={sections.bestSellers.title}>
          {products.map((product) => (
            <li key={product._id}>
              <ProductCard product={product} sizes="(max-width: 700px) 70vw, 300px" />
            </li>
          ))}
        </ul>
        <p className="row-foot">
          <Link to="/shop" className="link">
            {sections.bestSellers.link}
          </Link>
        </p>
      </div>
    </section>
  );
}
