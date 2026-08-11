import type { DocumentVersion } from '../types/document';

export function VersionHistory({ versions, onSelect }: { versions: DocumentVersion[]; onSelect: (version: DocumentVersion) => void }) {
  return (
    <div className="history">
      <h3>Versiones locales</h3>
      {versions.length === 0 ? <p className="muted">Todavía no hay versiones guardadas.</p> : versions.slice().reverse().map((version) => (
        <button key={version.id} className="history-item" onClick={() => onSelect(version)}>
          <strong>{version.label}</strong><span>{new Date(version.createdAt).toLocaleString('es-AR')}</span>
        </button>
      ))}
    </div>
  );
}
