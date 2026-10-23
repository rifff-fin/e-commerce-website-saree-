import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { checkout as copy } from '../content/copy';
import { apiErrorMessage, apiFieldErrors } from '../lib/api';
import {
  formatCardNumber,
  formatExpiry,
  isWallet,
  LAST_ORDER_KEY,
  normalizePhone,
  PAYMENT_OPTIONS,
  paymentLabel,
  validateShipping,
  validateTestCard,
  type CardInput,
  type FieldErrors,
  type WalletMethod,
} from '../lib/checkout';
import { formatTaka } from '../lib/format';
import { cartTotals, deliveryZoneFor } from '../lib/pricing';
import { writePref } from '../lib/storage';
import { useMeta } from '../hooks/useMeta';
import { createOrder } from '../services/storeService';
import { useCart } from '../store/cartStore';
import { useT } from '../store/langStore';
import { CouponField } from '../components/cart/CouponField';
import { Totals } from '../components/cart/Totals';
import { OrderSuccess } from '../components/checkout/OrderSuccess';
import { WalletMock } from '../components/checkout/WalletMock';
import { Photo } from '../components/product/Photo';
import type { Order, PaymentMethod, ShippingInfo } from '../types';

const EMPTY_SHIPPING: ShippingInfo = {
  name: '',
  phone: '',
  email: '',
  address: '',
  district: '',
  note: '',
};
const EMPTY_CARD: CardInput = { number: '', expiry: '', cvc: '', name: '' };

