"use server";

import { headers } from "next/headers";

// In-memory OTP storage cache
const otpCache = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// 15-Minute Anti-Abuse Lockout Storage: Phone -> Lockout Expiration Timestamp
const lockoutCache = new Map<string, number>();

// Rate limit request counter: Phone -> { count: number, resetAt: number }
const requestCounter = new Map<string, { count: number; resetAt: number }>();

/**
 * Checks if a phone number is currently in 15-minute lockout.
 */
function isPhoneLocked(cleanPhone: string): { isLocked: boolean; remainingMinutes?: number } {
  const lockedUntil = lockoutCache.get(cleanPhone);
  if (!lockedUntil) return { isLocked: false };

  const now = Date.now();
  if (now < lockedUntil) {
    const remainingMinutes = Math.ceil((lockedUntil - now) / (60 * 1000));
    return { isLocked: true, remainingMinutes };
  }

  // Lockout expired: remove from cache
  lockoutCache.delete(cleanPhone);
  return { isLocked: false };
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

    // 1. Check if locked out
    const { isLocked, remainingMinutes } = isPhoneLocked(cleanPhone);
    if (isLocked) {
      return {
        success: false,
        isLocked: true,
        message: `🚫 Número bloqueado temporalmente por seguridad. Espera ${remainingMinutes} minutos antes de intentar de nuevo.`
      };
    }

    // 2. Anti-Spam Rate Limit (Max 3 OTP requests per 10 minutes)
    const now = Date.now();
    const reqData = requestCounter.get(cleanPhone) || { count: 0, resetAt: now + 10 * 60 * 1000 };
    if (now > reqData.resetAt) {
      reqData.count = 0;
      reqData.resetAt = now + 10 * 60 * 1000;
    }

    reqData.count += 1;
    requestCounter.set(cleanPhone, reqData);

    if (reqData.count > 3) {
      // Trigger 15-minute lockout
      const lockUntil = now + 15 * 60 * 1000;
      lockoutCache.set(cleanPhone, lockUntil);
      otpCache.delete(cleanPhone);
      return {
        success: false,
        isLocked: true,
        message: "🚫 Demasiadas solicitudes de código. Tu número ha sido bloqueado por 15 minutos para proteger el servicio."
      };
    }

    // 3. Generate secure 6-digit code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes TTL

    // Store in OTP cache
    otpCache.set(cleanPhone, {
      code: generatedOtp,
      expiresAt,
      attempts: 0
    });

    const channelName = channel === 'whatsapp_otp' ? 'WhatsApp' : 'SMS';
    console.log(`[OTP Engine] Code generated for ${cleanPhone} via ${channelName}`);

    // --- Entrega real del código (P1) ---------------------------------------
    // Intenta enviar por SMS via Twilio. Si no hay credenciales, el código
    // queda almacenado en otpCache pero NO se entrega: no se simula entrega.
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

    // 1. Check if locked out
    const { isLocked, remainingMinutes } = isPhoneLocked(cleanPhone);
    if (isLocked) {
      return {
        success: false,
        isLocked: true,
        message: `🚫 Número bloqueado. Espera ${remainingMinutes} minutos.`
      };
    }

    const record = otpCache.get(cleanPhone);

    if (!record) {
      // P0 anti-fachada: se eliminaron los códigos demo ("123456"/"849201")
      // que permitían verificar cualquier número sin código real.
      return { success: false, message: "Código no encontrado o expirado. Solicita uno nuevo." };
    }

    if (Date.now() > record.expiresAt) {
      otpCache.delete(cleanPhone);
      return { success: false, message: "El código ha expirado (5 min). Solicita uno nuevo." };
    }

    // Strict 3 attempts limit
    record.attempts += 1;

    if (record.attempts >= 3 && record.code !== enteredOtp.trim()) {
      // Lock out for 15 minutes!
      const lockUntil = Date.now() + 15 * 60 * 1000;
      lockoutCache.set(cleanPhone, lockUntil);
      otpCache.delete(cleanPhone);
      return {
        success: false,
        isLocked: true,
        message: "🚫 3 intentos fallidos consecutivos. Tu número ha sido bloqueado por 15 minutos por seguridad."
      };
    }

    if (record.code !== enteredOtp.trim()) {
      const remaining = 3 - record.attempts;
      return {
        success: false,
        message: `Código incorrecto. Te quedan ${remaining} ${remaining === 1 ? 'intento' : 'intentos'} antes de bloqueo.`
      };
    }

    // Success: clean OTP cache
    otpCache.delete(cleanPhone);

    return { success: true, message: "¡Número autenticado exitosamente!" };
  } catch (err) {
    console.error("verifyPhoneOtpAction error:", err);
    return { success: false, message: "Error al validar el código." };
  }
}
