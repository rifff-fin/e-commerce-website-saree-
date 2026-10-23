import { useEffect, useState } from 'react';
import { getMeta } from '../services/storeService';
import type { Meta } from '../types';

let cached: Meta | null = null;

/** Store configuration (types, filters, districts); null until loaded. */
export function useMeta() {
  const [meta, setMeta] = useState<Meta | null>(cached);
  useEffect(() => {
    if (cached) return;
    let alive = true;
    getMeta()
      .then((data) => {
        cached = data;
        if (alive) setMeta(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return meta;
}
