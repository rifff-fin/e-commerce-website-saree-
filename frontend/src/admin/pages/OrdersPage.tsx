import { Fragment, useEffect, useState } from 'react';
import { apiErrorMessage } from '../../lib/api';
import { paymentLabel } from '../../lib/checkout';
import { formatTaka } from '../../lib/format';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { adminApi, ORDER_STATUSES } from '../adminApi';
import type { Order } from '../../types';

const dateTime = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const query = useDebouncedValue(q, 300);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    adminApi
      .orders({ status: status || undefined, q: query || undefined })
      .then((list) => alive && setOrders(list))
      .catch((err) => alive && setError(apiErrorMessage(err)));
    return () => {
      alive = false;
    };
  }, [status, query]);

  const change = async (order: Order, next: string) => {
    try {
      const updated = await adminApi.setOrderStatus(order._id, next);
      setOrders((list) => list?.map((o) => (o._id === updated._id ? updated : o)) ?? null);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  const remove = async (order: Order) => {
    if (!window.confirm(`Delete order ${order.orderNumber}?`)) return;
    try {
      await adminApi.deleteOrder(order._id);
      setOrders((list) => list?.filter((o) => o._id !== order._id) ?? null);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <div className="a-page">
      <h1>Orders</h1>
      <div className="a-filters">
        <label className="field">
          <span>Status</span>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Search order ID, phone or name</span>
          <input className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {!orders ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <p className="a-note">No orders found.</p>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Placed</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order._id}>
                  <tr>
                    <td>
                      <button
                        type="button"
                        className="a-link"
                        onClick={() => setOpen(open === order._id ? null : order._id)}
                        aria-expanded={open === order._id}
                      >
                        {order.orderNumber}
                      </button>
                    </td>
                    <td>{dateTime.format(new Date(order.createdAt))}</td>
                    <td>
                      {order.shipping.name}
                      <br />
                      <small>{order.shipping.phone}</small>
                    </td>
                    <td>{paymentLabel(order.payment.method)}</td>
                    <td>{formatTaka(order.pricing.total)}</td>
                    <td>
                      <select
                        className="select a-status-select"
                        value={order.status}
                        onChange={(e) => change(order, e.target.value)}
                        aria-label={`Status of ${order.orderNumber}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="a-actions">
                      <button type="button" className="a-danger" onClick={() => remove(order)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                  {open === order._id && (
                    <tr className="a-detail">
                      <td colSpan={7}>
                        <p>
                          {order.shipping.address}, {order.shipping.district} (
                          {order.shipping.division})
                          {order.shipping.email && ` · ${order.shipping.email}`}
                          {order.shipping.note && ` · Note: ${order.shipping.note}`}
                        </p>
                        <ul>
                          {order.items.map((item) => (
                            <li key={`${item.product}-${item.fallPico}`}>
                              {item.name} ({item.type}) × {item.qty}
                              {item.fallPico && ' + fall & pico'} · {formatTaka(item.lineTotal)}
                            </li>
                          ))}
                        </ul>
                        <p>
                          Sarees {formatTaka(order.pricing.subtotal)} · Add-ons{' '}
                          {formatTaka(order.pricing.addOns)} · Discount{' '}
                          {formatTaka(order.pricing.discount)}
                          {order.pricing.couponCode && ` (${order.pricing.couponCode})`} · Delivery{' '}
                          {formatTaka(order.pricing.deliveryFee)}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
