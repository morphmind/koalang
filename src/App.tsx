
import React from 'react';
import { useAuth } from './modules/auth';
import { Header } from './components';
import { HeroSection } from './components/HeroSection';
import { CTASection } from './components/CTASection';
import { QuizPage } from './exam/pages/QuizPage';
import { Word } from './data/oxford3000.types';
import { LoadingOverlay, ErrorAlert } from './components';
import { ContentSection } from './components/ContentSection';
import { useWords } from './modules/words/context/WordContext';
import { AuthPopup } from './modules/auth/components/AuthPopup';
import { useAuthPopup } from './modules/auth/hooks/useAuthPopup';
import { Footer } from './components/Footer';
import { LegalPopupProvider } from './context/LegalPopupContext';

// Import all word data from correct path
import { 
  oxford3000a,
  oxford3000b,
  oxford3000b2,
  oxford3000c,
  oxford3000d,
  oxford3000e,
  oxford3000f,
  oxford3000g,
  oxford3000h,
  oxford3000i,
  oxford3000j,
  oxford3000k,
  oxford3000l,
  oxford3000m,
  oxford3000n,
  oxford3000o,
  oxford3000p,
  oxford3000q,
  oxford3000r,
  oxford3000s, 
  oxford3000t,
  oxford3000u,
  oxford3000v,
  oxford3000w,
  oxford3000y,
  oxford3000z
} from './data/oxford3000';

function App() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeLevel, setActiveLevel] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showLearned, setShowLearned] = React.useState(false);
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { 
    learnedWords,
    isLoading,
    error: wordsError,
    toggleWordLearned,
    getLearnedWordsCount
  } = useWords();

  const { isOpen, closeAuthPopup } = useAuthPopup();

  const wordsPerPage = 12;
  const words: Word[] = [
    ...oxford3000a,
    ...oxford3000b,
    ...oxford3000b2,
    ...oxford3000c,
    ...oxford3000d,
    ...oxford3000e,
    ...oxford3000f,
    ...oxford3000g,
    ...oxford3000h,
    ...oxford3000i,
    ...oxford3000j,
    ...oxford3000k,
    ...oxford3000l,
    ...oxford3000m,
    ...oxford3000n,
    ...oxford3000o,
    ...oxford3000p,
    ...oxford3000q,
    ...oxford3000r,
    ...oxford3000s,
    ...oxford3000t,
    ...oxford3000u,
    ...oxford3000v,
    ...oxford3000w,
    ...oxford3000y,
    ...oxford3000z
  ];

  // Calculate total and learned words
  const totalWords = words.length;
  const learnedWordsCount = getLearnedWordsCount();
  const learningProgress = (learnedWordsCount / totalWords) * 100;

  // Handle text-to-speech
  const speak = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setError('Telaffuz özelliği şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
    }
  };

  // Filter words based on search and level
  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = activeLevel === 'all' || word.level.toLowerCase() === activeLevel;
    const matchesLearned = !showLearned || learnedWords[word.word];
    return matchesSearch && matchesLevel && matchesLearned;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);
  const startIndex = (currentPage - 1) * wordsPerPage;
  const displayedWords = filteredWords.slice(startIndex, startIndex + wordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Filtrelerin olduğu kısma scroll yap
    const filtersContainer = document.querySelector('.level-filters-container');
    if (filtersContainer) {
      filtersContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <LegalPopupProvider>
      <div className="min-h-screen bg-gray-100">
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showLearned={showLearned}
          setShowLearned={setShowLearned}
          setShowQuiz={setShowQuiz}
        />
        {isLoading && <LoadingOverlay message="İşleminiz gerçekleştiriliyor..." />}
        {(error || wordsError) && (
          <ErrorAlert
            message={error || wordsError || 'Bir hata oluştu'}
            onClose={() => setError(null)}
            action={{
              label: "Tekrar Dene",
              onClick: () => setError(null)
            }}
          />
        )}
        <main>
          {showQuiz ? (
            <QuizPage
              learnedWordsCount={learnedWordsCount}
              words={words}
              learnedWords={learnedWords}
              onClose={() => setShowQuiz(false)}
            />
          ) : (
            <div className="oxford-container">
              <HeroSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showLearned={showLearned}
                setShowLearned={setShowLearned}
                setShowQuiz={setShowQuiz}
                learnedWordsCount={learnedWordsCount}
                totalWords={totalWords}
                learningProgress={learningProgress}
              />
              <ContentSection
                words={words}
                activeLevel={activeLevel}
                setActiveLevel={setActiveLevel}
                displayedWords={displayedWords}
                showLearned={showLearned}
                setShowLearned={setShowLearned}
                learnedWords={learnedWords}
                toggleLearned={toggleWordLearned}
                speak={speak}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
              <CTASection />
            </div>
          )}
        </main>
        <Footer />
        <AuthPopup isOpen={isOpen} onClose={closeAuthPopup} />
      </div>
    </LegalPopupProvider>
  );
}

export default App;
