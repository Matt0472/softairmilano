// The Google rating and the reviews, shared by the whole site (testimonials.json): the home hero
// and every reviews section read the same rating, and each page shows the reviews tagged for it.

import testimonials from '../data/testimonials.json';

export interface Rating {
  label?: string;
  value?: number | string | null;
  count?: string;
  source?: string;
  url?: string;
}

export interface Review {
  author?: string;
  text?: string;
  /** Pages the review belongs to (activity slugs, "paintball"); ALL_PAGES or none: any page. */
  pages?: string[];
}

const ALL_PAGES = 'all';
const MAX_REVIEWS = 5;

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

/** The reviews for a page: those tagged for it first, then the general ones, at most five. */
export function reviewsFor(page?: string): Review[] {
  const items = ((testimonials.items ?? []) as Review[]).filter((r) => r?.text?.trim());
  const tagged = page ? items.filter((r) => r.pages?.includes(page)) : [];
  const general = items.filter((r) => !r.pages?.length || r.pages.includes(ALL_PAGES));
  return [...new Set([...tagged, ...general])].slice(0, MAX_REVIEWS);
}
