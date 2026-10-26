"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface StoryItem {
  id: string;
  model_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption?: string;
  views_count: number;
  created_at: string;
  model_name?: string;
  model_age?: number;
  model_city?: string;
  model_sector?: string;
  model_whatsapp?: string;
  model_is_verified_4k?: boolean;
  model_is_verified?: boolean;
  model_is_online?: boolean;
}

/**
 * Fetches active stories (created within the last 24h).
 */
export async function getActiveStoriesAction(): Promise<StoryItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("stories")
      .select(`
        id,
        model_id,
        media_url,
        media_type,
        caption,
        views_count,
        created_at,
        models (name, age, city, sector, whatsapp, is_verified, is_verified_4k, is_online)
      `)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item: Record<string, unknown>) => {
      const rawModel = item.models;
      const model = Array.isArray(rawModel) ? rawModel[0] : rawModel;
      const modelFields = model && typeof model === "object" ? model as Record<string, unknown> : {};
      return {
      id: String(item.id),
      model_id: String(item.model_id),
      media_url: String(item.media_url),
      media_type: (item.media_type as 'image' | 'video') || 'image',
      caption: item.caption ? String(item.caption) : undefined,
      views_count: Number(item.views_count || 0),
      created_at: String(item.created_at),
      model_name: typeof modelFields.name === "string" ? modelFields.name : undefined,
      model_age: typeof modelFields.age === "number" ? modelFields.age : undefined,
      model_city: typeof modelFields.city === "string" ? modelFields.city : undefined,
      model_sector: typeof modelFields.sector === "string" ? modelFields.sector : undefined,
      model_whatsapp: typeof modelFields.whatsapp === "string" ? modelFields.whatsapp : undefined,
      model_is_verified_4k: modelFields.is_verified_4k === true,
      model_is_verified: modelFields.is_verified === true,
      model_is_online: modelFields.is_online === true,
    };
    }).filter((story) => story.model_is_verified || story.model_is_verified_4k);
  } catch (err) {
    console.error("getActiveStoriesAction Error:", err);
    return [];
  }
}

/**
 * Increments the view count of a story.
 */
export async function incrementStoryViewAction(storyId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin.rpc("increment_story_view", { story_id: storyId });
    if (error) {
      // Fallback direct atomic-style update
      const { data: story } = await supabaseAdmin
        .from("stories")
        .select("views_count")
        .eq("id", storyId)
        .single();
      if (story) {
        await supabaseAdmin
          .from("stories")
          .update({ views_count: (story.views_count || 0) + 1 })
          .eq("id", storyId);
      }
    }
  } catch {
    // Silent catch so UI never breaks on view telemetry
  }
}
