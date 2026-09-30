// Phone numbers as the client types them in the CMS ("375 595 6805", "+39 375…", "0039…") turned
// into the international form that tel: links and structured data need.

export function toE164(phone: string | undefined, country = '39'): string {
  const digits = (phone ?? '').trim().replace(/[^\d+]/g, '');
  if (!digits) return '';
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  // Already carries the country code without the "+" (e.g. "39 375 595 6805").
  if (digits.startsWith(country) && digits.length > 10) return `+${digits}`;
  return `+${country}${digits}`;
}

export const telHref = (phone: string | undefined): string => {
  const e164 = toE164(phone);
  return e164 ? `tel:${e164}` : '';
};
