import { Link } from 'react-router';
import { product as copy } from '../../content/copy';
import { useUi } from '../../store/uiStore';
import { Icon } from '../ui/Icon';
import { Photo } from './Photo';
import { PriceTag } from './PriceTag';
import { WishButton } from './WishButton';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  sizes?: string;
  eager?: boolean;
}

/** A portrait card. On hover (or focus) it cross-fades to the second photo. */
export function ProductCard({ product, sizes, eager }: ProductCardProps) {
  const openQuickView = useUi((s) => s.openQuickView);
  const [first, second] = product.images;
  const href = `/saree/${product.slug}`;

  return (
    <article className="card">
      <div className={`card-media${second ? ' has-second' : ''}`}>
        <Link to={href} className="card-link" tabIndex={-1} aria-hidden="true">
          <Photo src={first?.url} alt="" sizes={sizes} eager={eager} />
          {second && <Photo src={second.url} alt="" sizes={sizes} className="card-second" />}
        </Link>
        <div className="card-badges">
          {product.isNewArrival && <span className="badge">{copy.newBadge}</span>}
          {product.discountPercent > 0 && (
            <span className="badge badge--sale">{copy.sale(product.discountPercent)}</span>
          )}
        </div>
        <WishButton product={product} className="card-wish" />
        <button
          type="button"
          className="card-quick"
          onClick={() => openQuickView(product)}
          aria-label={`${copy.quickView}: ${product.name}`}
        >
          <Icon name="eye" />
          <span>{copy.quickView}</span>
        </button>
      </div>
      <div className="card-body">
        <p className="label card-type">
          {product.type}
          {product.handwoven && <span className="card-hand"> · Handwoven</span>}
        </p>
        <h3 className="card-name">
          <Link to={href}>{product.name}</Link>
        </h3>
        <PriceTag price={product.price} originalPrice={product.originalPrice} />
      </div>
    </article>
  );
}
