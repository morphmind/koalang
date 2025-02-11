import { SettingsState, Profile } from '../types';

type SettingsAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Profile }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_START' }
  | { type: 'UPDATE_SUCCESS'; payload: Partial<Profile> }
  | { type: 'UPDATE_ERROR'; payload: string };

export const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
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
        profile: action.payload,
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
        isLoading: true,
        error: null
      };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          ...action.payload
        } : null,
        isLoading: false,
        error: null
      };

    case 'UPDATE_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
};