import { supabase } from "@/lib/supabase";

/**
 * CARIÑOSAS.TOP — TRACKING (métricas del bucle viral, sin costo externo)
 * ==============================================================================
 * Registra eventos del usuario en la tabla `tracking_events` de Supabase.
 * Se usa para medir el embudo (K-factor, CVR a WhatsApp, shares, retención)
 * sin depender de Google Analytics ni PostHog.
 *
 * Uso:  await trackEvent("whatsapp_click", { modelId, sessionKey })
 * Es fire-and-forget: nunca bloquea la UI ni lanza error.
 */

let cachedSession: string | null = null;

/** Session key estable por dispositivo (no adivinable), en localStorage. */
export function getSessionKey(): string {
  try {
    if (cachedSession) return cachedSession;
    let key = localStorage.getItem("carinosas_session");
    if (!key) {
      key = crypto.randomUUID();
      localStorage.setItem("carinosas_session", key);
    }
    cachedSession = key;
    return key;
  } catch {
    return "";
  }
}

export async function trackEvent(
  event: string,
  ctx?: { modelId?: string; sessionKey?: string; [k: string]: unknown }
): Promise<void> {
  try {
    const sessionKey = ctx?.sessionKey || getSessionKey();
    await supabase.from("tracking_events").insert([
      {
        event,
        model_id: (ctx?.modelId as string) || null,
        session_key: sessionKey || null,
        meta: ctx ? JSON.parse(JSON.stringify(ctx)) : {},
      },
    ]);
  } catch {
    // Fire-and-forget: nunca romper la experiencia por un error de tracking.
  }
}
