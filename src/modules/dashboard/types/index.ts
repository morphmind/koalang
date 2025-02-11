
export interface DashboardStats {
  learnedWords: number;
  totalWords: number;
  successRate: number;
  quizCount: number;
  streak: number;
  lastActivity?: Date;
}

export interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
}

export interface Activity {
  id: string;
  type: 'quiz' | 'learning';
  title: string;
  description: string;
  result?: 'success' | 'failure';
  timestamp: Date;
}

export interface WeeklyProgress {
  date: Date;
  count: number;
}

export interface LevelDistribution {
  [key: string]: number;
}
