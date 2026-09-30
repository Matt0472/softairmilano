// Shape of src/data/navigation.json, shared by the header, the footer and the pages that read
// their own name from the menu.

export interface NavChild {
  label: string;
  href: string;
  badge?: string;
  desc?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export const flattenNav = (items: NavItem[]): (NavItem | NavChild)[] =>
  items.flatMap((it) => [it, ...(it.children ?? [])]);
