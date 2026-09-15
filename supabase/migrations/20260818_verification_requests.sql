-- ==============================================================================
-- CARIÑOSAS.TOP — VERIFICATION 4K REAL PIPELINE (P0)
-- ==============================================================================
-- Reemplaza la "verificación 4K" simulada por un flujo real:
--   1. La modelo sube una selfie en vivo + un "gesto del día" (Supabase Storage o UploadThing).
--   2. Se crea una solicitud con estado 'pending'.
--   3. Un revisor humano (admin) la aprueba → se activa `models.is_verified_4k = true`
--      y la solicitud pasa a 'approved'; o la rechaza → 'rejected'.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id    uuid REFERENCES public.models(id) ON DELETE CASCADE,
  phone       text,
  selfie_url  text,
  gesture_url text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text
);

CREATE INDEX IF NOT EXISTS idx_verification_status ON public.verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_model ON public.verification_requests(model_id);

-- RLS activa
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Anónimo puede crear solicitudes (envío del dispositivo).
CREATE POLICY "anon_insert_verification" ON public.verification_requests
  FOR INSERT TO anon WITH CHECK (true);

-- El revisor (service_role via supabaseAdmin) gestiona sin RLS al usar la key de servicio.
-- No se exponen SELECT/UPDATE públicos: la revisión es exclusiva del admin (service role).
