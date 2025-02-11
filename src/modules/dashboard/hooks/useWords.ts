import { useState, useCallback } from 'react';
import { wordsAPI } from '../api/words';
import { useAuth } from '../../auth';
import { Word } from '../../../data/oxford3000.types';

export const useWords = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLearnedWords = useCallback(async () => {
    if (!user) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      return await wordsAPI.getLearnedWords(user.id);
    } catch (err) {
      setError('Öğrenilen kelimeler yüklenirken bir hata oluştu.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markWordAsLearned = useCallback(async (word: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await wordsAPI.markWordAsLearned(user.id, word);
    } catch (err) {
      setError('Kelime öğrenildi olarak işaretlenirken bir hata oluştu.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markWordAsUnlearned = useCallback(async (word: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await wordsAPI.markWordAsUnlearned(user.id, word);
    } catch (err) {
      setError('Kelime öğrenilmedi olarak işaretlenirken bir hata oluştu.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getSuggestedWords = useCallback(async (limit?: number): Promise<Word[]> => {
    if (!user) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      return await wordsAPI.getSuggestedWords(user.id, limit);
    } catch (err) {
      setError('Önerilen kelimeler yüklenirken bir hata oluştu.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getWordStats = useCallback(async () => {
    if (!user) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      return await wordsAPI.getWordStats(user.id);
    } catch (err) {
      setError('Kelime istatistikleri yüklenirken bir hata oluştu.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    getLearnedWords,
    markWordAsLearned,
    markWordAsUnlearned,
    getSuggestedWords,
    getWordStats,
    isLoading,
    error
  };
};