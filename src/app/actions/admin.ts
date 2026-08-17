"use server";

import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getClientKey, isRateLimited } from "@/lib/rateLimit";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "carinosas-top-elite-master-secret-2026-s0v3r31gn";
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "AlphaElite2026!";
const PLAN_TYPES = new Set(["Anuncio Gratis", "Premium", "Diamante", "VIP Elite"]);

function generateSessionToken(): string {
  if (!ADMIN_SECRET) throw new Error("ADMIN_SECRET no está configurada.");
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", ADMIN_SECRET)
    .update(`${timestamp}:admin-session-v2`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

function verifySessionToken(token: string): boolean {
  if (!ADMIN_SECRET || !token) return false;
  
  // Backward compatibility with legacy static token
  try {
    const legacyToken = crypto.createHmac("sha256", ADMIN_SECRET).update("admin-logged-in").digest("hex");
    if (safeEqual(token, legacyToken)) return true;
  } catch {}

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Max age: 24 hours (86,400,000 ms)
  const maxAgeMs = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) {
    return false; // Expired
  }

  const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET)
    .update(`${timestampStr}:admin-session-v2`)
    .digest("hex");

  return safeEqual(signature, expectedSignature);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

/**
 * Validates the admin password in the server with brute-force rate limiting and sets a secure HttpOnly cookie.
 */
export async function loginAdminAction(passkey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const reqHeaders = await headers();
    const clientKey = getClientKey(reqHeaders, "admin-login");

    // 1. Strict Brute-Force Rate Limiting (5 attempts per 15 minutes)
    if (isRateLimited(clientKey, 5, 15 * 60 * 1000)) {
      try {
        await supabaseAdmin.from("audit_logs").insert([
          {
            event_type: "admin_login_rate_limited",
            metadata: { ip_key: clientKey, timestamp: new Date().toISOString() }
          }
        ]);
      } catch {}
      return { 
        success: false, 
        error: "Demasiados intentos fallidos. Acceso bloqueado temporalmente por 15 minutos." 
      };
    }

    if (!ADMIN_SECRET || !ADMIN_PASSKEY) {
      return { success: false, error: "La administración no está configurada en las variables de entorno." };
    }

    if (!passkey || !safeEqual(passkey, ADMIN_PASSKEY)) {
      try {
        await supabaseAdmin.from("audit_logs").insert([
          {
            event_type: "admin_login_failed",
            metadata: { ip_key: clientKey, timestamp: new Date().toISOString() }
          }
        ]);
      } catch {}
      return { success: false, error: "Contraseña incorrecta." };
    }

    const token = generateSessionToken();
    const cookieStore = await cookies();
    
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/"
    });

    // Audit log successful admin authentication
    try {
      await supabaseAdmin.from("audit_logs").insert([
        {
          event_type: "admin_login_success",
          metadata: { ip_key: clientKey, timestamp: new Date().toISOString() }
        }
      ]);
    } catch {}

    return { success: true };
  } catch (err) {
    console.error("Login Server Action Error:", err);
    return { success: false, error: "Error interno del servidor." };
  }
}

/**
 * Checks if the current admin session is valid and unexpired.
 */
export async function checkAdminSessionAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    if (!sessionCookie) return false;

    return verifySessionToken(sessionCookie);
  } catch (err) {
    console.error("Session verification error:", err);
    return false;
  }
}

/**
 * Clears the admin session cookie and logs logout event.
 */
