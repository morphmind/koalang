/*
  # Profil fotoğrafları için storage sistemi

  1. Yeni Tablo
    - `storage_objects` tablosu profil fotoğraflarını saklamak için
    - Dosya adı, boyut, mime type ve binary data
    - Public erişime açık
    - 5MB dosya boyutu limiti
    - Sadece resim dosyaları

  2. Security
    - RLS politikaları ile güvenlik
    - Kullanıcılar kendi fotoğraflarını yönetebilir
    - Herkes fotoğrafları görüntüleyebilir
*/

-- Profil fotoğrafları için tablo
CREATE TABLE IF NOT EXISTS storage_objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket_id text NOT NULL CHECK (bucket_id = 'avatars'),
  size integer NOT NULL CHECK (size <= 5242880), -- 5MB limit
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/gif')),
  data bytea NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(bucket_id, name)
);

-- RLS aktifleştirme
ALTER TABLE storage_objects ENABLE ROW LEVEL SECURITY;

-- Güncelleme tetikleyicisi
CREATE OR REPLACE FUNCTION handle_storage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_storage_updated_at
  BEFORE UPDATE ON storage_objects
  FOR EACH ROW
  EXECUTE FUNCTION handle_storage_updated_at();

-- RLS politikaları
CREATE POLICY "Avatar files are publicly accessible"
  ON storage_objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatar files"
  ON storage_objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    auth.uid() = owner
  );

CREATE POLICY "Users can update own avatar files"
  ON storage_objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can delete own avatar files"
  ON storage_objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- İndeksler
CREATE INDEX IF NOT EXISTS storage_objects_bucket_name_idx ON storage_objects(bucket_id, name);
CREATE INDEX IF NOT EXISTS storage_objects_owner_idx ON storage_objects(owner);

-- Yardımcı fonksiyonlar
CREATE OR REPLACE FUNCTION get_public_url(bucket_id text, name text)
RETURNS text AS $$
BEGIN
  RETURN format('/storage/v1/object/public/%s/%s', bucket_id, name);
END;
$$ LANGUAGE plpgsql;