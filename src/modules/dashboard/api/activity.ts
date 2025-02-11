import { supabase } from '../../../lib/supabase';
import { Activity } from '../types';

export const activityAPI = {
  // Son aktiviteleri getir
  getRecentActivities: async (userId: string, limit: number = 5): Promise<Activity[]> => {
    try {
      // Öğrenilen kelimeler
      const { data: learnedWords, error: learnedError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('learned', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (learnedError) throw learnedError;

      // Sınav sonuçları
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (quizError) throw quizError;

      // Aktiviteleri birleştir ve sırala
      const activities: Activity[] = [
        ...learnedWords.map(word => ({
          id: word.id,
          type: 'learning',
          title: 'Yeni Kelime Öğrenildi',
          description: `"${word.word}" kelimesini öğrendin`,
          result: 'success',
          timestamp: new Date(word.created_at)
        })),
        ...quizResults.map(quiz => ({
          id: quiz.id,
          type: 'quiz',
          title: `${quiz.difficulty} Seviye Sınavı`,
          description: `${quiz.total_questions} sorudan ${quiz.correct_answers} doğru`,
          result: quiz.correct_answers > quiz.total_questions * 0.7 ? 'success' : 'failure',
          timestamp: new Date(quiz.created_at)
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

      return activities;
    } catch (error) {
      console.error('Son aktiviteler yüklenirken hata:', error);
      throw error;
    }
  }
};