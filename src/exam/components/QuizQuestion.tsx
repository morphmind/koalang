import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType } from '../types';
import { LoadingOverlay, ErrorAlert } from '../../components';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { QuizTimer } from './QuizTimer';

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentQuestionIndex: number;
  totalQuestions: number;
  isLastQuestion: boolean;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canNavigateBack: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  isLastQuestion,
  onAnswer,
  onSkip,
  onNext,
  onPrevious,
  canNavigateBack,
}) => {
  const { state } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime] = useState(Date.now());

  const isCorrectAnswer = useCallback(
    (answer: string) => answer === question.correctAnswer,
    [question.correctAnswer]
  );

  const isWrongAnswer = useCallback(
    (answer: string) => selectedAnswer === answer && !isCorrectAnswer(answer),
    [selectedAnswer, isCorrectAnswer]
  );

  // Soru değiştiğinde state'leri sıfırla
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswered(false);
    setIsProcessing(false);
  }, [question.id]);

  const handleAnswerSelect = useCallback(
    async (answer: string) => {
      if (answered || isProcessing) return;
      setIsLoading(true);
      setError(null);

      try {
        setIsProcessing(true);
        setSelectedAnswer(answer);
        setAnswered(true);
        setShowExplanation(isCorrectAnswer(answer) ? false : true);

        // Süreyi hesapla
        const timeSpent = Date.now() - startTime;

        setTimeout(() => {
          onAnswer(answer, timeSpent);
          setIsProcessing(false);
          // Doğru cevapsa otomatik olarak sonraki soruya geç
          if (isCorrectAnswer(answer)) {
            setTimeout(() => onNext(), 500);
          }
        }, 100);
      } catch (err) {
        setError('Cevabınız kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setIsLoading(false);
        setIsProcessing(false);
      }
    },
    [answered, isProcessing, isCorrectAnswer, onAnswer, onNext, startTime]
  );

  const getOptionClassName = useCallback(
    (answer: string) => {
      let className =
        'p-4 border rounded-xl transition-all flex justify-between items-center ';
      if (!answered) {
        className += 'cursor-pointer hover:border-bs-primary hover:bg-bs-50';
      } else if (isCorrectAnswer(answer)) {
        className += 'border-green-500 bg-green-50 text-green-700';
      } else if (isWrongAnswer(answer)) {
        className += 'border-red-500 bg-red-50 text-red-700';
      } else {
        className += 'opacity-50 cursor-not-allowed';
      }
      return className;
    },
    [answered, isCorrectAnswer, isWrongAnswer]
  );

  const handlePronunciation = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(question.wordId);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [question.wordId]);

  // Soru tipinin etiketini belirle (nested ternary yerine if/else kullanıldı)
  const questionTypeLabel = (() => {
    if (question.type === 'multiple-choice') {
      return 'Çoktan Seçmeli';
    } else if (question.type === 'sentence-completion') {
      return 'Cümle Tamamlama';
    } else if (question.type === 'pronunciation') {
      return 'Telaffuz';
    } else {
      return 'Örnek Eşleştirme';
    }
  })();

  const questionContent = (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bs-50 text-bs-primary text-sm font-medium">
            {questionTypeLabel}
          </span>
        </div>
        {question.type === 'pronunciation' && (
          <button
            onClick={handlePronunciation}
            className="flex items-center gap-2 px-4 py-2 text-bs-primary hover:bg-bs-50 rounded-lg transition-colors"
            type="button"
          >
            <Volume2 size={20} />
            <span>Dinle</span>
          </button>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-bs-navy mb-8">
          {question.question}
        </h3>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={`${question.id}-${index}`}
              onClick={() => !answered && handleAnswerSelect(option)}
              className={getOptionClassName(option)}
              disabled={answered}
              type="button"
              style={{ width: '100%', textAlign: 'left' }}
            >
              <span className="flex-1">{option}</span>
              {answered && (
                isCorrectAnswer(option) ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  isWrongAnswer(option) ? (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  ) : null
                )
              )}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-bs-navygri">{question.explanation}</p>
        </div>
      )}
    </>
  );

  return (
    <div className="flex flex-col h-full">
      {isLoading && <LoadingOverlay message="Cevabınız kaydediliyor..." />}
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
      <div className="flex-1 space-y-8">{questionContent}</div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center gap-3">
          {canNavigateBack && (
            <button
              onClick={onPrevious}
              className="px-4 py-2 text-bs-primary hover:bg-bs-50 rounded-lg transition-colors 
                       flex items-center gap-2 border border-bs-100"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki</span>
            </button>
          )}
          {!answered && !isLastQuestion && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-bs-navygri hover:text-bs-primary hover:bg-bs-50 
                       rounded-lg transition-colors border border-gray-100"
              type="button"
            >
              Soruyu Geç
            </button>
          )}
        </div>
        {answered && !isCorrectAnswer(selectedAnswer || '') && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-bs-primary text-white rounded-xl 
                     hover:bg-bs-800 transition-colors shadow-lg shadow-bs-primary/20"
            type="button"
          >
            <span>{isLastQuestion ? 'Sonuçları Gör' : 'Sonraki Soru'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};