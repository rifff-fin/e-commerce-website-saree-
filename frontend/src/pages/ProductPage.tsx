import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { notFound, product as copy, sections } from '../content/copy';
import { isAborted } from '../lib/api';
import { useMeta } from '../hooks/useMeta';
import { getProduct } from '../services/productService';
import { useSaved } from '../store/savedStore';
import { useT } from '../store/langStore';
import { useUi } from '../store/uiStore';
import { AddToBag } from '../components/product/AddToBag';
import { Gallery } from '../components/product/Gallery';
import { PriceTag } from '../components/product/PriceTag';
import { ProductCard } from '../components/product/ProductCard';
import { Specs } from '../components/product/Specs';
import { WishButton } from '../components/product/WishButton';
import { Icon } from '../components/ui/Icon';
import { RecentlyViewed } from '../sections/RecentlyViewed';
import type { ProductDetailResponse } from '../types';

type State =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'error' }
  | { status: 'ready'; data: ProductDetailResponse };

type Loaded = State & { slug: string };

/** Sets the title and the share preview (Facebook reads og:* tags). */
function useShareMeta(data: ProductDetailResponse | null) {
  useEffect(() => {
    if (!data) return;
    const { product } = data;
    document.title = `${product.name} | ${product.type} | Shari Kotha`;
    const set = (property: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    set('og:title', product.name);
    set('og:description', product.description);
    if (product.images[0])
      set('og:image', new URL(product.images[0].url, window.location.origin).href);
    set('og:url', window.location.href);
  }, [data]);
}

export function ProductPage() {
  const t = useT();
  const { slug = '' } = useParams();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const viewed = useSaved((s) => s.viewed);
  const toast = useUi((s) => s.toast);
  const meta = useMeta();

  useEffect(() => {
    const controller = new AbortController();
    getProduct(slug, controller.signal)
      .then((data) =>
        setLoaded(data ? { slug, status: 'ready', data } : { slug, status: 'missing' }),
      )
      .catch((error: unknown) => {
        if (!isAborted(error)) setLoaded({ slug, status: 'error' });
      });
    return () => controller.abort();
  }, [slug]);

  // A different slug than the loaded one means the new saree is still loading
  const state: State = loaded?.slug === slug ? loaded : { status: 'loading' };

  const data = state.status === 'ready' ? state.data : null;
  useShareMeta(data);
  useEffect(() => {
    if (data) viewed(data.product);
  }, [data, viewed]);

  if (state.status === 'loading') {
    return (
      <div className="wrap pdp pdp--loading" aria-busy="true">
        <div className="gallery">
          <span className="photo photo--empty" />
        </div>
      </div>
    );
  }
  if (state.status !== 'ready') {
    return (
      <div className="wrap page-message">
        <h1>{state.status === 'missing' ? copy.notFound : notFound.body}</h1>
        <Link to="/shop" className="btn">
          {notFound.cta}
        </Link>
      </div>
    );
  }

  const { product, related } = state.data;
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast(copy.copied);
    } catch {
      /* cancelled */
    }
  };

  return (
    <>
      <div className="wrap pdp">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/shop">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/shop?type=${meta?.types.find((type) => type.name === product.type)?.slug ?? ''}`}
          >
            {product.type}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp-grid">
          <Gallery images={product.images} name={product.name} />

          <div className="pdp-info">
            <p className="label">
              {product.type}
              {product.handwoven && ` · ${t(copy.handwoven)}`}
            </p>
            <h1 className="pdp-name">{product.name}</h1>
            {product.nameBn && (
              <p className="pdp-bn bn-display" lang="bn">
                {product.nameBn}
              </p>
            )}
            <div className="pdp-price">
              <PriceTag price={product.price} originalPrice={product.originalPrice} />
              {product.discountPercent > 0 && (
                <span className="badge badge--sale">{copy.sale(product.discountPercent)}</span>
              )}
            </div>
            <p className="pdp-desc">{product.description}</p>

            <AddToBag key={product._id} product={product} />

            <div className="pdp-tools">
              <WishButton product={product} />
              <button type="button" className="link pdp-share" onClick={share}>
                <Icon name="share" /> {copy.share}
              </button>
            </div>

            <Specs product={product} full />

            <details className="pdp-more" open>
              <summary>{t(copy.care)}</summary>
              <p>{product.care}</p>
            </details>
            <details className="pdp-more">
              <summary>{copy.drapeTitle}</summary>
              <ol>
                {copy.drape.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </details>
            <details className="pdp-more">
              <summary>{copy.deliveryTitle}</summary>
              <ul>
                {copy.delivery.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </details>

            {product.images.some((image) => image.credit) && (
              <p className="pdp-photo-note">
                {copy.photoNote}{' '}
                <Link to="/credits" className="link">
                  {copy.credits}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="related-title">
          <div className="wrap">
            <h2 id="related-title" className="row-title">
              {sections.related.title}
            </h2>
            <div className="grid">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} sizes="(max-width: 700px) 50vw, 25vw" />
              ))}
            </div>
          </div>
        </section>
      )}
      <RecentlyViewed exclude={product._id} />
    </>
  );
}
