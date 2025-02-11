/*
  # Kullanıcı İlerleme Tablosu

  1. İlerleme tablosu
    - Kelime öğrenme durumu
    - Son tekrar tarihi
    - RLS politikaları
    - Tetikleyiciler
    - İndeksler
*/

-- İlerleme tablosu
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  word text NOT NULL,
  learned boolean DEFAULT false,
  last_reviewed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, word)
);

-- RLS aktifleştirme
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Tetikleyiciler
CREATE TRIGGER set_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- İlerleme politikaları
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- İndeksler
CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS user_progress_word_idx ON user_progress(word);
CREATE INDEX IF NOT EXISTS user_progress_learned_idx ON user_progress(learned);