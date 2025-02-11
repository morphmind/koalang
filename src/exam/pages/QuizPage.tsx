import React, { useState } from 'react';
import { QuizStart } from '../components/QuizStart';
import { QuizQuestion } from '../components/QuizQuestion';
import { QuizResult } from '../components/QuizResult';
import { QuizTimer } from '../components/QuizTimer';
import { LoadingOverlay, ErrorAlert } from '../../components';
import { useQuiz } from '../context/QuizContext';
import { useQuizNavigation } from '../hooks/useQuizNavigation';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { useAuthPopup } from '../../modules/auth/hooks/useAuthPopup';
import { generateQuestions } from '../utils/questionGenerator';
import { analyzeQuizResult } from '../utils/quizAnalyzer';
import { QuizSettings } from '../types';
import { Word } from '../../data/oxford3000.types';
import { debug } from '../utils/debug';
import { X, Clock, CheckCircle2, XCircle, ChevronRight, BookOpen } from 'lucide-react';

export interface QuizPageContextProps {
  words: Word[];
  learnedWords: {[key: string]: boolean};
}

export const QuizPageContext = React.createContext<QuizPageContextProps | undefined>(undefined);

interface QuizPageProps {
  learnedWordsCount: number;
  words: Word[];
  learnedWords: {[key: string]: boolean};
  onClose: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ 
  learnedWordsCount, 
  words,
  learnedWords,
  onClose 
}) => {
  const { state, dispatch } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { openAuthPopup } = useAuthPopup();
  const { 
    currentQuestion,
    isLastQuestion,
    currentQuestionIndex,
    totalQuestions,
    handleAnswer,
    handleSkip,
    handleNext,
    handlePrevious,
    canNavigateBack
  } = useQuizNavigation();

  const [showResult, setShowResult] = useState(false);

  const handleStart = (settings: QuizSettings) => {
    if (!user) {
      openAuthPopup();
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      debug('Starting quiz', 'info', { settings });
      
      // Kelime havuzunu belirle
      const wordPool = settings.wordPool === 'learned'
        ? words.filter(word => learnedWords[word.word])
        : words;

      // Kelime havuzu boşsa uyarı ver
      if (wordPool.length === 0) {
        setError('Henüz hiç kelime öğrenmediniz. Lütfen önce birkaç kelime öğrenin veya tüm kelimelerden sınav olmayı deneyin.');
        return;
      }
      
      const questions = generateQuestions(wordPool, {
        count: settings.questionCount,
        types: settings.questionTypes,
        difficulty: settings.difficulty
      }, words); // Tüm kelimeleri yanlış şıklar için gönder

      dispatch({
        type: 'START_QUIZ',
        payload: {
          quiz: {
            id: Math.random().toString(36).substring(2),
            userId: 'user123', // TODO: Get from auth
            startedAt: new Date(),
            difficulty: settings.difficulty,
            totalQuestions: questions.length,
            questions,
            status: 'in-progress',
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            skippedQuestions: 0
          },
          settings
        }
      });
    } catch (err) {
      setError('Sınav oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionAnswer = (answer: string, timeSpent: number) => {
    if (!user) {
      openAuthPopup();
      return;
    }

    debug('Question answered', 'info', { answer, isLastQuestion });
    handleAnswer(answer, timeSpent);
    if (isLastQuestion) {
      setTimeout(() => setShowResult(true), 1500);
    }
  };

  const handleRetry = () => {
    debug('Retrying quiz', 'info');
    dispatch({ type: 'RESET_QUIZ' });
    setShowResult(false);
  };

  const handleClose = () => {
    debug('Closing quiz', 'info');
    dispatch({ type: 'RESET_QUIZ' });
    onClose();
  };

  return (
    <QuizPageContext.Provider value={{ words, learnedWords }}>
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex flex-col">
        {isLoading && <LoadingOverlay message="Sınav hazırlanıyor..." fullScreen />}
        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setError(null)}
            action={{
              label: "Tekrar Dene",
              onClick: () => setError(null)
            }}
          />
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 flex items-center justify-center rounded-2xl">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl">
            {/* Enhanced Quiz Header */}
            <div className="relative overflow-hidden">
              <div className="bg-gradient-to-br from-bs-primary via-bs-800 to-bs-navy p-4 sm:p-8 relative z-10 rounded-t-2xl">
                {/* Header Content */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur
                                    text-white/90 text-sm font-medium">
                        Oxford 3000™ Kelime Sınavı
                      </div>
                    </div>
                    
                    {state.currentQuiz ? (
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="text-white text-lg sm:text-2xl font-bold">
                          Soru {state.currentQuestionIndex + 1}
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-white/60">
                          <div className="w-1 h-1 rounded-full bg-white/60" />
                          <span>Toplam {state.currentQuiz.totalQuestions} Soru</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4">
                    {state.currentQuiz?.startedAt && (
                      <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
                        <Clock className="w-4 h-4 text-white/80" />
                        <span className="text-white/90 font-medium">
                          <QuizTimer 
                            startTime={state.currentQuiz.startedAt}
                            isCompleted={showResult || state.currentQuiz.status === 'completed'}
                          />
                        </span>
                      </div>
                    )}
                    <button 
                      onClick={handleClose}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center
                               hover:bg-white/20 transition-colors"
                      aria-label="Kapat"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {state.currentQuiz && (
                  <div className="mt-4 sm:mt-8">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white relative overflow-hidden rounded-r-full transition-all duration-500"
                        style={{ 
                          width: `${((state.currentQuestionIndex + 1) / state.currentQuiz.totalQuestions) * 100}%`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                                      animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-bs-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-bs-navy/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Quiz Content */}
            <div className="p-4 sm:p-8">
              {showResult && state.currentQuiz ? (
                <QuizResult
                  result={analyzeQuizResult(state.currentQuiz, words)}
                  onRetry={handleRetry}
                  onClose={handleClose}
                />
              ) : !state.currentQuiz ? (
                <QuizStart
                  learnedWordsCount={learnedWordsCount}
                  onStart={handleStart}
                />
              ) : currentQuestion && (
                <QuizQuestion
                  question={currentQuestion}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={totalQuestions}
                  isLastQuestion={isLastQuestion}
                  onAnswer={handleQuestionAnswer}
                  onSkip={handleSkip}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  canNavigateBack={canNavigateBack}
                />
              )}
            </div>

            {/* Quiz Footer */}
            {state.currentQuiz && !showResult && (
              <div className="border-t border-gray-100 bg-white">
                <div className="p-3 sm:p-4 relative">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    {/* Stats Pills */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{state.currentQuiz.correctAnswers}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        <span>{state.currentQuiz.wrongAnswers}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                        <ChevronRight className="w-4 h-4" />
                        <span>{state.currentQuiz.skippedQuestions}</span>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="h-8 sm:h-10 px-3 sm:px-4 flex items-center bg-bs-50 rounded-lg text-bs-navy">
                          <span className="text-sm font-medium">
                            {state.currentQuestionIndex + 1}
                          </span>
                          <span className="text-bs-navygri mx-1">/</span>
                          <span className="text-sm text-bs-navygri">
                            {state.currentQuiz.totalQuestions}
                          </span>
                        </div>
                        <div className="h-8 sm:h-10 w-20 sm:w-24 px-3 sm:px-4 bg-bs-50 rounded-lg text-bs-navy flex items-center gap-2">
                          <Clock className="w-4 h-4 text-bs-primary" />
                          <span className="text-sm font-medium">
                            {state.currentQuiz?.startedAt && (
                              <QuizTimer 
                                startTime={state.currentQuiz.startedAt} 
                                isCompleted={showResult || state.currentQuiz.status === 'completed'} 
                              />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 w-full mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-bs-primary to-bs-600 transition-all duration-500 
                             relative overflow-hidden rounded-r-full"
                    style={{ 
                      width: `${((state.currentQuestionIndex + 1) / state.currentQuiz.totalQuestions) * 100}%`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </QuizPageContext.Provider>
  );
};

export default QuizPage;

export { QuizPage }