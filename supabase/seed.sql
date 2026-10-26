-- Local schema compatibility only. No model, contact, verification, or story data is seeded.
-- Add production profiles through the consent and review workflow.

ALTER TABLE public.models ADD COLUMN IF NOT EXISTS personal_note TEXT;
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT 'EC';
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS voice_greeting_url TEXT;
