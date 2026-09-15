import { createClient } from '@supabase/supabase-js';

// SECURITY (P0): la anon key no es un secreto real, pero no debe hardcodearse
// con un proyecto de producción concreto. Se lee SIEMPRE del entorno.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[supabase] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Configúralas en el entorno.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
