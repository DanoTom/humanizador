import type { DocumentSettings, StyleProfile, SpanishVariant } from '../types/document';

const styles: Array<[StyleProfile, string]> = [
  ['essay', 'Ensayo'],
  ['newsletter', 'Newsletter / Substack'],
  ['literary_review', 'Reseña literaria'],
  ['academic_professional', 'Académico / profesional'],
  ['personal_literary', 'Personal / literario'],
];

export function StyleSelector({ settings, onChange }: { settings: DocumentSettings; onChange: (next: DocumentSettings) => void }) {
  return (
    <div className="settings-grid">
      <label>
        <span>Perfil</span>
        <select value={settings.styleProfile} onChange={(e) => onChange({ ...settings, styleProfile: e.target.value as StyleProfile })}>
          {styles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label>
        <span>Variante</span>
        <select value={settings.spanishVariant} onChange={(e) => onChange({ ...settings, spanishVariant: e.target.value as SpanishVariant })}>
          <option value="preserve">Conservar la variante</option>
          <option value="rioplatense">Español rioplatense</option>
          <option value="neutral">Español neutro</option>
        </select>
      </label>
    </div>
  );
}
