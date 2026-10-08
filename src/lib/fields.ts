// Pages CMS removes an emptied field (and an emptied object) from the file when it saves, while
// older data may hold "": a section is "filled in" only when its deciding fields hold real text,
// and code reaching into an optional object guards each step (CMS-10).

/** True for a string with something other than whitespace in it. */
export const has = (v?: string | null): v is string => typeof v === 'string' && v.trim().length > 0;

/** An address typed in the CMS, decoded for the file system; a malformed one is used as it is. */
export const decodePath = (s: string): string => {
  try {
    return decodeURI(s);
  } catch {
    return s;
  }
};
