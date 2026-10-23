import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiErrorMessage } from '../../lib/api';
import { formatTaka } from '../../lib/format';
import { adminApi, ORDER_STATUSES, type AdminStats } from '../adminApi';

export function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((err) => setError(apiErrorMessage(err)));
  }, []);

  if (error) return <p className="field-error">{error}</p>;
  if (!stats) return <p>Loading…</p>;

  const totalOrders = Object.values(stats.orders).reduce((a, b) => a + b, 0);
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.revenue));

  return (
    <div className="a-page">
      <h1>Dashboard</h1>
      <p className="a-note">
        All orders are demo orders; they are deleted automatically after 30 days.
      </p>
      <dl className="a-tiles">
        <div>
          <dt>Revenue (not cancelled)</dt>
          <dd>{formatTaka(stats.revenue)}</dd>
        </div>
        <div>
          <dt>Orders</dt>
          <dd>{totalOrders}</dd>
        </div>
        <div>
          <dt>Sarees live</dt>
          <dd>
            {stats.activeProducts} <small>of {stats.products}</small>
          </dd>
        </div>
        <div>
          <dt>Subscribers</dt>
          <dd>{stats.subscribers}</dd>
        </div>
      </dl>

      <div className="a-columns">
        <section className="a-card">
          <h2>Orders by status</h2>
          <ul className="a-status-list">
            {ORDER_STATUSES.map((status) => (
              <li key={status}>
                <span className={`a-status a-status--${status}`}>{status}</span>
                <b>{stats.orders[status] ?? 0}</b>
              </li>
            ))}
          </ul>
        </section>
        <section className="a-card">
          <h2>Sarees by type</h2>
          <ul className="a-status-list">
            {stats.byType.map((row) => (
              <li key={row.type}>
                <span>{row.type}</span>
                <b>{row.count}</b>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="a-card">
        <h2>Last 14 days</h2>
        {stats.daily.length === 0 ? (
          <p className="a-note">No orders yet.</p>
        ) : (
          <ul className="a-bars">
            {stats.daily.map((day) => (
              <li key={day._id}>
                <span className="a-bar-day">{day._id.slice(5)}</span>
                <span className="a-bar-track">
                  <span className="a-bar" style={{ width: `${(day.revenue / maxDaily) * 100}%` }} />
                </span>
                <span className="a-bar-value">
                  {formatTaka(day.revenue)} · {day.orders}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="a-card">
        <div className="a-card-head">
          <h2>Recent orders</h2>
          <Link to="/admin/orders">All orders</Link>
        </div>
        <table className="a-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.shipping.name}</td>
                <td>{formatTaka(order.pricing.total)}</td>
                <td>
                  <span className={`a-status a-status--${order.status}`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
