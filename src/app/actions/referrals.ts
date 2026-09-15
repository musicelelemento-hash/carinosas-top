"use server";

import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { checkAdminSessionAction } from "./admin";

function generateCode(): string {
  const segment = () => randomBytes(3).toString("hex").toUpperCase();
  return `CAR-${segment()}-${segment()}`;
}

/**
 * Genera un código de referido único para un caballero o modelo.
 * Solo accesible con sesión admin activa (evita abuso/spam de códigos).
 */
export async function generateReferralCodeAction(input: {
  ownerType: "gentleman" | "model";
  city?: string;
  ownerKey?: string;
}): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const isAdmin = await checkAdminSessionAction();
    if (!isAdmin) {
      return { success: false, error: "No autorizado." };
    }

    const ownerType = input.ownerType || "gentleman";
    const city = input.city?.trim() || null;
    const ownerKey = input.ownerKey?.trim() || null;

    let code = "";
    let attempts = 0;

    while (attempts < 5) {
      code = generateCode();
      const { error } = await supabaseAdmin
        .from("referral_codes")
        .insert([{ code, owner_type: ownerType, city, owner_key: ownerKey }]);

      if (!error) break;
      attempts++;
    }

    if (attempts >= 5) {
      return { success: false, error: "No se pudo generar un código único." };
    }

    return { success: true, code };
  } catch (err) {
    console.error("generateReferralCodeAction error:", err);
    return { success: false, error: "Error interno del servidor." };
  }
}

/**
 * Registra una visita por código de referido en tracking_events.
 * Llamado desde el cliente vía ReferralTracker cuando detecta ?ref= en la URL.
 * No requiere sesión admin (es un evento público de seguimiento).
 */
export async function trackReferralVisitAction(
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const clean = code?.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (!clean || clean.length < 6) {
      return { success: false, error: "Código no válido." };
    }

    // Verificar que el código existe en la tabla (sin exponer datos sensibles)
    const { data: referral } = await supabaseAdmin
      .from("referral_codes")
      .select("id, city, uses_count")
      .eq("code", clean)
      .single();

    if (!referral) {
      return { success: false, error: "Código de referido no encontrado." };
    }

    // Registrar evento de tracking (fire-and-forget style)
    await supabaseAdmin.from("tracking_events").insert([{
      event: "referral_visit",
      model_id: null,
      session_key: `ref_${clean}`,
      meta: { code: clean, city: referral.city },
    }]);

    // Incrementar contador de usos
    await supabaseAdmin
      .from("referral_codes")
      .update({ uses_count: (referral.uses_count || 0) + 1 })
      .eq("code", clean);

    return { success: true };
  } catch (err) {
    console.error("trackReferralVisitAction error:", err);
    return { success: false, error: "Error interno del servidor." };
  }
}