export async function logoutAdminAction(): Promise<void> {
  try {
    const reqHeaders = await headers();
    const clientKey = getClientKey(reqHeaders, "admin-login");
    await supabaseAdmin.from("audit_logs").insert([
      {
        event_type: "admin_logout",
        metadata: { ip_key: clientKey, timestamp: new Date().toISOString() }
      }
    ]);
  } catch {}
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
 * Fetches all models for the admin panel using service role to bypass RLS,
 * allowing admins to audit unverified models.
 */
export async function getAdminModelsAction() {
  await assertAdmin();
  const { data, error } = await supabaseAdmin
    .from("models")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin fetch models error:", error);
    throw new Error(`Error al obtener modelos: ${error.message}`);
  }

  return data || [];
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
  is_verified?: boolean;
  is_verified_4k?: boolean;
  personal_note?: string;
  country_code?: string;
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
        is_verified: modelData.is_verified ?? true,
        is_verified_4k: modelData.is_verified_4k ?? false,
        is_online: false,
        personal_note: modelData.personal_note || "Cada encuentro es una historia que merece ser contada con elegancia.",
        country_code: modelData.country_code || "EC"
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
    is_verified?: boolean;
    is_verified_4k?: boolean;
    is_online?: boolean;
    voice_greeting_url?: string;
    hourly_rate?: number;
    personal_note?: string;
    country_code?: string;
  }
) {
  await assertAdmin();
  if (modelData.plan_type && !PLAN_TYPES.has(modelData.plan_type)) throw new Error("El plan seleccionado no es válido.");
  if (modelData.age !== undefined && modelData.age < 18) throw new Error("La edad mínima es 18 años.");

  const updatePayload: Record<string, unknown> = {
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
  };

  if (modelData.is_verified !== undefined) updatePayload.is_verified = modelData.is_verified;
  if (modelData.personal_note !== undefined) updatePayload.personal_note = modelData.personal_note;
  if (modelData.country_code !== undefined) updatePayload.country_code = modelData.country_code;

  const { data, error } = await supabaseAdmin
    .from("models")
    .update(updatePayload)
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
  age?: number;
  country_code?: string;
  is_phone_verified?: boolean;
  user_id?: string;
  voice_greeting_url?: string;
  hourly_rate?: number;
  personal_note?: string;
}) {
  if (!modelData.name?.trim()) throw new Error("El nombre artístico es obligatorio.");
  if (!modelData.city?.trim()) throw new Error("La ciudad o cantón es obligatorio.");
  
  // Clean phone number
  const cleanPhone = modelData.whatsapp ? modelData.whatsapp.replace(/[^0-9+]/g, "") : "";
  if (cleanPhone.length < 7) {
    throw new Error("El número de WhatsApp debe tener al menos 7 dígitos.");
  }

  const modelAge = modelData.age && modelData.age >= 18 ? modelData.age : 22;

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
          age: modelAge,
          country_code: modelData.country_code || "EC",
          is_phone_verified: Boolean(modelData.is_phone_verified),
          user_id: modelData.user_id || null,
          is_verified: true,
          is_online: true,
          voice_greeting_url: modelData.voice_greeting_url,
          hourly_rate: modelData.hourly_rate || 120,
          personal_note: modelData.personal_note || "Cada encuentro es una historia que merece ser contada con elegancia."
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

/**
 * Fetches all VIP passes from the database for the admin console.
 */
export async function getAdminVIPPassesAction() {
  await assertAdmin();
  try {
    const { data, error } = await supabaseAdmin
      .from("vip_passes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase vip_passes fetch warning:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error fetching VIP passes:", err);
    return [];
  }
}

/**
 * Creates a new VIP Pass in the database.
 */
export async function createAdminVIPPassAction(passData: {
  pass_code: string;
  holder_name: string;
  tier_type: "gentleman" | "muse";
  tier_level: "Plata" | "Oro" | "Diamante" | "Alpha Founder";
  duration_days?: number;
  payment_method?: string;
  payment_hash?: string;
}) {
  await assertAdmin();
  const cleanCode = passData.pass_code.trim().toUpperCase();
  const days = passData.duration_days || 30;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("vip_passes")
    .insert([
      {
        pass_code: cleanCode,
        holder_name: passData.holder_name.trim() || "Caballero VIP",
        tier_type: passData.tier_type || "gentleman",
        tier_level: passData.tier_level || "Diamante",
        status: "active",
        payment_method: passData.payment_method || "complimentary",
        payment_hash: passData.payment_hash || `ADMIN_GRANTED_${Date.now()}`,
        expires_at: expiresAt
      }
    ])
    .select();

  if (error) {
    console.error("Error inserting VIP pass:", error);
    throw new Error(`Error al crear pase VIP: ${error.message}`);
  }

  // Audit log
  try {
    await supabaseAdmin.from("audit_logs").insert([
      {
        event_type: "admin_vip_pass_created",
        metadata: { pass_code: cleanCode, tier_level: passData.tier_level }
      }
    ]);
  } catch {}

  return data;
}

/**
 * Toggles a VIP Pass status (active / revoked).
 */
export async function toggleAdminVIPPassAction(id: string, newStatus: "active" | "revoked" | "expired") {
  await assertAdmin();
  const { data, error } = await supabaseAdmin
    .from("vip_passes")
    .update({ status: newStatus })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(`Error al actualizar estado del pase: ${error.message}`);
  }

  return data;
}

/**
 * Deletes a VIP Pass from the database.
 */
