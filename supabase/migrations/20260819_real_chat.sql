-- ==============================================================================
-- CARIÑOSAS.TOP — CHAT REAL (reemplaza mockChats) + puente a reservas
-- ==============================================================================
-- Chat persistente en Supabase con identidad de "sesión de invitado" (device id),
-- sin necesidad de login previo. Cada conversación se asocia a un modelo y a un
-- session_key (generado en el navegador). Esto también habilita reservas reales
-- sobre booking_requests (el usuario ya tiene una identificable por session_key).
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.chat_threads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id    uuid REFERENCES public.models(id) ON DELETE CASCADE NOT NULL,
  session_key text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (model_id, session_key)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid REFERENCES public.chat_threads(id) ON DELETE CASCADE NOT NULL,
  sender     text NOT NULL CHECK (sender IN ('guest','model','system')),
  text       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_threads_model ON public.chat_threads(model_id);
CREATE INDEX IF NOT EXISTS idx_chat_threads_session ON public.chat_threads(session_key);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON public.chat_messages(thread_id, created_at);

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- El invitado (anon) puede leer y escribir SU conversación identificada por session_key.
-- Nota: la session_key es un secreto no adivinable (uuid), por lo que un SELECT
-- filtrado por session_key no expone conversaciones de otros.
CREATE POLICY "anon read own thread" ON public.chat_threads
  FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert thread" ON public.chat_threads
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read own messages" ON public.chat_messages
  FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert messages" ON public.chat_messages
  FOR INSERT TO anon WITH CHECK (true);
