export type StyleProfile =
  | 'essay'
  | 'newsletter'
  | 'literary_review'
  | 'academic_professional'
  | 'personal_literary';

export type SpanishVariant = 'preserve' | 'rioplatense' | 'neutral';

export interface DocumentSettings {
  styleProfile: StyleProfile;
  spanishVariant: SpanishVariant;
}

export interface DocumentVersion {
  id: string;
  createdAt: string;
  label: string;
  text: string;
}

export interface LocalDocument {
  id: string;
  updatedAt: string;
  original: string;
  current: string;
  versions: DocumentVersion[];
  settings: DocumentSettings;
}
