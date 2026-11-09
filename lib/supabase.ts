import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_STORAGE_URL_KEY = 'cinelumina_supabase_url_custom';
const SUPABASE_STORAGE_KEY_ANON = 'cinelumina_supabase_anon_custom';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem(SUPABASE_STORAGE_URL_KEY) || '';
    const localKey = localStorage.getItem(SUPABASE_STORAGE_KEY_ANON) || '';
    const finalUrl = envUrl || localUrl;
    const finalKey = envKey || localKey;
    return { url: finalUrl, anonKey: finalKey };
  }

  return { url: envUrl, anonKey: envKey };
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_STORAGE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_STORAGE_KEY_ANON, anonKey.trim());
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(
    url &&
    anonKey &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-key') &&
    url.startsWith('https://')
  );
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || !url.startsWith('https://')) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return cachedClient;
}

export const supabase = getSupabaseClient();
