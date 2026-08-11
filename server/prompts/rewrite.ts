import { EDITOR_SYSTEM } from './system';
import { profileInstruction, variantInstruction } from './profiles';
import { rewriteSchema } from './schemas';
import type { ProviderRequest } from '../providers/types';
import type { DocumentSettings } from '../../src/types/document';

export function buildRewriteRequest(text: string, settings: DocumentSettings, instruction?: string): ProviderRequest {
  return {
    maxTokens: 9000,
    temperature: 0.2,
    responseSchema: rewriteSchema,
    messages: [
      { role: 'system', content: `${EDITOR_SYSTEM}\n${profileInstruction(settings.styleProfile)}\n${variantInstruction(settings.spanishVariant)}` },
      {
        role: 'user',
        content: `Realizá una reescritura conservadora del texto. Cambiá sólo aquello que mejore de manera justificable la calidad editorial. Conservá la estructura argumental, ejemplos, citas, referencias, URLs, nombres propios, cifras, fechas, código y el grado de certeza. Si no hace falta cambiar algo, dejalo igual.\n\n${instruction ? `INSTRUCCIÓN ADICIONAL DEL AUTOR:\n${instruction}\n\n` : ''}DEVOLVÉ EXCLUSIVAMENTE EL JSON DEL ESQUEMA.\n\nTEXTO ORIGINAL:\n${text}`,
      },
    ],
  };
}
