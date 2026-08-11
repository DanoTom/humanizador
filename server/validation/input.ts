export const MAX_WORDS = 1500;
export const MAX_CHARS = 30000;

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}

export function validateText(text: unknown): string {
  if (typeof text !== 'string') throw new Error('El texto debe ser una cadena.');
  const normalized = text.trim();
  if (!normalized) throw new Error('El texto está vacío.');
  if (countWords(normalized) > MAX_WORDS) {
    throw new Error(`El límite es de ${MAX_WORDS} palabras.`);
  }
  if (normalized.length > MAX_CHARS) {
    throw new Error(`El texto supera el límite técnico de ${MAX_CHARS} caracteres.`);
  }
  return normalized;
}

import type { DocumentSettings } from '../../src/types/document';

export function validateSettings(settings: unknown): DocumentSettings {
  if (!settings || typeof settings !== 'object') throw new Error('Faltan las preferencias editoriales.');
  const value = settings as Record<string, unknown>;
  const styles = ['essay', 'newsletter', 'literary_review', 'academic_professional', 'personal_literary'];
  const variants = ['preserve', 'rioplatense', 'neutral'];
  if (typeof value.styleProfile !== 'string' || !styles.includes(value.styleProfile)) {
    throw new Error('Perfil de estilo inválido.');
  }
  if (typeof value.spanishVariant !== 'string' || !variants.includes(value.spanishVariant)) {
    throw new Error('Variante de español inválida.');
  }
  return {
    styleProfile: value.styleProfile as DocumentSettings['styleProfile'],
    spanishVariant: value.spanishVariant as DocumentSettings['spanishVariant'],
  };
}
