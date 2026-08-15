-- ==============================================================================
-- CARIÑOSAS.TOP — MULTI-COUNTRY INTERNATIONAL EXPANSION MIGRATION
-- Supports: Ecuador (EC), Colombia (CO), Perú (PE), Panamá (PA), México (MX), España (ES), USA (US)
-- ==============================================================================

-- 1. ADD COUNTRY_CODE COLUMN TO MODELS
ALTER TABLE IF EXISTS public.models
ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT 'EC';

CREATE INDEX IF NOT EXISTS idx_models_country ON public.models(country_code);

-- 2. ADD COUNTRY_CODE COLUMN TO VIP_PASSES (Cross-border passport)
ALTER TABLE IF EXISTS public.vip_passes
ADD COLUMN IF NOT EXISTS origin_country VARCHAR(10) DEFAULT 'EC',
ADD COLUMN IF NOT EXISTS is_international_valid BOOLEAN DEFAULT TRUE;

-- 3. ADD TOURING_CITIES ARRAY TO MODELS (For Global Lounge tours)
ALTER TABLE IF EXISTS public.models
ADD COLUMN IF NOT EXISTS touring_cities TEXT[] DEFAULT '{}';

-- 4. INSERT SAMPLE INTERNATIONAL MODELS FOR COLOMBIA, PERU, PANAMA, MEXICO, SPAIN, MIAMI
INSERT INTO public.models (
    id, name, age, city, sector, whatsapp, description, tags, images, 
    voice_greeting_url, plan_type, is_verified, is_verified_4k, is_online, is_boosted, 
    hourly_rate, country_code, touring_cities
) VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'Mariana',
    23,
    'Medellín',
    'El Poblado / Provenza VIP',
    '+573001234567',
    'Modelo paisa exclusiva para caballeros de alto perfil en Medellín y giras internacionales a Quito y Panamá.',
    ARRAY['Paisa', 'El Poblado', 'Hotel 5★', 'Giras VIP'],
    ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'],
    'https://example.com/audio/mariana_medellin.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    200.00,
    'CO',
    ARRAY['Quito', 'Panamá', 'Miami']
),
(
    'b1000000-0000-0000-0000-000000000002',
    'Fiorella',
    24,
    'Lima',
    'Miraflores VIP',
    '+51987654321',
    'Acompañante de lujo en Lima. Cenas en restaurantes galardonados de Miraflores y suites ejecutivas en San Isidro.',
    ARRAY['Miraflores', 'San Isidro', 'Alta Gastronomía', 'Bóveda 4K'],
    ARRAY['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800'],
    'https://example.com/audio/fiorella_lima.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    180.00,
    'PE',
    ARRAY['Santiago', 'Quito', 'Bogotá']
),
(
    'b1000000-0000-0000-0000-000000000003',
    'Valeria',
    22,
    'Ciudad de Panamá',
    'Punta Pacífica VIP',
    '+50761234567',
    'Presencia y distinción en el centro financiero de Panamá. Exclusividad para empresarios y yates privados.',
    ARRAY['Punta Pacífica', 'Yates VIP', 'Discreción Total'],
    ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'],
    'https://example.com/audio/valeria_panama.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    250.00,
    'PA',
    ARRAY['Miami', 'Medellín', 'Cartagena']
),
(
    'b1000000-0000-0000-0000-000000000004',
    'Paulina',
    23,
    'Ciudad de México',
    'Polanco VIP',
    '+525512345678',
    'Sofisticación y encanto en Polanco y Santa Fe. Disponible para eventos de gala y fines de semana en Cancún.',
    ARRAY['Polanco', 'Santa Fe', 'Eventos VIP', 'Cancún'],
    ARRAY['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'],
    'https://example.com/audio/paulina_cdmx.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    220.00,
    'MX',
    ARRAY['Cancún', 'Monterrey', 'Miami']
)
ON CONFLICT (id) DO NOTHING;
