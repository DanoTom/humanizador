import type { PagesFunction } from '@cloudflare/workers-types';
import { rewriteFragment, type Env } from '../../server/service';
import { parseJson, authorize, json, errorResponse } from './_utils';
import { validateSettings, validateText } from '../../server/validation/input';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    authorize(request, env);
    const body = await parseJson(request);
    const selected = validateText(body.selected_text);
    const before = typeof body.context_before === 'string' ? body.context_before.slice(-6000) : '';
    const after = typeof body.context_after === 'string' ? body.context_after.slice(0, 6000) : '';
    const goal = typeof body.goal === 'string' && body.goal.trim() ? body.goal.slice(0, 500) : 'Mejorar claridad y naturalidad sin alterar el significado.';
    const settings = validateSettings(body.settings);
    return json(await rewriteFragment(env, selected, before, after, goal, settings));
  } catch (error) {
    return errorResponse(error);
  }
};
