import type { PagesFunction } from '@cloudflare/workers-types';
import { rewrite, type Env } from '../../server/service';
import { parseJson, authorize, json, errorResponse } from './_utils';
import { validateSettings, validateText } from '../../server/validation/input';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    authorize(request, env);
    const body = await parseJson(request);
    const text = validateText(body.text);
    const settings = validateSettings(body.settings);
    const instruction = typeof body.instruction === 'string' ? body.instruction.slice(0, 1000) : undefined;
    return json(await rewrite(env, text, settings, instruction));
  } catch (error) {
    return errorResponse(error);
  }
};
