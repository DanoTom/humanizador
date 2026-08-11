const profiles: Record<string, string> = {
  essay: 'Ensayo: priorizá argumento, precisión conceptual, cohesión, ritmo y desarrollo de ideas. Evitá introducciones genéricas y conclusiones prefabricadas.',
  newsletter: 'Newsletter/Substack: priorizá voz, ritmo, claridad, proximidad con el lector y transiciones naturales. No conviertas el texto en marketing.',
  literary_review: 'Reseña literaria: priorizá precisión crítica, matices, observación concreta y ritmo. Evitá lenguaje promocional o elogios genéricos.',
  academic_professional: 'Académico/profesional: priorizá precisión, claridad, terminología consistente y cautela epistemológica. No agregues formalidad innecesaria.',
  personal_literary: 'Prosa personal/literaria: priorizá voz, cadencia, singularidad, imágenes ya presentes y textura del lenguaje. No agregues metáforas por defecto ni homogeneices la voz.',
};

export function profileInstruction(profile: string): string {
  return profiles[profile] ?? profiles.essay;
}

export function variantInstruction(variant: string): string {
  if (variant === 'rioplatense') return 'Usá español rioplatense cuando corresponda, incluyendo voseo natural. No fuerces localismos.';
  if (variant === 'neutral') return 'Usá español internacional neutro, salvo que una cita o voz deliberada requiera otra variante.';
  return 'Conservá la variante de español que ya tenga el texto. No neutralices el registro por defecto.';
}
