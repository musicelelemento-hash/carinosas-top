"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isModelOwner } from "@/lib/modelAuth";

export interface BookingRequestItem {
  id: string;
  model_id: string;
  requested_city: string;
  service_duration: string;
  status: string;
  created_at: string;
}

export async function getModelBookingsAction(
  modelId: string,
  accessToken: string
): Promise<BookingRequestItem[] | null> {
  try {
    if (!await isModelOwner(modelId, accessToken)) return null;

    const { data, error } = await supabaseAdmin
      .from("booking_requests")
      .select("id, model_id, requested_city, service_duration, status, created_at")
      .eq("model_id", modelId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as BookingRequestItem[];
  } catch (err) {
    console.error("getModelBookingsAction error:", err);
    return null;
  }
}
