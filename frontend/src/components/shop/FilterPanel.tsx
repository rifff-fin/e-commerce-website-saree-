import { useState } from 'react';
import { shop as copy } from '../../content/copy';
import { useT } from '../../store/langStore';
import type { CatalogFilters, Meta } from '../../types';

interface FilterPanelProps {
  meta: Meta;
  filters: CatalogFilters;
  typeCounts: Record<string, number>;
  /** Counts with no filters: a type with none at all is "soon" rather than 0 */
  stockedCounts: Record<string, number>;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onClear: () => void;
}

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const PRICE_PRESETS = [
  { label: 'Under ৳5,000', max: 5000 },
  { label: '৳5,000 – ৳15,000', min: 5000, max: 15000 },
  { label: '৳15,000 – ৳30,000', min: 15000, max: 30000 },
  { label: 'Over ৳30,000', min: 30000 },
];

function PriceFilter({ filters, onChange }: Pick<FilterPanelProps, 'filters' | 'onChange'>) {
  // Local text while typing; applied on blur / Enter
  const [min, setMin] = useState(filters.minPrice?.toString() ?? '');
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? '');
  const [synced, setSynced] = useState({ min: filters.minPrice, max: filters.maxPrice });
  if (synced.min !== filters.minPrice || synced.max !== filters.maxPrice) {
    setSynced({ min: filters.minPrice, max: filters.maxPrice });
    setMin(filters.minPrice?.toString() ?? '');
    setMax(filters.maxPrice?.toString() ?? '');
  }
  const commit = () => {
    const n = (v: string) =>
      v.trim() && Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : undefined;
    onChange({ minPrice: n(min), maxPrice: n(max) });
  };
  return (
    <>
      <ul className="filter-presets">
        {PRICE_PRESETS.map((preset) => {
          const active = filters.minPrice === preset.min && filters.maxPrice === preset.max;
          return (
            <li key={preset.label}>
              <button
                type="button"
                className={`chip${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() =>
                  onChange(
                    active
                      ? { minPrice: undefined, maxPrice: undefined }
                      : { minPrice: preset.min, maxPrice: preset.max },
                  )
                }
              >
                {preset.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="price-inputs">
        <label>
          <span className="sr-only">{copy.min}</span>
          <input
            className="input"
            inputMode="numeric"
            placeholder={copy.min}
            value={min}
            onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
          />
        </label>
        <span aria-hidden="true">–</span>
        <label>
          <span className="sr-only">{copy.max}</span>
          <input
            className="input"
            inputMode="numeric"
            placeholder={copy.max}
            value={max}
            onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
          />
        </label>
      </div>
    </>
  );
}

export function FilterPanel({
  meta,
  filters,
  typeCounts,
  stockedCounts,
  onChange,
  onClear,
}: FilterPanelProps) {
  const t = useT();
  return (
    <div className="filters">
      <fieldset className="filter-group">
        <legend>{t(copy.type)}</legend>
        <ul className="filter-list">
          {meta.types.map((type) => {
            const count = typeCounts[type.slug] ?? 0;
            const stocked = (stockedCounts[type.slug] ?? 0) > 0;
            return (
              <li key={type.slug}>
                <label className={`checkbox${count === 0 ? ' is-empty' : ''}`}>
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.slug)}
                    onChange={() => onChange({ types: toggle(filters.types, type.slug) })}
                  />
                  <span>
                    {type.name}
                    <span className="filter-count">{stocked ? count : copy.soon}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="filter-group">
        <legend>{t(copy.occasion)}</legend>
        <ul className="chips">
          {meta.occasions.map((occasion) => {
            const active = filters.occasions.includes(occasion);
            return (
              <li key={occasion}>
                <button
                  type="button"
                  className={`chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => onChange({ occasions: toggle(filters.occasions, occasion) })}
                >
                  {occasion}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="filter-group">
        <legend>{t(copy.colour)}</legend>
        <ul className="swatches">
          {meta.colors.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <li key={color.name}>
                <button
                  type="button"
                  className={`swatch${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  aria-label={color.name}
                  title={color.name}
                  onClick={() => onChange({ colors: toggle(filters.colors, color.name) })}
                  style={
                    color.name === 'Multicolour'
                      ? {
                          background:
                            'conic-gradient(#b3202a, #e9b824, #3e7b4f, #3a5ba0, #5b3a8c, #b3202a)',
                        }
                      : { background: color.hex }
                  }
                />
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="filter-group">
        <legend>{t(copy.fabric)}</legend>
        <ul className="chips">
          {meta.fabrics.map((fabric) => {
            const active = filters.fabrics.includes(fabric);
            return (
              <li key={fabric}>
                <button
                  type="button"
                  className={`chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => onChange({ fabrics: toggle(filters.fabrics, fabric) })}
                >
                  {fabric}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="filter-group">
        <legend>{t(copy.price)}</legend>
        <PriceFilter filters={filters} onChange={onChange} />
      </fieldset>

      <fieldset className="filter-group filter-switches">
        <legend className="sr-only">More</legend>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filters.blouse}
            onChange={(e) => onChange({ blouse: e.target.checked })}
          />
          <span>{t(copy.blouse)}</span>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filters.handwoven}
            onChange={(e) => onChange({ handwoven: e.target.checked })}
          />
          <span>{t(copy.handwoven)}</span>
        </label>
      </fieldset>

      <button type="button" className="link filter-clear" onClick={onClear}>
        {copy.clear}
      </button>
    </div>
  );
}
