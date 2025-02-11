-- İlerleme tablosu
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  word text NOT NULL,
  learned boolean DEFAULT false,
  last_reviewed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint ekle
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_progress_user_id_word_key'
  ) THEN
    ALTER TABLE user_progress 
    ADD CONSTRAINT user_progress_user_id_word_key UNIQUE(user_id, word);
  END IF;
END $$;

-- RLS aktifleştirme
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- İndeksler
CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS user_progress_word_idx ON user_progress(word);
CREATE INDEX IF NOT EXISTS user_progress_learned_idx ON user_progress(learned);