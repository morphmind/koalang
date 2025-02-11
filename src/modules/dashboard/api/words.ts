import { supabase } from '../../../lib/supabase';
import { Word } from '../../../data/oxford3000.types';
import words from '../../../data/oxford3000';

export const wordsAPI = {
  // Öğrenilen kelimeleri getir
  getLearnedWords: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true);

      if (error) throw error;
      return data.map(item => item.word);
    } catch (error) {
      console.error('Öğrenilen kelimeler yüklenirken hata:', error);
      throw error;
    }
  },

  // Kelimeyi öğrenildi olarak işaretle
  markWordAsLearned: async (userId: string, word: string) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          word,
          learned: true,
          last_reviewed: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Kelime öğrenildi olarak işaretlenirken hata:', error);
      throw error;
    }
  },

  // Kelimeyi öğrenilmedi olarak işaretle
  markWordAsUnlearned: async (userId: string, word: string) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          word,
          learned: false,
          last_reviewed: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Kelime öğrenilmedi olarak işaretlenirken hata:', error);
      throw error;
    }
  },

  // Önerilen kelimeleri getir
  getSuggestedWords: async (userId: string, limit: number = 5): Promise<Word[]> => {
    try {
      // Kullanıcının öğrendiği kelimeleri al
      const { data: learned, error: learnedError } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', userId)
        .eq('learned', true);

      if (learnedError) throw learnedError;

      // Öğrenilmemiş kelimelerden rastgele seç
      const learnedWords = new Set(learned?.map(l => l.word) || []);
      const unlearned = words.filter(w => !learnedWords.has(w.word));
      
      return unlearned
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    } catch (error) {
      console.error('Önerilen kelimeler yüklenirken hata:', error);
      throw error;
    }
  },

  // Kelime istatistiklerini getir
  getWordStats: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('word, learned, last_reviewed')
        .eq('user_id', userId);

      if (error) throw error;

      return {
        totalLearned: data.filter(w => w.learned).length,
        totalWords: words.length,
        lastReviewed: data.length > 0 
          ? new Date(Math.max(...data.map(w => new Date(w.last_reviewed).getTime())))
          : null
      };
    } catch (error) {
      console.error('Kelime istatistikleri yüklenirken hata:', error);
      throw error;
    }
  }
};