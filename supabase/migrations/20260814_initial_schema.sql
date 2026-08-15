-- ==============================================================================
-- CARIÑOSAS.TOP — OBSIDIAN ELITE SUPABASE PRODUCTION SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MODELS TABLE
CREATE TABLE IF NOT EXISTS public.models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    age INT DEFAULT 21 CHECK (age >= 18),
    city VARCHAR(100) NOT NULL,
    sector VARCHAR(100),
    whatsapp VARCHAR(30) NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    voice_greeting_url TEXT,
    plan_type VARCHAR(50) DEFAULT 'Anuncio Gratis' CHECK (plan_type IN ('Anuncio Gratis', 'Premium', 'VIP Elite', 'Diamante')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_verified_4k BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    is_boosted BOOLEAN DEFAULT FALSE,
    hourly_rate NUMERIC(10, 2) DEFAULT 120.00,
    lat NUMERIC(10, 7),
    lng NUMERIC(10, 7),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. VIP PASSES TABLE (Él & Ella)
CREATE TABLE IF NOT EXISTS public.vip_passes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pass_code VARCHAR(50) UNIQUE NOT NULL,
    holder_name VARCHAR(100) NOT NULL,
    tier_type VARCHAR(20) NOT NULL CHECK (tier_type IN ('gentleman', 'muse')),
    tier_level VARCHAR(30) DEFAULT 'Diamante' CHECK (tier_level IN ('Plata', 'Oro', 'Diamante', 'Alpha Founder')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'revoked')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('crypto_usdt', 'crypto_btc', 'bank_transfer', 'complimentary')),
    payment_hash VARCHAR(150),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. STORIES TABLE (4K Reels & Ephemeral Stories)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    caption VARCHAR(255),
    views_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours') NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. VIP REVIEWS TABLE (Auditadas & Verificadas)
CREATE TABLE IF NOT EXISTS public.vip_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE NOT NULL,
    author_alias VARCHAR(100) NOT NULL,
    tier_badge VARCHAR(50) DEFAULT 'Diamante VIP',
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    is_verified_booking BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. BOOKING REQUESTS (Concierge & Direct Bookings)
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE NOT NULL,
    client_pass_code VARCHAR(50) REFERENCES public.vip_passes(pass_code) ON DELETE SET NULL,
    service_duration VARCHAR(20) DEFAULT '1h',
    requested_city VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_models_city ON public.models(city);
CREATE INDEX IF NOT EXISTS idx_models_online ON public.models(is_online);
CREATE INDEX IF NOT EXISTS idx_models_plan ON public.models(plan_type);
CREATE INDEX IF NOT EXISTS idx_models_verified_4k ON public.models(is_verified_4k);
CREATE INDEX IF NOT EXISTS idx_vip_passes_code ON public.vip_passes(pass_code);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON public.stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_reviews_model_id ON public.vip_reviews(model_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Models: Public Read for verified models
CREATE POLICY "Public models read" 
ON public.models 
FOR SELECT 
USING (is_verified = TRUE OR is_verified_4k = TRUE);

-- Stories: Public Read for non-expired stories
CREATE POLICY "Public stories read" 
ON public.stories 
FOR SELECT 
USING (expires_at > NOW());

-- Reviews: Public Read
CREATE POLICY "Public reviews read" 
ON public.vip_reviews 
FOR SELECT 
USING (TRUE);

-- VIP Passes: Read own pass by code
CREATE POLICY "Pass verification read" 
ON public.vip_passes 
FOR SELECT 
USING (status = 'active');

-- Service Role Full Access (Bypasses RLS for Admin Server Actions)
CREATE POLICY "Service Role models full" ON public.models FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Service Role passes full" ON public.vip_passes FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Service Role stories full" ON public.stories FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Service Role reviews full" ON public.vip_reviews FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Service Role bookings full" ON public.booking_requests FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Service Role audit full" ON public.audit_logs FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS REPLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.models;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
