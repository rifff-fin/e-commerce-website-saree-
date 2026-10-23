import { reviews } from '../content/copy';

/** Sample reviews, clearly labelled as samples until real ones are collected. */
export function Reviews() {
  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className="reviews-head" data-reveal>
          <h2 id="reviews-title">{reviews.title}</h2>
          <p className="reviews-label">{reviews.label}</p>
        </div>
        <ul className="reviews-list">
          {reviews.items.map((item, i) => (
            <li key={item.place} data-reveal style={{ '--d': i } as React.CSSProperties}>
              <figure>
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  <span className="badge">{item.name}</span> {item.place}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
