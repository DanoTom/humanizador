const URL_RE = /https?:\/\/[^\s)\]}>,]+/giu;
const NUMBER_RE = /(?<![\p{L}\p{N}])[-+]?\d+(?:[.,]\d+)?%?/gu;

function extractMatches(regex: RegExp, text: string): string[] {
  return Array.from(text.matchAll(regex), (match) => match[0]).sort();
}

export interface PreservationCheck {
  ok: boolean;
  warnings: string[];
}

export function validatePreservation(original: string, revised: string): PreservationCheck {
  const warnings: string[] = [];
  const urlsBefore = extractMatches(URL_RE, original);
  const urlsAfter = extractMatches(URL_RE, revised);
  if (urlsBefore.join('\u0000') !== urlsAfter.join('\u0000')) {
    warnings.push('Una o más URLs cambiaron, desaparecieron o fueron agregadas.');
  }

  const numbersBefore = extractMatches(NUMBER_RE, original);
  const numbersAfter = extractMatches(NUMBER_RE, revised);
  if (numbersBefore.join('\u0000') !== numbersAfter.join('\u0000')) {
    warnings.push('Una o más cifras o porcentajes cambiaron, desaparecieron o fueron agregados.');
  }

  return { ok: warnings.length === 0, warnings };
}
