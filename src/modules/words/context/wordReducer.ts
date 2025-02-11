import { WordState } from '../types';

type WordAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { [key: string]: boolean } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_START' }
  | { type: 'UPDATE_SUCCESS'; payload: { word: string; isLearned: boolean } }
  | { type: 'UPDATE_WORD'; payload: { word: string; isLearned: boolean; isLoading: boolean } }
  | { type: 'UPDATE_ERROR'; payload: string };

export const wordReducer = (state: WordState, action: WordAction): WordState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        learnedWords: action.payload,
        isLoading: false,
        error: null
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'UPDATE_START':
      return {
        ...state,
        error: null
      };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        learnedWords: {
          ...state.learnedWords,
          [action.payload.word]: action.payload.isLearned
        },
        error: null
      };

    case 'UPDATE_WORD':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        learnedWords: {
          ...state.learnedWords,
          [action.payload.word]: action.payload.isLearned
        }
      };

    case 'UPDATE_ERROR':
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};