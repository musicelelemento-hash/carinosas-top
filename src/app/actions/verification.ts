"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendTelegram } from "@/lib/telegram";
import { trackEvent } from "@/lib/track";

interface SubmitVerificationInput {
  model_id?: string;
  phone?: string;
  selfie_url: string;
  gesture_url?: string;
}

/**
 * Crea una solicitud de verificación 4K en estado 'pending' para que un revisor
 * humano la compare con el perfil de la modelo. Reemplaza el flujo simulado:
 * ahora SÍ se registra una solicitud real con el material subido.
 */
export async function submitVerificationRequestAction(
  input: SubmitVerificationInput
): Promise<{ success: boolean; error?: string; requestId?: string }> {
  try {
    if (!input.model_id && (!input.phone || input.phone.trim().length < 8)) {
      return { success: false, error: "Se requiere el perfil de la modelo o un teléfono válido." };
    }

    if (!input.selfie_url || !input.gesture_url) {
      return { success: false, error: "Se requieren la selfie en vivo y el gesto del día." };
    }

    const { data, error } = await supabaseAdmin
      .from("verification_requests")
      .insert([
        {
          model_id: input.model_id || null,
          phone: input.phone || null,
          selfie_url: input.selfie_url,
          gesture_url: input.gesture_url,
          status: "pending",
        },
      ])
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Notifica al operador por Telegram (si está configurado).
    await trackEvent("verification_submitted", { modelId: input.model_id || undefined });
    await sendTelegram(
      `🛡️ <b>Nueva solicitud de verificación 4K</b>\nSolicitud: ${(data as { id?: string })?.id}\nTeléfono: ${input.phone || "—"}\nModelo: ${input.model_id || "—"}`
    );

    return { success: true, requestId: data?.id as string };
  } catch (err) {
    console.error("submitVerificationRequestAction error:", err);
    return { success: false, error: "Error al enviar la solicitud de verificación." };
  }
}

/**
 * Un revisor humano aprueba o rechaza una solicitud de verificación.
 * Si aprueba → activa el sello 4K real del perfil (models.is_verified_4k = true).
 */
export async function reviewVerificationAction(
  requestId: string,
  approve: boolean,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: request, error: fetchErr } = await supabaseAdmin
      .from("verification_requests")
      .select("id, model_id")
      .eq("id", requestId)
      .single();

    if (fetchErr || !request) {
      return { success: false, error: "Solicitud no encontrada." };
    }

    const finalStatus = approve ? "approved" : "rejected";

    const { error: updateErr } = await supabaseAdmin
      .from("verification_requests")
      .update({
        status: finalStatus,
        notes: notes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // Si aprueba, activa el sello 4K real del perfil.
    if (approve && request.model_id) {
      await supabaseAdmin
        .from("models")
        .update({ is_verified_4k: true })
        .eq("id", request.model_id);

      // Oferta: modelo aprobada 4K (revisión humana real).
      try {
        await trackEvent("model_verified_4k", { modelId: request.model_id });
      } catch {}
    }

    // Notifica al operador por Telegram (si está configurado).
    await sendTelegram(
      `${approve ? "✅" : "⛔"} Verificación 4K ${approve ? "APROBADA" : "rechazada"}\nSolicitud: ${requestId}\n${approve ? "Sello 4K activado en el perfil." : "Perfil no verificado."}`
    );

    return { success: true };
  } catch (err) {
    console.error("reviewVerificationAction error:", err);
    return { success: false, error: "Error al revisar la solicitud." };
  }
}

/** Lista las solicitudes pendientes para el panel de revisión del admin. */
export async function listPendingVerificationsAction(): Promise<{
  success: boolean;
  data?: Array<Record<string, unknown>>;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from("verification_requests")
      .select("id, model_id, phone, selfie_url, gesture_url, status, created_at, model:models(name, city)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data as unknown as Array<Record<string, unknown>>) || [] };
  } catch (err) {
    console.error("listPendingVerificationsAction error:", err);
    return { success: false, error: "Error al listar solicitudes." };
  }
}
