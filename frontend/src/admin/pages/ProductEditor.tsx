import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { apiErrorMessage, apiFieldErrors } from '../../lib/api';
import { useMeta } from '../../hooks/useMeta';
import { adminApi, type ProductInput } from '../adminApi';
import { ImageManager } from '../ImageManager';
import type { ProductImage } from '../../types';

interface Form {
  name: string;
  nameBn: string;
  slug: string;
  type: string;
  fabric: string;
  weave: string;
  origin: string;
  price: string;
  originalPrice: string;
  colors: string[];
  occasions: string[];
  sareeMetres: string;
  blouseMetres: string;
  withBlousePiece: boolean;
  handwoven: boolean;
  care: string;
  description: string;
  images: ProductImage[];
  isNewArrival: boolean;
  bestSeller: boolean;
  active: boolean;
  popularity: string;
}

const EMPTY: Form = {
  name: '',
  nameBn: '',
  slug: '',
  type: 'Jamdani',
  fabric: 'Cotton',
  weave: '',
  origin: '',
  price: '',
  originalPrice: '',
  colors: [],
  occasions: [],
  sareeMetres: '5.5',
  blouseMetres: '0.8',
  withBlousePiece: true,
  handwoven: true,
  care: '',
  description: '',
  images: [],
  isNewArrival: true,
  bestSeller: false,
  active: true,
  popularity: '50',
};

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

