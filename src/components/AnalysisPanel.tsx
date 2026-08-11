import type { AnalysisResult } from '../types/analysis';

const labels: Record<string, string> = {
  cliche: 'Cliché', generic_intro: 'Introducción genérica', repetition: 'Repetición', redundancy: 'Redundancia', abstraction: 'Abstracción', vagueness: 'Vaguedad', bureaucratic: 'Burocrático', connector: 'Conector', nominalization: 'Nominalización', rhythm: 'Ritmo', clarity: 'Claridad', precision: 'Precisión', voice: 'Voz', other: 'Otro',
};

export function AnalysisPanel({ result }: { result: AnalysisResult | null }) {
  if (!result) return <div className="empty-panel">El análisis aparecerá acá.</div>;
  const scores = result.overall_assessment;
  return (
    <div className="analysis-panel">
      <div className="scores">
        {Object.entries(scores).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}/5</strong></div>)}
      </div>
      <div className="issues">
        {result.issues.length === 0 ? <p className="muted">No se detectaron problemas editoriales de alta confianza.</p> : result.issues.map((issue) => (
          <article className="issue" key={issue.id}>
            <div className="issue-top"><span className={`severity severity--${issue.severity}`}>{issue.severity}</span><span>{labels[issue.category] ?? issue.category}</span></div>
            <blockquote>{issue.excerpt}</blockquote>
            <p>{issue.explanation}</p>
            <p className="suggestion">{issue.suggestion}</p>
          </article>
        ))}
      </div>
      {result.warnings.length > 0 && <div className="warnings"><strong>Advertencias</strong>{result.warnings.map((w) => <p key={w}>{w}</p>)}</div>}
    </div>
  );
}
