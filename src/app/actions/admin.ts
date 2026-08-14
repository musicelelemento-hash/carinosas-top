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
      is_online: modelData.is_online
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
 * Explicitly forces is_verified = false, is_online = false, and age = 21.
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
}) {
  if (!modelData.ageConfirmed) throw new Error("Debes confirmar que eres mayor de edad.");
  if (!modelData.name?.trim() || modelData.name.trim().length > 80) throw new Error("El nombre no es válido.");
  if (!modelData.city?.trim() || modelData.city.trim().length > 80) throw new Error("La ciudad no es válida.");
  if (!/^\+?[0-9\s-]{8,20}$/.test(modelData.whatsapp)) throw new Error("El WhatsApp no es válido.");
  if (!PLAN_TYPES.has(modelData.plan_type)) throw new Error("El plan seleccionado no es válido.");

  const requestHeaders = await headers();
  if (isRateLimited(getClientKey(requestHeaders, "registration"), 3, 60 * 60 * 1000)) {
    throw new Error("Demasiados intentos. Intenta nuevamente más tarde.");
  }

  const { error } = await supabaseAdmin
    .from("models")
    .insert([
      {
        name: modelData.name,
        city: modelData.city,
        sector: modelData.sector || "",
        whatsapp: modelData.whatsapp,
        description: modelData.description || "",
        tags: modelData.tags || [],
        images: modelData.images || [],
        plan_type: modelData.plan_type,
        age: 21,
        is_verified: false,
        is_online: false
      }
    ])
    .select("id");

  if (error) {
    console.error("Public registration insert error:", error);
    throw new Error(`Error en el registro: ${error.message}`);
  }

  return { success: true };
}
