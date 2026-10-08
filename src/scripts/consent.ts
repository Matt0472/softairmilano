// Cookie consent (vanilla-cookieconsent, self-hosted: no external call). Three categories:
// "necessary" (always on: only the cookie that remembers the choice), "analytics" (GA4, offered
// only when the CMS holds a measurement ID) and "external" (TicketingHub and the Google map).
// Nothing third-party loads before its category is accepted (CODE-09, PERF-08).
//
// The texts come from src/data/cookie.json through the JSON block CookieConsent.astro writes.
// Third-party widgets read the choice from window.__consent and listen for the "consent-change"
// event; any element with data-cc="show-preferencesModal" reopens the preferences.
import * as CookieConsent from 'vanilla-cookieconsent';
import stylesheet from 'vanilla-cookieconsent/dist/cookieconsent.css?url';

// Pages CMS drops emptied keys and objects: every text may be missing.
interface Section {
  title?: string;
  text?: string;
}
interface Config {
  gaId?: string;
  banner?: { title?: string; text?: string; acceptAll?: string; rejectAll?: string; preferences?: string };
  preferences?: { title?: string; text?: string; save?: string; acceptAll?: string; rejectAll?: string; close?: string };
  categories?: { necessary?: Section; analytics?: Section; external?: Section };
  links?: { label: string; href: string }[];
}

declare global {
  interface Window {
    __consent?: { analytics: boolean; external: boolean };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const source = document.getElementById('consent-config');
const config: Config | null = source?.textContent ? JSON.parse(source.textContent) : null;

// The CMS texts are plain text: escape them before the library writes them as HTML.
const esc = (s?: string | null) =>
  (s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// GA4 arrives only now, after the consent, with Consent Mode v2: advertising stays denied.
let analyticsStarted = false;
const startAnalytics = (id: string) => {
  if (analyticsStarted || !id) return;
  analyticsStarted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag reads the arguments object, not an array.
    window.dataLayer!.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
};

const publish = () => {
  window.__consent = {
    analytics: CookieConsent.acceptedCategory('analytics'),
    external: CookieConsent.acceptedCategory('external'),
  };
  if (config && window.__consent.analytics) startAnalytics(config.gaId);
  window.dispatchEvent(new CustomEvent('consent-change', { detail: window.__consent }));
};

// The stylesheet loads on its own, off the critical path; the banner waits for it so it never
// shows unstyled.
const loadStyles = () =>
  new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheet;
    link.onload = link.onerror = () => resolve();
    document.head.append(link);
  });

if (config) {
  const { banner = {}, preferences = {}, categories = {}, links = [], gaId = '' } = config;
  const { necessary = {}, analytics = {}, external = {} } = categories;
  const hasAnalytics = !!gaId;
  const linkList = links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(' ');

  loadStyles().then(() =>
    CookieConsent.run({
      cookie: { name: 'cc_cookie', expiresAfterDays: 182 },
      // When the statistics arrive (the GA4 ID set in the CMS), whoever already chose is asked again.
      revision: hasAnalytics ? 1 : 0,
      categories: {
        necessary: { enabled: true, readOnly: true },
        // Withdrawing removes what GA left on our domain and reloads: a script already run cannot
        // be unloaded, only a clean load stops it.
        ...(hasAnalytics ? { analytics: { autoClear: { cookies: [{ name: /^_ga/ }], reloadPage: true } } } : {}),
        external: {},
      },
      // Until the first choice the page waits under a dark veil: it cannot be clicked, and Tab
      // stays in the banner, so focus never reaches a control the banner hides (WCAG 2.4.11).
      disablePageInteraction: true,
      guiOptions: {
        // A choice that blocks the page is a dialog: centred over it. On phones it sits at the
        // bottom instead, in thumb reach (CookieConsent.astro).
        consentModal: { layout: 'box', position: 'middle center', equalWeightButtons: true, flipButtons: false },
        preferencesModal: { layout: 'box', equalWeightButtons: true, flipButtons: false },
      },
      onConsent: publish,
      onChange: publish,
      // The library builds #cc-main only when a dialog opens (even on a later visit, from the
      // footer): Lenis takes the mouse wheel page-wide, so the dialog scrolls on its own.
      onModalShow: () => document.getElementById('cc-main')?.setAttribute('data-lenis-prevent', ''),
      language: {
        default: 'it',
        translations: {
          it: {
            consentModal: {
              title: esc(banner.title),
              description: esc(banner.text),
              acceptAllBtn: esc(banner.acceptAll),
              acceptNecessaryBtn: esc(banner.rejectAll),
              showPreferencesBtn: esc(banner.preferences),
              footer: linkList,
            },
            preferencesModal: {
              title: esc(preferences.title),
              acceptAllBtn: esc(preferences.acceptAll),
              acceptNecessaryBtn: esc(preferences.rejectAll),
              savePreferencesBtn: esc(preferences.save),
              closeIconLabel: esc(preferences.close),
              sections: [
                { description: `${esc(preferences.text)}<br>${linkList}` },
                { title: esc(necessary.title), description: esc(necessary.text), linkedCategory: 'necessary' },
                ...(hasAnalytics
                  ? [{ title: esc(analytics.title), description: esc(analytics.text), linkedCategory: 'analytics' }]
                  : []),
                { title: esc(external.title), description: esc(external.text), linkedCategory: 'external' },
              ],
            },
          },
        },
      },
    }),
  );
}
