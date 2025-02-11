// Local storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me'
} as const;

export const storage = {
  // Auth token
  getAuthToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setAuthToken: (token: string) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeAuthToken: () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),

  // User data
  getUserData: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  setUserData: (data: any) => localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data)),
  removeUserData: () => localStorage.removeItem(STORAGE_KEYS.USER_DATA),

  // Remember me
  getRememberMe: () => localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true',
  setRememberMe: (value: boolean) => localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(value)),
  removeRememberMe: () => localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME),

  // Clear all auth related data
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }
};