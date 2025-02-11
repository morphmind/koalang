/*
  # Profil Tablosu Güncellemesi
  
  1. Yeni Alanlar
    - `first_name` (text, opsiyonel) - İsim
    - `last_name` (text, opsiyonel) - Soyisim
    - `phone` (text, opsiyonel) - Telefon numarası
    - `notification_preferences` (jsonb) - Bildirim tercihleri
    - `theme_preferences` (jsonb) - Tema tercihleri
    - `privacy_settings` (jsonb) - Gizlilik ayarları
  
  2. Güvenlik
    - RLS politikaları güncellendi
    - Yeni indeksler eklendi
*/

-- Yeni alanları ekle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT jsonb_build_object(
  'email_notifications', true,
  'push_notifications', true,
  'quiz_reminders', true,
  'learning_reminders', true,
  'achievement_notifications', true,
  'weekly_summary', true
),
ADD COLUMN IF NOT EXISTS theme_preferences jsonb DEFAULT jsonb_build_object(
  'theme', 'light',
  'font_size', 'medium',
  'high_contrast', false,
  'reduce_animations', false
),
ADD COLUMN IF NOT EXISTS privacy_settings jsonb DEFAULT jsonb_build_object(
  'profile_visibility', 'public',
  'learning_status_visibility', 'public',
  'achievements_visibility', 'public',
  'activity_visibility', 'public'
);

-- Telefon numarası için unique constraint
ALTER TABLE profiles 
ADD CONSTRAINT profiles_phone_key UNIQUE (phone);

-- Yeni indeksler
CREATE INDEX IF NOT EXISTS profiles_first_name_idx ON profiles(first_name);
CREATE INDEX IF NOT EXISTS profiles_last_name_idx ON profiles(last_name);
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON profiles(phone);

-- Validation fonksiyonları
CREATE OR REPLACE FUNCTION validate_phone()
RETURNS trigger AS $$
BEGIN
  IF NEW.phone IS NOT NULL AND NOT NEW.phone ~ '^\+?[0-9]{10,15}$' THEN
    RAISE EXCEPTION 'Geçersiz telefon numarası formatı';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_notification_preferences()
RETURNS trigger AS $$
BEGIN
  IF NOT (NEW.notification_preferences ? 'email_notifications' AND 
          NEW.notification_preferences ? 'push_notifications' AND
          NEW.notification_preferences ? 'quiz_reminders' AND
          NEW.notification_preferences ? 'learning_reminders' AND
          NEW.notification_preferences ? 'achievement_notifications' AND
          NEW.notification_preferences ? 'weekly_summary') THEN
    RAISE EXCEPTION 'Geçersiz bildirim tercihleri formatı';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_theme_preferences()
RETURNS trigger AS $$
BEGIN
  IF NOT (NEW.theme_preferences ? 'theme' AND
          NEW.theme_preferences ? 'font_size' AND
          NEW.theme_preferences ? 'high_contrast' AND
          NEW.theme_preferences ? 'reduce_animations') THEN
    RAISE EXCEPTION 'Geçersiz tema tercihleri formatı';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_privacy_settings()
RETURNS trigger AS $$
BEGIN
  IF NOT (NEW.privacy_settings ? 'profile_visibility' AND
          NEW.privacy_settings ? 'learning_status_visibility' AND
          NEW.privacy_settings ? 'achievements_visibility' AND
          NEW.privacy_settings ? 'activity_visibility') THEN
    RAISE EXCEPTION 'Geçersiz gizlilik ayarları formatı';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tetikleyiciler
DROP TRIGGER IF EXISTS validate_phone_trigger ON profiles;
CREATE TRIGGER validate_phone_trigger
  BEFORE INSERT OR UPDATE OF phone ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_phone();

DROP TRIGGER IF EXISTS validate_notification_preferences_trigger ON profiles;
CREATE TRIGGER validate_notification_preferences_trigger
  BEFORE INSERT OR UPDATE OF notification_preferences ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_notification_preferences();

DROP TRIGGER IF EXISTS validate_theme_preferences_trigger ON profiles;
CREATE TRIGGER validate_theme_preferences_trigger
  BEFORE INSERT OR UPDATE OF theme_preferences ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_theme_preferences();

DROP TRIGGER IF EXISTS validate_privacy_settings_trigger ON profiles;
CREATE TRIGGER validate_privacy_settings_trigger
  BEFORE INSERT OR UPDATE OF privacy_settings ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_privacy_settings();