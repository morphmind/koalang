import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../modules/auth/context/AuthContext';
import { useAuthPopup } from '../modules/auth/hooks/useAuthPopup';
import { Word } from '../data/oxford3000.types';
import { BookmarkCheck, BookmarkPlus, Volume2, ChevronRight, ChevronLeft } from 'lucide-react';

interface ContentSectionProps {
  words: Word[];
  activeLevel: string;
  setActiveLevel: (level: string) => void;
  displayedWords: Word[];
  learnedWords: {[key: string]: boolean};
  toggleLearned: (word: string) => void;
  showLearned: boolean;
  setShowLearned: (show: boolean) => void;
  speak: (text: string) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  words,
  activeLevel,
  setActiveLevel,
  displayedWords,
  showLearned,
  setShowLearned,
  learnedWords,
  toggleLearned,
  speak,
  currentPage,
  totalPages,
  handlePageChange
}) => {
  const levels = [
    { id: 'all', title: 'Tümü', count: '3000', level: 'ALL' },
    { id: 'a1', title: 'Başlangıç', count: '750', level: 'A1' },
    { id: 'a2', title: 'Temel', count: '750', level: 'A2' },
    { id: 'b1', title: 'Orta', count: '600', level: 'B1' },
    { id: 'b2', title: 'İyi', count: '500', level: 'B2' },
    { id: 'c1', title: 'İleri', count: '400', level: 'C1' }
  ];
  const filtersRef = useRef<HTMLDivElement>(null);

  const handlePronunciation = useCallback((text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Telaffuz hatası:', err);
    }
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const el = filtersRef.current;
      if (!el) return;

      const hasOverflow = el.scrollWidth > el.clientWidth;

      el.classList.toggle('has-overflow', hasOverflow);
    };

    // İlk yüklemede kontrol et
    checkScroll();

    // Scroll event listener ekle
    const el = filtersRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
    }

    // Resize event listener ekle
    window.addEventListener('resize', checkScroll);

    // Cleanup
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, []);
  const { user } = useAuth();
  const { openAuthPopup } = useAuthPopup();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa öğrenilenleri gösterme modunu kapat
    if (!user && showLearned) {
      setShowLearned(false);
    }
  }, [user, showLearned]);
  const handleLearnClick = async (word: string) => {
    if (!user) {
      openAuthPopup();
      return;
    }
    await toggleLearned(word);
  };

  const handlePageWithScroll = (page: number) => {
    // Filtrelerin olduğu kısma scroll yap
    const filtersContainer = document.querySelector('.level-filters-container');
    if (filtersContainer) {
      filtersContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Parent'a page değişikliğini bildir
    handlePageChange(page);
  };

  return (
    <div className="content-section">
      <div className="container">
        {/* Level Filters Container */}
        <div className="level-filters-container">
          <div className="level-filters" ref={filtersRef}>
            {levels.map(level => (
              <button
                key={level.id}
                className={`level-tab ${activeLevel === level.id ? 'active' : ''}`}
                onClick={() => setActiveLevel(level.id)}
              >
                <div className="tab-header">
                  <div className={`tab-icon ${level.id}`}>
                    {level.level}
                  </div>
                  <div className="tab-content">
                    <span className="tab-title">{level.title}</span>
                    <span className="tab-count">{level.count} Kelime</span>
                  </div>
                </div>
                <div className="tab-progress">
                  <div className="tab-progress-bar">
                    <div 
                      className="tab-progress-fill"
                      style={{
                        width: `${(Object.values(learnedWords).filter(Boolean).length / words.filter(w => 
                          level.id === 'all' ? true : w.level.toLowerCase() === level.id
                        ).length * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Word Cards */}
        <div className="words-grid">
          {displayedWords.map((word, index) => (
            <div key={`word-${index}`} className="word-card">
              <div className="word-header">
                <div className="word-main">
                  <h4>{word.word}</h4>
                  <span className={`level ${word.level.toLowerCase()}`}>{word.level}</span>
                </div>
                <div className="word-actions" onClick={() => handleLearnClick(word.word)}>
                  <button className={`action-btn ${learnedWords[word.word] ? 'active' : ''}`}>
                    {learnedWords[word.word] ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="word-body">
                <div className="pronunciation">
                  <span className="ipa">{word.pronunciation}</span>
                  <button 
                    className="sound-btn"
                    onClick={() => speak(word.word)}
                    title="Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="meaning">
                  <h5>Anlamı</h5>
                  <p>{word.meaning}</p>
                </div>

                <div className="examples">
                  <h5>Örnek Cümleler</h5>
                  <ul>
                    {word.examples.map((example, i) => (
                      <li key={`${word.word}-example-${i}`}>
                        {example.en}
                        <button 
                          className="sound-btn-mini"
                          onClick={() => speak(example.en)}
                          title="Listen"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="word-footer">
                <div className="learning-status">
                  <div className={`status-indicator ${learnedWords[word.word] ? 'learned' : 'not-learned'}`}>
                    {learnedWords[word.word] ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <BookmarkPlus className="w-4 h-4" />
                    )}
                    <span>{learnedWords[word.word] ? 'Öğrenildi' : 'Öğrenilmedi'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center gap-4 mt-8 px-4 sm:px-6">
          <button 
            className="page-nav prev"
            onClick={() => handlePageWithScroll(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Önceki</span>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <button
                key={i + 1}
                className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageWithScroll(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 5 && <span className="page-dots">...</span>}
            {totalPages > 5 && (
              <button
                className={`page-num ${currentPage === totalPages ? 'active' : ''}`}
                onClick={() => handlePageWithScroll(totalPages)}
              >
                {totalPages}
              </button>
            )}
          </div>
          <button 
            className="page-nav next"
            onClick={() => handlePageWithScroll(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Sonraki</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};