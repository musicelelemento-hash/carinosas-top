import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcyyhjajmozzbbsggfrh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeXloamFqbW96emJic2dnZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NTY2NTgsImV4cCI6MjEwMjMzMjY1OH0.rJL6G5WUYH8NJy9vRdxn9w0VyXDz7HKtAWqBgy4TVUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
