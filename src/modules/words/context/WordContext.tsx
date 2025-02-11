import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Word } from '../../../data/oxford3000.types';
import { wordReducer } from './wordReducer';
import { useAuth } from '../../auth';
import words from '../../../data/oxford3000';

interface WordState {
  learnedWords: { [key: string]: boolean };
  isLoading: boolean;
  error: string | null;
}

interface WordContextType extends WordState {
  toggleWordLearned: (word: string) => Promise<void>;
  loadLearnedWords: () => Promise<void>;
  getLearnedWordsCount: () => number;
  getSuggestedWords: (limit?: number) => Promise<Word[]>;
}

const initialState: WordState = {
  learnedWords: {},
  isLoading: false,
  error: null
};

const WordContext = createContext<WordContextType | undefined>(undefined);

export const WordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wordReducer, initialState);
  const { user } = useAuth();

  // Öğrenilen kelimeleri yükle
  const loadLearnedWords = useCallback(async () => {
    if (!user) return;

    try {
      dispatch({ type: 'FETCH_START' });
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('word')
        .eq('user_id', user.id)
        .eq('learned', true);

      if (error) throw error;

      const learnedWords = data.reduce((acc: { [key: string]: boolean }, item) => {
        acc[item.word] = true;
        return acc;
      }, {});

      dispatch({ type: 'FETCH_SUCCESS', payload: learnedWords });
    } catch (err) {
      console.error('Öğrenilen kelimeler yüklenirken hata:', err);
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: 'Öğrenilen kelimeler yüklenirken bir hata oluştu.' 
      });
    }
  }, [user]);

  // Kelime durumunu değiştir
  const toggleWordLearned = useCallback(async (word: string) => {
    if (!user) {
      const event = new CustomEvent('showAuthPopup');
      window.dispatchEvent(event);
      return false;
    }

    const isCurrentlyLearned = state.learnedWords[word];

    try {
      // Önce local state'i güncelle
      const isLearned = !isCurrentlyLearned;
      dispatch({ 
        type: 'UPDATE_WORD', 
        payload: { word, isLearned, isLoading: false }
      });

      // Önce mevcut kaydı kontrol et
      const { data: existingRecord, error: checkError } = await supabase
        .from('user_progress')
        .select()
        .eq('user_id', user.id)
        .eq('word', word)
        .maybeSingle();

      if (checkError) throw checkError;

      let error;
      if (existingRecord) {
        // Kayıt varsa güncelle
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            learned: isLearned,
            last_reviewed: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('word', word);
        error = updateError;
      } else {
        // Kayıt yoksa yeni ekle
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            word,
            learned: isLearned,
            last_reviewed: new Date().toISOString()
          });
        error = insertError;
      }

      if (error) throw error;

    } catch (err) {
      console.error('Kelime durumu güncellenirken hata:', err);
      // Hata durumunda state'i geri al
      dispatch({ 
        type: 'UPDATE_WORD', 
        payload: { word, isLearned: isCurrentlyLearned, isLoading: false }
      });
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Kelime durumu güncellenirken bir hata oluştu.'
      });
      return false;
    }
    return true;
  }, [user, state.learnedWords]);

  // Öğrenilen kelime sayısını getir
  const getLearnedWordsCount = useCallback(() => {
    return Object.values(state.learnedWords).filter(Boolean).length;
  }, [state.learnedWords]);

  // Önerilen kelimeleri getir
  const getSuggestedWords = useCallback(async (limit: number = 5): Promise<Word[]> => {
    if (!user) return [];

    try {
      // Öğrenilmemiş kelimelerden rastgele seç
      const unlearned = words.filter(w => !state.learnedWords[w.word]);
      return unlearned
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    } catch (err) {
      console.error('Önerilen kelimeler yüklenirken hata:', err);
      return [];
    }
  }, [user, state.learnedWords]);

  // İlk yükleme
  React.useEffect(() => {
    loadLearnedWords();
  }, [loadLearnedWords]);

  return (
    <WordContext.Provider 
      value={{ 
        ...state,
        toggleWordLearned,
        loadLearnedWords,
        getLearnedWordsCount,
        getSuggestedWords
      }}
    >
      {children}
    </WordContext.Provider>
  );
};

export const useWords = () => {
  const context = useContext(WordContext);
  if (context === undefined) {
    throw new Error('useWords must be used within a WordProvider');
  }
  return context;
};