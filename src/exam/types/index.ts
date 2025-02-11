// Quiz Types
export interface Quiz {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  difficulty: QuizDifficulty;
  totalQuestions: number;
  questions: QuizQuestion[];
  status: QuizStatus;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
}

export type QuizStatus = 'not-started' | 'in-progress' | 'completed';
export type QuizDifficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'mixed';
export type QuestionType = 'multiple-choice' | 'sentence-completion' | 'pronunciation' | 'example-matching';

export interface QuizQuestion {
  id: string;
  wordId: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  isSkipped: boolean;
  timeSpent?: number;
  explanation?: string;
  startTime?: number;
}

export interface QuizSettings {
  questionCount: number;
  difficulty: QuizDifficulty;
  questionTypes: QuestionType[];
  wordPool: 'learned' | 'all';
  timeLimit?: number;
}

export interface QuizResult {
  quizId: string;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  successRate: number;
  levelAnalysis: {
    [key: string]: LevelAnalysis;
  };
  wordTypeAnalysis: {
    [key: string]: WordTypeAnalysis;
  };
  recommendations: string[];
  wrongAnswers: QuizQuestion[];
  timeSpent: number;
  averageTimePerQuestion: number;
}

interface LevelAnalysis {
  total: number;
  correct: number;
  percentage: number;
}

interface WordTypeAnalysis {
  total: number;
  correct: number;
  percentage: number;
}