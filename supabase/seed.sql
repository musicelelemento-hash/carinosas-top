-- ==============================================================================
-- CARIÑOSAS.TOP — TURNKEY SEED DATA (OBSIDIAN ELITE PRODUCTION)
-- Paste this script directly into Supabase SQL Editor to populate sample data.
-- ==============================================================================

-- 1. CLEAN EXISTING SAMPLE DATA (OPTIONAL)
-- TRUNCATE public.models, public.vip_passes, public.stories, public.vip_reviews CASCADE;

-- 2. INSERT VERIFIED 4K MODELS
INSERT INTO public.models (
    id, name, age, city, sector, whatsapp, description, tags, images, 
    voice_greeting_url, plan_type, is_verified, is_verified_4k, is_online, is_boosted, 
    hourly_rate, lat, lng
) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'Valentina',
    22,
    'Quito',
    'La Carolina VIP',
    '593987654321',
    'Acompañante de alto nivel para cenas exclusivas, viajes de negocios y momentos inolvidables en hoteles 5 estrellas en Quito.',
    ARRAY['Elegante', 'Hotel 5★', 'Discreción Total', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
    ],
    'https://example.com/audio/valentina_greeting.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    150.00,
    -0.180653,
    -78.484253
),
(
    'a1000000-0000-0000-0000-000000000002',
    'Alessandra',
    24,
    'Guayaquil',
    'Samborondón',
    '593987654322',
    'Modelo internacional venezolana con presencia impecable y trato de primera categoría. Disponible para eventos y suites privadas.',
    ARRAY['Trato VIP', 'Cena & Eventos', 'Alta Gama', '4K Verified'],
    ARRAY[
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800'
    ],
    'https://example.com/audio/alessandra_greeting.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    180.00,
    -2.146580,
    -79.866570
),
(
    'a1000000-0000-0000-0000-000000000003',
    'Isabella',
    23,
    'Quito',
    'Cumbayá VIP',
    '593987654323',
    'Universitaria carismática y sofisticada. Ideal para caballeros que buscan una conexión genuina, refinada y sin prisa.',
    ARRAY['Universitaria', 'Sutil', 'Masaje Sensitivo', 'Cumbayá'],
    ARRAY[
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'
    ],
    'https://example.com/audio/isabella_greeting.mp3',
    'Premium',
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    130.00,
    -0.205800,
    -78.435600
),
(
    'a1000000-0000-0000-0000-000000000004',
    'Camila',
    21,
    'Cuenca',
    'El Vergel',
    '593987654324',
    'Dulzura y sensualidad en el corazón de Cuenca. Atención exclusiva a caballeros respetuosos con reserva previa.',
    ARRAY['Dulce', 'Trato de Novios', 'Privado 5★'],
    ARRAY[
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'
    ],
    'https://example.com/audio/camila_greeting.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    120.00,
    -2.900550,
    -79.004530
)
ON CONFLICT (id) DO NOTHING;

-- 3. INSERT SAMPLE VIP PASSES (Él & Ella)
INSERT INTO public.vip_passes (
    pass_code, holder_name, tier_type, tier_level, status, payment_method, payment_hash, expires_at
) VALUES
(
    'ALPHA-8472-VIP',
    'Caballero Alpha Founder',
    'gentleman',
    'Alpha Founder',
    'active',
    'crypto_usdt',
    '0x9a8f4c7e2b1d3a6e8f0c2b4d6e8a0f2b4c6e8a0f2b4c6e8a0f2b4c6e8a0f2b4c',
    NOW() + INTERVAL '90 days'
),
(
    'MUSE-4921-VIP',
    'Valentina VIP Model',
    'muse',
    'Diamante',
    'active',
    'complimentary',
    'VERIFIED-STUDIO-2026',
    NOW() + INTERVAL '180 days'
)
ON CONFLICT (pass_code) DO NOTHING;

-- 4. INSERT SAMPLE 4K STORIES
INSERT INTO public.stories (
    model_id, media_url, media_type, caption, views_count, expires_at
) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    'image',
    'Lista para una noche inolvidable en Quito Norte 🥂✨',
    342,
    NOW() + INTERVAL '24 hours'
),
(
    'a1000000-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    'image',
    'Llegando a Samborondón para el fin de semana 🔥',
    520,
    NOW() + INTERVAL '24 hours'
);

-- 5. INSERT AUDITED VIP REVIEWS
INSERT INTO public.vip_reviews (
    model_id, author_alias, tier_badge, rating, comment, city, is_verified_booking
) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'Socio Alpha #084',
    'Alpha Founder',
    5,
    'La discreción y elegancia de Valentina en el Swissôtel fueron superlativas. 100% recomendada.',
    'Quito',
    TRUE
),
(
    'a1000000-0000-0000-0000-000000000002',
    'Caballero Diamante #219',
    'Diamante VIP',
    5,
    'Experiencia de máximo lujo en Samborondón. El saludo de voz coincidía a la perfección con la realidad.',
    'Guayaquil',
    TRUE
);
