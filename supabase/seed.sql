-- Seed file for models table
-- Run this in your Supabase SQL Editor to pre-populate with static fallback models.

TRUNCATE TABLE models RESTART IDENTITY;

-- 1. Valentina
INSERT INTO models (id, name, age, city, sector, whatsapp, description, plan_type, is_verified, is_verified_4k, is_online, is_boosted, personal_note, images, tags, lat, lng) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Valentina',
  21,
  'Quito',
  'Cumbayá',
  '593900000000',
  'Modelo exclusiva con un aura de misterio y elegancia natural. Valentina personifica la sofisticación de Quito, ofreciendo una compañía que trasciende lo convencional para convertirse en una experiencia de alto diseño.',
  'VIP Elite',
  true,
  true,
  true,
  true,
  'Cada encuentro es una historia que merece ser contada con elegancia.',
  ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200'],
  ARRAY['#Elite', '#Luxury', '#QuitoNight', '#Cumbayá'],
  -0.1807,
  -78.4678
);

-- 2. Camila
INSERT INTO models (id, name, age, city, sector, whatsapp, description, plan_type, is_verified, is_verified_4k, is_online, is_boosted, personal_note, images, tags, lat, lng) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Camila',
  23,
  'Guayaquil',
  'Samborondón',
  '593911111111',
  'Descubre la exclusividad en el corazón de Guayaquil. Una experiencia diseñada para caballeros que exigen lo mejor, donde la elegancia y la discreción son nuestra prioridad absoluta.',
  'Diamante',
  true,
  true,
  true,
  true,
  'El trato preferencial y la exclusividad que te mereces.',
  ARRAY['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200'],
  ARRAY['#Samborondón', '#PuertoSantaAna', '#GuayaquilVIP'],
  -2.1894,
  -79.8891
);

-- 3. Luciana
INSERT INTO models (id, name, age, city, sector, whatsapp, description, plan_type, is_verified, is_verified_4k, is_online, is_boosted, personal_note, images, tags, lat, lng) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Luciana',
  22,
  'Cuenca',
  'Centro Histórico',
  '593922222222',
  'Sumérgete en un mundo de sofisticación en Cuenca. Un espacio creado para quienes valoran la distinción y buscan una compañía de clase mundial.',
  'Premium',
  true,
  false,
  true,
  false,
  'Una velada agradable en el ambiente más refinado.',
  ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200'],
  ARRAY['#CuencaElite', '#CentroHistórico', '#AzuayVIP'],
  -2.9001,
  -79.0059
);

-- 4. Alessandra
INSERT INTO models (id, name, age, city, sector, whatsapp, description, plan_type, is_verified, is_verified_4k, is_online, is_boosted, personal_note, images, tags, lat, lng) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Alessandra',
  25,
  'Manta',
  'Murciélago',
  '593933333333',
  'Eleva tus sentidos en Manta. Te invito a disfrutar de un encuentro de alto nivel, rodeada de lujo y el trato preferencial que mereces.',
  'VIP Elite',
  true,
  false,
  true,
  true,
  'Exclusividad y brisa marina para tus momentos de relax.',
  ARRAY['https://images.unsplash.com/photo-1503105391650-704fd6827a88?auto=format&fit=crop&q=80&w=1200'],
  ARRAY['#MantaVIP', '#Murciélago', '#CostaLujo'],
  -0.9621,
  -80.7127
);

-- 5. Isabella
INSERT INTO models (id, name, age, city, sector, whatsapp, description, plan_type, is_verified, is_verified_4k, is_online, is_boosted, personal_note, images, tags, lat, lng) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Isabella',
  24,
  'Quito',
  'La Carolina',
  '593944444444',
  'Sofisticada y atenta compañía para caballeros distinguidos en la capital. Experiencias diseñadas a la medida.',
  'Anuncio Gratis',
  false,
  false,
  true,
  false,
  'Elegancia natural y discreción absoluta en tus reuniones.',
  ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200'],
  ARRAY['#LaCarolina', '#QuitoElite', '#DiscreciónTotal'],
  -0.1820,
  -78.4630
);

-- 6. Antonella
INSERT INTO models (id, name, age, city, sector, whatsapp, description, plan_type, is_verified, is_verified_4k, is_online, is_boosted, personal_note, images, tags, lat, lng) VALUES (
  '66666666-6666-6666-6666-666666666666',
  'Antonella',
  26,
  'Guayaquil',
  'Puerto Santa Ana',
  '593955555555',
  'Compañía fascinante en los mejores rincones de Guayaquil. Trato preferencial con la discreción que requieres.',
  'Premium',
  true,
  false,
  true,
  false,
  'Un trato dulce e inolvidable.',
  ARRAY['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200'],
  ARRAY['#PuertoSantaAna', '#GuayaquilVIP', '#Exclusividad'],
  -2.1800,
  -79.8800
);
