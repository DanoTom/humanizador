import type { ModelProvider, ProviderRequest } from './types';

const DEFAULT_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'z-ai/glm-5.2';

interface NvidiaResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string };
}

export class GlmProvider implements ModelProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model = DEFAULT_MODEL,
    private readonly endpoint = DEFAULT_ENDPOINT,
  ) {}

  async complete(request: ProviderRequest): Promise<unknown> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.2,
        max_tokens: request.maxTokens,
        stream: false,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'writing_editor_result',
            strict: true,
            schema: request.responseSchema,
          },
        },
      }),
    });

    const data = (await response.json().catch(() => ({}))) as NvidiaResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? `NVIDIA API error (${response.status}).`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('El proveedor devolvió una respuesta vacía.');

    try {
      return JSON.parse(content);
    } catch {
      throw new Error('El proveedor devolvió JSON inválido.');
    }
  }
}
