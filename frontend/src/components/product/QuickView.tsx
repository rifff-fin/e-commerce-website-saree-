import { useState } from 'react';
import { Link } from 'react-router';
import { nav, product as copy } from '../../content/copy';
import { useT } from '../../store/langStore';
import { useUi } from '../../store/uiStore';
import { Icon } from '../ui/Icon';
import { Overlay } from '../ui/Overlay';
import { AddToBag } from './AddToBag';
import { Photo } from './Photo';
import { PriceTag } from './PriceTag';
import { Specs } from './Specs';
import { WishButton } from './WishButton';

/** A quick look at a saree without leaving the page. */
export function QuickView() {
  const t = useT();
  const product = useUi((s) => s.quickView);
  const close = useUi((s) => s.closeQuickView);
  const [index, setIndex] = useState(0);
  const [shownFor, setShownFor] = useState<string | null>(null);

  // Start at the first photo for each saree
  if (product && shownFor !== product._id) {
    setShownFor(product._id);
    setIndex(0);
  }

  return (
    <Overlay
      open={!!product}
      onClose={close}
      label={product?.name ?? copy.quickView}
      className="quick-view"
    >
      {product && (
        <>
          <button
            type="button"
            className="icon-btn qv-close"
            onClick={close}
            aria-label={t(nav.close)}
          >
            <Icon name="close" />
          </button>
          <div className="qv-media">
            <Photo
              src={product.images[index]?.url}
              alt={product.images[index]?.alt ?? product.name}
              sizes="(max-width: 800px) 90vw, 420px"
              eager
            />
            {product.images.length > 1 && (
              <div className="qv-thumbs">
                {product.images.map((image, i) => (
                  <button
                    key={image.url}
                    type="button"
                    className={i === index ? 'is-active' : ''}
                    onClick={() => setIndex(i)}
                    aria-label={copy.photoOf(i + 1, product.images.length)}
                    aria-current={i === index}
                  >
                    <Photo src={image.url} alt="" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="qv-info">
            <p className="label">{product.type}</p>
            <h2 className="qv-name">{product.name}</h2>
            {product.nameBn && (
              <p className="qv-bn bn-display" lang="bn">
                {product.nameBn}
              </p>
            )}
            <PriceTag price={product.price} originalPrice={product.originalPrice} />
            <p className="qv-desc">{product.description}</p>
            <Specs product={product} />
            <AddToBag key={product._id} product={product} onAdded={close} />
            <div className="qv-foot">
              <Link to={`/saree/${product.slug}`} className="link-arrow" onClick={close}>
                {copy.details} <Icon name="arrowRight" />
              </Link>
              <WishButton product={product} />
            </div>
          </div>
        </>
      )}
    </Overlay>
  );
}
