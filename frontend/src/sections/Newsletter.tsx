import { useState, type FormEvent } from 'react';
import { newsletter } from '../content/copy';
import { apiErrorMessage } from '../lib/api';
import { subscribeNewsletter } from '../services/storeService';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'ok' | 'error'; message: string }>({
    kind: 'idle',
    message: '',
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState({ kind: 'error', message: newsletter.invalid });
      return;
    }
    setState({ kind: 'busy', message: '' });
    try {
      const { message } = await subscribeNewsletter(email.trim());
      setState({ kind: 'ok', message });
      setEmail('');
    } catch (error) {
      setState({ kind: 'error', message: apiErrorMessage(error) });
    }
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="wrap newsletter-inner" data-reveal>
        <div>
          <h2 id="newsletter-title">{newsletter.title}</h2>
          <p>{newsletter.body}</p>
        </div>
        <form onSubmit={submit} className="newsletter-form" noValidate>
          <label className="sr-only" htmlFor="newsletter-email">
            {newsletter.label}
          </label>
          <input
            id="newsletter-email"
            className="input"
            type="email"
            autoComplete="email"
            placeholder={newsletter.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={state.kind === 'error'}
            aria-describedby="newsletter-msg"
          />
          <button type="submit" className="btn" disabled={state.kind === 'busy'}>
            {newsletter.button}
          </button>
          <p
            id="newsletter-msg"
            className={state.kind === 'error' ? 'field-error' : 'newsletter-ok'}
            role="status"
          >
            {state.message}
          </p>
        </form>
      </div>
    </section>
  );
}
