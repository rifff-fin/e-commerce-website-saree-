import { Link, useNavigate } from 'react-router';
import { bag as copy, nav } from '../../content/copy';
import { formatTaka } from '../../lib/format';
import { cartTotals, FALL_PICO_PRICE, MAX_QTY_PER_LINE } from '../../lib/pricing';
import { useCart } from '../../store/cartStore';
import { useT } from '../../store/langStore';
import { useUi } from '../../store/uiStore';
import { Photo } from '../product/Photo';
import { Icon } from '../ui/Icon';
import { Overlay } from '../ui/Overlay';
import { QtyStepper } from '../ui/QtyStepper';
import { CouponField } from './CouponField';
import { Totals } from './Totals';

export function BagDrawer() {
  const t = useT();
  const navigate = useNavigate();
  const open = useUi((s) => s.bagOpen);
  const close = useUi((s) => s.closeBag);
  const { items, zone, coupon, setQty, setFallPico, remove, setZone } = useCart();
  const totals = cartTotals(items, zone, coupon);

  return (
    <Overlay open={open} onClose={close} label={t(copy.title)} variant="drawer" className="bag">
      <div className="bag-head">
        <h2>{t(copy.title)}</h2>
        <button type="button" className="icon-btn" onClick={close} aria-label={t(nav.close)}>
          <Icon name="close" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bag-empty">
          <p>{copy.empty}</p>
          <Link to="/shop" className="btn" onClick={close}>
            {copy.emptyCta}
          </Link>
        </div>
      ) : (
        <>
          <ul className="bag-items">
            {items.map((item) => (
              <li key={item.key} className="bag-item">
                <Link
                  to={`/saree/${item.slug}`}
                  onClick={close}
                  className="bag-thumb"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Photo src={item.image} alt="" sizes="96px" />
                </Link>
                <div className="bag-info">
                  <p className="label">{item.type}</p>
                  <Link to={`/saree/${item.slug}`} onClick={close} className="bag-name">
                    {item.name}
                  </Link>
                  <p className="price">{formatTaka(item.price)}</p>
                  <label className="checkbox bag-addon">
                    <input
                      type="checkbox"
                      checked={item.fallPico}
                      onChange={(e) => setFallPico(item.key, e.target.checked)}
                    />
                    <span>
                      {copy.fallPico} (+{formatTaka(FALL_PICO_PRICE)})
                    </span>
                  </label>
                  <div className="bag-row">
                    <QtyStepper
                      value={item.qty}
                      max={MAX_QTY_PER_LINE}
                      onChange={(n) => setQty(item.key, n)}
                      label={`Quantity of ${item.name}`}
                    />
                    <button
                      type="button"
                      className="link bag-remove"
                      onClick={() => remove(item.key)}
                    >
                      {copy.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="bag-foot">
            <fieldset className="zone">
              <legend className="sr-only">{t(copy.delivery)}</legend>
              <label>
                <input
                  type="radio"
                  name="zone"
                  checked={zone === 'inside-dhaka'}
                  onChange={() => setZone('inside-dhaka')}
                />
                <span>{copy.insideDhaka}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="zone"
                  checked={zone === 'outside-dhaka'}
                  onChange={() => setZone('outside-dhaka')}
                />
                <span>{copy.outsideDhaka}</span>
              </label>
            </fieldset>
            <CouponField subtotal={totals.subtotal} />
            <Totals {...totals} couponCode={coupon?.code} />
            <button
              type="button"
              className="btn btn--block"
              onClick={() => {
                close();
                navigate('/checkout');
              }}
            >
              {t(copy.checkout)}
            </button>
            <button type="button" className="link bag-continue" onClick={close}>
              {copy.continue}
            </button>
          </div>
        </>
      )}
    </Overlay>
  );
}