export function CheckoutPage() {
  const t = useT();
  const meta = useMeta();
  const { items, zone, coupon, setZone, clear } = useCart();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [method, setMethod] = useState<PaymentMethod>('cod');
  // Card details stay in this component only; they are never sent anywhere
  const [card, setCard] = useState<CardInput>(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardInput, string>>>({});
  const [wallet, setWallet] = useState<WalletMethod | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const totals = cartTotals(items, zone, coupon);

  useEffect(() => {
    document.title = 'Checkout | Shari Kotha';
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step, order]);

  if (order) {
    return (
      <div className="wrap checkout-page">
        <OrderSuccess order={order} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="wrap page-message">
        <h1>{t(copy.title)}</h1>
        <p>{copy.emptyBag}</p>
        <Link to="/shop" className="btn">
          Browse sarees
        </Link>
      </div>
    );
  }

  const field = (key: keyof ShippingInfo) => ({
    value: shipping[key],
    onChange: (e: { target: { value: string } }) => {
      const value = e.target.value;
      setShipping((s) => ({ ...s, [key]: value }));
      if (key === 'district' && value) setZone(deliveryZoneFor(value));
      if (errors[key]) setErrors((errs) => ({ ...errs, [key]: undefined }));
    },
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `err-${key}` : undefined,
  });

  const fieldError = (key: keyof ShippingInfo) =>
    errors[key] ? (
      <span id={`err-${key}`} className="field-error">
        {errors[key]}
      </span>
    ) : null;

  const submitShipping = (event: FormEvent) => {
    event.preventDefault();
    const found = validateShipping(shipping);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(1);
    else document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  };

  const submitPayment = (event: FormEvent) => {
    event.preventDefault();
    if (method === 'card') {
      const found = validateTestCard(card);
      setCardErrors(found);
      if (Object.keys(found).length) return;
    }
    setStep(2);
  };

  const place = async () => {
    setPlacing(true);
    setError('');
    try {
      const placed = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          fallPico: item.fallPico,
        })),
        shipping: { ...shipping, phone: normalizePhone(shipping.phone) },
        paymentMethod: method,
        couponCode: coupon?.code ?? null,
      });
      writePref(
        LAST_ORDER_KEY,
        JSON.stringify({ orderNumber: placed.orderNumber, phone: placed.shipping.phone }),
      );
      setCard(EMPTY_CARD);
      clear();
      setOrder(placed);
    } catch (err) {
      const fields = apiFieldErrors(err);
      setError(apiErrorMessage(err));
      if (Object.keys(fields).some((k) => k in EMPTY_SHIPPING)) {
        setErrors(fields as FieldErrors);
        setStep(0);
      }
    } finally {
      setPlacing(false);
    }
  };

  const editCard = (patch: Partial<CardInput>) => {
    setCard((c) => ({ ...c, ...patch }));
    setCardErrors({});
  };

  const confirm = () => (isWallet(method) ? setWallet(method) : void place());
  const label = paymentLabel(method);

  return (
    <div className="wrap checkout-page">
      <h1 className="checkout-title">{t(copy.title)}</h1>
      <p className="demo-note">{copy.demoNote}</p>

      <ol className="steps" aria-label="Checkout steps">
        {copy.steps.map((s, i) => (
          <li
            key={s.en}
            className={i === step ? 'is-current' : i < step ? 'is-done' : ''}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className="step-num">{i + 1}</span> {t(s)}
          </li>
        ))}
      </ol>

      <div className="checkout-grid">
        <div className="checkout-main">
          {step === 0 && (
            <form onSubmit={submitShipping} noValidate className="form-grid">
              <label className="field">
                <span>{t(copy.name)}</span>
                <input className="input" autoComplete="name" {...field('name')} />
                {fieldError('name')}
              </label>
              <label className="field">
                <span>{t(copy.phone)}</span>
                <input
                  className="input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  {...field('phone')}
                />
                {fieldError('phone')}
              </label>
              <label className="field field--wide">
                <span>{t(copy.email)}</span>
                <input className="input" type="email" autoComplete="email" {...field('email')} />
                {fieldError('email')}
              </label>
              <label className="field field--wide">
                <span>{t(copy.address)}</span>
                <textarea
                  className="textarea"
                  autoComplete="street-address"
                  rows={2}
                  {...field('address')}
                />
                {fieldError('address')}
              </label>
              <label className="field">
                <span>{t(copy.district)}</span>
                <select className="select" autoComplete="address-level2" {...field('district')}>
                  <option value="">{t(copy.chooseDistrict)}</option>
                  {meta &&
                    Object.entries(meta.divisions).map(([division, districts]) => (
                      <optgroup key={division} label={`${division} division`}>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                </select>
                {fieldError('district')}
              </label>
              <p className="zone-note">
                {shipping.district
                  ? `${shipping.district === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}: delivery ${formatTaka(totals.deliveryFee)}`
                  : 'Delivery: ৳80 inside Dhaka, ৳150 elsewhere'}
              </p>
              <label className="field field--wide">
                <span>{t(copy.note)}</span>
                <input className="input" {...field('note')} maxLength={240} />
              </label>
              <div className="form-actions field--wide">
                <button type="submit" className="btn">
                  {t(copy.next)}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={submitPayment} noValidate>
              <fieldset className="pay-options">
                <legend className="checkout-legend">{t(copy.payment)}</legend>
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`pay-option${method === option.id ? ' is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={method === option.id}
                      onChange={() => setMethod(option.id)}
                    />
                    <span
                      className="pay-dot"
                      style={{ background: option.colour }}
                      aria-hidden="true"
                    />
                    <span className="pay-label">
                      {option.id === 'cod' ? t(copy.cod) : option.label}
                      <small>
                        {option.id === 'cod'
                          ? copy.codNote
                          : option.id === 'card'
                            ? copy.cardNote
                            : copy.walletNote}
                      </small>
                    </span>
                  </label>
                ))}
              </fieldset>

              {method === 'card' && (
                <div className="card-form form-grid">
                  <label className="field field--wide">
                    <span>{copy.cardNumber}</span>
                    <input
                      className="input"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="4242 4242 4242 4242"
                      value={card.number}
                      onChange={(e) => editCard({ number: formatCardNumber(e.target.value) })}
                      aria-invalid={!!cardErrors.number}
                    />
                    {cardErrors.number && <span className="field-error">{cardErrors.number}</span>}
                  </label>
                  <label className="field">
                    <span>{copy.cardExpiry}</span>
                    <input
                      className="input"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="12/28"
                      value={card.expiry}
                      onChange={(e) => editCard({ expiry: formatExpiry(e.target.value) })}
                      aria-invalid={!!cardErrors.expiry}
                    />
                    {cardErrors.expiry && <span className="field-error">{cardErrors.expiry}</span>}
                  </label>
                  <label className="field">
                    <span>{copy.cardCvc}</span>
                    <input
                      className="input"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={3}
                      value={card.cvc}
                      onChange={(e) => editCard({ cvc: e.target.value.replace(/\D/g, '') })}
                      aria-invalid={!!cardErrors.cvc}
                    />
                    {cardErrors.cvc && <span className="field-error">{cardErrors.cvc}</span>}
                  </label>
                  <label className="field field--wide">
                    <span>{copy.cardName}</span>
                    <input
                      className="input"
                      autoComplete="off"
                      value={card.name}
                      onChange={(e) => editCard({ name: e.target.value })}
                      aria-invalid={!!cardErrors.name}
                    />
                    {cardErrors.name && <span className="field-error">{cardErrors.name}</span>}
                  </label>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setStep(0)}>
                  {t(copy.back)}
                </button>
                <button type="submit" className="btn">
                  {t(copy.next)}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="review">
              <section className="review-block">
                <div className="review-head">
                  <h2>{t(copy.shipTo)}</h2>
                  <button type="button" className="link" onClick={() => setStep(0)}>
                    {copy.edit}
                  </button>
                </div>
                <p>
                  {shipping.name} · {normalizePhone(shipping.phone)}
                  <br />
                  {shipping.address}, {shipping.district}
                </p>
              </section>
              <section className="review-block">
                <div className="review-head">
                  <h2>{t(copy.payment)}</h2>
                  <button type="button" className="link" onClick={() => setStep(1)}>
                    {copy.edit}
                  </button>
                </div>
                <p>
                  {method === 'cod' ? t(copy.cod) : label}
                  {method === 'card' && ` · •••• ${card.number.replace(/\D/g, '').slice(-4)}`}
                </p>
              </section>
              {error && (
                <p className="field-error" role="alert">
                  {error}
                </p>
              )}
              <p className="server-note">{copy.serverNote}</p>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setStep(1)}
                  disabled={placing}
                >
                  {t(copy.back)}
                </button>
                <button type="button" className="btn" onClick={confirm} disabled={placing}>
                  {placing
                    ? copy.placing
                    : method === 'cod'
                      ? t(copy.place)
                      : `${t(copy.pay(label))} · ${formatTaka(totals.total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="checkout-summary" aria-label={t(copy.summary)}>
          <h2>{t(copy.summary)}</h2>
          <ul className="summary-items">
            {items.map((item) => (
              <li key={item.key}>
                <span className="summary-thumb">
                  <Photo src={item.image} alt="" sizes="64px" />
                  <span className="summary-qty">{item.qty}</span>
                </span>
                <span className="summary-name">
                  {item.name}
                  {item.fallPico && <small>+ Fall & pico</small>}
                </span>
                <span className="price">{formatTaka(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <CouponField subtotal={totals.subtotal} />
          <Totals {...totals} couponCode={coupon?.code} />
        </aside>
      </div>

      <WalletMock
        method={wallet}
        amount={totals.total}
        onCancel={() => setWallet(null)}
        onConfirmed={() => {
          setWallet(null);
          void place();
        }}
      />
    </div>
  );
}
