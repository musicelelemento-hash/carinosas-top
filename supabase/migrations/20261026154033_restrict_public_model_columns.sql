-- Keep public profile discovery available while withholding account linkage,
-- consent records, and precise coordinates from the public Data API.
REVOKE SELECT ON TABLE public.models FROM PUBLIC, anon, authenticated;

GRANT SELECT (
  id,
  name,
  age,
  city,
  sector,
  whatsapp,
  description,
  tags,
  images,
  voice_greeting_url,
  plan_type,
  is_verified,
  is_verified_4k,
  is_online,
  is_boosted,
  hourly_rate,
  created_at,
  updated_at,
  country_code,
  is_phone_verified,
  touring_cities,
  personal_note
) ON TABLE public.models TO anon, authenticated;

-- These reserved IDs belong to the former stock-photo demo seed. Remove any
-- verification, online, and boost claims from existing demo rows without
-- deleting records from a database that may already contain them.
UPDATE public.models
SET is_verified = FALSE,
    is_verified_4k = FALSE,
    is_online = FALSE,
    is_boosted = FALSE
WHERE id::text LIKE 'a1000000-0000-0000-0000-0000000000%';

-- A public client must not be able to manufacture a "verified booking" review.
-- Reviews are written through the server action after checking a completed booking.
ALTER TABLE public.vip_reviews
  ALTER COLUMN is_verified_booking SET DEFAULT FALSE;

DROP POLICY IF EXISTS "Public reviews insert" ON public.vip_reviews;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.vip_reviews FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.vip_reviews TO anon, authenticated;
