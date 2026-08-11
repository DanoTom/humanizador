import { describe, expect, it } from 'vitest';
import { countWords, isWithinWordLimit, MAX_WORDS } from '../src/lib/wordCount';

describe('word count', () => {
  it('handles empty text', () => expect(countWords('')).toBe(0));
  it('counts whitespace-separated words', () => expect(countWords('Hola, mundo.\nEsto funciona.')).toBe(4));
  it('rejects more than 1500 words', () => expect(isWithinWordLimit(Array.from({ length: MAX_WORDS + 1 }, () => 'palabra').join(' '))).toBe(false));
});
