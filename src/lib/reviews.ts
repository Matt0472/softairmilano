// The Google rating and the reviews, shared by the whole site (testimonials.json): the home hero
// and every reviews section read the same rating, and every reviews section shows the same reviews.

import testimonials from '../data/testimonials.json';

export interface Rating {
  label?: string;
  value?: number | string | null;
  count?: string;
  source?: string;
  url?: string;
  /** The Trustindex page that lists every review: linked from each reviews section. */
  trustindexUrl?: string;
  /** Text of that link, e.g. «Leggi tutte le recensioni su Trustindex». */
  trustindexLabel?: string;
}

export interface Review {
  author?: string;
  text?: string;
}

export const rating: Rating = testimonials.rating ?? {};

/** The average from 1 to 5, or null when it is missing or out of range: no score, no stars. */
export function ratingScore(): number | null {
  const raw = typeof rating.value === 'string' ? parseFloat(rating.value.replace(',', '.')) : rating.value;
  return typeof raw === 'number' && Number.isFinite(raw) && raw >= 1 && raw <= 5 ? raw : null;
}

/** 4.7 → "4,7". */
export const formatScore = (score: number): string =>
  score.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** "500+ recensioni su Google". The source alone says nothing, so without a count: empty. */
export function ratingReach(): string {
  const count = rating.count?.trim();
  return count ? [count, rating.source?.trim()].filter(Boolean).join(' ') : '';
}

/** Every review with a text, in the CMS order. */
export function allReviews(): Review[] {
  return ((testimonials.items ?? []) as Review[]).filter((r) => r?.text?.trim());
}
