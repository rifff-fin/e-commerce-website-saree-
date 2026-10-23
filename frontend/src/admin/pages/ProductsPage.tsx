import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiErrorMessage } from '../../lib/api';
import { formatTaka } from '../../lib/format';
import { thumbOf } from '../../lib/images';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { adminApi } from '../adminApi';
import type { Product } from '../../types';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [q, setQ] = useState('');
  const query = useDebouncedValue(q, 300);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    adminApi
      .products(query)
      .then((list) => alive && setProducts(list))
      .catch((err) => alive && setError(apiErrorMessage(err)));
    return () => {
      alive = false;
    };
  }, [query]);

  const toggleActive = async (product: Product) => {
    try {
      const updated = await adminApi.updateProduct(product._id, { active: !product.active });
      setProducts((list) => list?.map((p) => (p._id === updated._id ? updated : p)) ?? null);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await adminApi.deleteProduct(product._id);
      setProducts((list) => list?.filter((p) => p._id !== product._id) ?? null);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <div className="a-page">
      <div className="a-page-head">
        <h1>Sarees</h1>
        <Link to="/admin/products/new" className="btn">
          Add a saree
        </Link>
      </div>
      <label className="field a-search">
        <span>Search by name or type</span>
        <input className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {!products ? (
        <p>Loading…</p>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Saree</th>
                <th>Type</th>
                <th>Price</th>
                <th>In store</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className={product.active ? '' : 'is-hidden'}>
                  <td>
                    {product.images[0] ? (
                      <img
                        src={thumbOf(product.images[0].url)}
                        alt=""
                        width={48}
                        height={64}
                        className="a-thumb"
                      />
                    ) : (
                      <span className="a-thumb a-thumb--empty">No photo</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/products/${product._id}`}>{product.name}</Link>
                    {product.images.some((image) => image.credit) && (
                      <span className="a-tag" title="Uses a licensed placeholder photo">
                        placeholder photo
                      </span>
                    )}
                  </td>
                  <td>{product.type}</td>
                  <td>{formatTaka(product.price)}</td>
                  <td>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={product.active}
                        onChange={() => toggleActive(product)}
                      />
                      <span className="sr-only">Show {product.name} in the store</span>
                    </label>
                  </td>
                  <td className="a-actions">
                    <Link to={`/admin/products/${product._id}`}>Edit</Link>
                    <a href={`/saree/${product.slug}`} target="_blank" rel="noopener">
                      View
                    </a>
                    <button type="button" className="a-danger" onClick={() => remove(product)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
