import type { CatalogFilters, SortKey } from '../types';

const SORTS: SortKey[] = ['popular', 'new', 'price-asc', 'price-desc'];

const list = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const num = (value: string | null) =>
  value !== null && value !== '' && Number.isFinite(Number(value)) ? Number(value) : undefined;

/** The shop's filters live in the URL (?type=jamdani&occasion=Wedding), so links can share them. */
export function filtersFromParams(params: URLSearchParams): CatalogFilters {
  const sort = params.get('sort') as SortKey | null;
  return {
    q: params.get('q') ?? '',
    types: list(params, 'type'),
    fabrics: list(params, 'fabric'),
    colors: list(params, 'color'),
    occasions: list(params, 'occasion'),
    minPrice: num(params.get('minPrice')),
    maxPrice: num(params.get('maxPrice')),
    blouse: params.get('blouse') === 'true',
    handwoven: params.get('handwoven') === 'true',
    sort: sort && SORTS.includes(sort) ? sort : 'popular',
  };
}

export function paramsFromFilters(filters: CatalogFilters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.types.length) params.set('type', filters.types.join(','));
  if (filters.occasions.length) params.set('occasion', filters.occasions.join(','));
  if (filters.colors.length) params.set('color', filters.colors.join(','));
  if (filters.fabrics.length) params.set('fabric', filters.fabrics.join(','));
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.blouse) params.set('blouse', 'true');
  if (filters.handwoven) params.set('handwoven', 'true');
  if (filters.sort !== 'popular') params.set('sort', filters.sort);
  return params;
}

/** How many filters are on (for the mobile "Filters (3)" button). */
export const activeFilterCount = (f: CatalogFilters) =>
  f.types.length +
  f.fabrics.length +
  f.colors.length +
  f.occasions.length +
  (f.minPrice !== undefined || f.maxPrice !== undefined ? 1 : 0) +
  (f.blouse ? 1 : 0) +
  (f.handwoven ? 1 : 0);
