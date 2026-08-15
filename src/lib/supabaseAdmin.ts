import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcyyhjajmozzbbsggfrh.supabase.co';
// Service role key or fallback to Anon Key so operations never fail
const supabaseServiceRoleKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeXloamFqbW96emJic2dnZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njc1NjY1OCwiZXhwIjoyMTAyMzMyNjU4fQ.k37IIk6YXMsXLYqc6S9EorZ4v2N34qgF9ho6uDXZ3xE';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
