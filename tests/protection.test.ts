import { describe, expect, it } from 'vitest';
import { validatePreservation } from '../server/validation/output';

describe('preservation checks', () => {
  it('accepts unchanged URL and number', () => {
    const result = validatePreservation('Ver https://example.com en 2026.', 'Mirá https://example.com durante 2026.');
    expect(result.ok).toBe(true);
  });
  it('warns when a number changes', () => {
    const result = validatePreservation('Hay 37% de casos.', 'Hay 40% de casos.');
    expect(result.ok).toBe(false);
    expect(result.warnings[0]).toContain('cifras');
  });
});
