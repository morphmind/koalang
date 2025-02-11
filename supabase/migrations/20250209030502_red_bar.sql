/*
  # Profil fotoğrafı depolama sistemi düzeltmesi
  
  1. Profil fotoğrafı tablosu oluştur
  2. RLS politikalarını ekle
  3. Yardımcı fonksiyonları ekle
*/

-- Profil fotoğrafı tablosu
CREATE TABLE IF NOT EXISTS avatar_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL CHECK (file_size <= 5242880), -- 5MB limit
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/gif')),
  file_data bytea NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS aktifleştirme
ALTER TABLE avatar_files ENABLE ROW LEVEL SECURITY;

-- RLS politikaları
DO $$ 
BEGIN
  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'avatar_files' AND policyname = 'Avatar files are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar files are publicly accessible"
      ON avatar_files FOR SELECT
      USING (true);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'avatar_files' AND policyname = 'Users can upload own avatar'
  ) THEN
    CREATE POLICY "Users can upload own avatar"
      ON avatar_files FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'avatar_files' AND policyname = 'Users can update own avatar'
  ) THEN
    CREATE POLICY "Users can update own avatar"
      ON avatar_files FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'avatar_files' AND policyname = 'Users can delete own avatar'
  ) THEN
    CREATE POLICY "Users can delete own avatar"
      ON avatar_files FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Güncelleme tetikleyicisi
CREATE OR REPLACE FUNCTION handle_avatar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_avatar_updated_at ON avatar_files;
CREATE TRIGGER set_avatar_updated_at
  BEFORE UPDATE ON avatar_files
  FOR EACH ROW
  EXECUTE FUNCTION handle_avatar_updated_at();

-- İndeksler
CREATE INDEX IF NOT EXISTS avatar_files_user_id_idx ON avatar_files(user_id);

-- Yardımcı fonksiyonlar
CREATE OR REPLACE FUNCTION get_avatar_url(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN format('/storage/v1/avatars/%s', user_id);
END;
$$ LANGUAGE plpgsql;