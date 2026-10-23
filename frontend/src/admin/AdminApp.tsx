import { useEffect } from 'react';
import { NavLink, Route, Routes } from 'react-router';
import { LogoMark } from '../components/layout/Logo';
import { brand } from '../content/copy';
import { adminApi, useAdminAuth } from './adminApi';
import { AdminLogin } from './AdminLogin';
import { BannersPage } from './pages/BannersPage';
import { CouponsPage } from './pages/CouponsPage';
import { Dashboard } from './pages/Dashboard';
import { OrdersPage } from './pages/OrdersPage';
import { ProductEditor } from './pages/ProductEditor';
import { ProductsPage } from './pages/ProductsPage';
import { SubscribersPage } from './pages/SubscribersPage';
import './admin.css';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Sarees' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/banners', label: 'Homepage banners' },
  { to: '/admin/subscribers', label: 'Subscribers' },
];

/** The admin panel (/admin): login, then a sidebar app for the catalog and orders. */
export default function AdminApp() {
  const token = useAdminAuth((s) => s.token);
  const email = useAdminAuth((s) => s.email);

  useEffect(() => {
    document.title = `Admin | ${brand.name}`;
  }, []);

  // Restore the admin's email for a token kept from earlier in this tab
  useEffect(() => {
    if (!token || email) return;
    adminApi
      .me()
      .then((me) => useAdminAuth.setState({ email: me.email }))
      .catch(() => {});
  }, [token, email]);

  if (!token) return <AdminLogin />;

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-brand">
          <LogoMark size={30} />
          <div>
            <b>{brand.name}</b>
            <span>Admin</span>
          </div>
        </div>
        <nav aria-label="Admin">
          {LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a href="/" target="_blank" rel="noopener">
            View store ↗
          </a>
          <button type="button" onClick={() => useAdminAuth.getState().logout()}>
            Log out
          </button>
          {email && <p className="admin-email">{email}</p>}
        </div>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductEditor />} />
          <Route path="products/:id" element={<ProductEditor />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
