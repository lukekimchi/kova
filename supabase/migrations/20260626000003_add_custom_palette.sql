ALTER TABLE plan ADD COLUMN IF NOT EXISTS custom_palette jsonb DEFAULT '{}'::jsonb;
