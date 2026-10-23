import { useState, type PointerEvent } from 'react';
import { product as copy } from '../../content/copy';
import { fullOf } from '../../lib/images';
import { Icon } from '../ui/Icon';
import { Overlay } from '../ui/Overlay';
import { Photo } from './Photo';
import type { ProductImage } from '../../types';

/**
 * Product photos: a large photo with thumbnails, a hover magnifier on desktop and a
 * full-screen zoom (tap or the zoom button) that pans with the pointer.
 */
export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const current = images[index] ?? images[0];

  const pan = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  };

  if (!current)
    return (
      <div className="gallery">
        <span className="photo photo--empty" />
      </div>
    );

  return (
    <div className="gallery">
      {images.length > 1 && (
        <ul className="gallery-thumbs" aria-label="Photos">
          {images.map((image, i) => (
            <li key={image.url}>
              <button
                type="button"
                className={i === index ? 'is-active' : ''}
                onClick={() => setIndex(i)}
                aria-label={copy.photoOf(i + 1, images.length)}
                aria-current={i === index}
              >
                <Photo src={image.url} alt="" sizes="96px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="gallery-main">
        <button
          type="button"
          className="gallery-zoomable"
          onClick={() => setZoomOpen(true)}
          onPointerMove={pan}
          style={{ '--zoom-origin': origin } as React.CSSProperties}
          aria-label={`${copy.zoom}: ${current.alt || name}`}
        >
          <Photo
            src={current.url}
            alt={current.alt || name}
            sizes="(max-width: 900px) 100vw, 50vw"
            eager
          />
        </button>
        <span className="gallery-zoom-hint" aria-hidden="true">
          <Icon name="zoom" />
        </span>
        {current.credit && (
          <p className="gallery-credit">
            {copy.photoCredit}: {current.credit.author}, {current.credit.license}
          </p>
        )}
      </div>

      <Overlay
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        label={copy.zoom}
        variant="sheet"
        className="zoom-sheet"
      >
        <button
          type="button"
          className="icon-btn zoom-close"
          onClick={() => setZoomOpen(false)}
          aria-label={copy.zoomClose}
          data-autofocus
        >
          <Icon name="close" />
        </button>
        <div
          className="zoom-frame"
          onPointerMove={pan}
          style={{ '--zoom-origin': origin } as React.CSSProperties}
        >
          <img src={fullOf(current.url)} alt={current.alt || name} />
        </div>
        {images.length > 1 && (
          <div className="zoom-nav">
            <button
              type="button"
              className="icon-btn ring"
              onClick={() => setIndex((index - 1 + images.length) % images.length)}
              aria-label="Previous photo"
            >
              <Icon name="chevronLeft" />
            </button>
            <span>{copy.photoOf(index + 1, images.length)}</span>
            <button
              type="button"
              className="icon-btn ring"
              onClick={() => setIndex((index + 1) % images.length)}
              aria-label="Next photo"
            >
              <Icon name="chevronRight" />
            </button>
          </div>
        )}
      </Overlay>
    </div>
  );
}
