import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uvrpvramkocndrbeugls.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cnB2cmFta29jbmRyYmV1Z2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDEzODEsImV4cCI6MjA4OTE3NzM4MX0.BlfknWpmiWvepFTlR-NJXuVdFDqHN0NclBWf3CkzgN4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
