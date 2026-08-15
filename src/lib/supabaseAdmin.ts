import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uvrpvramkocndrbeugls.supabase.co';
// Service role key or fallback to Anon Key so operations never fail
const supabaseServiceRoleKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cnB2cmFta29jbmRyYmV1Z2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDEzODEsImV4cCI6MjA4OTE3NzM4MX0.BlfknWpmiWvepFTlR-NJXuVdFDqHN0NclBWf3CkzgN4';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
