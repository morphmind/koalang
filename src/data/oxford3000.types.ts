
export interface Example {
  en: string;
  tr?: string;
}

export interface Word {
  word: string;
  type: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  pronunciation: string;
  meaning: string;
  examples: Example[];
  progress?: number;
  phrases?: string[];
}
