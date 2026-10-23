import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { track as copy } from '../content/copy';
import { apiErrorMessage } from '../lib/api';
import { isBdMobile, LAST_ORDER_KEY, normalizePhone, paymentLabel } from '../lib/checkout';
import { formatDayRange, formatTaka } from '../lib/format';
import { readPref } from '../lib/storage';
import { getOrder } from '../services/storeService';
import { useT } from '../store/langStore';
import { Totals } from '../components/cart/Totals';
import type { Order, OrderStatus } from '../types';

const FLOW: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'delivered'];

function lastOrder() {
  try {
    return JSON.parse(readPref(LAST_ORDER_KEY) || 'null') as {
      orderNumber: string;
      phone: string;
    } | null;
  } catch {
    return null;
  }
}

export function TrackOrderPage() {
  const t = useT();
  const [orderNumber, setOrderNumber] = useState(() => lastOrder()?.orderNumber ?? '');
  const [phone, setPhone] = useState(() => lastOrder()?.phone ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    document.title = 'Track your order | Shari Kotha';
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const id = orderNumber.trim().toUpperCase();
    if (!/^SK-\d{5}$/.test(id)) return setError(copy.invalidId);
    if (!isBdMobile(phone)) return setError(copy.invalidPhone);
    setBusy(true);
    setError('');
    setOrder(null);
    try {
      const found = await getOrder(id, normalizePhone(phone));
      if (found) setOrder(found);
      else setError('No order found with that ID and phone number');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const reached = order ? FLOW.indexOf(order.status) : -1;

  return (
    <div className="wrap narrow track">
      <h1>{t(copy.title)}</h1>
      <p className="section-intro">{copy.intro}</p>
      <form className="track-form" onSubmit={submit} noValidate>
        <label className="field">
          <span>{t(copy.orderId)}</span>
          <input
            className="input"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="SK-12345"
            autoCapitalize="characters"
          />
        </label>
        <label className="field">
          <span>{t(copy.phone)}</span>
          <input
            className="input"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
          />
        </label>
        <button type="submit" className="btn" disabled={busy}>
          {t(copy.submit)}
        </button>
      </form>
      <p className="field-error" role="alert">
        {error}
      </p>

      {order && (
        <section className="track-result" aria-live="polite">
          <h2>{order.orderNumber}</h2>
          {order.status === 'cancelled' ? (
            <p className="track-cancelled">{copy.statuses.cancelled}</p>
          ) : (
            <ol className="track-flow">
              {FLOW.map((status, i) => (
                <li
                  key={status}
                  className={i <= reached ? 'is-done' : ''}
                  aria-current={i === reached ? 'step' : undefined}
                >
                  {copy.statuses[status]}
                </li>
              ))}
            </ol>
          )}
          <p>
            Expected: {formatDayRange(order.estimatedDelivery.from, order.estimatedDelivery.to)} ·{' '}
            {order.shipping.district} · {paymentLabel(order.payment.method)}
          </p>
          <h3 className="label">{copy.items}</h3>
          <ul className="track-items">
            {order.items.map((item) => (
              <li key={`${item.product}-${item.fallPico}`}>
                <Link to={`/saree/${item.slug}`}>{item.name}</Link> × {item.qty}
                {item.fallPico && ' (fall & pico)'}{' '}
                <span className="price">{formatTaka(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <Totals {...order.pricing} />
          {order.isDemo && <p className="demo-note">Demo order: nothing will be shipped.</p>}
        </section>
      )}
    </div>
  );
}
