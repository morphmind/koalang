/*
  # Storage bucket düzeltmesi
  
  1. Bucket oluştur
  2. Bucket ayarlarını yap
  3. RLS politikalarını ekle
*/

-- Bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Bucket ayarları
UPDATE storage.buckets
SET file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']
WHERE id = 'profiles';

-- RLS politikaları
DO $$ 
BEGIN
  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Profile files are publicly accessible'
  ) THEN
    CREATE POLICY "Profile files are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'profiles');
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can upload own profile files'
  ) THEN
    CREATE POLICY "Users can upload own profile files" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'profiles' AND
        auth.role() = 'authenticated' AND
        owner = auth.uid()
      );
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can update own profile files'
  ) THEN
    CREATE POLICY "Users can update own profile files" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'profiles' AND
        owner = auth.uid()
      );
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can delete own profile files'
  ) THEN
    CREATE POLICY "Users can delete own profile files" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'profiles' AND
        owner = auth.uid()
      );
  END IF;
END $$;