import { useRef } from 'react';
import { Link } from 'react-router';
import { weaveStory } from '../content/copy';
import { useParallax } from '../hooks/useParallax';
import { Photo } from '../components/product/Photo';
import { Icon } from '../components/ui/Icon';

/** A short, factual strip about one weave, with a slow parallax close-up. */
export function WeaveStory() {
  const media = useRef<HTMLDivElement>(null);
  useParallax(media, 36);

  return (
    <section className="story" aria-labelledby="story-title">
      <div className="wrap story-grid">
        <div className="story-media" data-reveal="image">
          <div ref={media} className="story-parallax">
            <Photo
              src="/products/khoyeri-buti-jamdani.webp"
              alt="Wine Jamdani saree with gold buti and a woven zari border"
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="story-copy" data-reveal>
          <p className="label">{weaveStory.kicker}</p>
          <h2 id="story-title">{weaveStory.title}</h2>
          <p className="story-body">{weaveStory.body}</p>
          <dl className="story-facts">
            {weaveStory.facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
          <Link to="/shop?type=jamdani" className="link-arrow">
            {weaveStory.cta} <Icon name="arrowRight" />
          </Link>
        </div>
      </div>
    </section>
  );
}
