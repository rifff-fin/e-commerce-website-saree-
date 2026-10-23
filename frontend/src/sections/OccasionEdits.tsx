import { Link } from 'react-router';
import { occasionEdits } from '../content/copy';
import { Photo } from '../components/product/Photo';

/** Four occasion edits in an uneven magazine grid. */
export function OccasionEdits() {
  return (
    <section className="occasions" id="occasions" aria-labelledby="occasions-title">
      <div className="wrap">
        <h2 id="occasions-title" className="occasions-title" data-reveal>
          {occasionEdits.title}
        </h2>
        <ul className="occasion-grid">
          {occasionEdits.items.map((item, i) => (
            <li key={item.name} className={`occasion occasion--${i + 1}`}>
              <Link
                to={`/shop?occasion=${encodeURIComponent(item.name)}`}
                className="occasion-link"
              >
                <span className="occasion-media" data-reveal="image">
                  <Photo src={`${item.image}.webp`} alt="" sizes="(max-width: 700px) 100vw, 40vw" />
                </span>
                <span className="occasion-text">
                  <span className="occasion-bn bn-display" lang="bn">
                    {item.bn}
                  </span>
                  <span className="occasion-name">{item.short ?? item.name}</span>
                  <span className="occasion-note">{item.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
