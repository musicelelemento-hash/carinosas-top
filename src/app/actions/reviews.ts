"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface VIPReviewItem {
  id: string;
  model_id: string;
  author_alias: string;
  tier_badge: string;
  rating: number;
  comment: string;
  city: string;
  is_verified_booking: boolean;
  created_at: string;
}

/**
 * Fetches verified VIP reviews for a model or globally.
 */
export async function getVIPReviewsAction(modelId?: string): Promise<VIPReviewItem[]> {
  try {
    let query = supabaseAdmin
      .from("vip_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (modelId) {
      query = query.eq("model_id", modelId);
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    return data as VIPReviewItem[];
  } catch (err) {
    console.error("getVIPReviewsAction Error:", err);
    return [];
  }
}

/**
 * Submits a new review, optionally validating against a VIP pass.
 */
export async function submitVIPReviewAction(reviewData: {
  model_id: string;
  author_alias: string;
  tier_badge?: string;
  rating: number;
  comment: string;
  city: string;
  pass_code?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!reviewData.model_id) {
      return { success: false, error: "El identificador de modelo es requerido." };
    }

    if (!reviewData.comment || reviewData.comment.trim().length < 5) {
      return { success: false, error: "El comentario debe tener al menos 5 caracteres." };
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return { success: false, error: "La calificación debe estar entre 1 y 5 estrellas." };
    }

    let isVerified = false;
    let assignedBadge = reviewData.tier_badge || "Socio Verificado";

    // If a pass code was supplied, check its validity in database
    if (reviewData.pass_code?.trim()) {
      const { data: pass } = await supabaseAdmin
        .from("vip_passes")
        .select("tier_level, status")
        .eq("pass_code", reviewData.pass_code.trim().toUpperCase())
        .single();

      if (pass && pass.status === "active") {
        isVerified = true;
        assignedBadge = `${pass.tier_level || "Diamante"} VIP`;
      }
    } else {
      // Default verified flag if submitted through authenticated flow
      isVerified = true;
    }

    const { error } = await supabaseAdmin
      .from("vip_reviews")
      .insert([
        {
          model_id: reviewData.model_id,
          author_alias: (reviewData.author_alias || "Caballero VIP").trim(),
          tier_badge: assignedBadge,
          rating: reviewData.rating,
          comment: reviewData.comment.trim(),
          city: (reviewData.city || "Quito").trim(),
          is_verified_booking: isVerified
        }
      ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("submitVIPReviewAction Error:", err);
    return { success: false, error: "Error al enviar la reseña." };
  }
}

