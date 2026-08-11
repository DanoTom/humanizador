import type {
  AnalysisRequest,
  AnalysisResult,
  FragmentRewriteRequest,
  RewriteRequest,
  RewriteResult,
} from '../types/analysis';

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | { error?: string; details?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? 'La API no pudo procesar la solicitud.');
  }

  return payload as T;
}

export const analyzeText = (request: AnalysisRequest) =>
  post<AnalysisResult>('/api/analyze', request);

export const rewriteText = (request: RewriteRequest) =>
  post<RewriteResult>('/api/rewrite', request);

export const rewriteFragment = (request: FragmentRewriteRequest) =>
  post<RewriteResult>('/api/rewrite-fragment', request);
