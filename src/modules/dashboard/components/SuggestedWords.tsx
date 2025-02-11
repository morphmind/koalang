import React from 'react';
import { Sparkles, Volume2, BookmarkPlus, BookmarkCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useAuthPopup } from '../../auth/hooks/useAuthPopup';
import { Word } from '../../../data/oxford3000.types';
import { useWords } from '../../words/context/WordContext';

interface SuggestedWordsProps {
  words: Word[];
  isLoading: boolean;
  error: string | null;
  onLearn: (word: Word) => void;
  onSpeak: (word: string) => void;
  limit?: number;
}

export const SuggestedWords: React.FC<SuggestedWordsProps> = ({
  words,
  isLoading,
  error,
  onLearn,
  onSpeak,
  limit = 6
}) => {
  const { learnedWords } = useWords();
  const { user } = useAuth();
  const { openAuthPopup } = useAuthPopup();
  const displayWords = words.slice(0, limit);

  const handleLearn = async (word: Word) => {
    if (!user) {
      openAuthPopup();
      return;
    }

    try {
      await onLearn(word);
    } catch (err) {
      console.error('Kelime öğrenildi olarak işaretlenirken hata:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-bs-100 overflow-hidden shadow-sm hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-bs-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-bs-50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-bs-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-bs-navy mb-1">
              Önerilen Kelimeler
            </h2>
            <p className="text-sm text-bs-navygri">
              Seviyene uygun yeni kelimeler
            </p>
          </div>
          <div className="flex-shrink-0">
            <a 
              href="/dashboard/words" 
              className="text-sm font-medium text-bs-primary hover:text-bs-800 
                       flex items-center gap-1 group"
            >
              Tümünü Gör
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Word List */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {isLoading && !displayWords.length ? (
            <div className="col-span-full flex items-center justify-center h-[200px]">
              <div className="w-8 h-8 border-4 border-bs-100 border-t-bs-primary rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="col-span-full flex items-center justify-center h-[200px] px-6 text-center">
              <div className="text-bs-navygri">
                {error}
                <button
                  onClick={() => window.location.reload()}
                  className="block mt-2 text-sm text-bs-primary hover:text-bs-800"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          ) : displayWords.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-[200px] px-6 text-center">
              <div className="text-bs-navygri">
                Şu anda önerilecek kelime bulunmuyor.
              </div>
            </div>
          ) : (
            displayWords.map((word) => {
              const isLearned = learnedWords[word.word];
              
              return (
                <div 
                  key={word.word}
                  className="relative p-4 rounded-xl border border-bs-100 hover:border-bs-primary 
                           hover:shadow-xl transition-all hover:-translate-y-1 group overflow-hidden
                           bg-gradient-to-br from-white to-bs-50/30 flex flex-col"
                >
                  {/* Dekoratif Arka Plan */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-bs-50 to-transparent 
                               rounded-full blur-3xl -translate-y-24 translate-x-24 group-hover:translate-x-16 
                               transition-transform duration-500" />

                  {/* Word Info */}
                  <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
                    <h3 className="text-lg font-semibold text-bs-navy group-hover:text-bs-primary 
                                transition-colors">
                      {word.word}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap
                                  shadow-sm backdrop-blur-sm
                                  ${word.level === 'A1' ? 'bg-green-50 text-green-600' :
                                    word.level === 'A2' ? 'bg-blue-50 text-blue-600' :
                                    word.level === 'B1' ? 'bg-indigo-50 text-indigo-600' :
                                    word.level === 'B2' ? 'bg-purple-50 text-purple-600' :
                                    'bg-pink-50 text-pink-600'}`}>
                      {word.level}
                    </span>
                  </div>
                  
                  {/* Pronunciation */}
                  <div className="text-xs text-bs-navygri mb-2 opacity-75 relative z-10">
                    {word.pronunciation}
                  </div>

                  {/* Meaning */}
                  <p className="text-sm text-bs-navygri mb-4 line-clamp-2 relative z-10">
                    {word.meaning}
                  </p>

                  {/* Example */}
                  {word.examples[0] && (
                    <p className="text-xs text-bs-navygri/75 italic mb-4 line-clamp-2 relative z-10">
                      "{word.examples[0].en}"
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto relative z-10">
                    <button
                      onClick={() => onSpeak(word.word)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-bs-50 
                               text-bs-primary hover:bg-white hover:shadow-lg hover:-translate-y-0.5 
                               transition-all border border-transparent hover:border-bs-primary
                               group-hover:bg-white"
                      title="Telaffuzu dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleLearn(word)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg 
                                transition-all hover:-translate-y-0.5 hover:shadow-md border border-transparent 
                                ${isLearned 
                                  ? 'bg-bs-primary text-white hover:bg-bs-800 shadow-lg shadow-bs-primary/20' 
                                  : 'bg-bs-50 text-bs-primary hover:bg-white hover:border-bs-primary group-hover:bg-white'}`}
                      title={isLearned ? 'Öğrenildi' : 'Öğrendim olarak işaretle'}
                    >
                      {isLearned ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <BookmarkPlus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};