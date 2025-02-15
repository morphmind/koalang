import React, { useState } from 'react';
import { Search, X, BookmarkPlus, BookmarkCheck, PenTool, Sparkles, Brain, Target } from 'lucide-react';
import { LoadingOverlay, ErrorAlert } from '../components';
import { useAuth } from '../modules/auth';
import { useAuthPopup } from '../modules/auth/hooks/useAuthPopup';
import { useWords } from '../modules/words/context/WordContext';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showLearned: boolean;
  setShowLearned: (show: boolean) => void;
  setShowQuiz: (show: boolean) => void;
  learnedWordsCount: number;
  totalWords: number;
  learningProgress: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  showLearned,
  setShowLearned,
  setShowQuiz,
  learnedWordsCount,
  totalWords,
  learningProgress
}) => { 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { openAuthPopup } = useAuthPopup();
  const progress = Math.round((learnedWordsCount / totalWords) * 100);

  const handleSearch = (value: string) => {
    try {
      setIsLoading(true);
      setSearchQuery(value);
    } catch (err) {
      setError('Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowLearned = () => {
    if (!user) {
      openAuthPopup();
      return;
    }
    setShowLearned(!showLearned);
  };

  const handleQuizStart = () => {
    if (!user) {
      openAuthPopup();
      return;
    }
    setShowQuiz(true);
  };

  return (
    <div className="hero-section relative overflow-hidden rounded-2xl">
      {/* Soft Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-bs-50 to-bs-100 rounded-2xl" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full 
                   bg-gradient-to-br from-bs-primary/10 to-bs-800/10 blur-3xl
                   animate-float-slow opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full 
                   bg-gradient-to-br from-bs-800/10 to-bs-primary/10 blur-3xl
                   animate-float-slow-reverse opacity-40" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-[0.02]" />
      {isLoading && <LoadingOverlay />}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="relative border-b border-white/10">
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Üst Kısım */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur
                           bg-bs-primary/10 text-bs-primary text-sm font-medium mb-6
                           hover:bg-bs-primary/20 transition-colors cursor-pointer">
                <Sparkles className="w-4 h-4" />
                <span>Kolay ve Etkili İngilizce Öğrenme</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-bs-navy mb-6 leading-tight">
                İngilizce Öğrenmenin <br />
                <span className="bg-gradient-to-r from-bs-primary to-bs-800 bg-clip-text text-transparent">
                  En Akıllı Yolu
                </span>
              </h1>
              <p className="text-lg text-bs-navygri max-w-2xl mx-auto">
                Yapay zeka destekli kişiselleştirilmiş öğrenme deneyimi ile 
                İngilizce kelime haznenizi geliştirin.
              </p>
            </div>

            {/* Arama ve Aksiyonlar */}
            <div className="relative mb-12">
              {/* Arama */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-bs-navygri" />
                </div>
                <input
                  type="text"
                  placeholder="Kelime veya anlam ara..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 bg-white border border-bs-100 rounded-2xl 
                           text-bs-navy placeholder-bs-navygri/50 shadow-lg
                           focus:ring-2 focus:ring-bs-primary/10 focus:border-bs-primary 
                           hover:border-bs-primary/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center"
                  >
                    <X className="w-5 h-5 text-bs-navygri hover:text-bs-navy" />
                  </button>
                )}
              </div>

              {/* Aksiyonlar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleShowLearned}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl 
                           font-medium text-sm transition-all relative overflow-hidden group
                           ${showLearned 
                             ? 'bg-bs-primary text-white shadow-lg shadow-bs-primary/20' 
                             : 'bg-white border border-bs-100 text-bs-navy hover:border-bs-primary hover:bg-bs-50'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {showLearned ? (
                    <>
                      <BookmarkCheck className="w-5 h-5" />
                      <span>Öğrendiklerimi Gizle</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-5 h-5" />
                      <span>Öğrendiklerimi Göster</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleQuizStart}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 
                           bg-gradient-to-r from-bs-primary to-bs-800 text-white
                           rounded-xl font-medium text-sm shadow-lg shadow-bs-primary/20
                           hover:shadow-xl hover:-translate-y-0.5 
                           transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-bs-50/0 via-bs-50/50 to-bs-50/0 
                                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <PenTool className="w-5 h-5" />
                  <span>Sınav Ol</span>
                </button>
              </div>

              {/* İstatistikler */}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-bs-primary to-bs-800 transition-all duration-500 ease-out relative"
            style={{ width: `${learningProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                         animate-shimmer bg-[length:200%_100%]" />
          </div>
          
          {/* Progress Text */}
          <div className="absolute right-4 -top-10 text-xs font-medium bg-bs-navy text-white px-3 py-1.5 rounded-full shadow-lg
                       flex items-center gap-2 border border-white/10 hover:scale-105 transition-transform">
            <span className="font-bold">{learnedWordsCount}</span>
            <span className="opacity-80">kelime öğrenildi</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="font-bold">%{Math.round(learningProgress)}</span>
          </div>
        </div>
      </div>
      <div className="search-section absolute -bottom-20 left-0 right-0 h-20 pointer-events-none" />
    </div>
  );
};