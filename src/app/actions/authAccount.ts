"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { EmailValidator } from "@/lib/emailValidator";

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email?: string;
    role?: string;
    fullName?: string;
  };
  sessionUrl?: string;
}

/**
 * Creates a new user account with validated Email + Password in Supabase Auth.
 */
export async function signUpWithEmailAction(
  email: string,
  password: string,
  fullName: string,
  role: 'model' | 'client' = 'client'
): Promise<AuthResponse> {
  try {
    // 1. Strict Email Validation (Blocks 120+ disposable email providers)
    const emailRes = EmailValidator.validate(email);
    if (!emailRes.isValid) {
      return { success: false, message: emailRes.error || "Correo electrónico no válido o temporal." };
    }

    // 2. Password Strength Check
    if (!password || password.length < 6) {
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }

    if (!fullName || fullName.trim().length < 2) {
      return { success: false, message: "El nombre es obligatorio." };
    }

    // 3. Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true, // Auto-confirm for frictionless onboarding
      user_metadata: {
        full_name: fullName.trim(),
        role: role,
        created_via: "web_auth"
      }
    });

    if (error) {
      console.error("signUpWithEmailAction error:", error);
      if (error.message.includes("already registered") || error.message.includes("duplicate")) {
        return { success: false, message: "Este correo ya se encuentra registrado. Inicia sesión." };
      }
      return { success: false, message: `Error al crear cuenta: ${error.message}` };
    }

    if (!data.user) {
      return { success: false, message: "No se pudo crear el usuario." };
    }

    // 4. Create VIP pass or Model entry if applicable
    if (role === 'client') {
      const passCode = `ALPHA-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
      await supabaseAdmin.from("vip_passes").insert([
        {
          pass_code: passCode,
          holder_name: fullName.trim(),
          tier_type: "gentleman",
          tier_level: "Plata",
          status: "active",
          payment_method: "complimentary"
        }
      ]);
    }

    return {
      success: true,
      message: "¡Cuenta creada exitosamente! Bienvenido a Cariñosas.top.",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role,
        fullName: fullName.trim()
      }
    };
  } catch (err) {
    console.error("signUpWithEmailAction exception:", err);
    return { success: false, message: "Error interno del servidor al registrar cuenta." };
  }
}

/**
 * Signs in with Email and Password.
 */
export async function signInWithEmailAction(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const cleanEmail = email.trim().toLowerCase();

    // Verify format
    const emailRes = EmailValidator.validate(cleanEmail);
    if (!emailRes.isValid) {
      return { success: false, message: emailRes.error || "Correo inválido." };
    }

    if (!password) {
      return { success: false, message: "Ingresa tu contraseña." };
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (error || !data.user) {
      return { success: false, message: "Correo o contraseña incorrectos." };
    }

    return {
      success: true,
      message: "Sesión iniciada correctamente.",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: (data.user.user_metadata?.role as string) || "client",
        fullName: (data.user.user_metadata?.full_name as string) || "Socio VIP"
      }
    };
  } catch (err) {
    console.error("signInWithEmailAction error:", err);
    return { success: false, message: "Error al iniciar sesión." };
  }
}

/**
 * Generates the Google OAuth Redirect URL.
 */
export async function getGoogleOAuthUrlAction(
  redirectTo: string = "/"
): Promise<{ url?: string; error?: string }> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carinosas.top";
    const callbackUrl = `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-supabase.supabase.co";
    const googleOAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(callbackUrl)}`;

    return { url: googleOAuthUrl };
  } catch (err) {
    console.error("getGoogleOAuthUrlAction error:", err);
    return { error: "Error al generar enlace de Google." };
  }
}
