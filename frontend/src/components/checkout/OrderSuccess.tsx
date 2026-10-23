import { Link } from 'react-router';
import { success } from '../../content/copy';
import { paymentLabel } from '../../lib/checkout';
import { formatDayRange } from '../../lib/format';
import { useT } from '../../store/langStore';
import { Totals } from '../cart/Totals';
import type { Order } from '../../types';

export function OrderSuccess({ order }: { order: Order }) {
  const t = useT();
  return (
    <div className="success">
      <p className="success-mark" aria-hidden="true">
        ধন্যবাদ
      </p>
      <h1 tabIndex={-1} data-autofocus>
        {t(success.title)}
      </h1>
      <p className="success-id">
        {t(success.number)}: <strong>{order.orderNumber}</strong>
      </p>
      <p>{success.keep}</p>
      <dl className="success-meta">
        <div>
          <dt>{success.eta}</dt>
          <dd>{formatDayRange(order.estimatedDelivery.from, order.estimatedDelivery.to)}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>
            {order.payment.method === 'cod'
              ? success.cod
              : success.paid(paymentLabel(order.payment.method))}
          </dd>
        </div>
      </dl>
      <Totals {...order.pricing} />
      <p className="demo-note">{success.demo}</p>
      <div className="success-actions">
        <Link to="/track" className="btn">
          {success.track}
        </Link>
        <Link to="/shop" className="link-arrow">
          {success.shop}
        </Link>
      </div>
    </div>
  );
}
