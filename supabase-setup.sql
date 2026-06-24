-- Run this once in your Supabase project's SQL Editor

CREATE TABLE IF NOT EXISTS plan (
  id           text        PRIMARY KEY DEFAULT 'default',
  marathon_date date,
  start_date   date,
  active_week  integer     DEFAULT 1,
  is_dark      boolean     DEFAULT false,
  weeks        jsonb       DEFAULT '[]'::jsonb,
  updated_at   timestamptz DEFAULT now()
);

-- Seed the default row so upserts always work
INSERT INTO plan (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE plan ENABLE ROW LEVEL SECURITY;

-- Allow full public access (single-user personal app, no auth needed)
CREATE POLICY "public access" ON plan FOR ALL USING (true) WITH CHECK (true);
