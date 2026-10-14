// The site's social profiles (settings.social) as links: only the channels with an address, always
// in the footer's order. One source, so a page and the component it guards never disagree on
// whether there is anything to show.

import settings from '../data/settings.json';
import { has } from './fields';

export type SocialKey = 'instagram' | 'facebook' | 'youtube' | 'tiktok';

export interface SocialLink {
  key: SocialKey;
  label: string;
  href: string;
}

const CHANNELS: { key: SocialKey; label: string }[] = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
];

export function socialLinks(): SocialLink[] {
  const social: Partial<Record<SocialKey, string>> = settings.social ?? {};
  return CHANNELS.flatMap(({ key, label }) => {
    const href = social[key];
    return has(href) ? [{ key, label, href: href.trim() }] : [];
  });
}
