import { useCallback } from 'react';
import { useQuiz } from '../context/QuizContext';

export const useQuizNavigation = () => {
  const { state, dispatch } = useQuiz();

  const canNavigateBack = useCallback(() => {
    if (!state.currentQuiz) return false;
    return state.currentQuestionIndex > 0;
  }, [state.currentQuiz, state.currentQuestionIndex]);

  const handleAnswer = useCallback((answer: string, timeSpent: number) => {
    if (!state.currentQuiz) return;

    const currentQuestion = state.currentQuiz.questions[state.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { answer, isCorrect, timeSpent }
    });
  }, [state.currentQuiz, state.currentQuestionIndex, dispatch]);

  const handleSkip = useCallback(() => {
    dispatch({ type: 'SKIP_QUESTION' });
    dispatch({ type: 'NEXT_QUESTION' });
  }, [dispatch]);

  const handleNext = useCallback(() => {
    if (!state.currentQuiz) return;

    if (state.currentQuestionIndex === state.currentQuiz.questions.length - 1) {
      dispatch({ type: 'END_QUIZ' });
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }, [state.currentQuiz, state.currentQuestionIndex, dispatch]);

  const handlePrevious = useCallback(() => {
    if (!state.currentQuiz || state.currentQuestionIndex === 0) return;
    dispatch({ type: 'PREVIOUS_QUESTION' });
  }, [state.currentQuiz, state.currentQuestionIndex, dispatch]);

  return {
    currentQuestion: state.currentQuiz?.questions[state.currentQuestionIndex],
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: state.currentQuiz?.totalQuestions || 0,
    isLastQuestion: state.currentQuiz 
      ? state.currentQuestionIndex === state.currentQuiz.questions.length - 1 
      : false,
    isAnswering: state.isAnswering,
    handleAnswer,
    handleSkip,
    handleNext,
    handlePrevious,
    canNavigateBack: canNavigateBack()
  };
};