import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router';
import { errors } from './content/copy';
import { useRevealObserver } from './hooks/useReveal';
import { useConnection } from './store/connectionStore';
import { BagDrawer } from './components/cart/BagDrawer';
import { ChatButtons } from './components/layout/ChatButtons';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { FinCredit } from './components/layout/FinCredit';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { QuickView } from './components/product/QuickView';
import { Toasts } from './components/ui/Toasts';
import { CheckoutPage } from './pages/CheckoutPage';
import { CreditsPage } from './pages/CreditsPage';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { ShopPage } from './pages/ShopPage';
import { FaqPage, NotFoundPage } from './pages/SimplePages';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';

// The admin panel is its own chunk: shoppers never download it
const AdminApp = lazy(() => import('./admin/AdminApp'));

/** New page: scroll to the top, or to #section; back/forward keeps the browser's position. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === 'POP') return;
    if (hash) {
      let tries = 0;
      const find = () => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) el.scrollIntoView();
        else if (tries++ < 20) window.setTimeout(find, 50);
      };
      find();
      return;
    }
    window.scrollTo(0, 0);
    // Only the path and hash: filter changes on the shop page must not jump the page
  }, [pathname, hash, navType]);

  return null;
}

function OfflineNotice() {
  const offline = useConnection((s) => s.offline);
  if (!offline) return null;
  return (
    <p className="offline-note" role="status">
      {errors.offline}
    </p>
  );
}

function Store() {
  useRevealObserver();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <OfflineNotice />
      <main id="main" tabIndex={-1}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/saree/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      <BagDrawer />
      <QuickView />
      <Toasts />
      <ChatButtons />
      <FinCredit />
    </>
  );
}

export function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<p className="admin-loading">Loading admin…</p>}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<Store />} />
      </Routes>
    </>
  );
}
