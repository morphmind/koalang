import { supabase } from '../../../lib/supabase';
import { LoginCredentials, RegisterCredentials } from '../types';
import { handleAuthError } from '../utils/errors';

export const authAPI = {
  login: async ({ email, password }: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('User not found');
      }

      return data;
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  register: async ({ email, password, username }: RegisterCredentials) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Bu email adresi zaten kullanılıyor.');
        }
        throw new Error('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
      }

      // Kullanıcı profili oluştur
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username,
              email,
              avatar_url: null,
            },
          ]);

        if (profileError) {
          if (profileError.message.includes('username')) {
            throw new Error('Bu kullanıcı adı zaten kullanılıyor.');
          }
          throw new Error('Profil oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      }

      return authData;
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      throw handleAuthError(error);
    }
  },

  updateProfile: async (userId: string, updates: { username?: string; avatar_url?: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      throw handleAuthError(error);
    }
  },
};
