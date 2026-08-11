export const MAX_WORDS = 1500;

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}

export function isWithinWordLimit(text: string): boolean {
  return countWords(text) <= MAX_WORDS;
}
