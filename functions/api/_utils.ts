import type { Env } from '../../server/service';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function parseJson(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) throw new Error('Content-Type debe ser application/json.');
  const body = await request.json();
  if (!body || typeof body !== 'object') throw new Error('Cuerpo JSON inválido.');
  return body as Record<string, unknown>;
}

export function authorize(_request: Request, _env: Env): void {
  // Access control is intentionally delegated to Cloudflare Access in production.
}

export function errorResponse(error: unknown): Response {
  const message = error instanceof Error ? error.message : 'Error inesperado.';
  const status = message === 'No autorizado.' ? 401 : message.includes('límite') || message.includes('vacío') || message.includes('inválido') ? 400 : 500;
  return json({ error: message }, status);
}
