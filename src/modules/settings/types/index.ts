export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  notification_preferences: NotificationPreferences;
  theme_preferences: ThemePreferences;
  privacy_settings: PrivacySettings;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  quiz_reminders: boolean;
  learning_reminders: boolean;
  achievement_notifications: boolean;
  weekly_summary: boolean;
}

export interface ThemePreferences {
  theme: 'light' | 'dark';
  font_size: 'small' | 'medium' | 'large';
  high_contrast: boolean;
  reduce_animations: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  learning_status_visibility: 'public' | 'private' | 'friends';
  achievements_visibility: 'public' | 'private' | 'friends';
  activity_visibility: 'public' | 'private' | 'friends';
}

export interface SettingsState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}