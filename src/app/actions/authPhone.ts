"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 3;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_VERIFY_ATTEMPTS = 3;

interface OtpRow {
  phone: string;
  code: string | null;
  code_expires_at: string | null;
  attempts: number;
  locked_until: string | null;
  request_count: number;
  request_reset_at: string | null;
}

async function getOtpRow(cleanPhone: string): Promise<OtpRow | null> {
  const { data } = await supabaseAdmin
    .from("otp_verifications")
    .select("*")
    .eq("phone", cleanPhone)
    .maybeSingle();
  return (data as OtpRow | null) ?? null;
}

function isLocked(row: OtpRow | null, now: number): { locked: boolean; remainingMinutes?: number } {
  if (!row?.locked_until) return { locked: false };
  const lockedUntil = new Date(row.locked_until).getTime();
  if (now < lockedUntil) {
    return { locked: true, remainingMinutes: Math.ceil((lockedUntil - now) / (60 * 1000)) };
  }
  return { locked: false };
}

/**
 * Generates and sends a 6-digit verification code via WhatsApp or SMS.
 */
export async function sendPhoneOtpAction(
  phoneNumber: string,
  channel: 'whatsapp_otp' | 'sms_otp'
): Promise<{ success: boolean; message: string; isLocked?: boolean; whatsAppLink?: string; smsSent?: boolean; smsError?: string | null }> {
  try {
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 8) {
      return { success: false, message: "El número de teléfono no es válido." };
    }

    const now = Date.now();
    const existing = await getOtpRow(cleanPhone);

    // 1. Check if locked out
    const { locked, remainingMinutes } = isLocked(existing, now);
    if (locked) {
      return {
        success: false,
        isLocked: true,
        message: `🚫 Número bloqueado temporalmente por seguridad. Espera ${remainingMinutes} minutos antes de intentar de nuevo.`
      };
    }

    // 2. Anti-Spam Rate Limit (Max 3 OTP requests per 10 minutes)
    const resetAt = existing?.request_reset_at ? new Date(existing.request_reset_at).getTime() : 0;
    let requestCount = existing && now <= resetAt ? existing.request_count : 0;
    const requestResetAt = existing && now <= resetAt ? resetAt : now + RATE_LIMIT_WINDOW_MS;
    requestCount += 1;

    if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
      const lockUntil = new Date(now + LOCKOUT_MS).toISOString();
      await supabaseAdmin.from("otp_verifications").upsert({
        phone: cleanPhone,
        code: null,
        code_expires_at: null,
        attempts: 0,
        locked_until: lockUntil,
        request_count: requestCount,
        request_reset_at: new Date(requestResetAt).toISOString(),
        updated_at: new Date().toISOString(),
      });
      return {
        success: false,
        isLocked: true,
        message: "🚫 Demasiadas solicitudes de código. Tu número ha sido bloqueado por 15 minutos para proteger el servicio."
      };
    }

    // 3. Generate secure 6-digit code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + OTP_TTL_MS;

    // Store (upsert) — shared across every serverless instance, not just this one.
    const { error: upsertError } = await supabaseAdmin.from("otp_verifications").upsert({
      phone: cleanPhone,
      code: generatedOtp,
      code_expires_at: new Date(expiresAt).toISOString(),
      attempts: 0,
      locked_until: null,
      request_count: requestCount,
      request_reset_at: new Date(requestResetAt).toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      console.error("[OTP] Error guardando código en Supabase:", upsertError);
      return { success: false, message: "Error interno al generar el código." };
    }

    const channelName = channel === 'whatsapp_otp' ? 'WhatsApp' : 'SMS';
    console.log(`[OTP Engine] Code generated for ${cleanPhone} via ${channelName}`);

    // --- Entrega real del código (P1) ---------------------------------------
    // Intenta enviar por SMS via Twilio. Si no hay credenciales, el código
    // queda almacenado pero NO se entrega: no se simula entrega.
    let smsSent = false;
    let smsError: string | null = null;

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER;

    if (twilioAccountSid && twilioAuthToken && twilioFrom) {
      try {
        const smsBody = `Tu código de verificación de Cariñosas.top es: ${generatedOtp}. Válido por 5 minutos. No lo compartas.`;
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const auth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString("base64");
        const formData = new URLSearchParams();
        formData.append("From", twilioFrom);
        formData.append("To", cleanPhone);
        formData.append("Body", smsBody);

        const twilioRes = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        });

        if (twilioRes.ok) {
          smsSent = true;
          console.log(`[OTP Twilio] SMS enviado a ${cleanPhone}`);
        } else {
          const errText = await twilioRes.text();
          smsError = `Twilio HTTP ${twilioRes.status}: ${errText}`;
          console.error("[OTP Twilio] Error enviando SMS:", smsError);
        }
      } catch (err) {
        smsError = err instanceof Error ? err.message : "Error desconocido de Twilio";
        console.error("[OTP Twilio] Excepción:", smsError);
      }
    } else {
      smsError = "Credenciales de Twilio no configuradas (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER).";
      console.warn("[OTP] " + smsError);
    }

    const whatsAppMessage = encodeURIComponent(`Hola Cariñosas.top, mi código de verificación de seguridad es: ${generatedOtp}`);
    const whatsAppLink = `https://wa.me/${cleanPhone.replace(/^\+/, "")}?text=${whatsAppMessage}`;

    return {
      success: true,
      message: smsSent
        ? `Código de seguridad enviado por SMS a ${cleanPhone}`
        : `Código generado. ${smsError ? "Entrega pendiente: " + smsError : ""}`,
      whatsAppLink,
      smsSent,
      smsError,
    };
  } catch (err) {
    console.error("sendPhoneOtpAction error:", err);
    return { success: false, message: "Error interno al generar el código." };
  }
}