/** Add or edit a saree: details, saree metadata, photos (Cloudinary) and visibility. */
export function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const meta = useMeta();
  const [form, setForm] = useState<Form | null>(id ? null : EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminApi
      .product(id)
      .then((p) =>
        setForm({
          name: p.name,
          nameBn: p.nameBn ?? '',
          slug: p.slug,
          type: p.type,
          fabric: p.fabric,
          weave: p.weave,
          origin: p.origin,
          price: String(p.price),
          originalPrice: String(p.originalPrice),
          colors: p.colors,
          occasions: p.occasions,
          sareeMetres: String(p.length?.sareeMetres ?? 5.5),
          blouseMetres: String(p.length?.blouseMetres ?? 0.8),
          withBlousePiece: p.withBlousePiece,
          handwoven: p.handwoven,
          care: p.care,
          description: p.description,
          images: p.images,
          isNewArrival: p.isNewArrival,
          bestSeller: p.bestSeller,
          active: p.active,
          popularity: String(p.popularity),
        }),
      )
      .catch((err) => setMessage(apiErrorMessage(err)));
  }, [id]);

  if (!form || !meta) return <p>{message || 'Loading…'}</p>;

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));
  const text = (key: keyof Form) => ({
    value: form[key] as string,
    onChange: (e: { target: { value: string } }) => set(key, e.target.value as never),
    'aria-invalid': !!errors[key],
  });
  const err = (key: string) =>
    errors[key] ? <span className="field-error">{errors[key]}</span> : null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage('');
    const input: ProductInput = {
      name: form.name,
      nameBn: form.nameBn,
      slug: form.slug || undefined,
      type: form.type,
      fabric: form.fabric,
      weave: form.weave,
      origin: form.origin,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      colors: form.colors,
      occasions: form.occasions,
      length: {
        sareeMetres: Number(form.sareeMetres),
        blouseMetres: form.withBlousePiece ? Number(form.blouseMetres) : 0,
      },
      withBlousePiece: form.withBlousePiece,
      handwoven: form.handwoven,
      care: form.care,
      description: form.description,
      images: form.images,
      isNewArrival: form.isNewArrival,
      bestSeller: form.bestSeller,
      active: form.active,
      popularity: Number(form.popularity) || 0,
    };
    try {
      const saved = id
        ? await adminApi.updateProduct(id, input)
        : await adminApi.createProduct(input);
      setMessage('Saved.');
      if (!id) navigate(`/admin/products/${saved._id}`, { replace: true });
      else set('slug', saved.slug);
    } catch (e) {
      setErrors(apiFieldErrors(e));
      setMessage(apiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="a-page a-editor" onSubmit={submit} noValidate>
      <div className="a-page-head">
        <h1>{id ? `Edit: ${form.name}` : 'Add a saree'}</h1>
        <Link to="/admin/products">Back to sarees</Link>
      </div>

      <section className="a-card a-form">
        <h2>Basics</h2>
        <label className="field">
          <span>Name</span>
          <input className="input" {...text('name')} required />
          {err('name')}
        </label>
        <label className="field">
          <span>Name in Bangla (optional)</span>
          <input className="input" lang="bn" {...text('nameBn')} />
        </label>
        <label className="field">
          <span>URL name (made from the name if empty)</span>
          <input className="input" {...text('slug')} placeholder="raatrani-black-jamdani" />
          {err('slug')}
        </label>
        <label className="field">
          <span>Price (৳)</span>
          <input className="input" inputMode="numeric" {...text('price')} />
          {err('price')}
        </label>
        <label className="field">
          <span>Old price (৳, for a sale; same as price otherwise)</span>
          <input className="input" inputMode="numeric" {...text('originalPrice')} />
          {err('originalPrice')}
        </label>
        <label className="field a-wide">
          <span>Description</span>
          <textarea className="textarea" rows={3} maxLength={800} {...text('description')} />
        </label>
      </section>

      <section className="a-card a-form">
        <h2>Saree details</h2>
        <label className="field">
          <span>Type</span>
          <select className="select" {...text('type')}>
            {meta.types.map((type) => (
              <option key={type.slug}>{type.name}</option>
            ))}
          </select>
          {err('type')}
        </label>
        <label className="field">
          <span>Fabric</span>
          <select className="select" {...text('fabric')}>
            {meta.fabrics.map((fabric) => (
              <option key={fabric}>{fabric}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Weave</span>
          <input className="input" {...text('weave')} placeholder="Handwoven, Dhakai motifs" />
        </label>
        <label className="field">
          <span>Origin</span>
          <input className="input" {...text('origin')} placeholder="Narayanganj, Bangladesh" />
        </label>
        <label className="field">
          <span>Saree length (m)</span>
          <input className="input" inputMode="decimal" {...text('sareeMetres')} />
          {err('length')}
        </label>
        <label className="field">
          <span>Blouse piece (m)</span>
          <input
            className="input"
            inputMode="decimal"
            {...text('blouseMetres')}
            disabled={!form.withBlousePiece}
          />
        </label>
        <div className="a-checks a-wide">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.withBlousePiece}
              onChange={(e) => set('withBlousePiece', e.target.checked)}
            />
            <span>With blouse piece</span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.handwoven}
              onChange={(e) => set('handwoven', e.target.checked)}
            />
            <span>Handwoven</span>
          </label>
        </div>
        <fieldset className="a-wide a-pills">
          <legend>Colours {err('colors')}</legend>
          {meta.colors.map((color) => (
            <label key={color.name} className="a-pill">
              <input
                type="checkbox"
                checked={form.colors.includes(color.name)}
                onChange={() => set('colors', toggle(form.colors, color.name))}
              />
              <span>
                <i style={{ background: color.hex }} aria-hidden="true" /> {color.name}
              </span>
            </label>
          ))}
        </fieldset>
        <fieldset className="a-wide a-pills">
          <legend>Occasions</legend>
          {meta.occasions.map((occasion) => (
            <label key={occasion} className="a-pill">
              <input
                type="checkbox"
                checked={form.occasions.includes(occasion)}
                onChange={() => set('occasions', toggle(form.occasions, occasion))}
              />
              <span>{occasion}</span>
            </label>
          ))}
        </fieldset>
        <label className="field a-wide">
          <span>Care</span>
          <textarea className="textarea" rows={2} maxLength={600} {...text('care')} />
        </label>
      </section>

      <section className="a-card">
        <h2>Photos</h2>
        <ImageManager images={form.images} onChange={(images) => set('images', images)} />
      </section>

      <section className="a-card a-form">
        <h2>Visibility</h2>
        <div className="a-checks a-wide">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set('active', e.target.checked)}
            />
            <span>Show in the store</span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) => set('isNewArrival', e.target.checked)}
            />
            <span>New arrival</span>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.bestSeller}
              onChange={(e) => set('bestSeller', e.target.checked)}
            />
            <span>Best seller (homepage carousel)</span>
          </label>
        </div>
        <label className="field">
          <span>Popularity (higher shows first)</span>
          <input className="input" inputMode="numeric" {...text('popularity')} />
        </label>
      </section>

      <div className="a-savebar">
        <p role="status">{message}</p>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving…' : 'Save saree'}
        </button>
      </div>
    </form>
  );
}
