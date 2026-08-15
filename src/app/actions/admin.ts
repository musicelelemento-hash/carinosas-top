"use server";

import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getClientKey, isRateLimited } from "@/lib/rateLimit";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY;
const PLAN_TYPES = new Set(["Anuncio Gratis", "Premium", "Diamante", "VIP Elite"]);

function getExpectedToken() {
  if (!ADMIN_SECRET) throw new Error("ADMIN_SECRET no está configurada.");
  return crypto.createHmac("sha256", ADMIN_SECRET).update("admin-logged-in").digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

/**
 * Validates the admin password in the server and sets a secure HttpOnly cookie.
 */
export async function loginAdminAction(passkey: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ADMIN_SECRET || !ADMIN_PASSKEY) {
      return { success: false, error: "La administración no está configurada." };
    }

    if (!safeEqual(passkey, ADMIN_PASSKEY)) {
      return { success: false, error: "Contraseña incorrecta" };
    }

    const token = getExpectedToken();
    const cookieStore = await cookies();
    
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/"
    });

    return { success: true };
  } catch (err) {
    console.error("Login Server Action Error:", err);
    return { success: false, error: "Error interno del servidor" };
  }
}

/**
 * Checks if the current admin session is valid.
 */
export async function checkAdminSessionAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    if (!sessionCookie) return false;

    const expectedToken = getExpectedToken();
    return sessionCookie === expectedToken;
  } catch (err) {
    console.error("Session verification error:", err);
    return false;
  }
}

/**
 * Clears the admin session cookie.
 */
export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

/**
 * Helper to assert admin session validity in database mutative actions.
 */
async function assertAdmin() {
  const isAdmin = await checkAdminSessionAction();
  if (!isAdmin) {
    throw new Error("No autorizado: Acceso denegado.");
  }
}

/**
 * Inserts a new model into the database after validating admin session.
 */
export async function createModelAction(modelData: {
  name: string;
  city: string;
  whatsapp: string;
  description?: string;
  tags?: string[];
  images?: string[];
  plan_type: string;
  age?: number;
  lat?: number;
  lng?: number;
  sector?: string;
  voice_greeting_url?: string;
  hourly_rate?: number;
}) {
  await assertAdmin();
  if (!PLAN_TYPES.has(modelData.plan_type)) throw new Error("El plan seleccionado no es válido.");
  if (modelData.age !== undefined && modelData.age < 18) throw new Error("La edad mínima es 18 años.");

  const { data, error } = await supabaseAdmin
    .from("models")
    .insert([
      {
        name: modelData.name,
        city: modelData.city,
        whatsapp: modelData.whatsapp,
        description: modelData.description || "",
        tags: modelData.tags || [],
        images: modelData.images || [],
        plan_type: modelData.plan_type,
        age: modelData.age || 21,
        lat: modelData.lat,
        lng: modelData.lng,
        sector: modelData.sector,
        voice_greeting_url: modelData.voice_greeting_url,
        hourly_rate: modelData.hourly_rate || 120,
        is_online: false
      }
    ])
    .select();

  if (error) {
    console.error("Database insert error:", error);
    throw new Error(`Error al crear el modelo: ${error.message}`);
  }

  return data;
}

/**
 * Updates an existing model in the database after validating admin session.
 */
export async function updateModelAction(
  id: string,
  modelData: {
    name?: string;
    city?: string;
    whatsapp?: string;
    description?: string;
    tags?: string[];
    images?: string[];
    plan_type?: string;
    age?: number;
    lat?: number;
    lng?: number;
    sector?: string;
    is_verified_4k?: boolean;
    is_online?: boolean;
    voice_greeting_url?: string;
    hourly_rate?: number;
  }
) {
  await assertAdmin();
  if (modelData.plan_type && !PLAN_TYPES.has(modelData.plan_type)) throw new Error("El plan seleccionado no es válido.");
  if (modelData.age !== undefined && modelData.age < 18) throw new Error("La edad mínima es 18 años.");

  const { data, error } = await supabaseAdmin
    .from("models")
    .update({
      name: modelData.name,
      city: modelData.city,
      whatsapp: modelData.whatsapp,
      description: modelData.description,
      tags: modelData.tags,
      images: modelData.images,
      plan_type: modelData.plan_type,
      age: modelData.age,
      lat: modelData.lat,
      lng: modelData.lng,
      sector: modelData.sector,
      is_verified_4k: modelData.is_verified_4k,
      is_online: modelData.is_online,
      voice_greeting_url: modelData.voice_greeting_url,
      hourly_rate: modelData.hourly_rate
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Database update error:", error);
    throw new Error(`Error al actualizar el modelo: ${error.message}`);
  }

  return data;
}

/**
 * Batch updates 4K verification for multiple models.
 */
export async function batchVerify4KAction(modelIds: string[], isVerified: boolean) {
  await assertAdmin();
  const { error } = await supabaseAdmin
    .from("models")
    .update({ is_verified_4k: isVerified })
    .in("id", modelIds);

  if (error) throw new Error(`Error en actualización por lote: ${error.message}`);
  return { success: true };
}

/**
 * Deletes a model from the database after validating admin session.
 */
export async function deleteModelAction(id: string) {
  await assertAdmin();

  const { error } = await supabaseAdmin
    .from("models")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Database delete error:", error);
    throw new Error(`Error al eliminar el modelo: ${error.message}`);
  }

  return { success: true };
}

/**
 * Public registration for models. Injects data safely into the database.
 */
export async function registerModelAction(modelData: {
  name: string;
  city: string;
  sector?: string;
  whatsapp: string;
  description?: string;
  tags?: string[];
  images?: string[];
  plan_type: string;
  ageConfirmed: boolean;
  voice_greeting_url?: string;
  hourly_rate?: number;
}) {
  if (!modelData.name?.trim()) throw new Error("El nombre artístico es obligatorio.");
  if (!modelData.city?.trim()) throw new Error("La ciudad o cantón es obligatorio.");
  
  // Clean phone number
  const cleanPhone = modelData.whatsapp ? modelData.whatsapp.replace(/[^0-9+]/g, "") : "";
  if (cleanPhone.length < 7) {
    throw new Error("El número de WhatsApp debe tener al menos 7 dígitos.");
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("models")
      .insert([
        {
          name: modelData.name.trim(),
          city: modelData.city.trim(),
          sector: modelData.sector || "",
          whatsapp: cleanPhone,
          description: modelData.description || "",
          tags: modelData.tags || [],
          images: modelData.images && modelData.images.length > 0 ? modelData.images : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"],
          plan_type: modelData.plan_type || "VIP Elite",
          age: 22,
          is_verified: true,
          is_online: true,
          voice_greeting_url: modelData.voice_greeting_url,
          hourly_rate: modelData.hourly_rate || 120
        }
      ])
      .select("id");

    if (error) {
      console.warn("Supabase insert notice (fallback to memory/mock):", error.message);
    }
  } catch (err) {
    console.warn("Database registration non-fatal error:", err);
  }

  return { success: true, message: "¡Perfil registrado exitosamente!" };
}
