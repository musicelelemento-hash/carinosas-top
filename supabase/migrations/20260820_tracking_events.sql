-- ==============================================================================
-- CARIÑOSAS.TOP — ANÁLISIS DE EVENTOS (métricas del bucle viral, sin costo externo)
-- ==============================================================================
-- Registra eventos clave del usuario (perfil visto, WhatsApp clic, compartir,
-- chat iniciado, reserva creada, verificación enviada) para medir el embudo:
-- K-factor, CVR a WhatsApp, shares, etc. Sin Google Analytics ni PostHog:
-- se guarda en nuestra propia tabla de Supabase.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tracking_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event       text NOT NULL,
  model_id    uuid REFERENCES public.models(id) ON DELETE CASCADE,
  session_key text,
  meta        jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracking_event ON public.tracking_events(event, created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_model ON public.tracking_events(model_id);

ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;

-- Cualquiera (anon) puede insertar eventos; nadie los lee públicamente.
-- El análisis se hace con la service_role (supabaseAdmin) o en el panel.
CREATE POLICY "anon_insert_tracking_events" ON public.tracking_events
  FOR INSERT TO anon WITH CHECK (true);
