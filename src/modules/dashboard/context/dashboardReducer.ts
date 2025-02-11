import { DashboardState, DashboardStats } from '../types';

type DashboardAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: DashboardStats }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_STATS'; payload: Partial<DashboardStats> }
  | { type: 'RESET' };

export const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
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
        isLoading: false,
        stats: action.payload,
        error: null
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      };

    case 'RESET':
      return {
        ...state,
        stats: {
          learnedWords: 0,
          totalWords: 3000,
          successRate: 0,
          streak: 0
        },
        isLoading: false,
        error: null
      };

    default:
      return state;
  }
};