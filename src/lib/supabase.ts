import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseSetupMessage() {
  return 'Chưa cấu hình Supabase. Hãy điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env.local, sau đó khởi động lại ứng dụng.';
}
