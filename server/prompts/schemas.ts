export const analysisSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    language: { type: 'string', enum: ['es'] },
    style_profile: { type: 'string' },
    overall_assessment: {
      type: 'object',
      additionalProperties: false,
      properties: {
        clarity: { type: 'number', minimum: 1, maximum: 5 },
        rhythm: { type: 'number', minimum: 1, maximum: 5 },
        specificity: { type: 'number', minimum: 1, maximum: 5 },
        coherence: { type: 'number', minimum: 1, maximum: 5 },
        voice: { type: 'number', minimum: 1, maximum: 5 },
      },
      required: ['clarity', 'rhythm', 'specificity', 'coherence', 'voice'],
    },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          category: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] },
          excerpt: { type: 'string' },
          explanation: { type: 'string' },
          suggestion: { type: 'string' },
        },
        required: ['id', 'category', 'severity', 'excerpt', 'explanation', 'suggestion'],
      },
    },
    warnings: { type: 'array', items: { type: 'string' } },
  },
  required: ['language', 'style_profile', 'overall_assessment', 'issues', 'warnings'],
} as const;

export const rewriteSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    revised_text: { type: 'string' },
    changes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          original: { type: 'string' },
          revised: { type: 'string' },
          reason: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
        required: ['id', 'type', 'original', 'revised', 'reason', 'confidence'],
      },
    },
    warnings: { type: 'array', items: { type: 'string' } },
    semantic_risk: { type: 'string', enum: ['low', 'medium', 'high'] },
    certainty_preserved: { type: 'boolean' },
  },
  required: ['revised_text', 'changes', 'warnings', 'semantic_risk', 'certainty_preserved'],
} as const;
