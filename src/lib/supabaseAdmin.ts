import { createClient } from '@supabase/supabase-js';

// SECURITY (P0): nunca hardcodear secretos en el código fuente.
// La Service Role key anula por completo las políticas RLS de Supabase.
// Si falta la variable de entorno, fallamos en frío (fail-closed) en lugar
// de usar un fallback con una key comprometida que estaba en git.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    '[supabaseAdmin] Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. ' +
    'Configúralas en el entorno (Vercel/Cloudflare). No se permiten fallbacks con secretos en código.'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
