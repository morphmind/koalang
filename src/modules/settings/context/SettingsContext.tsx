import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { settingsReducer } from './settingsReducer';
import { SettingsState, Profile, NotificationPreferences, ThemePreferences, PrivacySettings } from '../types';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth';

interface SettingsContextType extends SettingsState {
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateNotificationPreferences: (data: Partial<NotificationPreferences>) => Promise<void>;
  updateThemePreferences: (data: Partial<ThemePreferences>) => Promise<void>;
  updatePrivacySettings: (data: Partial<PrivacySettings>) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updatePhone: (newPhone: string) => Promise<void>;
}

const initialState: SettingsState = {
  profile: null,
  isLoading: false,
  error: null
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { user } = useAuth();

  // Profil bilgilerini yükle
  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      dispatch({ type: 'FETCH_START' });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      console.error('Profil bilgileri yüklenirken hata:', err);
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: 'Profil bilgileri yüklenirken bir hata oluştu.' 
      });
    }
  }, [user]);

  // Profil güncelleme
  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    if (!user) return;

    try {
      dispatch({ type: 'UPDATE_START' });

      // Avatar URL'i storage'dan al
      let avatarUrl = data.avatar_url;
      if (data.avatar_url && data.avatar_url.startsWith('data:')) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`${user.id}/${Date.now()}`, data.avatar_url);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadData.path);

        avatarUrl = publicUrl;
        data.avatar_url = avatarUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      // Merge the updates with existing profile data
      dispatch({ 
        type: 'UPDATE_SUCCESS', 
        payload: { ...state.profile, ...data }
      });
    } catch (err) {
      console.error('Profil güncellenirken hata:', err);
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Profil güncellenirken bir hata oluştu.' 
      });
      throw err;
    }
  }, [user, state.profile]);

  // Bildirim tercihleri güncelleme
  const updateNotificationPreferences = useCallback(async (data: Partial<NotificationPreferences>) => {
    if (!user || !state.profile) return;

    try {
      dispatch({ type: 'UPDATE_START' });
      
      const updatedPreferences = {
        ...state.profile.notification_preferences,
        ...data
      };

      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: updatedPreferences })
        .eq('id', user.id);

      if (error) throw error;

      dispatch({ 
        type: 'UPDATE_SUCCESS', 
        payload: { notification_preferences: updatedPreferences } 
      });
    } catch (err) {
      console.error('Bildirim tercihleri güncellenirken hata:', err);
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Bildirim tercihleri güncellenirken bir hata oluştu.' 
      });
      throw err;
    }
  }, [user, state.profile]);

  // Tema tercihleri güncelleme
  const updateThemePreferences = useCallback(async (data: Partial<ThemePreferences>) => {
    if (!user || !state.profile) return;

    try {
      dispatch({ type: 'UPDATE_START' });
      
      const updatedPreferences = {
        ...state.profile.theme_preferences,
        ...data
      };

      const { error } = await supabase
        .from('profiles')
        .update({ theme_preferences: updatedPreferences })
        .eq('id', user.id);

      if (error) throw error;

      dispatch({ 
        type: 'UPDATE_SUCCESS', 
        payload: { theme_preferences: updatedPreferences } 
      });
    } catch (err) {
      console.error('Tema tercihleri güncellenirken hata:', err);
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Tema tercihleri güncellenirken bir hata oluştu.' 
      });
      throw err;
    }
  }, [user, state.profile]);

  // Gizlilik ayarları güncelleme
  const updatePrivacySettings = useCallback(async (data: Partial<PrivacySettings>) => {
    if (!user || !state.profile) return;

    try {
      dispatch({ type: 'UPDATE_START' });
      
      const updatedSettings = {
        ...state.profile.privacy_settings,
        ...data
      };

      const { error } = await supabase
        .from('profiles')
        .update({ privacy_settings: updatedSettings })
        .eq('id', user.id);

      if (error) throw error;

      dispatch({ 
        type: 'UPDATE_SUCCESS', 
        payload: { privacy_settings: updatedSettings } 
      });
    } catch (err) {
      console.error('Gizlilik ayarları güncellenirken hata:', err);
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Gizlilik ayarları güncellenirken bir hata oluştu.' 
      });
      throw err;
    }
  }, [user, state.profile]);

  // Email güncelleme
  const updateEmail = useCallback(async (newEmail: string) => {
    if (!user) return;

    try {
      dispatch({ type: 'UPDATE_START' });
      
      const { error } = await supabase.auth.updateUser({ 
        email: newEmail 
      });

      if (error) throw error;

      dispatch({ 
        type: 'UPDATE_SUCCESS', 
        payload: { email: newEmail } 
      });
    } catch (err) {
      console.error('Email güncellenirken hata:', err);
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Email güncellenirken bir hata oluştu.' 
      });
      throw err;
    }
  }, [user]);

  // Şifre güncelleme
  const updatePassword = useCallback(async (newPassword: string) => {
    if (!user) return;

    try {
      dispatch({ type: 'UPDATE_START' });
      
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      dispatch({ type: 'UPDATE_SUCCESS', payload: {} });
    } catch (err) {
      console.error('Şifre güncellenirken hata:', err);
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Şifre güncellenirken bir hata oluştu.' 
      });
      throw err;
    }
  }, [user]);

  // Telefon güncelleme
  const updatePhone = useCallback(async (newPhone: string) => {
    if (!user) return;

    try {
      dispatch({ type: 'UPDATE_START' });
      
      const { error } = await supabase
        .from('profiles')
        .update({ phone: newPhone })
        .eq('id', user.id);

      if (error) throw error;

      dispatch({ 
        type: 'UPDATE_SUCCESS', 
        payload: { phone: newPhone } 
      });
    } catch (err) {
      console.error('Telefon güncellenirken hata:', err);
      dispatch({ 
        type: 'UPDATE_ERROR', 
        payload: 'Telefon güncellenirken bir hata oluştu.' 
      });
      throw err;
    }
  }, [user]);

  // İlk yükleme
  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <SettingsContext.Provider 
      value={{ 
        ...state,
        updateProfile,
        updateNotificationPreferences,
        updateThemePreferences,
        updatePrivacySettings,
        updateEmail,
        updatePassword,
        updatePhone
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};