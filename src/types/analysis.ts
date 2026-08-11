import type { DocumentSettings } from './document';

export type IssueCategory =
  | 'cliche'
  | 'generic_intro'
  | 'repetition'
  | 'redundancy'
  | 'abstraction'
  | 'vagueness'
  | 'bureaucratic'
  | 'connector'
  | 'nominalization'
  | 'rhythm'
  | 'clarity'
  | 'precision'
  | 'voice'
  | 'other';

export type Severity = 'low' | 'medium' | 'high';

export interface Issue {
  id: string;
  category: IssueCategory;
  severity: Severity;
  excerpt: string;
  explanation: string;
  suggestion: string;
}

export interface AnalysisResult {
  language: 'es';
  style_profile: string;
  overall_assessment: {
    clarity: number;
    rhythm: number;
    specificity: number;
    coherence: number;
    voice: number;
  };
  issues: Issue[];
  warnings: string[];
}

export interface ChangeItem {
  id: string;
  type: 'grammar' | 'clarity' | 'precision' | 'style' | 'rhythm' | 'redundancy' | 'other';
  original: string;
  revised: string;
  reason: string;
  confidence: number;
}

export interface RewriteResult {
  revised_text: string;
  changes: ChangeItem[];
  warnings: string[];
  semantic_risk: 'low' | 'medium' | 'high';
  certainty_preserved: boolean;
}

export interface AnalysisRequest {
  text: string;
  settings: DocumentSettings;
}

export interface RewriteRequest extends AnalysisRequest {
  instruction?: string;
}

export interface FragmentRewriteRequest extends AnalysisRequest {
  selected_text: string;
  context_before: string;
  context_after: string;
  goal: string;
}
