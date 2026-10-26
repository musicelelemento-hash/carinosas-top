"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isModelOwner } from "@/lib/modelAuth";

export interface ModelMetrics {
  weeklyViews: number;
  whatsappClicks: number;
  bookingRequests: number;
  vipUnlocks: number;
  estimatedEarningsUsd: number;
  verified4k: boolean;
  isOnline: boolean;
  hourlyRate: number;
  vaultRate: number;
}

/**
 * Obtiene métricas reales de un modelo desde tablas de Supabase.
 * Sin datos reales → devuelve cero/null honesto, nunca números inventados.
 */
export async function getModelMetricsAction(modelId: string, accessToken: string): Promise<ModelMetrics> {
  const authorized = await isModelOwner(modelId, accessToken);
  if (!authorized) {
    return {
      weeklyViews: 0,
      whatsappClicks: 0,
      bookingRequests: 0,
      vipUnlocks: 0,
      estimatedEarningsUsd: 0,
      verified4k: false,
      isOnline: false,
      hourlyRate: 0,
      vaultRate: 19,
    };
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 1) Datos base del modelo
  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id, name, is_verified_4k, is_online, hourly_rate, plan_type")
    .eq("id", modelId)
    .single();

  const hourlyRate = model?.hourly_rate ?? 0;
  const vaultRate = 19; // precio del pase VIP (bóveda), alineado al spec

  // 2) Vistas de perfil esta semana (tracking_events)
  const { data: profileViews } = await supabaseAdmin
    .from("tracking_events")
    .select("id")
    .eq("event", "profile_view")
    .eq("model_id", modelId)
    .gte("created_at", weekAgo);

  const weeklyViews = profileViews?.length ?? 0;

  // 3) Clics a WhatsApp esta semana
    const { data: whatsappClicksData } = await supabaseAdmin
      .from("tracking_events")
      .select("id")
      .eq("event", "whatsapp_cta_click")
      .eq("model_id", modelId)
      .gte("created_at", weekAgo);

    const whatsappClicks = whatsappClicksData?.length ?? 0;

  // 4) Reservas pendientes/confirmadas
  const { data: bookings } = await supabaseAdmin
    .from("booking_requests")
    .select("id, status")
    .eq("model_id", modelId);

  const bookingRequests = bookings?.length ?? 0;

  // 5) Desbloqueos de bóveda (pases VIP vendidos) - usamos vip_passes vinculados al modelo
  const { data: vipPasses } = await supabaseAdmin
    .from("vip_passes")
    .select("id, status, holder_name")
    .eq("user_id", modelId)
    .eq("status", "active");

  const vipUnlocks = vipPasses?.length ?? 0;
  const estimatedEarningsUsd = vipUnlocks * vaultRate;

  return {
    weeklyViews,
    whatsappClicks,
    bookingRequests,
    vipUnlocks,
    estimatedEarningsUsd,
    verified4k: Boolean(model?.is_verified_4k),
    isOnline: Boolean(model?.is_online),
    hourlyRate,
    vaultRate,
  };
}

/**
 * Wrapper para el dashboard del modelo: busca el modelo por nombre y devuelve
 * sus métricas reales. Si no existe el modelo, devuelve métricas en cero.
 */
export async function getModelDashboardByNameAction(
  modelId: string,
  accessToken: string
): Promise<{ modelId?: string; metrics: ModelMetrics }> {
  if (!await isModelOwner(modelId, accessToken)) {
    return {
      metrics: {
        weeklyViews: 0,
        whatsappClicks: 0,
        bookingRequests: 0,
        vipUnlocks: 0,
        estimatedEarningsUsd: 0,
        verified4k: false,
        isOnline: false,
        hourlyRate: 0,
        vaultRate: 19,
      },
    };
  }

  const { data: model } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("id", modelId)
    .single();

  if (!model) {
    return {
      metrics: {
        weeklyViews: 0,
        whatsappClicks: 0,
        bookingRequests: 0,
        vipUnlocks: 0,
        estimatedEarningsUsd: 0,
        verified4k: false,
        isOnline: false,
        hourlyRate: 0,
        vaultRate: 19,
      },
    };
  }

  const metrics = await getModelMetricsAction(model.id, accessToken);
  return { modelId: model.id, metrics };
}
