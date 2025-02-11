/*
  # User Progress Table Fixes

  1. Changes
    - Add unique constraint for user_id and word
    - Add indexes for performance
    - Add RLS policies if not exist
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

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

-- Politikaları kontrol et ve ekle
DO $$ 
BEGIN
  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' AND policyname = 'Users can read own progress'
  ) THEN
    CREATE POLICY "Users can read own progress"
      ON user_progress FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' AND policyname = 'Users can insert own progress'
  ) THEN
    CREATE POLICY "Users can insert own progress"
      ON user_progress FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' AND policyname = 'Users can update own progress'
  ) THEN
    CREATE POLICY "Users can update own progress"
      ON user_progress FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' AND policyname = 'Users can delete own progress'
  ) THEN
    CREATE POLICY "Users can delete own progress"
      ON user_progress FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- İndeksler
CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS user_progress_word_idx ON user_progress(word);
CREATE INDEX IF NOT EXISTS user_progress_learned_idx ON user_progress(learned);
CREATE INDEX IF NOT EXISTS user_progress_last_reviewed_idx ON user_progress(last_reviewed);