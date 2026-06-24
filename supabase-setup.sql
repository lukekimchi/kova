-- Run this in your Supabase project's SQL Editor.
-- Passwords are stored encrypted (bcrypt) by Supabase Auth in auth.users automatically.
-- This file sets up the public tables your app reads/writes.

-- ── Profiles ────────────────────────────────────────────────────────────────
-- One row per registered user, auto-created on signup via trigger.

DROP TABLE IF EXISTS plan;
DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile" ON profiles
  FOR ALL
  USING      (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: insert a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Plan ─────────────────────────────────────────────────────────────────────
-- One training plan row per user.

CREATE TABLE plan (
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
