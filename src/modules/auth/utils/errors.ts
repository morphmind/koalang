// Auth error types
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_IN_USE = 'EMAIL_IN_USE',
  USERNAME_IN_USE = 'USERNAME_IN_USE',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_USERNAME = 'INVALID_USERNAME',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Error messages
export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, string> = {
  [AuthErrorType.INVALID_CREDENTIALS]: 'E-posta veya şifre hatalı.',
  [AuthErrorType.NETWORK_ERROR]: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
  [AuthErrorType.USER_NOT_FOUND]: 'Kullanıcı bulunamadı.',
  [AuthErrorType.EMAIL_IN_USE]: 'Bu e-posta adresi zaten kullanımda.',
  [AuthErrorType.USERNAME_IN_USE]: 'Bu kullanıcı adı zaten kullanımda.',
  [AuthErrorType.WEAK_PASSWORD]: 'Şifre yeterince güçlü değil.',
  [AuthErrorType.INVALID_EMAIL]: 'Geçersiz e-posta adresi.',
  [AuthErrorType.INVALID_USERNAME]: 'Geçersiz kullanıcı adı.',
  [AuthErrorType.UNAUTHORIZED]: 'Bu işlem için yetkiniz yok.',
  [AuthErrorType.SERVER_ERROR]: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  [AuthErrorType.UNKNOWN_ERROR]: 'Bilinmeyen bir hata oluştu.'
};

// Custom auth error class
export class AuthError extends Error {
  constructor(
    public type: AuthErrorType,
    public originalError?: any
  ) {
    super(AUTH_ERROR_MESSAGES[type]);
    this.name = 'AuthError';
  }
}

// Error handler function
export const handleAuthError = (error: any): AuthError => {
  // Supabase error handling
  if (error?.message?.toLowerCase().includes('invalid login credentials')) {
    return new AuthError(AuthErrorType.INVALID_CREDENTIALS, 'Email veya şifre hatalı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
  }
  
  if (error?.message?.toLowerCase().includes('user not found')) {
    return new AuthError(AuthErrorType.USER_NOT_FOUND, 'Bu email adresiyle kayıtlı bir kullanıcı bulunamadı.');
  }
  
  if (error?.message?.toLowerCase().includes('email already in use')) {
    return new AuthError(AuthErrorType.EMAIL_IN_USE, 'Bu email adresi zaten kullanılıyor. Lütfen başka bir email adresi deneyin.');
  }
  
  if (error?.message?.toLowerCase().includes('username already exists')) {
    return new AuthError(AuthErrorType.USERNAME_IN_USE, 'Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı deneyin.');
  }

  // Network error
  if (error?.message?.includes('Network Error') || !navigator.onLine) {
    return new AuthError(AuthErrorType.NETWORK_ERROR, 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.');
  }

  // Server error
  if (error?.status >= 500) {
    return new AuthError(AuthErrorType.SERVER_ERROR, 'Sunucu kaynaklı bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }

  // Unauthorized
  if (error?.status === 401) {
    return new AuthError(AuthErrorType.UNAUTHORIZED, 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.');
  }

  // Default to unknown error
  return new AuthError(AuthErrorType.UNKNOWN_ERROR, 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.');
};