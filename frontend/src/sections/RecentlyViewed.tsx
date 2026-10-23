import { Link } from 'react-router';
import { sections } from '../content/copy';
import { formatTaka } from '../lib/format';
import { useSaved } from '../store/savedStore';
import { Photo } from '../components/product/Photo';

/** The last sarees this shopper opened (kept in this browser). */
export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const recent = useSaved((s) => s.recent).filter((item) => item.id !== exclude);
  if (recent.length === 0) return null;

  return (
    <section className="recent" aria-labelledby="recent-title">
      <div className="wrap">
        <h2 id="recent-title" className="recent-title">
          {sections.recent.title}
        </h2>
        <ul className="recent-row">
          {recent.map((item) => (
            <li key={item.id}>
              <Link to={`/saree/${item.slug}`} className="mini-card">
                <Photo src={item.image} alt="" sizes="160px" />
                <span className="mini-name">{item.name}</span>
                <span className="mini-price">{formatTaka(item.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
