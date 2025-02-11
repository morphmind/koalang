import { useCallback, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { WeeklyProgress, LevelDistribution } from '../types';

export const useDashboardStats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeeklyProgress = useCallback(async (): Promise<WeeklyProgress[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { data, error: dbError } = await supabase
        .from('user_progress')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', startOfWeek.toISOString())
        .order('created_at', { ascending: true });

      if (dbError) throw dbError;

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
    } catch (err) {
      setError('Haftalık ilerleme yüklenirken bir hata oluştu.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLevelDistribution = useCallback(async (): Promise<LevelDistribution> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { data, error: dbError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', user.id)
        .eq('learned', true);

      if (dbError) throw dbError;

      // Seviyelere göre grupla
      const distribution = data.reduce((acc: LevelDistribution, item) => {
        const level = item.word.level;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      // Yüzdeleri hesapla
      const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
      Object.keys(distribution).forEach(level => {
        distribution[level] = Math.round((distribution[level] / total) * 100);
      });

      return distribution;
    } catch (err) {
      setError('Seviye dağılımı yüklenirken bir hata oluştu.');
      return {};
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getWeeklyProgress,
    getLevelDistribution,
    isLoading,
    error
  };
};