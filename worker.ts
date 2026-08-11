import type { Fetcher } from '@cloudflare/workers-types';
import { analyze, rewrite, rewriteFragment } from './server/service';
import { validateSettings, validateText } from './server/validation/input';

type WorkerEnv = {
  NVIDIA_API_KEY: string;
  NVIDIA_MODEL?: string;
  ASSETS: Fetcher;
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function parseJson(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('Content-Type debe ser application/json.');
  }
  const body = await request.json();
  if (!body || typeof body !== 'object') {
    throw new Error('Cuerpo JSON inválido.');
  }
  return body as Record<string, unknown>;
}

function errorResponse(error: unknown): Response {
  const message = error instanceof Error ? error.message : 'Error inesperado.';
  const status = message.includes('límite') || message.includes('vacío') || message.includes('inválido')
    ? 400
    : 500;
  return json({ error: message }, status);
}

async function handleApi(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);

  const pathname = new URL(request.url).pathname;
  const body = await parseJson(request);

  if (pathname === '/api/analyze') {
    const text = validateText(body.text);
    const settings = validateSettings(body.settings);
    return json(await analyze(env, text, settings));
  }

  if (pathname === '/api/rewrite') {
    const text = validateText(body.text);
    const settings = validateSettings(body.settings);
    const instruction = typeof body.instruction === 'string' ? body.instruction.slice(0, 1000) : undefined;
    return json(await rewrite(env, text, settings, instruction));
  }

  if (pathname === '/api/rewrite-fragment') {
    const selected = validateText(body.selected_text);
    const before = typeof body.context_before === 'string' ? body.context_before.slice(-6000) : '';
    const after = typeof body.context_after === 'string' ? body.context_after.slice(0, 6000) : '';
    const goal = typeof body.goal === 'string' && body.goal.trim()
      ? body.goal.slice(0, 500)
      : 'Mejorar claridad y naturalidad sin alterar el significado.';
    const settings = validateSettings(body.settings);
    return json(await rewriteFragment(env, selected, before, after, goal, settings));
  }

  return json({ error: 'Ruta no encontrada.' }, 404);
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const pathname = new URL(request.url).pathname;

    try {
      if (pathname.startsWith('/api/')) {
        return await handleApi(request, env);
      }

      return env.ASSETS.fetch(request);
    } catch (error) {
      return errorResponse(error);
    }
  },
};
