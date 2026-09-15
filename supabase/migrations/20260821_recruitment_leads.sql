-- ==============================================================================
-- CARIÑOSAS.TOP — OPERATIVA DE RECLUTAMIENTO (siembra de Machala) + CONSENTIMIENTO
-- ==============================================================================
-- Rastrea el embudo de reclutamiento de modelos (nuevo → contactada → interesada →
-- consentida → perfil creado / declinada) en la propia base, sin hojas sueltas.
-- El consentimiento explícito de contenido (4 puntos de RECLUTAMIENTO-WHATSAPP.md)
-- queda grabado en models.consent_at + models.consent_snapshot al publicar.
-- ==============================================================================

-- 1. TABLA DE LEADS DE RECLUTAMIENTO
CREATE TABLE IF NOT EXISTS public.recruitment_leads (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  whatsapp             text NOT NULL,
  city                 text NOT NULL DEFAULT 'Machala',
  zone                 text,
  status               text NOT NULL DEFAULT 'new'
                       CHECK (status IN ('new','contacted','interested','consented','profile_created','declined')),
  source               text DEFAULT 'whatsapp',
  consent_confirmed_at timestamptz,
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_leads_status ON public.recruitment_leads(status);
CREATE INDEX IF NOT EXISTS idx_recruitment_leads_city ON public.recruitment_leads(city);
CREATE INDEX IF NOT EXISTS idx_recruitment_leads_consent ON public.recruitment_leads(consent_confirmed_at);

-- 2. COLUMNAS DE CONSENTIMIENTO EN MODELS (registro de la confirmación escrita)
ALTER TABLE IF EXISTS public.models
  ADD COLUMN IF NOT EXISTS consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_snapshot text;

ALTER TABLE public.recruitment_leads ENABLE ROW LEVEL SECURITY;

-- Cualquiera (anon) puede registrar un lead (widget público / landing futura).
-- La lectura y manipulación del embudo son exclusivas del operador vía service_role:
-- no se exponen SELECT/UPDATE público; el tracker usa supabaseAdmin (key de servicio).
CREATE POLICY "anon_insert_recruitment_leads" ON public.recruitment_leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "service_role_recruitment_leads_full" ON public.recruitment_leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);