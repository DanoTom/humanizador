import { GlmProvider } from './providers/glm';
import { buildAnalysisRequest } from './prompts/analysis';
import { buildRewriteRequest } from './prompts/rewrite';
import { buildFragmentRequest } from './prompts/fragment';
import { validatePreservation } from './validation/output';
import type { DocumentSettings } from '../src/types/document';

export interface Env {
  NVIDIA_API_KEY: string;
  NVIDIA_MODEL?: string;
}

function providerFromEnv(env: Env) {
  if (!env.NVIDIA_API_KEY) throw new Error('NVIDIA_API_KEY no está configurada.');
  return new GlmProvider(env.NVIDIA_API_KEY, env.NVIDIA_MODEL || 'z-ai/glm-5.2');
}

export async function analyze(env: Env, text: string, settings: DocumentSettings) {
  return providerFromEnv(env).complete(buildAnalysisRequest(text, settings));
}

export async function rewrite(env: Env, text: string, settings: DocumentSettings, instruction?: string) {
  const result = (await providerFromEnv(env).complete(buildRewriteRequest(text, settings, instruction))) as Record<string, unknown>;
  const revised = typeof result.revised_text === 'string' ? result.revised_text : '';
  const preservation = validatePreservation(text, revised);
  const warnings = Array.isArray(result.warnings) ? [...result.warnings.filter((v): v is string => typeof v === 'string'), ...preservation.warnings] : preservation.warnings;
  return { ...result, warnings, semantic_risk: preservation.ok ? result.semantic_risk : 'high', certainty_preserved: preservation.ok && result.certainty_preserved === true };
}

export async function rewriteFragment(
  env: Env,
  selected: string,
  before: string,
  after: string,
  goal: string,
  settings: DocumentSettings,
) {
  return providerFromEnv(env).complete(buildFragmentRequest(selected, before, after, goal, settings));
}
