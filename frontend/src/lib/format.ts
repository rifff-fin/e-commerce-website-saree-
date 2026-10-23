const taka = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 18500 -> "৳18,500" (lakh grouping, as used in Bangladesh: ৳1,25,000) */
export const formatTaka = (amount: number) => `৳${taka.format(Math.round(amount))}`;

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

/** "Fri, 24 Oct" */
export const formatDay = (date: string | Date) => dayFormat.format(new Date(date));

/** "Fri, 24 Oct – Sun, 26 Oct" */
export const formatDayRange = (from: string | Date, to: string | Date) =>
  `${formatDay(from)} – ${formatDay(to)}`;

/** 5.5 -> "5.5 m" */
export const metres = (value: number) => `${value} m`;
