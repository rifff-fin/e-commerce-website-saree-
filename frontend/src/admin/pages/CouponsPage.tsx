import { useEffect, useState, type FormEvent } from 'react';
import { apiErrorMessage, apiFieldErrors } from '../../lib/api';
import { adminApi, type Coupon } from '../adminApi';

const EMPTY = { code: '', percent: '10', description: '', expiresAt: '', active: true };

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const load = () =>
    adminApi
      .coupons()
      .then(setCoupons)
      .catch((err) => setMessage(apiErrorMessage(err)));

  useEffect(() => {
    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setMessage('');
    const input = {
      code: form.code,
      percent: Number(form.percent),
      description: form.description,
      active: form.active,
      expiresAt: form.expiresAt || null,
    };
    try {
      if (editing) await adminApi.updateCoupon(editing, input);
      else await adminApi.createCoupon(input);
      setForm(EMPTY);
      setEditing(null);
      setMessage('Saved.');
      void load();
    } catch (err) {
      setErrors(apiFieldErrors(err));
      setMessage(apiErrorMessage(err));
    }
  };

  const edit = (coupon: Coupon) => {
    setEditing(coupon._id);
    setForm({
      code: coupon.code,
      percent: String(coupon.percent),
      description: coupon.description ?? '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      active: coupon.active,
    });
  };

  const remove = async (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    await adminApi.deleteCoupon(coupon._id).catch((err) => setMessage(apiErrorMessage(err)));
    void load();
  };

  return (
    <div className="a-page">
      <h1>Coupons</h1>
      <form className="a-card a-form" onSubmit={submit} noValidate>
        <h2>{editing ? `Edit ${form.code}` : 'New coupon'}</h2>
        <label className="field">
          <span>Code</span>
          <input
            className="input"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            aria-invalid={!!errors.code}
          />
          {errors.code && <span className="field-error">{errors.code}</span>}
        </label>
        <label className="field">
          <span>% off the sarees</span>
          <input
            className="input"
            inputMode="numeric"
            value={form.percent}
            onChange={(e) => setForm({ ...form, percent: e.target.value })}
            aria-invalid={!!errors.percent}
          />
          {errors.percent && <span className="field-error">{errors.percent}</span>}
        </label>
        <label className="field">
          <span>Expires (optional)</span>
          <input
            className="input"
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Description</span>
          <input
            className="input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="checkbox a-wide">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span>Active</span>
        </label>
        <div className="a-wide a-row">
          <button type="submit" className="btn">
            {editing ? 'Save coupon' : 'Add coupon'}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setEditing(null);
                setForm(EMPTY);
              }}
            >
              Cancel
            </button>
          )}
          <p role="status">{message}</p>
        </div>
      </form>

      {coupons && (
        <table className="a-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Off</th>
              <th>Expires</th>
              <th>Active</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>
                  <b>{coupon.code}</b>
                  <br />
                  <small>{coupon.description}</small>
                </td>
                <td>{coupon.percent}%</td>
                <td>{coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : 'Never'}</td>
                <td>{coupon.active ? 'Yes' : 'No'}</td>
                <td className="a-actions">
                  <button type="button" className="a-link" onClick={() => edit(coupon)}>
                    Edit
                  </button>
                  <button type="button" className="a-danger" onClick={() => remove(coupon)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
