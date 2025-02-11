import { Word } from '../../../data/oxford3000.types';

export interface WordState {
  learnedWords: { [key: string]: boolean };
  isLoading: boolean;
  error: string | null;
}

export interface WordProgress {
  word: string;
  learned: boolean;
  lastReviewed: Date;
}

export interface WordStats {
  totalLearned: number;
  totalWords: number;
  lastReviewed: Date | null;
}

export interface WordContextType extends WordState {
  toggleWordLearned: (word: string) => Promise<void>;
  loadLearnedWords: () => Promise<void>;
  getLearnedWordsCount: () => number;
  getSuggestedWords: (limit?: number) => Promise<Word[]>;
}