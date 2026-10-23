import { Icon } from './Icon';

interface QtyStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}

export function QtyStepper({ value, max, onChange, label }: QtyStepperProps) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Fewer"
      >
        <Icon name="minus" />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="More"
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
