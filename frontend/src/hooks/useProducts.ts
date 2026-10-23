import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { isAborted } from '../lib/api';
import type { ProductListResponse } from '../types';

interface Result {
  key: string; // the request this answer belongs to
  status: 'ready' | 'error';
  data: ProductListResponse | null;
}

/**
 * Fetches a product list for the given query; refetches when the query changes. While a
 * new query loads, the previous list stays on screen (status 'loading').
 */
export function useProducts(params: Record<string, string>) {
  const [attempt, setAttempt] = useState(0);
  const key = `${JSON.stringify(params)}#${attempt}`;
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getProducts(
      JSON.parse(key.slice(0, key.lastIndexOf('#'))) as Record<string, string>,
      controller.signal,
    )
      .then((data) => setResult({ key, status: 'ready', data }))
      .catch((error: unknown) => {
        if (!isAborted(error))
          setResult((prev) => ({ key, status: 'error', data: prev?.data ?? null }));
      });
    return () => controller.abort();
  }, [key]);

  const status = result?.key === key ? result.status : 'loading';
  return { status, data: result?.data ?? null, retry: () => setAttempt((n) => n + 1) };
}
