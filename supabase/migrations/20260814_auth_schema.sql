-- ==============================================================================
-- CARIÑOSAS.TOP — SUPABASE AUTH & USER PROFILE INTEGRATION
-- Google OAuth & Email + Password Account Linking
-- ==============================================================================

-- 1. LINK USER_ID ON MODELS TABLE
ALTER TABLE IF EXISTS public.models
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_models_user_id ON public.models(user_id);

-- 2. LINK USER_ID ON VIP_PASSES TABLE
ALTER TABLE IF EXISTS public.vip_passes
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vip_passes_user_id ON public.vip_passes(user_id);

-- 3. ENABLE RLS FOR USER OWNERSHIP
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update their own model profiles" ON public.models;
CREATE POLICY "Users can update their own model profiles" 
ON public.models 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own VIP passes" ON public.vip_passes;
CREATE POLICY "Users can view their own VIP passes" 
ON public.vip_passes 
FOR SELECT 
USING (auth.uid() = user_id OR status = 'active');
