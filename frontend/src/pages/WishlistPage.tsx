import { useEffect } from 'react';
import { Link } from 'react-router';
import { wishlist as copy } from '../content/copy';
import { formatTaka } from '../lib/format';
import { useSaved } from '../store/savedStore';
import { useT } from '../store/langStore';
import { Photo } from '../components/product/Photo';

export function WishlistPage() {
  const t = useT();
  const items = useSaved((s) => s.wishlist);
  const remove = useSaved((s) => s.removeWish);

  useEffect(() => {
    document.title = 'Wishlist | Shari Kotha';
  }, []);

  return (
    <div className="wrap wishlist">
      <h1>{t(copy.title)}</h1>
      {items.length === 0 ? (
        <div className="page-message page-message--left">
          <p>{copy.empty}</p>
          <Link to="/shop" className="btn">
            {copy.browse}
          </Link>
        </div>
      ) : (
        <ul className="grid">
          {items.map((item) => (
            <li key={item.id} className="card">
              <Link
                to={`/saree/${item.slug}`}
                className="card-media"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Photo src={item.image} alt="" />
              </Link>
              <div className="card-body">
                <p className="label">{item.type}</p>
                <h2 className="card-name">
                  <Link to={`/saree/${item.slug}`}>{item.name}</Link>
                </h2>
                <p className="price">{formatTaka(item.price)}</p>
                <button type="button" className="link" onClick={() => remove(item.id)}>
                  {copy.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
