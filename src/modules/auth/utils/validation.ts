// Email validation with detailed error messages
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'E-posta adresi gereklidir';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Geçerli bir e-posta adresi giriniz';
  }

  return null;
};

// Password validation with detailed error messages
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Şifre gereklidir';
  }

  if (password.length < 8) {
    return 'Şifre en az 8 karakter olmalıdır';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Şifre en az bir büyük harf içermelidir';
  }

  if (!/[a-z]/.test(password)) {
    return 'Şifre en az bir küçük harf içermelidir';
  }

  if (!/[0-9]/.test(password)) {
    return 'Şifre en az bir rakam içermelidir';
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Şifre en az bir özel karakter içermelidir';
  }

  return null;
};

// Username validation with detailed error messages
export const validateUsername = (username: string): string | null => {
  if (!username) {
    return 'Kullanıcı adı gereklidir';
  }

  if (username.length < 3) {
    return 'Kullanıcı adı en az 3 karakter olmalıdır';
  }

  if (username.length > 20) {
    return 'Kullanıcı adı en fazla 20 karakter olmalıdır';
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir';
  }

  return null;
};

// Form validation helper
export const validateForm = (values: { [key: string]: string }): { [key: string]: string | null } => {
  const errors: { [key: string]: string | null } = {};

  // Email validation
  if ('email' in values) {
    errors.email = validateEmail(values.email);
  }

  // Password validation
  if ('password' in values) {
    errors.password = validatePassword(values.password);
  }

  // Username validation
  if ('username' in values) {
    errors.username = validateUsername(values.username);
  }

  return errors;
};