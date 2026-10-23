import type { AppliedCoupon, CartItem, DeliveryZone } from '../types';

// Mirrors backend/services/pricingService.js. The server recalculates every order; these
// numbers are only the preview shown in the bag and at checkout.
export const DELIVERY_FEES: Record<DeliveryZone, number> = {
  'inside-dhaka': 80,
  'outside-dhaka': 150,
};

export const MAX_QTY_PER_LINE = 5;

// "Fall & pico stitching" add-on, per saree (backend/data/catalogOptions.js)
export const FALL_PICO_PRICE = 150;

export const deliveryZoneFor = (district: string): DeliveryZone =>
  district === 'Dhaka' ? 'inside-dhaka' : 'outside-dhaka';

/** The coupon applies to the sarees only, never to stitching or delivery. */
export function cartTotals(items: CartItem[], zone: DeliveryZone, coupon: AppliedCoupon | null) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const addOns = items.reduce(
    (sum, item) => sum + (item.fallPico ? FALL_PICO_PRICE : 0) * item.qty,
    0,
  );
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const deliveryFee = items.length ? DELIVERY_FEES[zone] : 0;
  return {
    subtotal,
    addOns,
    discount,
    deliveryFee,
    total: subtotal + addOns - discount + deliveryFee,
  };
}
