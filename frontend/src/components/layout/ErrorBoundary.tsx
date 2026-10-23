import { Component, type ReactNode } from 'react';
import { errors } from '../../content/copy';

/** Keeps one broken view from blanking the whole store. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="wrap page-message">
        <h1>{errors.generic}</h1>
        <button type="button" className="btn" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }
}
