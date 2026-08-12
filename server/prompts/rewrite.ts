import { EDITOR_SYSTEM } from './system';
import { profileInstruction, variantInstruction } from './profiles';
import { rewriteSchema } from './schemas';
import type { ProviderRequest } from '../providers/types';
import type { DocumentSettings } from '../../src/types/document';

export function buildRewriteRequest(text: string, settings: DocumentSettings, instruction?: string): ProviderRequest {
  return {
    maxTokens: 9000,
    temperature: 0.24,
    responseSchema: rewriteSchema,
    messages: [
      { role: 'system', content: `${EDITOR_SYSTEM}\n${profileInstruction(settings.styleProfile)}\n${variantInstruction(settings.spanishVariant)}` },
      {
        role: 'user',
        content: `Realizá una reescritura editorial conservadora, pero suficientemente profunda cuando el original sea formulaico, genérico o mecánico. No te limites a sustituir sinónimos. Trabajá en tres pasadas mentales: (1) detectar fórmulas y automatismos de estilo; (2) reconstruir las frases problemáticas con sintaxis y ritmo más naturales; (3) verificar que significado, estructura argumental, ejemplos, citas, referencias, URLs, nombres propios, cifras, fechas y grado de certeza permanezcan intactos.\n\nCuando corresponda, priorizá: eliminar aperturas genéricas, metacomentarios y conectores de relleno; reducir nominalizaciones y abstracciones; reemplazar perífrasis innecesarias por formulaciones directas; evitar adjetivos inflados o vagos; variar la longitud y estructura de las oraciones; evitar tríadas o contrastes excesivamente simétricos; reducir repeticiones y reformulaciones; y conservar palabras concretas o rasgos de voz del autor cuando no haya una razón real para cambiarlos.\n\nNo agregues información, ejemplos, anécdotas, opiniones ni experiencias que no estén en el original. No introduzcas un tono corporativo, neutro o artificialmente coloquial. Una buena reescritura puede dejar intacta una parte importante del texto: no cambies frases sólo para producir más diferencias.\n\n${instruction ? `INSTRUCCIÓN ADICIONAL DEL AUTOR:\n${instruction}\n\n` : ''}DEVOLVÉ EXCLUSIVAMENTE EL JSON DEL ESQUEMA.\n\nTEXTO ORIGINAL:\n${text}`,
      },
    ],
  };
}
