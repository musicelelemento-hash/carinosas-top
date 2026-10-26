import { supabaseAdmin } from "@/lib/supabaseAdmin";

/** Verify a Supabase session and the model-to-account ownership link. */
export async function isModelOwner(modelId: string, accessToken: string): Promise<boolean> {
  if (!modelId || !accessToken) return false;

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
  if (authError || !authData.user) return false;

  const { data: model, error: modelError } = await supabaseAdmin
    .from("models")
    .select("id")
    .eq("id", modelId)
    .eq("user_id", authData.user.id)
    .maybeSingle();

  return !modelError && Boolean(model);
}
