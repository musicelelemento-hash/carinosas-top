"use server";

import { supabase } from "@/lib/supabase";
import { sendTelegram } from "@/lib/telegram";
import { trackEvent } from "@/lib/track";

/**
 * CHAT REAL — conversaciones persistentes en Supabase con identidad de sesión (guest).
 * Reemplaza `mockChats`. La session_key es un uuid generado en el navegador y
 * guardado en localStorage; así el invitado conserva su conversación.
 */

interface ThreadRow {
  id: string;
  model_id: string;
  session_key: string;
}

/** Devuelve el id del hilo de un invitado con un modelo, o lo crea. */
export async function getOrCreateThreadAction(
  modelId: string,
  sessionKey: string
): Promise<{ success: boolean; threadId?: string; error?: string }> {
  try {
    if (!modelId || !sessionKey) {
      return { success: false, error: "Faltan datos de la conversación." };
    }
    // Upsert por (model_id, session_key) sin duplicar.
    const { data: existing } = await supabase
      .from("chat_threads")
      .select("id")
      .eq("model_id", modelId)
      .eq("session_key", sessionKey)
      .maybeSingle();

    if (existing) return { success: true, threadId: existing.id };

    const { data, error } = await supabase
      .from("chat_threads")
      .insert([{ model_id: modelId, session_key: sessionKey }])
      .select("id")
      .single();

    if (error || !data) return { success: false, error: error?.message || "No se pudo crear el hilo." };
    return { success: true, threadId: data.id };
  } catch (err) {
    console.error("getOrCreateThreadAction error:", err);
    return { success: false, error: "Error al iniciar la conversación." };
  }
}

/** Carga los mensajes de una conversación (orden cronológico). */
export async function getMessagesAction(threadId: string): Promise<{
  success: boolean;
  messages?: { id: string; sender: string; text: string; created_at: string }[];
  error?: string;
}> {
  try {
    if (!threadId) return { success: false, error: "Hilo inválido." };
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, sender, text, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) return { success: false, error: error.message };
    return { success: true, messages: (data as never[]) || [] };
  } catch (err) {
    console.error("getMessagesAction error:", err);
    return { success: false, error: "Error al cargar mensajes." };
  }
}

/** Envía un mensaje del invitado al hilo. */
export async function sendMessageAction(
  threadId: string,
  text: string
): Promise<{ success: boolean; message?: { id: string; sender: string; text: string; created_at: string }; error?: string }> {
  try {
    const clean = text.trim().slice(0, 1000);
    if (!threadId || clean.length < 1) return { success: false, error: "Mensaje vacío." };

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([{ thread_id: threadId, sender: "guest", text: clean }])
      .select("id, sender, text, created_at")
      .single();

    if (error || !data) return { success: false, error: error?.message || "No se pudo enviar." };
    return { success: true, message: data };
  } catch (err) {
    console.error("sendMessageAction error:", err);
    return { success: false, error: "Error al enviar el mensaje." };
  }
}

/** Crea una reserva real desde el chat (vincular ya es posible con el hilo/la sesión). */
export async function createBookingFromChatAction(input: {
  modelId: string;
  sessionKey: string;
  city: string;
  serviceDuration?: string;
  meetingType?: string;
  day?: string;
  time?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!input.modelId || !input.sessionKey || !input.city) {
      return { success: false, error: "Faltan datos de la reserva." };
    }
    const hilo = await getOrCreateThreadAction(input.modelId, input.sessionKey);
    if (!hilo.threadId) return { success: false, error: hilo.error || "No se pudo vincular la reserva." };

    const { error } = await supabase.from("booking_requests").insert([
      {
        model_id: input.modelId,
        requested_city: input.city,
        service_duration: `1h`, // MVP; se puede extender con duración real.
        status: "pending",
      },
    ]);

    if (error) return { success: false, error: error.message };

    // Trackea la conversión clave del embudo y notifica por Telegram.
    await trackEvent("booking_requested", { modelId: input.modelId, city: input.city });
    await sendTelegram(
      `📅 <b>Nueva reserva solicitada</b>\nModelo: ${input.modelId}\nCiudad: ${input.city}\n${input.day || ""} ${input.time || ""} ${input.meetingType || ""}`
    );

    return { success: true };
  } catch (err) {
    console.error("createBookingFromChatAction error:", err);
    return { success: false, error: "Error al crear la reserva." };
  }
}
