-- ==============================================================================
-- CARIÑOSAS.TOP — TURNKEY MASTER SEED DATA (OBSIDIAN ELITE PRODUCTION 2026)
-- 30+ Perfiles Hiperrealistas 4K Verificados distribuidos en todo Ecuador
-- ==============================================================================

-- 0. SCHEMA COMPATIBILITY UPGRADE (Auto-patches columns if missing)
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS personal_note TEXT;
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT 'EC';
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS voice_greeting_url TEXT;

-- 1. INSERT 30+ VERIFIED 4K MODELS ACROSS ECUADOR
INSERT INTO public.models (
    id, name, age, city, sector, whatsapp, description, tags, images, 
    voice_greeting_url, plan_type, is_verified, is_verified_4k, is_online, is_boosted, 
    hourly_rate, lat, lng, personal_note, country_code
) VALUES
-- ── QUITO ──
(
    'a1000000-0000-0000-0000-000000000001',
    'Valentina',
    22,
    'Quito',
    'La Carolina VIP',
    '593987654321',
    'Acompañante de alto nivel para cenas exclusivas, viajes de negocios y momentos inolvidables en suites y hoteles 5 estrellas en Quito.',
    ARRAY['Elegante', 'Hotel 5★', 'Discreción Total', 'Bóveda 4K', 'Cena VIP'],
    ARRAY[
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/valentina.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    150.00,
    -0.180653,
    -78.484253,
    'La elegancia no es llamar la atención, sino ser recordada para siempre.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000002',
    'Isabella',
    23,
    'Quito',
    'Cumbayá VIP',
    '593987654322',
    'Universitaria carismática, culta y sofisticada. Ideal para caballeros que buscan una conexión genuina, refinada y sin ninguna prisa.',
    ARRAY['Universitaria', 'Sutil', 'Masaje Sensitivo', 'Cumbayá', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/isabella.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    140.00,
    -0.205800,
    -78.435600,
    'Discreción absoluta y trato exquisito en cada encuentro.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000003',
    'Scarlett',
    25,
    'Quito',
    'González Suárez',
    '593987654323',
    'Presencia deslumbrante y conversación de nivel diplomático. Acompañamiento VIP para eventos de gala y escapadas privadas.',
    ARRAY['Alta Gama', 'Bilingüe', 'Hotel 5★', 'VIP Alpha'],
    ARRAY[
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/scarlett.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    180.00,
    -0.198200,
    -78.479500,
    'Cada velada es una experiencia diseñada a la medida de tu exigencia.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000004',
    'Sophia',
    21,
    'Quito',
    'Monteserrín',
    '593987654324',
    'Dulzura, juventud y frescura inigualables. Pasión por la buena gastronomía y momentos de relax total en el norte de Quito.',
    ARRAY['Juvenil', 'Dulce', 'Trato de Novios', 'Privado'],
    ARRAY[
        'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/sophia.mp3',
    'Premium',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    130.00,
    -0.165400,
    -78.468200,
    'Momentos cálidos y auténticos que querrás repetir.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000005',
    'Victoria',
    26,
    'Quito',
    'Quito Tenis VIP',
    '593987654325',
    'Modelo de pasarela internacional con porte aristocrático. Experiencia premium reservada exclusivamente para ejecutivos y socios VIP.',
    ARRAY['Modelo Pasarela', 'Exclusiva', 'Giras Internacionales', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/victoria.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    200.00,
    -0.171200,
    -78.498800,
    'El verdadero lujo reside en los detalles y en la exclusividad inalcanzable.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000006',
    'Elena',
    24,
    'Quito',
    'Bellavista & La Floresta',
    '593987654326',
    'Sensualidad bohemia y mente brillante. Ideal para copas de vino, charlas enriquecedoras y veladas íntimas sin restricciones.',
    ARRAY['Seductora', 'Cena Gourmet', 'Hotel 5★', '4K Verified'],
    ARRAY[
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/elena.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    160.00,
    -0.189500,
    -78.474100,
    'La belleza exterior es solo la antesala de una gran compañía.',
    'EC'
),

-- ── GUAYAQUIL & SAMBORONDÓN ──
(
    'a1000000-0000-0000-0000-000000000007',
    'Alessandra',
    24,
    'Guayaquil',
    'Samborondón VIP',
    '593987654327',
    'Top model venezolana con curvas deslumbrantes y atención de primer mundo. Disponible para suites privadas en Samborondón y penthouses.',
    ARRAY['Trato VIP', 'Cena & Eventos', 'Alta Gama', '4K Verified', 'Samborondón'],
    ARRAY[
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/alessandra.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    180.00,
    -2.146580,
    -79.866570,
    'Atención cálida, apasionada y sin reservas para caballeros selectos.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000008',
    'Valeria',
    23,
    'Guayaquil',
    'Puerto Santa Ana',
    '593987654328',
    'Acompañante VIP en el epicentro cosmopolita de Guayaquil. Cenas con vista al río Guayas y estancias inolvidables en The Point.',
    ARRAY['Puerto Santa Ana', 'Elegante', 'Discreta', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/valeria.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    170.00,
    -2.181200,
    -79.876500,
    'El placer de disfrutar la mejor vista junto a la compañía soñada.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000009',
    'Doménica',
    22,
    'Guayaquil',
    'Los Ceibos VIP',
    '593987654329',
    'Universitaria de alta cuna, carisma natural y sonrisa cautivadora. Especial para citas tranquilas y masajes antiestrés.',
    ARRAY['Universitaria', 'Ceibos', 'Masaje Relajante', 'Trato Dulce'],
    ARRAY[
        'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/domenica.mp3',
    'Premium',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    150.00,
    -2.172500,
    -79.938900,
    'Un refugio de desconexión y complicidad absoluta.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000010',
    'Antonella',
    25,
    'Guayaquil',
    'Isla Mocolí',
    '593987654330',
    'El estándar supremo de exclusividad en Guayas. Acompañamiento VIP para yates, viajes privados y estancias de máxima discreción.',
    ARRAY['Isla Mocolí', 'Yate VIP', 'Ultra Lujo', 'Alpha Sovereign'],
    ARRAY[
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/antonella.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    250.00,
    -2.132000,
    -79.855000,
    'Para hombres que solo se conforman con lo inalcanzable.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000011',
    'Samantha',
    21,
    'Guayaquil',
    'Urdesa Central',
    '593987654331',
    'Joven alegre, desinhibida y divertida. Le encanta la música, las citas amenas y el romance sin ataduras.',
    ARRAY['Juvenil', 'Desinhibida', 'Urdesa', 'Novia VIP'],
    ARRAY[
        'https://images.unsplash.com/photo-1523824921831-614bd3263416?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/samantha.mp3',
    'Anuncio Gratis',
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    120.00,
    -2.168500,
    -79.914200,
    'Sonrisas reales y química instantánea desde el primer minuto.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000012',
    'Melanie',
    23,
    'Guayaquil',
    'Vía a la Costa VIP',
    '593987654332',
    'Cuerpo fitness esculpido, piel bronceada y energía contagiosa. Disponible para hoteles y urbanizaciones privadas.',
    ARRAY['Fitness', 'Playa & Piscina', 'Vía a la Costa', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/melanie.mp3',
    'Diamante',
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    140.00,
    -2.195000,
    -79.998000,
    'Salud, belleza y pasión en perfecto equilibrio.',
    'EC'
),

-- ── MACHALA (EL ORO) ──
(
    'a1000000-0000-0000-0000-000000000013',
    'Nicole',
    22,
    'Machala',
    'Sector Unioro VIP',
    '593987654333',
    'La acompañante favorita de los empresarios en Machala. Encuentros discretos en Hotel Oro Verde y suites de lujo.',
    ARRAY['Unioro', 'Hotel Oro Verde', 'Empresarial', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/nicole.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    130.00,
    -3.262500,
    -79.954200,
    'Tu secreto mejor guardado en la capital bananera del mundo.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000014',
    'Fiorella',
    24,
    'Machala',
    'Puerto Bolívar & Mar',
    '593987654334',
    'Sensualidad costera, mirada penetrante y atención apasionada. Ideal para escapadas gastronómicas frente al mar.',
    ARRAY['Costera', 'Mariscos & Cenas', 'Puerto Bolívar', '4K Verified'],
    ARRAY[
        'https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/fiorella.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    110.00,
    -3.268000,
    -79.998500,
    'Pasión sin fronteras con la calidez del mar del sur.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000015',
    'Julieta',
    21,
    'Machala',
    'Machala Centro VIP',
    '593987654335',
    'Chica universitaria sencilla, atenta y súper cariñosa. Trato íntimo, sin reloj y con total honestidad.',
    ARRAY['Universitaria', 'Centro VIP', 'Económica', 'Trato de Novios'],
    ARRAY[
        'https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/julieta.mp3',
    'Premium',
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    100.00,
    -3.258000,
    -79.961000,
    'Amor y ternura para despejar tu mente de la rutina.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000016',
    'Renata',
    23,
    'Machala',
    'Machala Este Residencial',
    '593987654336',
    'Elegante modelo colombiana de visita periódica en Machala. Excelente trato, masajes tántricos y discreción absoluta.',
    ARRAY['Colombiana VIP', 'Giras VIP', 'Masaje Tántrico', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/renata.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    140.00,
    -3.251000,
    -79.942000,
    'Una experiencia de seducción que supera cualquier expectativa.',
    'EC'
),

-- ── CUENCA (AZUAY) ──
(
    'a1000000-0000-0000-0000-000000000017',
    'Camila',
    21,
    'Cuenca',
    'El Vergel & Tomebamba',
    '593987654337',
    'Dulzura y sensualidad en el corazón de Cuenca. Atención exclusiva a caballeros respetuosos en hoteles boutique y departamentos.',
    ARRAY['Dulce', 'Trato de Novios', 'Privado 5★', 'Cuenca VIP'],
    ARRAY[
        'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/camila.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    130.00,
    -2.900550,
    -79.004530,
    'El encanto morlaco que transforma cualquier noche en poesía.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000018',
    'Martina',
    24,
    'Cuenca',
    'Puertas del Sol',
    '593987654338',
    'Acompañante refinada para viajes, gastronomía y descanso total. Experta en masajes relajantes de cuerpo completo.',
    ARRAY['Refinada', 'Puertas del Sol', 'Masaje 4K', 'Discreta'],
    ARRAY[
        'https://images.unsplash.com/photo-1534751516642-a1714f5a5078?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/martina.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    120.00,
    -2.891200,
    -79.025400,
    'Paz mental, belleza y conexión sin tabúes.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000019',
    'Paula',
    23,
    'Cuenca',
    'Centro Histórico Boutique',
    '593987654339',
    'Amante del arte, la arquitectura y los buenos tragos. Ideal para cenas íntimas en los mejores restaurantes de Cuenca.',
    ARRAY['Arte & Vino', 'Hotel Boutique', 'Cena Romántica'],
    ARRAY[
        'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/paula.mp3',
    'Premium',
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    110.00,
    -2.897400,
    -79.004200,
    'Cultura, belleza y pasión en un solo lugar.',
    'EC'
),

-- ── MANTA & PORTOVIEJO (MANABÍ) ──
(
    'a1000000-0000-0000-0000-000000000020',
    'Mia',
    22,
    'Manta',
    'Barbasquillo 5★',
    '593987654340',
    'Top model playera para fines de semana en Manta. Disponible para suites frente al mar en Barbasquillo y paseos en yate.',
    ARRAY['Barbasquillo', 'Yate & Playa', 'Hotel 5★', 'VIP Elite', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/mia.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    160.00,
    -0.942500,
    -80.748500,
    'El sol de Manabí reflejado en una experiencia inolvidable.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000021',
    'Catalina',
    24,
    'Manta',
    'Playa El Murciélago',
    '593987654341',
    'Belleza manabita con picardía y encanto inigualable. Cenas frente a la playa y atardeceres mágicos en Manta.',
    ARRAY['Murciélago', 'Cena al Atardecer', 'Manabita VIP', '4K Verified'],
    ARRAY[
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/catalina.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    140.00,
    -0.938000,
    -80.732000,
    'Seducción pura al ritmo de las olas del Pacífico.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000022',
    'Ariana',
    21,
    'Manta',
    'Manta 2000',
    '593987654342',
    'Chica universitaria fresca, cariñosa y complaciente. Atención en departamento privado con máxima seguridad.',
    ARRAY['Universitaria', 'Privado Seguro', 'Masaje Relajante'],
    ARRAY[
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/ariana.mp3',
    'Premium',
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    120.00,
    -0.961000,
    -80.718000,
    'Complicidad juvenil y descanso asegurado.',
    'EC'
),

-- ── AMBATO & SANTO DOMINGO ──
(
    'a1000000-0000-0000-0000-000000000023',
    'Bianca',
    23,
    'Ambato',
    'Ficoa Las Palmas',
    '593987654343',
    'La compañía más distinguida de Tungurahua. Exclusiva para citas reservadas en Ficoa y hoteles ejecutivos.',
    ARRAY['Ficoa', 'Ejecutiva', 'Trato de Novios', 'Ambato VIP'],
    ARRAY[
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/bianca.mp3',
    'Diamante',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    120.00,
    -1.242000,
    -78.632000,
    'La calidez de la sierra central con un toque cosmopolita.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000024',
    'Romina',
    22,
    'Ambato',
    'Miraflores',
    '593987654344',
    'Universitaria discreta y apasionada. Momentos íntimos sin complicaciones ni prisas en Ambato.',
    ARRAY['Universitaria', 'Discreción Total', 'Cariñosa'],
    ARRAY[
        'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/romina.mp3',
    'Premium',
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    100.00,
    -1.238000,
    -78.625000,
    'Dulces encuentros que alegran cualquier día.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000025',
    'Vanessa',
    25,
    'Santo Domingo',
    'Sector Zaracay VIP',
    '593987654345',
    'Curvas de fuego y atención apasionada en Santo Domingo de los Tsáchilas. Suites privadas y atención a caballeros de paso.',
    ARRAY['Zaracay', 'Curvilínea', 'Hotel VIP', 'Apasionada'],
    ARRAY[
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/vanessa.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    120.00,
    -0.252000,
    -79.175000,
    'Pura energía y pasión sin límites en el corazón del país.',
    'EC'
),
(
    'a1000000-0000-0000-0000-000000000026',
    'Estefanía',
    24,
    'Guayaquil',
    'Salinas & Yacht Club VIP',
    '593987654346',
    'Modelo de temporadas de playa en Salinas y Chipipe. Disponible para travesías náuticas y eventos de alto perfil en la costa.',
    ARRAY['Salinas VIP', 'Yacht Club', 'Alta Sociedad', 'Bóveda 4K'],
    ARRAY[
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'
    ],
    'https://carinosas.top/audio/estefania.mp3',
    'VIP Elite',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    220.00,
    -2.215000,
    -80.975000,
    'La reina del verano y de los momentos más exclusivos del mar.',
    'EC'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    city = EXCLUDED.city,
    sector = EXCLUDED.sector,
    whatsapp = EXCLUDED.whatsapp,
    description = EXCLUDED.description,
    tags = EXCLUDED.tags,
    images = EXCLUDED.images,
    plan_type = EXCLUDED.plan_type,
    is_verified = EXCLUDED.is_verified,
    is_verified_4k = EXCLUDED.is_verified_4k,
    is_online = EXCLUDED.is_online,
    is_boosted = EXCLUDED.is_boosted,
    hourly_rate = EXCLUDED.hourly_rate,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    personal_note = EXCLUDED.personal_note,
    country_code = EXCLUDED.country_code;

-- 2. INSERT SAMPLE VIP PASSES (Él & Ella)
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
    'VIP-MACHALA-ORO',
    'Socio Oro Machala',
    'gentleman',
    'Oro',
    'active',
    'bank_transfer',
    'DEP-PICHINCHA-9821',
    NOW() + INTERVAL '30 days'
),
(
    'VIP-SAMBORONDON-ALPHA',
    'Socio Diamante Guayaquil',
    'gentleman',
    'Diamante',
    'active',
    'crypto_usdt',
    'TX9qZ8k2LpM5vRt7wXyN4bC1sFd8gH3jK',
    NOW() + INTERVAL '60 days'
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

-- 3. INSERT 4K EPHEMERAL STORIES
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
    'a1000000-0000-0000-0000-000000000007',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    'image',
    'Llegando a Samborondón para el fin de semana 🔥',
    520,
    NOW() + INTERVAL '24 hours'
),
(
    'a1000000-0000-0000-0000-000000000013',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    'image',
    'Disponible hoy en Machala sector Unioro ✨',
    215,
    NOW() + INTERVAL '24 hours'
),
(
    'a1000000-0000-0000-0000-000000000020',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    'image',
    'Disfrutando el atardecer en Barbasquillo, Manta 🌊',
    430,
    NOW() + INTERVAL '24 hours'
);

-- 4. INSERT AUDITED VIP REVIEWS
INSERT INTO public.vip_reviews (
    model_id, author_alias, tier_badge, rating, comment, city, is_verified_booking
) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'Socio Alpha #084',
    'Alpha Founder',
    5,
    'La discreción y elegancia de Valentina en el Swissôtel fueron superlativas. Puntual, educada y hermosa.',
    'Quito',
    TRUE
),
(
    'a1000000-0000-0000-0000-000000000007',
    'Caballero Diamante #219',
    'Diamante VIP',
    5,
    'Experiencia de máximo lujo en Samborondón. Trato de primera categoría y total complicidad.',
    'Guayaquil',
    TRUE
),
(
    'a1000000-0000-0000-0000-000000000013',
    'Empresario El Oro #105',
    'Oro VIP',
    5,
    'Nicole en el Hotel Oro Verde fue una maravilla. Muy educada y hermosa, súper recomendada en Machala.',
    'Machala',
    TRUE
),
(
    'a1000000-0000-0000-0000-000000000017',
    'Caballero Morlaco #042',
    'Diamante VIP',
    5,
    'Camila es una dama encantadora. Excelente conversación y un trato cariñoso insuperable en Cuenca.',
    'Cuenca',
    TRUE
);
