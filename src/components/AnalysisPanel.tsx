import type { AnalysisResult } from '../types/analysis';

const labels: Record<string, string> = {
  cliche: 'Cliché',
  generic_intro: 'Introducción genérica',
  repetition: 'Repetición',
  redundancy: 'Redundancia',
  abstraction: 'Abstracción',
  vagueness: 'Vaguedad',
  bureaucratic: 'Burocrático',
  connector: 'Conector',
  nominalization: 'Nominalización',
  rhythm: 'Ritmo',
  clarity: 'Claridad',
  precision: 'Precisión',
  voice: 'Voz',
  other: 'Otro',
};

const scoreLabels: Record<string, string> = {
  clarity: 'Claridad',
  rhythm: 'Ritmo',
  specificity: 'Especificidad',
  coherence: 'Coherencia',
  voice: 'Voz',
};

const severityLabels: Record<string, string> = {
  low: 'Sugerencia',
  medium: 'Conviene revisar',
  high: 'Problema relevante',
};

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="score-bar" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < value ? 'score-dot score-dot--active' : 'score-dot'} />
      ))}
    </div>
  );
}

export function AnalysisPanel({ result }: { result: AnalysisResult | null }) {
  if (!result) return <div className="empty-panel">El análisis aparecerá acá.</div>;

  const scores = result.overall_assessment;

  return (
    <div className="analysis-panel">
      <div className="scores" aria-label="Evaluación general">
        {Object.entries(scores).map(([key, value]) => (
          <div className="score-row" key={key}>
            <div className="score-copy">
              <span>{scoreLabels[key] ?? key}</span>
              <strong>{value}/5</strong>
            </div>
            <ScoreBar value={value} />
          </div>
        ))}
      </div>

      <div className="analysis-divider" />

      <div className="issues">
        <div className="issues-heading">
          <span>Sugerencias editoriales</span>
          <strong>{result.issues.length}</strong>
        </div>

        {result.issues.length === 0 ? (
          <p className="muted">No se detectaron problemas editoriales con suficiente fundamento como para sugerir cambios.</p>
        ) : (
          result.issues.map((issue) => (
            <article className="issue" key={issue.id}>
              <div className="issue-top">
                <span className={`severity severity--${issue.severity}`}>
                  {severityLabels[issue.severity] ?? issue.severity}
                </span>
                <span className="issue-category">{labels[issue.category] ?? issue.category}</span>
              </div>
              <blockquote>{issue.excerpt}</blockquote>
              <p>{issue.explanation}</p>
              <div className="suggestion-box">
                <span className="suggestion-label">Propuesta</span>
                <p className="suggestion">{issue.suggestion}</p>
              </div>
            </article>
          ))
        )}
      </div>

      {result.warnings.length > 0 && (
        <div className="warnings">
          <strong>Advertencias</strong>
          {result.warnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      )}
    </div>
  );
}
