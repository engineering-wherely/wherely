import type { YearMonthRange } from '@/features/forms/year-month-range/types';
import type { Maybe } from '@/types/common';

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatYearMonth(value: Maybe<string>, yearFormat: 'short' | 'full' = 'short') {
  if (!value) {
    return '—';
  }
  const match = /^(\d{4})(0[1-9]|1[0-2])$/.exec(value);
  if (!match) {
    return value;
  }
  const year = yearFormat === 'full' ? match[1] : `’${match[1].slice(-2)}`;
  return `${MONTHS[Number(match[2]) - 1]} ${year}`;
}

export function toYearMonth(value: Maybe<string>): string {
  if (!value) {
    return '';
  }
  const match = /^(\d{4})-?(0[1-9]|1[0-2])(?:$|-\d{2}(?:T.*)?$)/.exec(value);
  return match ? `${match[1]}${match[2]}` : value;
}

export function yearMonthOrder(value: Maybe<string>) {
  const match = /^(\d{4})(0[1-9]|1[0-2])$/.exec(value ?? '');
  return match ? Number(match[1]) * 12 + Number(match[2]) : -1;
}

export function sortYearMonthRanges(ranges: readonly YearMonthRange[]) {
  return [...ranges].sort(
    (a, b) =>
      yearMonthOrder(b.start) - yearMonthOrder(a.start) ||
      yearMonthOrder(b.end) - yearMonthOrder(a.end)
  );
}
