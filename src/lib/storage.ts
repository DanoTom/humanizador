import type { LocalDocument } from '../types/document';

const KEY = 'personal-writing-editor:v1';

export function loadDocument(): LocalDocument | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalDocument) : null;
  } catch {
    return null;
  }
}

export function saveDocument(document: LocalDocument): void {
  localStorage.setItem(KEY, JSON.stringify(document));
}

export function clearDocument(): void {
  localStorage.removeItem(KEY);
}
