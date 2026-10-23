import { useState } from 'react';
import { product as copy } from '../../content/copy';
import { formatTaka } from '../../lib/format';
import { FALL_PICO_PRICE, MAX_QTY_PER_LINE } from '../../lib/pricing';
import { useCart } from '../../store/cartStore';
import { useT } from '../../store/langStore';
import { useUi } from '../../store/uiStore';
import { QtyStepper } from '../ui/QtyStepper';
import type { Product } from '../../types';

/** Free-size note, the fall & pico add-on, quantity and the add button (opens the bag). */
export function AddToBag({ product, onAdded }: { product: Product; onAdded?: () => void }) {
  const t = useT();
  const add = useCart((s) => s.add);
  const openBag = useUi((s) => s.openBag);
  const [qty, setQty] = useState(1);
  const [fallPico, setFallPico] = useState(false);

  return (
    <div className="add-to-bag">
      <p className="free-size">{t(copy.freeSize)}</p>
      <label className="checkbox addon">
        <input type="checkbox" checked={fallPico} onChange={(e) => setFallPico(e.target.checked)} />
        <span>
          {t(copy.fallPico)} <strong>(+{formatTaka(FALL_PICO_PRICE)})</strong>
          <small>{copy.fallPicoNote}</small>
        </span>
      </label>
      <div className="add-row">
        <QtyStepper
          value={qty}
          max={MAX_QTY_PER_LINE}
          onChange={(n) => setQty(Math.max(1, Math.min(MAX_QTY_PER_LINE, n)))}
          label={t(copy.qty)}
        />
        <button
          type="button"
          className="btn add-btn"
          onClick={() => {
            add(product, qty, fallPico);
            onAdded?.();
            openBag();
          }}
        >
          {t(copy.addToBag)} ·{' '}
          {formatTaka((product.price + (fallPico ? FALL_PICO_PRICE : 0)) * qty)}
        </button>
      </div>
    </div>
  );
}
