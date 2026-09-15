-- ==============================================================================
-- CARIÑOSAS.TOP — CÓDIGOS DE REFERIDO (bucle viral "refiere y gana", fases futuras)
-- ==============================================================================
-- Mínimo viable para el lanzamiento de demanda D1: cada embajador (caballero o
-- modelo) recibe un código compartible via ?ref= en el home. La acreditación
-- (boost/visibilidad/crédito crypto) se resuelve luego con referral_codes en
-- junction a vip_passes / tracking_events, sin datos inventados.
-- ==============================================================================

-- 1. TABLA DE CÓDIGOS DE REFERIDO
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  owner_type  text NOT NULL DEFAULT 'gentleman'
              CHECK (owner_type IN ('gentleman','model')),
  owner_key   text,          -- identificador del dueño (alias o user_id) para acreditación
  city        text,          -- ciudad semilla del referido (para atribución local)
  uses_count  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_city    ON public.referral_codes(city);
CREATE INDEX IF NOT EXISTS idx_referral_codes_created ON public.referral_codes(created_at);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer un código (validar un ?ref= público).
CREATE POLICY "anon_read_referral_codes" ON public.referral_codes
  FOR SELECT TO anon USING (true);

-- La emisión/registro queda exclusivamente en el operador vía service_role
-- (supabaseAdmin en la server action); sin INSERT anon para evitar spam de códigos.
CREATE POLICY "service_role_referral_codes_full" ON public.referral_codes
  FOR ALL TO service_role USING (true) WITH CHECK (true);