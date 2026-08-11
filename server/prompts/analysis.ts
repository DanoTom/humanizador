import { EDITOR_SYSTEM } from './system';
import { profileInstruction, variantInstruction } from './profiles';
import { analysisSchema } from './schemas';
import type { ProviderRequest } from '../providers/types';
import type { DocumentSettings } from '../../src/types/document';

export function buildAnalysisRequest(text: string, settings: DocumentSettings): ProviderRequest {
  return {
    maxTokens: 3000,
    temperature: 0.15,
    responseSchema: analysisSchema,
    messages: [
      { role: 'system', content: `${EDITOR_SYSTEM}\n${profileInstruction(settings.styleProfile)}\n${variantInstruction(settings.spanishVariant)}` },
      {
        role: 'user',
        content: `Analizá el siguiente texto sin reescribirlo. Detectá sólo problemas editoriales que tengan una justificación concreta. No inventes defectos para llenar la lista.\n\nDEVOLVÉ EXCLUSIVAMENTE EL JSON DEL ESQUEMA.\n\nTEXTO:\n${text}`,
      },
    ],
  };
}
