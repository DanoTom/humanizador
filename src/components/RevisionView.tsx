import { diffText } from '../lib/diff';
import type { RewriteResult } from '../types/analysis';

export function RevisionView({ original, result }: { original: string; result: RewriteResult | null }) {
  if (!result) return <div className="empty-panel">La comparación aparecerá después de una reescritura.</div>;
  const parts = diffText(original, result.revised_text);
  return (
    <div className="revision">
      <div className="revision-diff">
        {parts.map((part, index) => <span key={index} className={part.added ? 'diff-added' : part.removed ? 'diff-removed' : ''}>{part.value}</span>)}
      </div>
      <div className="change-list">
        <h3>Cambios explicados</h3>
        {result.changes.length === 0 ? <p className="muted">No se informaron cambios.</p> : result.changes.map((change) => (
          <article className="change" key={change.id}>
            <div className="change-type">{change.type} · {Math.round(change.confidence * 100)}% de confianza</div>
            <div className="change-pair"><del>{change.original}</del><ins>{change.revised}</ins></div>
            <p>{change.reason}</p>
          </article>
        ))}
      </div>
      <div className="risk"><strong>Riesgo semántico:</strong> {result.semantic_risk}. {result.certainty_preserved ? 'No se detectó cambio de certeza.' : 'Revisá especialmente las afirmaciones y su grado de certeza.'}</div>
      {result.warnings.length > 0 && <div className="warnings"><strong>Advertencias de preservación</strong>{result.warnings.map((w) => <p key={w}>{w}</p>)}</div>}
    </div>
  );
}
