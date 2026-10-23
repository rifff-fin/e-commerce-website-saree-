import { useState, type FormEvent } from 'react';
import { bag as copy } from '../../content/copy';
import { validateCoupon } from '../../services/storeService';
import { useCart } from '../../store/cartStore';
import { useT } from '../../store/langStore';

export function CouponField({ subtotal }: { subtotal: number }) {
  const t = useT();
  const coupon = useCart((s) => s.coupon);
  const apply = useCart((s) => s.applyCoupon);
  const remove = useCart((s) => s.removeCoupon);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError('');
    const result = await validateCoupon(code.trim(), subtotal);
    setBusy(false);
    if (result?.valid) {
      apply({ code: result.code, percent: result.percent });
      setCode('');
    } else {
      setError(copy.couponInvalid);
    }
  };

  if (coupon) {
    return (
      <p className="coupon-applied">
        <span>
          <strong>{coupon.code}</strong> · {coupon.percent}% off
        </span>
        <button type="button" className="link" onClick={remove}>
          {copy.couponRemove}
        </button>
      </p>
    );
  }

  return (
    <form className="coupon" onSubmit={submit}>
      <label className="field">
        <span>{t(copy.coupon)}</span>
        <span className="coupon-row">
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            autoComplete="off"
            autoCapitalize="characters"
            aria-invalid={!!error}
            aria-describedby="coupon-msg"
          />
          <button type="submit" className="btn btn--ghost" disabled={busy}>
            {copy.couponApply}
          </button>
        </span>
      </label>
      <p id="coupon-msg" className={error ? 'field-error' : 'coupon-hint'}>
        {error || copy.couponHint}
      </p>
    </form>
  );
}
