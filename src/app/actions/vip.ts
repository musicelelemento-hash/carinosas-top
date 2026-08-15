"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface VIPPassData {
  pass_code: string;
  holder_name: string;
  tier_type: 'gentleman' | 'muse';
  tier_level: 'Plata' | 'Oro' | 'Diamante' | 'Alpha Founder';
  payment_method: 'crypto_usdt' | 'crypto_btc' | 'bank_transfer' | 'complimentary';
  payment_hash?: string;
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
    const { data, error } = await supabaseAdmin
      .from("vip_passes")
      .select("pass_code, holder_name, tier_type, tier_level, status, expires_at")
      .eq("pass_code", passCode.trim().toUpperCase())
      .single();

    if (error || !data) {
      return { isValid: false, error: "Pase no encontrado o código incorrecto." };
    }

    if (data.status !== "active") {
      return { isValid: false, error: `El pase se encuentra en estado: ${data.status}` };
    }

    const isExpired = new Date(data.expires_at) < new Date();
    if (isExpired) {
      return { isValid: false, error: "El pase ha expirado." };
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
    const generatedCode = passData.pass_code || `ALPHA-${Math.floor(1000 + Math.random() * 9000)}-VIP`;

    const { error } = await supabaseAdmin
      .from("vip_passes")
      .insert([
        {
          pass_code: generatedCode.toUpperCase(),
          holder_name: passData.holder_name || "Socio Confidencial",
          tier_type: passData.tier_type,
          tier_level: passData.tier_level || "Diamante",
          status: "active",
          payment_method: passData.payment_method,
          payment_hash: passData.payment_hash || `TX-${Date.now()}`
        }
      ]);

    if (error) {
      console.error("registerVIPPassAction insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, passCode: generatedCode };
  } catch (err) {
    console.error("registerVIPPassAction Exception:", err);
    return { success: false, error: "Error interno del servidor al crear el pase." };
  }
}
