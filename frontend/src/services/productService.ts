import api from '../lib/api';
import { demoProduct, demoProducts } from '../lib/demoStore';
import { isObject, READ_TIMEOUT, withFallback } from './fallback';
import type { CatalogFilters, ProductDetailResponse, ProductListResponse } from '../types';

/** Turns the UI filters into the API's query string (only non-default values). */
export function toQuery(filters: Partial<CatalogFilters>) {
  const params: Record<string, string> = {};
  if (filters.q?.trim()) params.q = filters.q.trim();
  if (filters.types?.length) params.type = filters.types.join(',');
  if (filters.fabrics?.length) params.fabric = filters.fabrics.join(',');
  if (filters.colors?.length) params.color = filters.colors.join(',');
  if (filters.occasions?.length) params.occasion = filters.occasions.join(',');
  if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice);
  if (filters.blouse) params.blouse = 'true';
  if (filters.handwoven) params.handwoven = 'true';
  if (filters.sort && filters.sort !== 'popular') params.sort = filters.sort;
  return params;
}

const isProductList = (data: unknown) => isObject(data) && Array.isArray(data.products);

/** GET /api/products with query params built by `toQuery`. */
export function getProducts(params: Record<string, string>, signal?: AbortSignal) {
  return withFallback(
    async () =>
      (await api.get<ProductListResponse>('/products', { params, signal, timeout: READ_TIMEOUT }))
        .data,
    isProductList,
    () => demoProducts(params),
  );
}

/** One saree and its related sarees. Resolves null when the slug does not exist. */
export async function getProduct(slug: string, signal?: AbortSignal) {
  try {
    return await withFallback<ProductDetailResponse | null>(
      async () =>
        (
          await api.get<ProductDetailResponse>(`/products/${encodeURIComponent(slug)}`, {
            signal,
            timeout: READ_TIMEOUT,
          })
        ).data,
      (data) => isObject(data) && isObject(data.product),
      () => demoProduct(slug),
    );
  } catch (error) {
    if ((error as { response?: { status?: number } }).response?.status === 404) return null;
    throw error;
  }
}
