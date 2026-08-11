import { useEffect, useMemo, useState } from 'react';
import { analyzeText, rewriteFragment, rewriteText } from './lib/api';
import { clearDocument, loadDocument, saveDocument } from './lib/storage';
import { countWords, isWithinWordLimit } from './lib/wordCount';
import type { AnalysisResult, RewriteResult } from './types/analysis';
import type { DocumentSettings, DocumentVersion } from './types/document';
import { AnalysisPanel } from './components/AnalysisPanel';
import { RevisionView } from './components/RevisionView';
import { StyleSelector } from './components/StyleSelector';
import { VersionHistory } from './components/VersionHistory';
import { WordCounter } from './components/WordCounter';

const defaultSettings: DocumentSettings = { styleProfile: 'essay', spanishVariant: 'preserve' };

type PendingRevision = {
  result: RewriteResult;
  baseText: string;
  mode: 'full' | 'fragment';
  selectionStart: number;
  selectionEnd: number;
};

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }

export default function App() {
  const saved = useMemo(() => loadDocument(), []);
  const [text, setText] = useState(saved?.current ?? '');
  const [settings, setSettings] = useState(saved?.settings ?? defaultSettings);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [pendingRevision, setPendingRevision] = useState<PendingRevision | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>(saved?.versions ?? []);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  useEffect(() => {
    if (!historyEnabled) return;
    saveDocument({ id: saved?.id ?? uid(), updatedAt: new Date().toISOString(), original: pendingRevision?.baseText ?? '', current: text, versions, settings });
  }, [text, versions, settings, historyEnabled, pendingRevision]);

  const overLimit = !isWithinWordLimit(text);

  function addVersion(next: string, label: string) {
    const version: DocumentVersion = { id: uid(), createdAt: new Date().toISOString(), label, text: next };
    setVersions((current) => [...current, version].slice(-20));
    setText(next);
  }

  async function handleAnalyze() {
    setMessage('');
    setBusy(true);
    try {
      setAnalysis(await analyzeText({ text, settings }));
      setMessage('Análisis terminado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo analizar el texto.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRewrite() {
    if (overLimit) return;
    const baseText = text;
    setMessage('');
    setBusy(true);
    setPendingRevision(null);
    try {
      const result = await rewriteText({ text: baseText, settings });
      setPendingRevision({ result, baseText, mode: 'full', selectionStart: 0, selectionEnd: baseText.length });
      setMessage('Revisión recibida. La propuesta todavía no modifica tu texto.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo reescribir el texto.');
    } finally {
      setBusy(false);
    }
  }

  async function handleFragment() {
    if (!selectedText) {
      setMessage('Seleccioná primero un fragmento del texto.');
      return;
    }

    const start = selectionStart;
    const end = selectionEnd;
    const baseText = text;
    const before = baseText.slice(Math.max(0, start - 2500), start);
    const after = baseText.slice(end, Math.min(baseText.length, end + 2500));
    const goal = window.prompt('¿Qué querés mejorar en este fragmento?', 'Más claro y natural, sin cambiar el significado.') || '';
    if (!goal) return;

    setBusy(true);
    setMessage('');
    setPendingRevision(null);
    try {
      const result = await rewriteFragment({
        selected_text: selectedText,
        context_before: before,
        context_after: after,
        goal,
        settings,
      });
      setPendingRevision({ result, baseText, mode: 'fragment', selectionStart: start, selectionEnd: end });
      setMessage('Se generó una propuesta para el fragmento. La propuesta todavía no modifica tu texto.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo reescribir el fragmento.');
    } finally {
      setBusy(false);
    }
  }

  function handleExport(ext: 'md' | 'txt') {
    const blob = new Blob([text], {
      type: ext === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `texto-revisado.${ext}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function acceptRevision() {
    if (!pendingRevision) return;

    const { result, baseText, mode, selectionStart: start, selectionEnd: end } = pendingRevision;
    let nextText = result.revised_text;

    if (mode === 'fragment') {
      nextText = `${baseText.slice(0, start)}${result.revised_text}${baseText.slice(end)}`;
    }

    addVersion(nextText, mode === 'full' ? 'Reescritura conservadora aceptada' : 'Reescritura de fragmento aceptada');
    setPendingRevision(null);
    setMessage('Versión aceptada.');
  }

  function rejectRevision() {
    setPendingRevision(null);
    setMessage('Propuesta descartada. Tu texto no fue modificado.');
  }

  function resetLocal() {
    if (!window.confirm('¿Borrar el historial local y comenzar de cero?')) return;
    clearDocument();
    setVersions([]);
    setAnalysis(null);
    setPendingRevision(null);
    setText('');
    setSelectedText('');
    setSelectionStart(0);
    setSelectionEnd(0);
    setMessage('Historial local borrado.');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">EDITOR PERSONAL</div>
          <h1>Escribir mejor sin dejar de escribir como vos.</h1>
        </div>
        <div className="top-actions">
          <button onClick={() => handleExport('md')}>Markdown</button>
          <button onClick={() => handleExport('txt')}>Texto</button>
        </div>
      </header>

      <section className="workspace">
        <div className="editor-column">
          <div className="editor-head">
            <WordCounter text={text} />
            <span className={overLimit ? 'limit-error' : 'muted'}>
              {overLimit ? 'Superaste el límite' : 'Hasta 1.500 palabras'}
            </span>
          </div>

          <textarea
            className="editor"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setPendingRevision(null);
            }}
            onSelect={(e) => {
              setSelectedText(e.currentTarget.value.slice(e.currentTarget.selectionStart, e.currentTarget.selectionEnd));
              setSelectionStart(e.currentTarget.selectionStart);
              setSelectionEnd(e.currentTarget.selectionEnd);
            }}
            placeholder="Pegá acá tu texto…"
            spellCheck
          />

          <div className="selection-row">
            <span>
              {selectedText
                ? `Selección: ${countWords(selectedText)} palabras`
                : 'Seleccioná una frase o párrafo para intervenirlo de manera puntual.'}
            </span>
            <button disabled={!selectedText || busy} onClick={handleFragment}>
              Reescribir selección
            </button>
          </div>

          <StyleSelector settings={settings} onChange={setSettings} />

          <div className="primary-actions">
            <button disabled={!text.trim() || overLimit || busy} onClick={handleAnalyze}>
              Analizar estilo
            </button>
            <button className="primary" disabled={!text.trim() || overLimit || busy} onClick={handleRewrite}>
              {busy ? 'Procesando…' : 'Reescritura conservadora'}
            </button>
          </div>

          {message && <div className="status">{message}</div>}

          <div className="privacy-note">
            <strong>Privacidad:</strong> el texto no se guarda en un servidor de esta aplicación. Para analizar o reescribir, se envía al proveedor de modelos configurado. El historial, si está activo, permanece sólo en este navegador.
          </div>
        </div>

        <aside className="side-column">
          <section className="panel">
            <div className="panel-title"><h2>Análisis</h2></div>
            <AnalysisPanel result={analysis} />
          </section>

          <section className="panel">
            <div className="panel-title revision-title">
              <h2>Revisión</h2>
              {pendingRevision && (
                <div className="revision-actions">
                  <button onClick={acceptRevision}>Aceptar versión</button>
                  <button onClick={rejectRevision}>Rechazar</button>
                </div>
              )}
            </div>
            <RevisionView
              original={pendingRevision?.mode === 'fragment' ? text.slice(selectionStart, selectionEnd) : (pendingRevision?.baseText ?? text)}
              result={pendingRevision?.result ?? null}
            />
          </section>

          <section className="panel">
            <VersionHistory versions={versions} onSelect={(v) => { setText(v.text); setPendingRevision(null); }} />
          </section>

          <section className="privacy-controls">
            <label>
              <input
                type="checkbox"
                checked={historyEnabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  if (!enabled) clearDocument();
                  setHistoryEnabled(enabled);
                }}
              />{' '}
              Guardar historial local
            </label>
            <button onClick={resetLocal}>Borrar historial</button>
          </section>
        </aside>
      </section>

      <footer>Herramienta personal de edición. No evalúa ni intenta evadir detectores de IA.</footer>
    </main>
  );
}
