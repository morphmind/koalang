import { supabase } from '../../../lib/supabase';
import { WeeklyProgress, LevelDistribution } from '../types';
import { Word } from '../../../data/oxford3000.types';
import words from '../../../data/oxford3000';

export const progressAPI = {
  // Haftalık ilerleme verilerini getir
  getWeeklyProgress: async (userId: string): Promise<WeeklyProgress[]> => {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('user_progress')
        .select('created_at')
        .eq('user_id', userId)
        .eq('learned', true)
        .gte('created_at', startOfWeek.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Günlük aktiviteleri grupla
      const dailyProgress = data.reduce((acc: { [key: string]: number }, item) => {
        const date = new Date(item.created_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Son 7 günü doldur
      const weeklyProgress: WeeklyProgress[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        weeklyProgress.unshift({
          date,
          count: dailyProgress[date.toDateString()] || 0
        });
      }

      return weeklyProgress;
    } catch (error) {
      console.error('Haftalık ilerleme yüklenirken hata:', error);
      throw error;
    }
  },

  // Seviye dağılımını getir
  getLevelDistribution: async (userId: string): Promise<LevelDistribution> => {
    try {
      const { data: learnedWords, error } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true);

      if (error) throw error;

      // Öğrenilen kelimeleri bul
      const learnedWordSet = new Set(learnedWords.map(item => item.word));
      
      // Seviyelere göre grupla
      const distribution = words.reduce((acc: LevelDistribution, word) => {
        if (learnedWordSet.has(word.word)) {
          acc[word.level] = (acc[word.level] || 0) + 1;
        }
        return acc;
      }, {});

      // Yüzdeleri hesapla
      const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
      Object.keys(distribution).forEach(level => {
        distribution[level] = Math.round((distribution[level] / total) * 100);
      });

      return distribution;
    } catch (error) {
      console.error('Seviye dağılımı yüklenirken hata:', error);
      throw error;
    }
  },

  // Günlük hedefleri getir
  getDailyGoals: async (userId: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: todayLearned, error: todayError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true)
        .gte('created_at', today.toISOString());

      if (todayError) throw todayError;

      const { data: weekLearned, error: weekError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true)
        .gte('created_at', startOfWeek.toISOString());

      if (weekError) throw weekError;

      const { data: monthLearned, error: monthError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true)
        .gte('created_at', startOfMonth.toISOString());

      if (monthError) throw monthError;

      const { data: userLevel } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true)
        .order('created_at', { ascending: false })
        .limit(1);

      const calculateTargets = (learnedCount: number) => {
        if (learnedCount < 100) { // Başlangıç seviyesi
          return { daily: 5, weekly: 25, monthly: 100 };
        } else if (learnedCount < 500) { // Orta seviye
          return { daily: 10, weekly: 50, monthly: 200 };
        } else { // İleri seviye
          return { daily: 15, weekly: 75, monthly: 300 };
        }
      };

      const targets = calculateTargets(userLevel?.length || 0);

      return {
        daily: {
          current: todayLearned?.length || 0,
          target: targets.daily
        },
        weekly: {
          current: weekLearned?.length || 0,
          target: targets.weekly
        },
        monthly: {
          current: monthLearned?.length || 0,
          target: targets.monthly
        }
      };
    } catch (error) {
      console.error('Hedefler yüklenirken hata:', error);
      throw error;
    }
  },

  // Başarıları getir
  getAchievements: async (userId: string) => {
    try {
      // Öğrenilen kelime sayısı
      const { data: learnedWords, error: learnedError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true);

      if (learnedError) throw learnedError;

      // Sınav sonuçları
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId);

      if (quizError) throw quizError;

      // Başarıları hesapla
      const achievements = [];
      const learnedCount = learnedWords?.length || 0;

      // İlk kelime başarısı
      if (learnedCount > 0) {
        achievements.push({
          id: 'first_word',
          title: 'İlk Adım',
          description: 'İlk kelimeyi öğrendiniz',
          progress: 100,
          earned: true,
          earnedAt: learnedWords[0].created_at
        });
      }

      // 10 kelime başarısı
      achievements.push({
        id: 'word_master_10',
        title: 'Kelime Ustası I',
        description: '10 kelime öğrendiniz',
        progress: Math.min((learnedCount / 10) * 100, 100),
        earned: learnedCount >= 10,
        earnedAt: learnedCount >= 10 ? learnedWords[9].created_at : null,
        current: learnedCount,
        target: 10
      });

      // 50 kelime başarısı
      achievements.push({
        id: 'word_master_50',
        title: 'Kelime Ustası II',
        description: '50 kelime öğrendiniz',
        progress: Math.min((learnedCount / 50) * 100, 100),
        earned: learnedCount >= 50,
        earnedAt: learnedCount >= 50 ? learnedWords[49].created_at : null,
        current: learnedCount,
        target: 50
      });

      // Mükemmel sınav başarısı
      const perfectQuiz = quizResults?.find(quiz => 
        quiz.correct_answers === quiz.total_questions && quiz.total_questions >= 10
      );
      if (perfectQuiz) {
        achievements.push({
          id: 'perfect_quiz',
          title: 'Mükemmel Sınav',
          description: 'Bir sınavda tüm soruları doğru yanıtladınız',
          progress: 100,
          earned: true,
          earnedAt: perfectQuiz.created_at
        });
      }

      return achievements;
    } catch (error) {
      console.error('Başarılar yüklenirken hata:', error);
      throw error;
    }
  },

  // Son aktiviteleri getir
  getRecentActivities: async (userId: string, limit: number = 5) => {
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
      const activities = [
        ...learnedWords.map(word => ({
          id: word.id,
          type: 'learning' as const,
          title: 'Yeni Kelime Öğrenildi',
          description: `"${word.word}" kelimesini öğrendin`,
          result: 'success' as const,
          timestamp: new Date(word.created_at)
        })),
        ...quizResults.map(quiz => ({
          id: quiz.id,
          type: 'quiz' as const,
          title: `${quiz.difficulty} Seviye Sınavı`,
          description: `${quiz.total_questions} sorudan ${quiz.correct_answers} doğru`,
          result: quiz.correct_answers > quiz.total_questions * 0.7 ? 'success' as const : 'failure' as const,
          timestamp: new Date(quiz.created_at)
        }))
      ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

      return activities;
    } catch (error) {
      console.error('Son aktiviteler yüklenirken hata:', error);
      throw error;
    }
  }
};