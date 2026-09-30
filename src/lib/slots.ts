// A slot filled through a conditional (`{cond && <X />}`) is still "present" for Astro.slots.has
// even when it renders nothing: components that wrap a slot in their own markup check the HTML.

type Slots = { has(name: string): boolean; render(name: string): Promise<string> };

/** The slot's rendered HTML, trimmed: '' when the page passed nothing or only a false conditional. */
export async function slotHtml(slots: Slots, name = 'default'): Promise<string> {
  return slots.has(name) ? (await slots.render(name)).trim() : '';
}
