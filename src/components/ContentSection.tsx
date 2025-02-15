import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '../modules/auth/context/AuthContext';
import { useAuthPopup } from '../modules/auth/hooks/useAuthPopup';
import { Word } from '../data/oxford3000.types';
import { BookmarkCheck, BookmarkPlus, Volume2, ChevronRight, ChevronLeft, ChevronUp, BookOpen } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

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

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType>();
  const currentIndexRef = useRef(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);

  // Tutorial'ı sadece mobilde ve kelime kartlarına gelince göster
  useEffect(() => {
    if (isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const tutorialShown = localStorage.getItem('wordCardTutorialShown');
              if (!tutorialShown) {
                setShowTutorial(true);
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      const wordsContainer = document.querySelector('.words-swiper');
      if (wordsContainer) {
        observer.observe(wordsContainer);
      }

      return () => {
        if (wordsContainer) {
          observer.unobserve(wordsContainer);
        }
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSlideChange = useCallback(async (swiper: SwiperType) => {
    const currentIndex = swiper.activeIndex;
    currentIndexRef.current = currentIndex;

    // Son slide'a geldiğimizde bir sonraki sayfaya geç
    if (currentIndex === displayedWords.length - 1 && !isLoading && currentPage < totalPages) {
      setIsLoading(true);
      
      // Bir sonraki sayfaya geç
      await handlePageChange(currentPage + 1);
      
      // Swiper'ı ilk slide'a döndür
      if (swiperRef.current) {
        swiperRef.current.slideTo(0, 0);
      }
      
      setIsLoading(false);
    }
  }, [currentPage, totalPages, displayedWords.length, handlePageChange, isLoading]);

  const WordCard = ({ word, index }: { word: Word; index: number }) => (
    <div 
      className="word-card relative"
      onTouchStart={() => isMobile && setHoveredCard(word.word)}
      onTouchEnd={() => isMobile && setHoveredCard(null)}
    >
      {/* Tutorial Overlay */}
      {showTutorial && hoveredCard === word.word && isMobile && (
        <div className="absolute inset-0 z-50 bg-black/80 rounded-2xl backdrop-blur-sm 
                     flex items-center justify-center p-6 animate-fade-in">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-bs-primary/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-bs-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white">Kelime Kartı</h3>
            </div>
            <p className="text-white/90 text-base leading-relaxed">
              Kelimeleri öğrenmek için kartın üzerine tıklayın. Telaffuzu dinlemek için ses simgesine, 
              öğrenildi olarak işaretlemek için yer imi simgesine tıklayın.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <button 
                onClick={() => {
                  setShowTutorial(false);
                  localStorage.setItem('wordCardTutorialShown', 'true');
                }}
                className="px-6 py-3 bg-bs-primary text-white rounded-xl font-medium
                         hover:bg-bs-800 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}

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
  );

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
        {isMobile ? (
          <div className="relative">
            {showTutorial && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-fade-in">
                <div className="relative max-w-sm mx-4">
                  {/* Tutorial Card */}
                  <div className="bg-gradient-to-br from-bs-primary to-bs-800 rounded-2xl p-8 shadow-2xl
                               border border-white/10 backdrop-blur-xl">
                    {/* Tutorial Content */}
                    <div className="flex flex-col items-center gap-8">
                      {/* Icon & Title */}
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-4
                                    shadow-lg shadow-bs-primary/20 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 
                                      group-hover:opacity-100 transition-opacity" />
                          <ChevronUp className="w-10 h-10 text-white animate-swipe-up" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Kelime Kartlarını Keşfet</h3>
                        <p className="text-white/80 text-lg">Yeni kelimeler öğrenmeye hazır mısın?</p>
                      </div>

                      {/* Tutorial Steps */}
                      <div className="space-y-4 w-full">
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            <ChevronUp className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">Yukarı kaydır</p>
                            <p className="text-white/60 text-xs">Yeni kelimeler için</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">Telaffuzu dinle</p>
                            <p className="text-white/60 text-xs">Ses simgesine tıkla</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            <BookmarkPlus className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">Öğrenildi olarak işaretle</p>
                            <p className="text-white/60 text-xs">Yer imi simgesine tıkla</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setShowTutorial(false);
                          localStorage.setItem('wordCardTutorialShown', 'true');
                        }}
                        className="w-full py-4 bg-white text-bs-primary rounded-xl font-medium
                                 hover:bg-bs-50 transition-all hover:-translate-y-1 hover:shadow-lg
                                 shadow-lg shadow-white/10"
                      >
                        Anladım, Başlayalım!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Swiper
              direction="vertical"
              className="h-[calc(100vh-200px)] words-swiper"
              modules={[Virtual]}
              virtual
              slidesPerView={1}
              spaceBetween={20}
              resistance={true}
              resistanceRatio={0.85}
              speed={400}
              touchRatio={1.5}
              followFinger={true}
              watchSlidesProgress={true}
              grabCursor={true}
              threshold={5}
              mousewheel={true}
              lazyPreloadPrevNext={1}
              watchOverflow={true}
              touchMoveStopPropagation={true}
              preventClicks={true}
              preventClicksPropagation={true}
              longSwipes={false}
              longSwipesRatio={0.2}
              touchAngle={45}
              preventInteractionOnTransition={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={handleSlideChange}
              observer={true}
              observeParents={true}
            >
              {displayedWords.map((word, index) => (
                <SwiperSlide key={`word-${word.word}-${index}`} virtualIndex={index}>
                  <WordCard word={word} index={index} />
                </SwiperSlide>
              ))}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bs-primary"></div>
                </div>
              )}
            </Swiper>
          </div>
        ) : (
          <div className="words-grid">
            {displayedWords.map((word, index) => (
              <WordCard key={`word-${word.word}-${index}`} word={word} index={index} />
            ))}
          </div>
        )}

        {/* Pagination - Only show in desktop */}
        {!isMobile && (
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
        )}
      </div>
    </div>
  );
};