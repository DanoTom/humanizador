import { EDITOR_SYSTEM } from './system';
import { profileInstruction, variantInstruction } from './profiles';
import { rewriteSchema } from './schemas';
import type { ProviderRequest } from '../providers/types';
import type { DocumentSettings } from '../../src/types/document';

export function buildFragmentRequest(
  selected: string,
  before: string,
  after: string,
  goal: string,
  settings: DocumentSettings,
): ProviderRequest {
  return {
    maxTokens: 2500,
    temperature: 0.3,
    responseSchema: rewriteSchema,
    messages: [
      { role: 'system', content: `${EDITOR_SYSTEM}\n${profileInstruction(settings.styleProfile)}\n${variantInstruction(settings.spanishVariant)}` },
      {
        role: 'user',
        content: `Proponé una versión mejorada únicamente para el fragmento seleccionado. Usá el contexto sólo para preservar el significado. No inventes información ni alteres el grado de certeza.\n\nOBJETIVO DEL AUTOR: ${goal}\n\nCONTEXTO ANTERIOR:\n${before}\n\nFRAGMENTO SELECCIONADO:\n${selected}\n\nCONTEXTO POSTERIOR:\n${after}\n\nDEVOLVÉ EXCLUSIVAMENTE EL JSON DEL ESQUEMA.`,
      },
    ],
  };
}
