import React, { createContext, useContext, useReducer } from 'react';
import { Quiz, QuizSettings } from '../types';

interface QuizState {
  currentQuiz: Quiz | null;
  settings: QuizSettings | null;
  currentQuestionIndex: number;
}

type QuizAction =
  | { type: 'START_QUIZ'; payload: { quiz: Quiz; settings: QuizSettings } }
  | { type: 'ANSWER_QUESTION'; payload: { answer: string; isCorrect: boolean; timeSpent: number } }
  | { type: 'SKIP_QUESTION' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'END_QUIZ' }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  currentQuiz: null,
  settings: null,
  currentQuestionIndex: 0
};

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | undefined>(undefined);

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        currentQuiz: action.payload.quiz,
        settings: action.payload.settings,
        currentQuestionIndex: 0
      };

    case 'ANSWER_QUESTION': {
      if (!state.currentQuiz) return state;
      
      const currentQuestion = state.currentQuiz.questions[state.currentQuestionIndex];
      if (currentQuestion.userAnswer !== undefined) {
        return state;
      }

      const correctCount = state.currentQuiz.questions.filter(q => q.isCorrect === true).length;
      const wrongCount = state.currentQuiz.questions.filter(q => q.isCorrect === false).length;

      const updatedQuestions = state.currentQuiz.questions.map((q, idx) => {
        if (idx === state.currentQuestionIndex) {
          return {
            ...q,
            userAnswer: action.payload.answer,
            isCorrect: action.payload.isCorrect,
            timeSpent: action.payload.timeSpent
          };
        }
        return q;
      });

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: updatedQuestions,
          correctAnswers: correctCount + (action.payload.isCorrect ? 1 : 0),
          wrongAnswers: wrongCount + (!action.payload.isCorrect ? 1 : 0)
        }
      };
    }

    case 'SKIP_QUESTION':
      if (!state.currentQuiz) return state;

      const skippedQuestions = state.currentQuiz.questions.map((q, idx) => {
        if (idx === state.currentQuestionIndex) {
          return { ...q, isSkipped: true };
        }
        return q;
      });

      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: skippedQuestions,
          skippedQuestions: state.currentQuiz.skippedQuestions + 1
        }
      };

    case 'NEXT_QUESTION':
      if (!state.currentQuiz) return state;
      
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      };

    case 'PREVIOUS_QUESTION':
      if (!state.currentQuiz || state.currentQuestionIndex === 0) return state;
      
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1
      };

    case 'END_QUIZ':
      if (!state.currentQuiz) return state;
      
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          status: 'completed',
          completedAt: new Date()
        }
      };

    case 'RESET_QUIZ':
      return initialState;

    default:
      return state;
  }
}

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};