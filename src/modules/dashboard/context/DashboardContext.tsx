import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { DashboardState, DashboardStats } from '../types';
import { dashboardReducer } from './dashboardReducer';
import { supabase } from '../../../lib/supabase';

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

  const loadDashboardStats = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_START' });

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        dispatch({ type: 'FETCH_ERROR', payload: sessionError.message });
        return;
      }
      
      if (!session?.user) {
        dispatch({ type: 'FETCH_ERROR', payload: 'Oturum bulunamadı' });
        return;
      }

      // Öğrenilen kelimeler
      const { data: learnedWords, error: learnedError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('learned', true)
        .eq('user_id', session.user.id);

      if (learnedError) throw learnedError;

      // Son 10 sınav sonucu
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('correct_answers, total_questions')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (quizError) throw quizError;

      // Sınav sonuçlarını hesapla
      const totalCorrect = quizResults?.reduce((sum, result) => sum + (result.correct_answers || 0), 0) || 0;
      const totalQuestions = quizResults?.reduce((sum, result) => sum + (result.total_questions || 0), 0) || 0;
      const quizCount = quizResults?.length || 0;

      // Son aktivite
      const { data: streak, error: streakError } = await supabase
        .from('user_progress')
        .select('created_at')
        .eq('user_id', session.user.id)
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
        lastActivity: streak?.[0]?.created_at ? new Date(streak[0].created_at) : undefined
      };

      dispatch({ type: 'FETCH_SUCCESS', payload: stats });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'İstatistikler yüklenirken bir hata oluştu.';
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: errorMessage
      });
    }
  }, [dispatch]);

  const refreshStats = useCallback(async () => {
    await loadDashboardStats();
  }, [loadDashboardStats]);

  // İlk yükleme
  React.useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  return (
    <DashboardContext.Provider 
      value={{ 
        ...state,
        loadDashboardStats,
        refreshStats
      }}
    >
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