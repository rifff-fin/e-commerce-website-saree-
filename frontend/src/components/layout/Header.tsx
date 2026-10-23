import { useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { demo, nav, shop, weaves as weavesCopy } from '../../content/copy';
import { useCart, selectCartCount } from '../../store/cartStore';
import { useSaved } from '../../store/savedStore';
import { useUi } from '../../store/uiStore';
import { useLang, useT } from '../../store/langStore';
import { useMeta } from '../../hooks/useMeta';
import { Icon } from '../ui/Icon';
import { Overlay } from '../ui/Overlay';
import { Logo } from './Logo';

// Only "Shop" shows as current; the others are sections or filtered views
const LINKS = [
  { to: '/shop', label: nav.shop, current: true },
  { to: '/#weaves', label: nav.weaves },
  { to: '/#occasions', label: nav.occasions },
  { to: '/shop?sort=new', label: nav.newIn },
  { to: '/track', label: nav.track },
];

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onClose();
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop');
  };
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={t(nav.search)}
      variant="dialog"
      className="search-dialog"
    >
      <form onSubmit={submit} role="search">
        <label className="field">
          <span>{t(shop.searchLabel)}</span>
          <input
            className="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={shop.searchPlaceholder}
            data-autofocus
            enterKeyHint="search"
          />
        </label>
        <div className="search-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t(nav.close)}
          </button>
          <button type="submit" className="btn">
            {t(nav.search)}
          </button>
        </div>
      </form>
    </Overlay>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const meta = useMeta();
  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={t(nav.menu)}
      variant="sheet"
      className="menu-sheet"
    >
      <div className="menu-head">
        <Logo />
        <button type="button" className="icon-btn" onClick={onClose} aria-label={t(nav.close)}>
          <Icon name="close" />
        </button>
      </div>
      <nav aria-label={t(nav.menu)}>
        <ul className="menu-links">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} onClick={onClose}>
                {t(link.label)}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/wishlist" onClick={onClose}>
              {t(nav.wishlist)}
            </Link>
          </li>
        </ul>
        <p className="label menu-sub">{weavesCopy.title}</p>
        <ul className="menu-weaves">
          {meta?.types.map((type) => (
            <li key={type.slug}>
              <Link to={`/shop?type=${type.slug}`} onClick={onClose}>
                {type.name}
                <span lang="bn" className="bn">
                  {type.bn}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Overlay>
  );
}

export function Header() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const count = useCart(selectCartCount);
  const wishCount = useSaved((s) => s.wishlist.length);
  const openBag = useUi((s) => s.openBag);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <p className="ribbon">{demo.ribbon}</p>
      <header className="header">
        <div className="wrap header-inner">
          <div className="header-left">
            <button
              type="button"
              className="icon-btn header-menu"
              onClick={() => setMenuOpen(true)}
              aria-label={t(nav.menu)}
            >
              <Icon name="menu" />
            </button>
            <nav className="header-nav" aria-label="Main">
              {LINKS.slice(0, 4).map((link) =>
                link.current ? (
                  <NavLink key={link.to} to={link.to}>
                    {t(link.label)}
                  </NavLink>
                ) : (
                  <Link key={link.to} to={link.to}>
                    {t(link.label)}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <Link to="/" className="header-logo" aria-label="Shari Kotha, home">
            <Logo />
          </Link>

          <div className="header-right">
            <button
              type="button"
              className="lang-toggle"
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              aria-label={t(nav.languageLabel)}
              lang={lang === 'en' ? 'bn' : 'en'}
            >
              {t(nav.language)}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label={t(nav.search)}
            >
              <Icon name="search" />
            </button>
            <Link
              to="/wishlist"
              className="icon-btn header-wish"
              aria-label={`${t(nav.wishlist)} (${wishCount})`}
            >
              <Icon name="heart" />
              {wishCount > 0 && <span className="count-dot">{wishCount}</span>}
            </Link>
            <button
              type="button"
              className="icon-btn"
              onClick={openBag}
              aria-label={`${t(nav.bag)} (${count})`}
            >
              <Icon name="bag" />
              {count > 0 && <span className="count-dot">{count}</span>}
            </button>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
