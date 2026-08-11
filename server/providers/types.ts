export interface ProviderMessage {
  role: 'system' | 'user';
  content: string;
}

export interface ProviderRequest {
  messages: ProviderMessage[];
  responseSchema: Record<string, unknown>;
  maxTokens: number;
  temperature?: number;
}

export interface ModelProvider {
  complete(request: ProviderRequest): Promise<unknown>;
}
