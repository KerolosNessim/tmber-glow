/** Lower-cases and folds Arabic spelling variants so "هودى" finds "هودي" and "اوفر" finds "أوفر". */
export function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ْـ̀-ͯ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim()
}
