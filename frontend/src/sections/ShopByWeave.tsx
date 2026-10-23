import { Link } from 'react-router';
import { weaves } from '../content/copy';
import { useMeta } from '../hooks/useMeta';
import { useProducts } from '../hooks/useProducts';
import { Photo } from '../components/product/Photo';

// The tile photo for each weave (the first saree of that type otherwise)
const COVER: Record<string, string> = {
  jamdani: '/products/jamdani-grey-red-01.webp',
  'katan-benarasi': '/products/benarasi-purple-01.webp',
  'rajshahi-silk': '/products/rajshahi-silk-magenta-01.webp',
  'tangail-tant': '/products/tant-pink-01.webp',
  muslin: '/products/muslin-ivory-01.webp',
  cotton: '/products/cotton-orange-print-01.webp',
};

/** Tall arched tiles, one per weave that has sarees in stock. */
export function ShopByWeave() {
  const meta = useMeta();
  const { data } = useProducts({ limit: '1' });
  const counts = data?.facets.types ?? {};
  const types = (meta?.types ?? []).filter((type) => (counts[type.slug] ?? 0) > 0);

  return (
    <section className="weaves" id="weaves" aria-labelledby="weaves-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="weaves-title">
            {weaves.title}{' '}
            <span className="bn-display section-bn" lang="bn">
              {weaves.titleBn}
            </span>
          </h2>
          <p className="section-intro">{weaves.intro}</p>
        </div>
        <ul className="weave-row">
          {types.map((type, i) => (
            <li key={type.slug} data-reveal style={{ '--d': i } as React.CSSProperties}>
              <Link to={`/shop?type=${type.slug}`} className="weave-tile">
                <span className="weave-arch">
                  <Photo src={COVER[type.slug]} alt="" sizes="(max-width: 700px) 45vw, 200px" />
                </span>
                <span className="weave-name">{type.name}</span>
                <span className="weave-bn bn" lang="bn">
                  {type.bn}
                </span>
                <span className="weave-count">{weaves.count(counts[type.slug] ?? 0)}</span>
              </Link>
            </li>
          ))}
        </ul>
        {types.length > 0 && <p className="weave-soon">{weaves.soon}</p>}
      </div>
    </section>
  );
}
