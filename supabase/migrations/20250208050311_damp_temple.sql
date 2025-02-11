/*
  # Quiz Sonuçları Tablosu

  1. Quiz sonuçları tablosu
    - Sınav istatistikleri
    - RLS politikaları
    - İndeksler
*/

-- Quiz sonuçları tablosu
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  wrong_answers integer NOT NULL,
  skipped_questions integer NOT NULL,
  time_spent integer NOT NULL,
  difficulty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS aktifleştirme
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Quiz sonuçları politikaları
CREATE POLICY "Users can read own quiz results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz results"
  ON quiz_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- İndeksler
CREATE INDEX IF NOT EXISTS quiz_results_user_id_idx ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS quiz_results_created_at_idx ON quiz_results(created_at DESC);