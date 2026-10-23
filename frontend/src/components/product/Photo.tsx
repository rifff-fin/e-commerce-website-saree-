import { fullOf, hasThumb, thumbOf } from '../../lib/images';

interface PhotoProps {
  src?: string;
  alt: string;
  /** CSS sizes hint, e.g. "(max-width: 600px) 50vw, 25vw" */
  sizes?: string;
  eager?: boolean;
  className?: string;
}

/**
 * A product photo in a reserved 3:4 box (no layout shift). Local photos and Cloudinary
 * uploads both get a 480 px and a full-size source, picked by `sizes`.
 */
export function Photo({
  src,
  alt,
  sizes = '(max-width: 700px) 50vw, 25vw',
  eager,
  className,
}: PhotoProps) {
  if (!src)
    return (
      <span
        className={`photo photo--empty${className ? ` ${className}` : ''}`}
        aria-hidden="true"
      />
    );
  const srcSet = hasThumb(src) ? `${thumbOf(src)} 480w, ${fullOf(src)} 1200w` : undefined;
  return (
    <img
      className={`photo${className ? ` ${className}` : ''}`}
      src={fullOf(src)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={1200}
      height={1600}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
    />
  );
}
