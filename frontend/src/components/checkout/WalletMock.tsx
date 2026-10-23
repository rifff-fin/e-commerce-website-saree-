import { useState, type FormEvent } from 'react';
import { brand, checkout } from '../../content/copy';
import {
  DEMO_OTP,
  DEMO_PIN,
  isBdMobile,
  PAYMENT_OPTIONS,
  type WalletMethod,
} from '../../lib/checkout';
import { formatTaka } from '../../lib/format';
import { Overlay } from '../ui/Overlay';

interface WalletMockProps {
  method: WalletMethod | null;
  amount: number;
  onCancel: () => void;
  onConfirmed: () => void;
}

/**
 * A pretend bKash / Nagad / Rocket screen: account number, then a code, then the PIN.
 * Everything typed here stays in this component's state and is thrown away afterwards.
 */
export function WalletMock({ method, amount, onCancel, onConfirmed }: WalletMockProps) {
  const option = PAYMENT_OPTIONS.find((o) => o.id === method);
  const [step, setStep] = useState<'account' | 'otp' | 'pin'>('account');
  const [account, setAccount] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const w = checkout.wallet;

  const reset = () => {
    setStep('account');
    setAccount('');
    setOtp('');
    setPin('');
    setError('');
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (step === 'account') {
      if (!isBdMobile(account)) return setError(w.badAccount);
      return setStep('otp');
    }
    if (step === 'otp') {
      if (otp !== DEMO_OTP) return setError(w.wrongOtp);
      return setStep('pin');
    }
    if (pin !== DEMO_PIN) return setError(w.wrongPin);
    reset();
    onConfirmed();
  };

  if (!option) return null;
  return (
    <Overlay
      open={!!method}
      onClose={() => {
        reset();
        onCancel();
      }}
      label={w.title(option.label)}
      className="wallet"
    >
      <div className="wallet-head" style={{ background: option.colour }}>
        <p className="wallet-brand">{option.label}</p>
        <p className="wallet-demo">{w.demo}</p>
      </div>
      <dl className="wallet-meta">
        <div>
          <dt>{w.merchant}</dt>
          <dd>{brand.name}</dd>
        </div>
        <div>
          <dt>{w.amount}</dt>
          <dd>{formatTaka(amount)}</dd>
        </div>
      </dl>
      <form className="wallet-form" onSubmit={submit} noValidate>
        {step === 'account' && (
          <label className="field">
            <span>{w.account(option.label)}</span>
            <input
              className="input"
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="01XXXXXXXXX"
              data-autofocus
              aria-invalid={!!error}
            />
          </label>
        )}
        {step === 'otp' && (
          <label className="field">
            <span>{w.otp}</span>
            <input
              className="input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              data-autofocus
              aria-invalid={!!error}
              aria-describedby="wallet-hint"
            />
            <small id="wallet-hint">{w.otpHint}</small>
          </label>
        )}
        {step === 'pin' && (
          <label className="field">
            <span>{w.pin(option.label)}</span>
            <input
              className="input"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={5}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              data-autofocus
              aria-invalid={!!error}
              aria-describedby="wallet-hint"
            />
            <small id="wallet-hint">{w.pinHint}</small>
          </label>
        )}
        <p className="field-error" role="alert">
          {error}
        </p>
        <div className="wallet-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              reset();
              onCancel();
            }}
          >
            {w.cancel}
          </button>
          <button
            type="submit"
            className="btn"
            style={{ background: option.colour, borderColor: option.colour }}
          >
            {w.confirm}
          </button>
        </div>
      </form>
    </Overlay>
  );
}
