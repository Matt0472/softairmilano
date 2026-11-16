// The voucher promotion («Voucher regalo › Promozione» in the CMS): a strip on top of every page
// (PromoStrip) and a box over the voucher cards, both carrying the discount code the buyer types in
// TicketingHub's cart. It shows only when switched on, with a code, and while the voucher page is
// online. Its days are checked twice: at build time, so a promotion already over leaves the build,
// and in the visitor's browser (data-promo-start / -end, read by the inline script of each
// component), so it appears on its first day and goes on its last without a new deploy.

import voucher from '../data/voucher.json';
import { has } from './fields';
import { isLive } from './pages';

export interface Promo {
  name: string;
  discount: string;
  /** What the discount applies to, read right after it: «sul voucher con noleggio attrezzatura». */
  scope: string;
  text: string;
  code: string;
  codeHint: string;
  linkLabel: string;
  start: string;
  end: string;
  /** Names this promotion where the visitor's «close» is remembered: a new code shows again. */
  key: string;
  /** Today, at build time, falls within its days: the markup starts visible. */
  liveAtBuild: boolean;
}

interface PromoData {
  active?: boolean;
  name?: string;
  discount?: number | string | null;
  scope?: string;
  text?: string;
  code?: string;
  codeHint?: string;
  linkLabel?: string;
  start?: string | null;
  end?: string | null;
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const day = (value: unknown) => (typeof value === 'string' && ISO_DAY.test(value.trim()) ? value.trim() : '');
/** Today in the arena's calendar, as YYYY-MM-DD. */
export const todayInRome = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());

export function promoOf(): Promo | undefined {
  const data = (voucher as { promo?: PromoData }).promo;
  if (!data?.active || !has(data.code) || !isLive('/voucher-regalo')) return undefined;
  const start = day(data.start);
  const end = day(data.end);
  const today = todayInRome();
  if (end && end < today) return undefined;
  const amount = Number(data.discount);
  return {
    name: data.name?.trim() ?? '',
    discount: amount > 0 ? `−${amount} €` : '',
    scope: data.scope?.trim() ?? '',
    text: data.text?.trim() ?? '',
    code: data.code!.trim(),
    codeHint: data.codeHint?.trim() ?? '',
    linkLabel: data.linkLabel?.trim() ?? '',
    start,
    end,
    key: `${data.code!.trim()}|${start}|${end}`,
    liveAtBuild: !start || start <= today,
  };
}
