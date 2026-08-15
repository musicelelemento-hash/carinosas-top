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
        models (
          name
        )
      `)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item: Record<string, unknown>) => ({
      id: String(item.id),
      model_id: String(item.model_id),
      media_url: String(item.media_url),
      media_type: (item.media_type as 'image' | 'video') || 'image',
      caption: item.caption ? String(item.caption) : undefined,
      views_count: Number(item.views_count || 0),
      created_at: String(item.created_at),
      model_name: typeof item.models === 'object' && item.models && 'name' in item.models
        ? String((item.models as { name: string }).name)
        : undefined
    }));
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
    await supabaseAdmin.rpc("increment_story_view", { story_id: storyId });
  } catch {
    // Fallback if rpc is not created: silent catch
  }
}
