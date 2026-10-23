import { faq } from '../content/copy';

/** Care, delivery, exchange and handloom questions (native disclosure widgets). */
export function Faq({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <Heading id="faq-title" className="faq-title" data-reveal>
          {faq.title}
        </Heading>
        <div className="faq-list">
          {faq.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
