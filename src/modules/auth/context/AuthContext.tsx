import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AuthState, AuthContextType, LoginCredentials, RegisterCredentials } from '../types';
import { authReducer } from './authReducer';
import { supabase } from '../../../lib/supabase';
import { AuthError, AuthErrorType } from '../utils/errors';

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      console.log('🔵 Login başlatılıyor...', { email: credentials.email });
      dispatch({ type: 'AUTH_START' });

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        console.error('🔴 Auth hatası:', authError);
        throw new AuthError(AuthErrorType.INVALID_CREDENTIALS);
      }

      if (!authData.user) {
        console.error('🔴 Kullanıcı verisi bulunamadı');
        throw new AuthError(AuthErrorType.USER_NOT_FOUND);
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('🔴 Profil bilgileri alınamadı:', profileError);
        throw new AuthError(AuthErrorType.USER_NOT_FOUND);
      }

      console.log('🟢 Giriş başarılı, state güncelleniyor...', { profile });
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          id: authData.user.id,
          email: authData.user.email!,
          username: profile.username,
          avatar: profile.avatar_url,
          createdAt: new Date(authData.user.created_at),
          updatedAt: profile.updated_at ? new Date(profile.updated_at) : new Date(),
        },
      });

    } catch (error) {
      console.error('🔴 Login hatası:', error);
      const errorMessage = error instanceof AuthError ? error.message : 'Giriş yapılırken bir hata oluştu.';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            username: credentials.username,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new AuthError(AuthErrorType.EMAIL_IN_USE);
        }
        throw authError;
      }

      if (!authData.user) {
        throw new AuthError(AuthErrorType.SERVER_ERROR);
      }

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          username: credentials.username,
          email: credentials.email,
          avatar_url: null,
        },
      ]);

      if (profileError) {
        if (profileError.message.includes('username')) {
          throw new AuthError(AuthErrorType.USERNAME_IN_USE);
        }
        throw new AuthError(AuthErrorType.SERVER_ERROR);
      }

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          id: authData.user.id,
          email: authData.user.email!,
          username: credentials.username,
          createdAt: new Date(authData.user.created_at),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error instanceof AuthError ? error.message : 'Kayıt olurken bir hata oluştu.';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: 'Çıkış yapılırken bir hata oluştu.' });
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      dispatch({ type: 'AUTH_SUCCESS', payload: null });
    } catch (error) {
      console.error('Reset password error:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: 'Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu.' });
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        dispatch({ type: 'AUTH_START' });
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile error:', profileError);
            dispatch({ type: 'AUTH_FAILURE', payload: 'Profil bilgileri alınamadı.' });
            return;
          }

          if (!mounted) return;

          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              id: session.user.id,
              email: session.user.email!,
              username: profile.username,
              avatar: profile.avatar_url,
              createdAt: new Date(session.user.created_at),
              updatedAt: profile.updated_at ? new Date(profile.updated_at) : new Date(),
            },
          });
        } else {
          if (!mounted) return;
          dispatch({ type: 'AUTH_START' });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (!mounted) return;
        dispatch({ type: 'AUTH_FAILURE', payload: 'Oturum kontrolü sırasında bir hata oluştu.' });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
