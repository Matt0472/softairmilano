// Italian display titles break before short words («SEI PRONTO A / SCENDERE»): binding every word of one
// or two letters to the next with a no-break space keeps prepositions and articles off the line end.

const NBSP = '\u00a0';

/** "Sei pronto a scendere in campo" → "Sei pronto a{NBSP}scendere in{NBSP}campo". */
export function keepShortWords(text?: string): string {
  return (text ?? '').replace(/(?<=^|\s)([\p{L}']{1,2})\s+/gu, `$1${NBSP}`);
}
