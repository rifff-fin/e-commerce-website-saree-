import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { brand, nav, shop as copy } from '../content/copy';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useMeta } from '../hooks/useMeta';
import { useProducts } from '../hooks/useProducts';
import { activeFilterCount, filtersFromParams, paramsFromFilters } from '../lib/filters';
import { toQuery } from '../services/productService';
import { useT } from '../store/langStore';
import { FilterPanel } from '../components/shop/FilterPanel';
import { ProductCard } from '../components/product/ProductCard';
import { Icon } from '../components/ui/Icon';
import { Overlay } from '../components/ui/Overlay';
import type { CatalogFilters, SortKey } from '../types';

export function ShopPage() {
  const t = useT();
  const meta = useMeta();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const [sheetOpen, setSheetOpen] = useState(false);

  // The search box types freely; the URL (and the fetch) follow after a pause
  const [q, setQ] = useState(filters.q);
  const [syncedQ, setSyncedQ] = useState(filters.q);
  if (filters.q !== syncedQ) {
    // The URL changed from outside (e.g. the header search): show it in the box
    setSyncedQ(filters.q);
    setQ(filters.q);
  }
  const debouncedQ = useDebouncedValue(q, 350);

  const update = (patch: Partial<CatalogFilters>) =>
    setParams(paramsFromFilters({ ...filters, ...patch }), { replace: true });

  useEffect(() => {
    if (debouncedQ !== filters.q) update({ q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the typed text settles
  }, [debouncedQ]);

  const { status, data, retry } = useProducts(toQuery(filters));
  const stocked = useProducts({ limit: '1' }).data?.facets.types ?? {};
  const products = data?.products ?? [];
  const activeCount = activeFilterCount(filters);
  const typeName =
    filters.types.length === 1
      ? meta?.types.find((type) => type.slug === filters.types[0])
      : undefined;

  useEffect(() => {
    document.title = `${typeName?.name ?? copy.title} | ${brand.name}`;
  }, [typeName]);

  const clear = () => {
    setQ('');
    setParams(filters.sort !== 'popular' ? { sort: filters.sort } : {}, { replace: true });
  };

  const panel = meta && (
    <FilterPanel
      meta={meta}
      filters={filters}
      typeCounts={data?.facets.types ?? {}}
      stockedCounts={stocked}
      onChange={update}
      onClear={clear}
    />
  );

  return (
    <div className="shop wrap">
      <header className="shop-head">
        <h1>
          {typeName?.name ?? copy.title}{' '}
          <span className="bn-display section-bn" lang="bn">
            {typeName?.bn ?? copy.titleBn}
          </span>
        </h1>
        {typeName && <p className="section-intro">{typeName.blurb}</p>}
      </header>

      <div className="shop-bar">
        <label className="shop-search">
          <Icon name="search" />
          <span className="sr-only">{t(copy.searchLabel)}</span>
          <input
            type="search"
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={copy.searchPlaceholder}
            enterKeyHint="search"
          />
        </label>
        <button
          type="button"
          className="btn btn--ghost shop-filter-btn"
          onClick={() => setSheetOpen(true)}
        >
          {t(copy.filters)}
          {activeCount > 0 && ` (${activeCount})`}
        </button>
        <label className="shop-sort">
          <span>{t(copy.sort)}</span>
          <select
            className="select"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortKey })}
          >
            {(Object.keys(copy.sorts) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {copy.sorts[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="shop-layout">
        <aside className="shop-aside" aria-label={t(copy.filters)}>
          {panel}
        </aside>

        <section className="shop-results" aria-busy={status === 'loading'} aria-live="polite">
          <p className="shop-count">
            {status === 'loading' && !data ? copy.loading : copy.results(products.length)}
          </p>
          {status === 'error' && !data ? (
            <div className="shop-empty">
              <p>{copy.error}</p>
              <button type="button" className="btn" onClick={retry}>
                {copy.retry}
              </button>
            </div>
          ) : products.length === 0 && status === 'ready' ? (
            <div className="shop-empty">
              <p>{copy.empty}</p>
              <p className="section-intro">{copy.emptyHint}</p>
              <button type="button" className="btn btn--ghost" onClick={clear}>
                {copy.clear}
              </button>
            </div>
          ) : (
            <div className={`grid grid--shop${status === 'loading' ? ' is-loading' : ''}`}>
              {products.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  eager={i < 3}
                  sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Overlay
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        label={t(copy.filters)}
        variant="sheet"
        className="filter-sheet"
      >
        <div className="sheet-head">
          <h2>{t(copy.filters)}</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSheetOpen(false)}
            aria-label={t(nav.close)}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="sheet-body">{panel}</div>
        <div className="sheet-foot">
          <button type="button" className="btn btn--block" onClick={() => setSheetOpen(false)}>
            {copy.apply} ({products.length})
          </button>
        </div>
      </Overlay>
    </div>
  );
}
