import { Link } from 'react-router';
import { lookbook } from '../content/copy';
import { Photo } from '../components/product/Photo';

/** An Instagram-style grid, using the same licensed photos as the shop. */
export function Lookbook() {
  return (
    <section className="lookbook" aria-labelledby="lookbook-title">
      <div className="wrap">
        <div className="row-head" data-reveal>
          <h2 id="lookbook-title">{lookbook.title}</h2>
          <p className="lookbook-handle">{lookbook.handle}</p>
        </div>
        <ul className="lookbook-grid">
          {lookbook.images.map((image) => (
            <li key={image.src} data-reveal="image">
              <Photo
                src={`${image.src}.webp`}
                alt={image.alt}
                sizes="(max-width: 700px) 50vw, 16vw"
              />
            </li>
          ))}
        </ul>
        <p className="lookbook-note">
          {lookbook.note}{' '}
          <Link to="/credits" className="link">
            Credits
          </Link>
        </p>
      </div>
    </section>
  );
}
