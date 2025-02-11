import { useState, useCallback } from 'react';
import { useAuth } from '../../auth';
import { progressAPI } from '../api/progress';
import { WeeklyProgress, LevelDistribution } from '../types';

export const useProgress = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeeklyProgress = useCallback(async (): Promise<WeeklyProgress[]> => {
    if (!user) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      return await progressAPI.getWeeklyProgress(user.id);
    } catch (err) {
      setError('Haftalık ilerleme yüklenirken bir hata oluştu.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getLevelDistribution = useCallback(async (): Promise<LevelDistribution> => {
    if (!user) return {};
    
    try {
      setIsLoading(true);
      setError(null);
      return await progressAPI.getLevelDistribution(user.id);
    } catch (err) {
      setError('Seviye dağılımı yüklenirken bir hata oluştu.');
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getRecentActivities = useCallback(async (limit?: number) => {
    if (!user) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      return await progressAPI.getRecentActivities(user.id, limit);
    } catch (err) {
      setError('Son aktiviteler yüklenirken bir hata oluştu.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    getWeeklyProgress,
    getLevelDistribution,
    getRecentActivities,
    isLoading,
    error
  };
};