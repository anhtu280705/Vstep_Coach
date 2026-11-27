import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_CONFIG_KEY = 'vstep_supabase_config_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const SUPABASE_SETUP_SQL = `-- Tạo bảng lưu tiến độ học tập riêng cho từng tài khoản
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Bật bảo mật theo từng user (Row Level Security)
alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);`;

let cachedClient: SupabaseClient | null = null;
let cachedKeySignature = '';

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SupabaseConfig>;
      return {
        url: (parsed.url ?? '').trim(),
        anonKey: (parsed.anonKey ?? '').trim(),
      };
    }
  } catch {
    // Ignore storage read errors
  }

  return { url: '', anonKey: '' };
}

export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url.startsWith('http') && cfg.anonKey.length > 20);
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = anonKey.trim();
  localStorage.setItem(
    SUPABASE_CONFIG_KEY,
    JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
  );
  cachedClient = null;
  cachedKeySignature = '';
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(SUPABASE_CONFIG_KEY);
  cachedClient = null;
  cachedKeySignature = '';
}

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg.url.startsWith('http') || cfg.anonKey.length <= 20) {
    return null;
  }

  const signature = `${cfg.url}::${cfg.anonKey}`;
  if (cachedClient && cachedKeySignature === signature) {
    return cachedClient;
  }

  cachedClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  cachedKeySignature = signature;
  return cachedClient;
}
