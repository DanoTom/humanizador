import { diffWordsWithSpace, type Change } from 'diff';

export function diffText(original: string, revised: string): Change[] {
  return diffWordsWithSpace(original, revised);
}
