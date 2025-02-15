import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { DashboardState, DashboardStats } from '../types';
import { dashboardReducer } from './dashboardReducer';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth';

interface DashboardContextType extends DashboardState {
  loadDashboardStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const initialState: DashboardState = {
  stats: {
    learnedWords: 0,
    totalWords: 3000,
    successRate: 0,
    streak: 0
  },
  isLoading: false,
  error: null
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { user } = useAuth();

  const loadDashboardStats = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Oturum bulunamadı' });
      return;
    }

    try {
      dispatch({ type: 'FETCH_START' });

      // Öğrenilen kelimeler
      const { data: learnedWords, error: learnedError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('learned', true)
        .eq('user_id', user.id);

      if (learnedError) throw learnedError;

      // Son 10 sınav sonucu
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (quizError) throw quizError;

      // Son aktiviteleri getir
      const { data: activities, error: activitiesError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;

      // Aktiviteleri birleştir ve sırala
      const allActivities = [
        ...(activities || []).map(activity => ({
          id: activity.id,
          type: 'learning',
          title: 'Yeni Kelime Öğrenildi',
          description: `"${activity.word}" kelimesini öğrendin`,
          result: 'success',
          timestamp: new Date(activity.created_at)
        })),
        ...(quizResults || []).map(quiz => ({
          id: quiz.id,
          type: 'quiz',
          title: `${quiz.difficulty} Seviye Sınavı`,
          description: `${quiz.total_questions} sorudan ${quiz.correct_answers} doğru`,
          result: quiz.correct_answers > quiz.total_questions * 0.7 ? 'success' : 'failure',
          timestamp: new Date(quiz.created_at)
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
       .slice(0, 10);
      // Sınav sonuçlarını hesapla
      const totalCorrect = quizResults?.reduce((sum, result) => sum + (result.correct_answers || 0), 0) || 0;
      const totalQuestions = quizResults?.reduce((sum, result) => sum + (result.total_questions || 0), 0) || 0;
      const quizCount = quizResults?.length || 0;

      // Son aktivite
      const { data: streak, error: streakError } = await supabase
        .from('user_progress')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (streakError) throw streakError;

      // Başarı oranı hesaplama
      const successRate = totalQuestions > 0 
        ? Math.round((totalCorrect / totalQuestions) * 100) 
        : 0;

      // Günlük seri hesaplama
      const streakCount = calculateStreak(streak?.[0]?.created_at);

      const stats: DashboardStats = {
        learnedWords: learnedWords?.length || 0,
        totalWords: 3000,
        successRate,
        quizCount,
        streak: streakCount,
        lastActivity: activities?.[0]?.created_at ? new Date(activities[0].created_at) : undefined,
        recentActivities: allActivities
      };

      dispatch({ type: 'FETCH_SUCCESS', payload: stats });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'İstatistikler yüklenirken bir hata oluştu.';
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: errorMessage
      });
    }
  }, [user]);

  // User değiştiğinde verileri otomatik yükle
  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user, loadDashboardStats]);

  const refreshStats = useCallback(async () => {
    await loadDashboardStats();
  }, [loadDashboardStats]);

  return (
    <DashboardContext.Provider value={{ ...state, loadDashboardStats, refreshStats }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Yardımcı fonksiyonlar
function calculateStreak(lastActivityDate?: string): number {
  if (!lastActivityDate) return 0;

  const lastActivity = new Date(lastActivityDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Eğer son aktivite bugün veya dün ise seriyi devam ettir
  return diffDays <= 1 ? 1 : 0;
}