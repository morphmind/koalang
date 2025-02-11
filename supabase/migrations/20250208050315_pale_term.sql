/*
  # Bildirimler Tablosu

  1. Bildirimler tablosu
    - Sistem, öğrenme ve quiz bildirimleri
    - RLS politikaları
    - İndeksler

  2. Bildirim temizleme
    - Eski bildirimleri temizleme fonksiyonu
    - Cron job
*/

-- Bildirimler tablosu
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('system', 'learning', 'quiz')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

-- RLS aktifleştirme
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Bildirim politikaları
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- İndeksler
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);

-- Bildirim temizleme fonksiyonu
CREATE OR REPLACE FUNCTION clean_old_notifications()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND is_read = true;
END;
$$;

-- Cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Bildirim temizleme cron job'ı
SELECT cron.schedule(
  'clean_old_notifications_job',   -- unique job name
  '0 0 * * *',                    -- daily at midnight
  $$
    SELECT clean_old_notifications();
  $$
);