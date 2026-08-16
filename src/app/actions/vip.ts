"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface VIPPassData {
  pass_code?: string;
  holder_name: string;
  tier_type: 'gentleman' | 'muse';
  tier_level: 'Plata' | 'Oro' | 'Diamante' | 'Alpha Founder';
  payment_method: 'crypto_usdt' | 'crypto_btc' | 'bank_transfer' | 'complimentary';
  payment_hash?: string;
  user_id?: string;
  origin_country?: string;
}

/**
 * Validates whether a VIP Pass is active and valid in the database.
 */
export async function verifyVIPPassAction(passCode: string): Promise<{
  isValid: boolean;
  pass?: {
    pass_code: string;
    holder_name: string;
    tier_type: string;
    tier_level: string;
    expires_at: string;
  };
  error?: string;
}> {
  try {
    if (!passCode || typeof passCode !== "string") {
      return { isValid: false, error: "Código de pase inválido." };
    }

    const cleanPassCode = passCode.replace(/[^A-Z0-9-]/gi, "").toUpperCase().slice(0, 30);
    if (cleanPassCode.length < 4) {
      return { isValid: false, error: "Formato de código inválido." };
    }

    const { data, error } = await supabaseAdmin
      .from("vip_passes")
      .select("pass_code, holder_name, tier_type, tier_level, status, expires_at")
      .eq("pass_code", cleanPassCode)
      .single();

    if (error || !data) {
      return { isValid: false, error: "Pase no encontrado o código incorrecto." };
    }

    if (data.status !== "active") {
      return { isValid: false, error: `El pase se encuentra en estado: ${data.status}` };
    }

    if (data.expires_at) {
      const isExpired = new Date(data.expires_at) < new Date();
      if (isExpired) {
        return { isValid: false, error: "El pase ha expirado." };
      }
    }

    return {
      isValid: true,
      pass: {
        pass_code: data.pass_code,
        holder_name: data.holder_name,
        tier_type: data.tier_type,
        tier_level: data.tier_level,
        expires_at: data.expires_at
      }
    };
  } catch (err) {
    console.error("verifyVIPPassAction Error:", err);
    return { isValid: false, error: "Error al verificar el pase." };
  }
}

/**
 * Creates or registers a new VIP pass request from checkout.
 */
export async function registerVIPPassAction(passData: VIPPassData): Promise<{
  success: boolean;
  passCode?: string;
  error?: string;
}> {
  try {
    const rawCode = passData.pass_code || `ALPHA-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
    const cleanCode = rawCode.replace(/[^A-Z0-9-]/gi, "").toUpperCase().slice(0, 30);
    const cleanHolderName = (passData.holder_name || "Socio Confidencial").replace(/<[^>]*>?/gm, "").trim().slice(0, 80);
    const cleanHash = (passData.payment_hash || `TX-${Date.now()}`).replace(/<[^>]*>?/gm, "").trim().slice(0, 100);

    const { error } = await supabaseAdmin
      .from("vip_passes")
      .insert([
        {
          pass_code: cleanCode,
          holder_name: cleanHolderName,
          tier_type: passData.tier_type,
          tier_level: passData.tier_level || "Diamante",
          status: "active",
          payment_method: passData.payment_method,
          payment_hash: cleanHash,
          user_id: passData.user_id || null,
          origin_country: (passData.origin_country || "EC").slice(0, 5),
          is_international_valid: true
        }
      ]);

    if (error) {
      console.error("registerVIPPassAction insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, passCode: cleanCode };
  } catch (err) {
    console.error("registerVIPPassAction Exception:", err);
    return { success: false, error: "Error interno del servidor al crear el pase." };
  }
}
