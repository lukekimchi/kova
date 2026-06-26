ALTER TABLE plan ADD COLUMN IF NOT EXISTS weight_tracking boolean DEFAULT false;
ALTER TABLE plan ADD COLUMN IF NOT EXISTS weights jsonb DEFAULT '{}'::jsonb;
