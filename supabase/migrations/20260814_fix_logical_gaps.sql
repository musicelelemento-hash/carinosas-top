-- ==============================================================================
-- CARIÑOSAS.TOP — FIX LOGICAL GAPS & SCHEMA ENHANCEMENTS MIGRATION
-- Adds personal_note, increment_story_view function, and robust indexation
-- ==============================================================================

-- 1. ADD PERSONAL_NOTE COLUMN TO MODELS TABLE
ALTER TABLE IF EXISTS public.models
ADD COLUMN IF NOT EXISTS personal_note TEXT DEFAULT 'Cada encuentro es una historia que merece ser contada con elegancia.';

-- 2. CREATE STORED PROCEDURE TO ATOMICALLY INCREMENT STORY VIEWS
CREATE OR REPLACE FUNCTION public.increment_story_view(story_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.stories
    SET views_count = COALESCE(views_count, 0) + 1
    WHERE id = story_id;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.increment_story_view(UUID) TO anon, authenticated, service_role;

-- 3. ENSURE INDEXES EXIST FOR QUERIES
CREATE INDEX IF NOT EXISTS idx_models_created_at ON public.models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);
