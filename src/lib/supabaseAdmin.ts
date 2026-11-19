import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  // Fallback to dummy credentials during build/static-analysis so Next.js build never crashes
  const safeUrl = url || 'https://placeholder-project.supabase.co';
  const safeKey = key || 'placeholder-service-role-key';

  if (!_supabaseAdmin || (_supabaseAdmin as any).__configuredUrl !== safeUrl) {
    _supabaseAdmin = createClient(safeUrl, safeKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    (_supabaseAdmin as any).__configuredUrl = safeUrl;
  }

  return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
