import { product as copy } from '../../content/copy';
import { metres } from '../../lib/format';
import { useT } from '../../store/langStore';
import type { Product } from '../../types';

/** The saree's details as a definition list (labels in English or Bangla). */
export function Specs({ product, full = false }: { product: Product; full?: boolean }) {
  const t = useT();
  const { sareeMetres, blouseMetres } = product.length;
  const rows: [string, string][] = [
    [t(copy.type), product.type + (product.handwoven ? ` · ${t(copy.handwoven)}` : '')],
    [t(copy.fabric), product.fabric],
    [t(copy.weave), product.weave],
    [t(copy.length), metres(sareeMetres)],
    [
      t(copy.blouse),
      product.withBlousePiece && blouseMetres > 0
        ? `${t(copy.included)}, ${metres(blouseMetres)}`
        : t(copy.notIncluded),
    ],
  ];
  if (full) {
    rows.push(
      [t(copy.origin), product.origin],
      [t(copy.colours), product.colors.join(', ')],
      [t(copy.occasion), product.occasions.join(', ')],
    );
  }
  return (
    <dl className="specs">
      {rows
        .filter(([, value]) => value)
        .map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
}
