// Pages CMS saves an emptied field as "" and always saves the object around it, so a section is
// "filled in" only when its deciding fields hold real text (CMS-10).

/** True for a string with something other than whitespace in it. */
export const has = (v?: string | null): v is string => typeof v === 'string' && v.trim().length > 0;
