import type { PagesFunction } from '@cloudflare/workers-types';
import { analyze, type Env } from '../../server/service';
import { parseJson, authorize, json, errorResponse } from './_utils';
import { validateSettings, validateText } from '../../server/validation/input';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    authorize(request, env);
    const body = await parseJson(request);
    const text = validateText(body.text);
    const settings = validateSettings(body.settings);
    return json(await analyze(env, text, settings));
  } catch (error) {
    return errorResponse(error);
  }
};
