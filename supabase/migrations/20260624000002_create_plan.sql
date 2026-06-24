CREATE TABLE IF NOT EXISTS plan (
  user_id       uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  marathon_date date,
  start_date    date,
  active_week   integer     DEFAULT 1,
  is_dark       boolean     DEFAULT false,
  weeks         jsonb       DEFAULT '[]'::jsonb,
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own plan" ON plan
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
