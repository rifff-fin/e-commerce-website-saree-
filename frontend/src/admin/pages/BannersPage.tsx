import { useEffect, useState, type FormEvent } from 'react';
import { apiErrorMessage, apiFieldErrors } from '../../lib/api';
import { thumbOf } from '../../lib/images';
import { adminApi, emptyImage, type BannerInput } from '../adminApi';
import { ImageManager } from '../ImageManager';
import type { Banner } from '../../types';

const EMPTY: BannerInput = {
  title: '',
  subtitle: '',
  image: '',
  alt: '',
  ctaLabel: '',
  ctaHref: '',
  order: 1,
  active: true,
};

/** The homepage hero slides: headline, photo, link and order. */
export function BannersPage() {
  const [banners, setBanners] = useState<Banner[] | null>(null);
  const [form, setForm] = useState<BannerInput>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const load = () =>
    adminApi
      .banners()
      .then(setBanners)
      .catch((err) => setMessage(apiErrorMessage(err)));

  useEffect(() => {
    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setMessage('');
    try {
      if (editing) await adminApi.updateBanner(editing, form);
      else await adminApi.createBanner(form);
      setForm(EMPTY);
      setEditing(null);
      setMessage('Saved. The homepage shows it within two minutes.');
      void load();
    } catch (err) {
      setErrors(apiFieldErrors(err));
      setMessage(apiErrorMessage(err));
    }
  };

  const remove = async (banner: Banner) => {
    if (!window.confirm(`Delete the banner “${banner.title}”?`)) return;
    await adminApi.deleteBanner(banner._id).catch((err) => setMessage(apiErrorMessage(err)));
    void load();
  };

  const field = (key: 'title' | 'subtitle' | 'ctaLabel' | 'ctaHref') => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value }),
    'aria-invalid': !!errors[key],
  });

  return (
    <div className="a-page">
      <h1>Homepage banners</h1>
      <p className="a-note">The hero cross-fades between active banners, lowest order first.</p>

      <form className="a-card a-form" onSubmit={submit} noValidate>
        <h2>{editing ? 'Edit banner' : 'New banner'}</h2>
        <label className="field a-wide">
          <span>Headline</span>
          <input className="input" maxLength={90} {...field('title')} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>
        <label className="field a-wide">
          <span>Line under the headline</span>
          <input className="input" maxLength={200} {...field('subtitle')} />
        </label>
        <label className="field">
          <span>Link text</span>
          <input
            className="input"
            maxLength={40}
            {...field('ctaLabel')}
            placeholder="Shop Jamdani"
          />
        </label>
        <label className="field">
          <span>Link (a store path)</span>
          <input className="input" {...field('ctaHref')} placeholder="/shop?type=jamdani" />
          {errors.ctaHref && <span className="field-error">{errors.ctaHref}</span>}
        </label>
        <label className="field">
          <span>Order</span>
          <input
            className="input"
            inputMode="numeric"
            value={String(form.order)}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value.replace(/\D/g, '')) || 0 })
            }
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span>Active</span>
        </label>
        <div className="a-wide">
          <ImageManager
            max={1}
            images={form.image ? [emptyImage(form.image, form.alt)] : []}
            onChange={(images) =>
              setForm({ ...form, image: images[0]?.url ?? '', alt: images[0]?.alt ?? '' })
            }
          />
          {errors.image && <span className="field-error">{errors.image}</span>}
        </div>
        <div className="a-wide a-row">
          <button type="submit" className="btn">
            {editing ? 'Save banner' : 'Add banner'}
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

      {banners && (
        <ul className="a-banner-list">
          {banners.map((banner) => (
            <li key={banner._id} className={banner.active ? '' : 'is-hidden'}>
              <img src={thumbOf(banner.image)} alt="" width={72} height={96} />
              <div>
                <b>
                  {banner.order}. {banner.title}
                </b>
                <p>{banner.subtitle}</p>
                <small>
                  {banner.ctaLabel} → {banner.ctaHref} {banner.active ? '' : '(hidden)'}
                </small>
              </div>
              <div className="a-actions">
                <button
                  type="button"
                  className="a-link"
                  onClick={() => {
                    setEditing(banner._id);
                    const { _id: _ignored, ...rest } = banner;
                    setForm({ ...EMPTY, ...rest });
                    window.scrollTo({ top: 0 });
                  }}
                >
                  Edit
                </button>
                <button type="button" className="a-danger" onClick={() => remove(banner)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
