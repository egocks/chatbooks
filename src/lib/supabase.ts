import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables are set in the .env file
// For development, you can hardcode them here temporarily
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
