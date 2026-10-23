import { Link } from 'react-router';
import { sections } from '../content/copy';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { Icon } from '../components/ui/Icon';

export function NewArrivals() {
  const { data } = useProducts({ isNew: 'true', sort: 'new', limit: '8' });
  const products = data?.products ?? [];

  return (
    <section className="arrivals" aria-labelledby="arrivals-title">
      <div className="wrap">
        <div className="row-head" data-reveal>
          <h2 id="arrivals-title">{sections.newArrivals.title}</h2>
          <Link to="/shop?sort=new" className="link-arrow">
            {sections.newArrivals.link} <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="grid">
          {products.map((product, i) => (
            <div key={product._id} data-reveal style={{ '--d': i % 4 } as React.CSSProperties}>
              <ProductCard
                product={product}
                sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
