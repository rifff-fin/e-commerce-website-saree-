import { useState, type FormEvent } from 'react';
import { LogoMark } from '../components/layout/Logo';
import { brand } from '../content/copy';
import { apiErrorMessage } from '../lib/api';
import { adminApi, useAdminAuth } from './adminApi';

/** Admin sign-in (the email and password are set in the API's environment). */
export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = await adminApi.login(email, password);
      useAdminAuth.getState().setSession(session.token, session.email);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not sign in'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <LogoMark size={40} />
        <h1>{brand.name} admin</h1>
        <p>Sign in to manage sarees, orders, coupons and banners.</p>
        <label className="field">
          <span>Email</span>
          <input
            className="input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
