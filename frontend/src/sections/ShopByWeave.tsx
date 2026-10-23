import { Link } from 'react-router';
import { weaves } from '../content/copy';
import { useMeta } from '../hooks/useMeta';
import { useProducts } from '../hooks/useProducts';
import { Photo } from '../components/product/Photo';

// The tile photo for each weave
const COVER: Record<string, string> = {
  jamdani: '/products/khoyeri-buti-jamdani.webp',
  'katan-benarasi': '/products/khoyeri-jaal-benarasi.webp',
  'rajshahi-silk': '/products/tota-sobuj-rajshahi-silk.webp',
  'tangail-tant': '/products/nil-paar-tangail.webp',
  monipuri: '/products/beige-khoyeri-monipuri.webp',
  'half-silk': '/products/shonali-buti-ivory-half-silk.webp',
  kantha: '/products/tia-sui-kantha-cotton.webp',
  'georgette-chiffon': '/products/koffee-sheer-chiffon.webp',
  'tissue-organza': '/products/akashi-tissue-organza.webp',
  cotton: '/products/holud-paisley-cotton.webp',
};

/** Tall arched tiles, one per weave that has sarees in stock. */
export function ShopByWeave() {
  const meta = useMeta();
  const { data } = useProducts({ limit: '1' });
  const counts = data?.facets.types ?? {};
  const types = (meta?.types ?? []).filter((type) => (counts[type.slug] ?? 0) > 0);
  const soon = data
    ? (meta?.types ?? []).filter((type) => !counts[type.slug]).map((t) => t.name)
    : [];

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
        {soon.length > 0 && <p className="weave-soon">{weaves.soon(soon)}</p>}
      </div>
    </section>
  );
}
