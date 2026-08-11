import { countWords, MAX_WORDS } from '../lib/wordCount';

export function WordCounter({ text }: { text: string }) {
  const count = countWords(text);
  const over = count > MAX_WORDS;
  return <span className={over ? 'counter counter--over' : 'counter'}>{count.toLocaleString('es-AR')} / {MAX_WORDS.toLocaleString('es-AR')} palabras</span>;
}
