import { useEffect, useRef, useState, type DragEvent } from 'react';
import { apiErrorMessage } from '../lib/api';
import { thumbOf } from '../lib/images';
import { adminApi, cloudinaryPublicId, emptyImage } from './adminApi';
import type { ProductImage } from '../types';

const MAX_MB = 8;

interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  max?: number;
}

/**
 * Photos for a saree: upload to Cloudinary (drop or pick), or use a /products/ path;
 * reorder by dragging or with the arrow buttons; edit alt text; remove.
 * The first photo is the main one and the second shows on hover in the shop.
 */
export function ImageManager({ images, onChange, max = 8 }: ImageManagerProps) {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');
  const [path, setPath] = useState('');
  const dragFrom = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  // Uploads finish one by one: always add to the latest list
  const latest = useRef(images);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  const upload = async (files: FileList | File[]) => {
    setError('');
    const list = [...files]
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, max - images.length);
    for (const file of list) {
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`${file.name} is larger than ${MAX_MB} MB`);
        continue;
      }
      setUploading((n) => n + 1);
      try {
        const { url } = await adminApi.uploadImage(file);
        latest.current = [
          ...latest.current,
          emptyImage(url, file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')),
        ];
        onChange(latest.current);
      } catch (err) {
        setError(apiErrorMessage(err, 'Upload failed'));
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length || from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const remove = async (index: number) => {
    const image = images[index];
    onChange(images.filter((_, i) => i !== index));
    // Uploaded photos are also deleted from Cloudinary; seed photos stay in the repo
    const publicId = cloudinaryPublicId(image.url);
    if (publicId && window.confirm('Also delete this photo from Cloudinary?')) {
      adminApi.deleteUpload(publicId).catch(() => {});
    }
  };

  const addPath = () => {
    const value = path.trim();
    if (!/^\/products\/[a-z0-9-]+\.(webp|jpe?g|png)$/i.test(value)) {
      setError('Use a path like /products/jamdani-red-01.webp');
      return;
    }
    onChange([...images, emptyImage(value)]);
    setPath('');
    setError('');
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) void upload(event.dataTransfer.files);
  };

  return (
    <div className="a-images">
      <div
        className="a-drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInput.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.current?.click()}
      >
        <b>Drop photos here or click to upload</b>
        <span>
          JPG, PNG or WebP up to {MAX_MB} MB, uploaded to Cloudinary. Portrait 3:4 looks best. The
          first photo is the main one.
        </span>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void upload(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <div className="a-path">
        <label className="field">
          <span>…or a photo already in the store (public/products)</span>
          <input
            className="input"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/products/jamdani-red-01.webp"
          />
        </label>
        <button type="button" className="btn btn--ghost" onClick={addPath}>
          Add
        </button>
      </div>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      <ol className="a-image-list">
        {images.map((image, i) => (
          <li
            key={`${image.url}-${i}`}
            draggable
            onDragStart={() => (dragFrom.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (dragFrom.current !== null) move(dragFrom.current, i);
              dragFrom.current = null;
            }}
          >
            <img src={thumbOf(image.url)} alt="" width={72} height={96} />
            <div className="a-image-meta">
              <span className="a-image-role">
                {i === 0 ? 'Main photo' : i === 1 ? 'Hover photo' : `Photo ${i + 1}`}
              </span>
              <label className="field">
                <span>Alt text (describe the saree)</span>
                <input
                  className="input"
                  value={image.alt}
                  maxLength={240}
                  onChange={(e) =>
                    onChange(
                      images.map((img, j) => (j === i ? { ...img, alt: e.target.value } : img)),
                    )
                  }
                />
              </label>
              {image.credit && (
                <span className="a-tag">
                  Placeholder: {image.credit.author}, {image.credit.license}
                </span>
              )}
            </div>
            <div className="a-image-tools">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                aria-label="Move earlier"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === images.length - 1}
                aria-label="Move later"
              >
                ↓
              </button>
              <button
                type="button"
                className="a-danger"
                onClick={() => remove(i)}
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <li key={`up-${i}`} className="a-uploading">
            Uploading…
          </li>
        ))}
      </ol>
    </div>
  );
}