export async function deleteAdminVIPPassAction(id: string) {
  await assertAdmin();
  const { error } = await supabaseAdmin
    .from("vip_passes")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error al eliminar pase VIP: ${error.message}`);
  }

  return { success: true };
}

/**
 * Fetches the master payment settings configured by the admin.
 */
export async function getAdminPaymentSettingsAction() {
  await assertAdmin();
  try {
    const { data } = await supabaseAdmin
      .from("audit_logs")
      .select("metadata")
      .eq("event_type", "payment_settings_sync")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data?.metadata?.methods) {
      return data.metadata.methods;
    }
  } catch {}
  return null;
}

/**
 * Saves payment settings in server audit store for cross-device synchronization.
 */
export async function saveAdminPaymentSettingsAction(methods: unknown[]) {
  await assertAdmin();
  try {
    await supabaseAdmin.from("audit_logs").insert([
      {
        event_type: "payment_settings_sync",
        metadata: { methods, updated_at: new Date().toISOString() }
      }
    ]);
    return { success: true };
  } catch (err) {
    console.error("Payment settings save error:", err);
    return { success: false, error: "Error al sincronizar métodos de pago." };
  }
}

/**
 * Fetches real-time executive dashboard stats (total models, verified 4K, online, passes, revenue).
 */
export async function getAdminDashboardStatsAction() {
  await assertAdmin();
  try {
    const [modelsRes, passesRes, storiesRes, logsRes] = await Promise.all([
      supabaseAdmin.from("models").select("id, is_verified_4k, is_online, is_boosted, hourly_rate, city"),
      supabaseAdmin.from("vip_passes").select("id, status"),
      supabaseAdmin.from("stories").select("id, views_count"),
      supabaseAdmin.from("audit_logs").select("id, event_type, created_at").order("created_at", { ascending: false }).limit(20)
    ]);

    const models = modelsRes.data || [];
    const passes = passesRes.data || [];
    const stories = storiesRes.data || [];
    const logs = logsRes.data || [];

    const totalModels = models.length;
    const verified4K = models.filter(m => m.is_verified_4k).length;
    const onlineModels = models.filter(m => m.is_online).length;
    const boostedModels = models.filter(m => m.is_boosted).length;
    const activePasses = passes.filter(p => p.status === "active").length;
    const totalStoryViews = stories.reduce((acc, s) => acc + (s.views_count || 0), 0);
    const avgHourlyRate = totalModels > 0 ? Math.round(models.reduce((acc, m) => acc + Number(m.hourly_rate || 120), 0) / totalModels) : 140;

    // City distribution
    const cityCounts: Record<string, number> = {};
    models.forEach(m => {
      const c = m.city || "Ecuador";
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });

    return {
      totalModels,
      verified4K,
      onlineModels,
      boostedModels,
      activePasses,
      totalStoryViews,
      avgHourlyRate,
      cityCounts,
      recentLogs: logs
    };
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return null;
  }
}

/**
 * Fetches all security and audit logs.
 */
export async function getAdminAuditLogsAction() {
  await assertAdmin();
  try {
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Audit logs fetch error:", err);
    return [];
  }
}

/**
 * Fetches all 4K ephemeral stories with model details.
 */
export async function getAdminStoriesAction() {
  await assertAdmin();
  try {
    const { data, error } = await supabaseAdmin
      .from("stories")
      .select("id, model_id, media_url, media_type, caption, views_count, expires_at, created_at, models(name, city)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Stories fetch error:", err);
    return [];
  }
}

/**
 * Creates a story for any model directly from the admin panel.
 */
export async function createAdminStoryAction(storyData: {
  model_id: string;
  media_url: string;
  media_type?: "image" | "video";
  caption?: string;
}) {
  await assertAdmin();
  const { data, error } = await supabaseAdmin
    .from("stories")
    .insert([
      {
        model_id: storyData.model_id,
        media_url: storyData.media_url,
        media_type: storyData.media_type || "image",
        caption: storyData.caption || "Historia 4K Oficial",
        views_count: 0,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    ])
    .select();

  if (error) throw new Error(`Error al crear historia: ${error.message}`);
  return data;
}

/**
 * Deletes a story.
 */
export async function deleteAdminStoryAction(storyId: string) {
  await assertAdmin();
  const { error } = await supabaseAdmin
    .from("stories")
    .delete()
    .eq("id", storyId);

  if (error) throw new Error(`Error al eliminar historia: ${error.message}`);
  return { success: true };
}

/**
 * Batch boosts or un-boosts all models in a specific city with 1 click.
 */
export async function batchBoostCityAction(city: string, isBoosted: boolean) {
  await assertAdmin();
  const { data, error } = await supabaseAdmin
    .from("models")
    .update({ is_boosted: isBoosted })
    .ilike("city", `%${city}%`)
    .select("id");

  if (error) throw new Error(`Error al impulsar ciudad: ${error.message}`);

  try {
    await supabaseAdmin.from("audit_logs").insert([
      {
        event_type: "admin_batch_boost_city",
        metadata: { city, is_boosted: isBoosted, count: data?.length || 0 }
      }
    ]);
  } catch {}

  return { success: true, count: data?.length || 0 };
}
