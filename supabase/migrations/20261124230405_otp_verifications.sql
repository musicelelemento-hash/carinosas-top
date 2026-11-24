-- ==============================================================================
-- CARIÑOSAS.TOP — OTP PERSISTENTE (P0)
-- ==============================================================================
-- Antes, los códigos OTP (sendPhoneOtpAction / verifyPhoneOtpAction) vivían en
-- Maps en memoria del proceso de Node. En Vercel (serverless / Fluid Compute)
-- cada request puede caer en una instancia distinta: el usuario pedía el
-- código y la verificación fallaba con "código no encontrado" porque la
-- instancia que verifica nunca vio el Map de la instancia que lo generó.
--
-- Esta tabla reemplaza esos tres Maps (otpCache, lockoutCache, requestCounter)
-- por una sola fila por teléfono, compartida entre todas las instancias.
-- Solo el service role (supabaseAdmin) la toca — RLS activa sin políticas
-- públicas, así que anon/authenticated no pueden leer ni escribir.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.otp_verifications (
  phone             text PRIMARY KEY,
  code              text,
  code_expires_at   timestamptz,
  attempts          integer NOT NULL DEFAULT 0,
  locked_until      timestamptz,
  request_count     integer NOT NULL DEFAULT 0,
  request_reset_at  timestamptz,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
-- Sin políticas: con RLS activa y ninguna policy, anon/authenticated quedan
-- bloqueados por defecto. Solo supabaseAdmin (service role, bypassa RLS) opera
-- sobre esta tabla — igual que verification_requests para la revisión de admin.
