import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const isPlaceholder = !rawUrl || 
  rawUrl.includes('placeholder') || 
  rawUrl.includes('tu_url_de_supabase') || 
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder') || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('tu_anon_key_de_supabase');

export const isSupabaseConfigured = !isPlaceholder;

const supabaseUrl = (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')))
  ? rawUrl
  : 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Cliente público para frontend (usando Anon Key, respeta RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente administrador para backend (usando Service Role Key, se salta RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

