
import { useState, FormEvent, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAuthPopup } from './useAuthPopup';
import { validateForm } from '../utils/validation';

interface FormErrors {
  [key: string]: string | null;
}

interface FormValues {
  email: string;
  password: string;
  username?: string;
}

export const useAuthForm = (type: 'login' | 'register') => {
  const [values, setValues] = useState<FormValues>({
    email: '',
    password: '',
    ...(type === 'register' ? { username: '' } : {})
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { closeAuthPopup } = useAuthPopup();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (formError) {
      setFormError(null);
    }
  }, [errors, formError]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const validationValues = { [name]: values[name as keyof FormValues] || '' };
    const fieldErrors = validateForm(validationValues);
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
  }, [values]);

  const validateAllFields = useCallback(() => {
    const formErrors = validateForm(values as Record<string, string>);
    setErrors(formErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.values(formErrors).every(error => !error);
  }, [values]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('🟡 Form submit başlatılıyor...', { values, isSubmitting });

    if (isSubmitting) {
      console.log('🔴 Form zaten submit ediliyor');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      if (!validateAllFields()) {
        console.log('🔴 Form validasyonu başarısız');
        setIsSubmitting(false);
        return;
      }

      console.log('🟡 Auth işlemi başlatılıyor...', { type, values });

      if (type === 'login') {
        await login({ 
          email: values.email, 
          password: values.password 
        });
      } else {
        if (!values.username) {
          throw new Error('Kullanıcı adı gerekli');
        }
        await register({ 
          email: values.email, 
          password: values.password, 
          username: values.username 
        });
      }

      console.log('🟢 Auth başarılı, yönlendirme yapılıyor...');
      await handleSuccessfulAuth();

    } catch (err) {
      console.error('🔴 Auth hatası:', err);
      setFormError(err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessfulAuth = async () => {
    try {
      await closeAuthPopup();
      await new Promise(resolve => setTimeout(resolve, 300)); // Biraz bekleyelim
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('🔴 Yönlendirme hatası:', err);
      throw err;
    }
  };

  const getFieldProps = useCallback((name: keyof FormValues) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': touched[name] && errors[name] ? true : false,
    'aria-describedby': errors[name] ? `${name}-error` : undefined
  }), [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    formError,
    handleSubmit,
    getFieldProps
  };
};
