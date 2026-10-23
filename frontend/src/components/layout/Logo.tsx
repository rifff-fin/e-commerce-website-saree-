import { brand } from '../../content/copy';

/** The mark: a single pleat (a slim vesica) crossed by a paar line; gold, as in the favicon. */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo-mark">
      <path
        d="M16 3c-5 6.5-5 19.5 0 26 5-6.5 5-19.5 0-26z"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.4"
      />
      <path d="M8 16h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-words">
        <span className="logo-name">{brand.name}</span>
        <span className="logo-bn bn-display" lang="bn">
          {brand.nameBn}
        </span>
      </span>
    </span>
  );
}
