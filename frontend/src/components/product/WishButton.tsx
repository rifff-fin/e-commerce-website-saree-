import { product as copy } from '../../content/copy';
import { useSaved } from '../../store/savedStore';
import { useUi } from '../../store/uiStore';
import { Icon } from '../ui/Icon';
import type { Product } from '../../types';

export function WishButton({ product, className }: { product: Product; className?: string }) {
  const saved = useSaved((s) => s.wishlist.some((w) => w.id === product._id));
  const toggle = useSaved((s) => s.toggleWish);
  const toast = useUi((s) => s.toast);
  return (
    <button
      type="button"
      className={`wish-btn${saved ? ' is-saved' : ''}${className ? ` ${className}` : ''}`}
      aria-pressed={saved}
      aria-label={`${saved ? copy.unwish : copy.wish}: ${product.name}`}
      onClick={() => {
        if (toggle(product)) toast(copy.wished, { label: 'View', to: '/wishlist' });
      }}
    >
      <Icon name="heart" />
    </button>
  );
}
