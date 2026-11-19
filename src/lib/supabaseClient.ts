import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const safeUrl = url || 'https://placeholder-project.supabase.co';
  const safeKey = key || 'placeholder-anon-key';

  if (!_supabaseClient || (_supabaseClient as any).__configuredUrl !== safeUrl) {
    _supabaseClient = createClient(safeUrl, safeKey);
    (_supabaseClient as any).__configuredUrl = safeUrl;
  }

  return _supabaseClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
