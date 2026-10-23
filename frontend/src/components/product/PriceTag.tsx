import { formatTaka } from '../../lib/format';

export function PriceTag({ price, originalPrice }: { price: number; originalPrice?: number }) {
  const onSale = originalPrice !== undefined && originalPrice > price;
  return (
    <p className="price">
      <span>{formatTaka(price)}</span>
      {onSale && (
        <del>
          <span className="sr-only">was </span>
          {formatTaka(originalPrice)}
        </del>
      )}
    </p>
  );
}
