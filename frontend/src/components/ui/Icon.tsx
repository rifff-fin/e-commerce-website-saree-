const PATHS = {
  search: <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21" />,
  heart: (
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.4 3.7 4.5 6.9 4.5c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3 3.2 0 5.3 2.9 4.1 6.2C19.5 15.4 12 20 12 20Z" />
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12.5H6L5 8Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </>
  ),
  menu: <path d="M3 7h18M3 12h18M3 17h12" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronDown: <path d="M5 9l7 7 7-7" />,
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  zoom: (
    <>
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.3-2.2L21 21" />
      <path d="M10.5 7.5v6M7.5 10.5h6" />
    </>
  ),
  share: (
    <>
      <path d="M12 3v12M7 8l5-5 5 5" />
      <path d="M5 13v7h14v-7" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  whatsapp: (
    <>
      <path d="M4.5 19.5l1.2-4.1A8 8 0 1 1 9 18.6l-4.5.9Z" />
      <path d="M9.3 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.5.9 1.3 1.7 2.3 2.2.2.1.4.1.6-.1l.6-.6c.2-.2.4-.2.7-.1l1.6.8c.2.1.4.3.3.6-.1.6-.6 1.5-1.6 1.6-1 .1-2.7-.3-4.5-2-1.8-1.7-2.4-3.4-2.4-4.3 0-.6.2-1.1.5-1.5Z" />
    </>
  ),
  messenger: (
    <>
      <path d="M12 3.5c-4.9 0-8.5 3.5-8.5 7.9 0 2.4 1.1 4.5 2.9 5.9v3.2l3-1.7c.8.2 1.7.4 2.6.4 4.9 0 8.5-3.5 8.5-7.8S16.9 3.5 12 3.5Z" />
      <path d="M7.5 13.5l3-3.2 2.2 2 3.8-2.6-3 3.3-2.2-2-3.8 2.5Z" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

/** Line icons drawn in the current text colour. Decorative unless `label` is given. */
export function Icon({
  name,
  label,
  className,
}: {
  name: IconName;
  label?: string;
  className?: string;
}) {
  return (
    <svg
      className={`icon${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
