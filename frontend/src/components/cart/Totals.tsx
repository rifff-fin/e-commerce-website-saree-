import { bag as copy } from '../../content/copy';
import { formatTaka } from '../../lib/format';
import { useT } from '../../store/langStore';

interface TotalsProps {
  subtotal: number;
  addOns: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string | null;
}

export function Totals({
  subtotal,
  addOns,
  discount,
  deliveryFee,
  total,
  couponCode,
}: TotalsProps) {
  const t = useT();
  return (
    <dl className="totals">
      <div>
        <dt>{t(copy.subtotal)}</dt>
        <dd>{formatTaka(subtotal)}</dd>
      </div>
      {addOns > 0 && (
        <div>
          <dt>{t(copy.addOns)}</dt>
          <dd>{formatTaka(addOns)}</dd>
        </div>
      )}
      {discount > 0 && (
        <div className="totals-discount">
          <dt>
            {t(copy.discount)}
            {couponCode ? ` (${couponCode})` : ''}
          </dt>
          <dd>−{formatTaka(discount)}</dd>
        </div>
      )}
      <div>
        <dt>{t(copy.delivery)}</dt>
        <dd>{formatTaka(deliveryFee)}</dd>
      </div>
      <div className="totals-total">
        <dt>{t(copy.total)}</dt>
        <dd>{formatTaka(total)}</dd>
      </div>
    </dl>
  );
}