/**
 * Validates the entered 6-digit OTP code with strict 3-attempt lock.
 */
export async function verifyPhoneOtpAction(
  phoneNumber: string,
  enteredOtp: string
): Promise<{ success: boolean; message: string; isLocked?: boolean }> {
  try {
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
    const now = Date.now();
    const row = await getOtpRow(cleanPhone);

    // 1. Check if locked out
    const { locked, remainingMinutes } = isLocked(row, now);
    if (locked) {
      return {
        success: false,
        isLocked: true,
        message: `🚫 Número bloqueado. Espera ${remainingMinutes} minutos.`
      };
    }

    if (!row || !row.code || !row.code_expires_at) {
      // P0 anti-fachada: se eliminaron los códigos demo ("123456"/"849201")
      // que permitían verificar cualquier número sin código real.
      return { success: false, message: "Código no encontrado o expirado. Solicita uno nuevo." };
    }

    if (now > new Date(row.code_expires_at).getTime()) {
      await supabaseAdmin.from("otp_verifications").update({ code: null, code_expires_at: null }).eq("phone", cleanPhone);
      return { success: false, message: "El código ha expirado (5 min). Solicita uno nuevo." };
    }

    // Strict 3 attempts limit
    const attempts = row.attempts + 1;

    if (attempts >= MAX_VERIFY_ATTEMPTS && row.code !== enteredOtp.trim()) {
      // Lock out for 15 minutes!
      const lockUntil = new Date(now + LOCKOUT_MS).toISOString();
      await supabaseAdmin.from("otp_verifications").update({
        attempts,
        locked_until: lockUntil,
        code: null,
        code_expires_at: null,
      }).eq("phone", cleanPhone);
      return {
        success: false,
        isLocked: true,
        message: "🚫 3 intentos fallidos consecutivos. Tu número ha sido bloqueado por 15 minutos por seguridad."
      };
    }

    if (row.code !== enteredOtp.trim()) {
      await supabaseAdmin.from("otp_verifications").update({ attempts }).eq("phone", cleanPhone);
      const remaining = MAX_VERIFY_ATTEMPTS - attempts;
      return {
        success: false,
        message: `Código incorrecto. Te quedan ${remaining} ${remaining === 1 ? 'intento' : 'intentos'} antes de bloqueo.`
      };
    }

    // Success: clear the code so it can't be reused.
    await supabaseAdmin.from("otp_verifications").update({
      code: null,
      code_expires_at: null,
      attempts: 0,
    }).eq("phone", cleanPhone);

    return { success: true, message: "¡Número autenticado exitosamente!" };
  } catch (err) {
    console.error("verifyPhoneOtpAction error:", err);
    return { success: false, message: "Error al validar el código." };
  }
}
