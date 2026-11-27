import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { AppState } from '../types';
import { hasMeaningfulProgress, mergeAppStates } from '../utils/stateMerge';
import { normalizeAppState } from '../utils/storage';
import {
  clearSupabaseConfig,
  getSupabaseClient,
  isSupabaseConfigured,
  saveSupabaseConfig,
} from '../utils/supabaseClient';
import { useApp } from './AppContext';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface AuthContextValue {
  user: User | null;
  authLoading: boolean;
  supabaseConfigured: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  syncError: string | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; needsVerify?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
  saveCloudConfig: (url: string, anonKey: string) => void;
  clearCloudConfig: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function formatSyncError(err: unknown): string {
  let message = '';
  let code = '';

  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'object' && err !== null) {
    const obj = err as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
    message = typeof obj.message === 'string' ? obj.message : '';
    code = typeof obj.code === 'string' ? obj.code : '';
    if (!message && typeof obj.details === 'string') {
      message = obj.details;
    }
  } else if (typeof err === 'string') {
    message = err;
  }

  const lower = message.toLowerCase();
  if (
    code === '42P01' ||
    code === 'PGRST205' ||
    (lower.includes('user_progress') &&
      (lower.includes('does not exist') ||
        lower.includes('could not find the table') ||
        lower.includes('schema cache')))
  ) {
    return 'Chưa tạo bảng user_progress trên Supabase. Hãy bấm "Cấu hình máy chủ Supabase" bên dưới → Copy SQL → dán vào SQL Editor trên Supabase rồi bấm Run.';
  }

  if (code === '42501' || lower.includes('row-level security') || lower.includes('permission denied')) {
    const rawDetail = message ? ` (${message})` : '';
    if (lower.includes('permission denied')) {
      return `Tài khoản chưa được cấp quyền GRANT trên bảng user_progress. Hãy bấm "Cấu hình máy chủ Supabase" → Copy SQL mới và bấm Run lại trong SQL Editor.${rawDetail}`;
    }
    return `Thiếu quyền bảo mật (RLS Policy) trên bảng user_progress. Hãy bấm "Cấu hình máy chủ Supabase" → Copy SQL và chạy lại trong SQL Editor.${rawDetail}`;
  }

  if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
    return 'Không kết nối được máy chủ Supabase. Hãy kiểm tra kết nối mạng hoặc Project URL.';
  }

  if (message) {
    return code ? `${message} (mã: ${code})` : message;
  }
  return 'Không thể đồng bộ dữ liệu với Supabase.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, replaceState } = useApp();

  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean>(() =>
    isSupabaseConfigured()
  );
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(() => isSupabaseConfigured());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const latestStateRef = useRef<AppState>(state);
  latestStateRef.current = state;
  const prevStateRef = useRef<AppState>(state);
  const skipNextAutoUploadRef = useRef<boolean>(false);
  const inFlightPullRef = useRef<Promise<void> | null>(null);
  const syncedUserIdRef = useRef<string | null>(null);

  const pullAndMergeFromCloud = useCallback(
    async (targetUser: User) => {
      if (inFlightPullRef.current) {
        return inFlightPullRef.current;
      }

      const client = getSupabaseClient();
      if (!client) return;

      const task = (async () => {
        setSyncStatus('syncing');
        setSyncError(null);
        try {
          const { data, error } = await client
            .from('user_progress')
            .select('state, updated_at')
            .eq('user_id', targetUser.id)
            .maybeSingle();

          if (error) throw error;

          const localState = latestStateRef.current;
          if (data && data.state && typeof data.state === 'object') {
            const cloudState = normalizeAppState(data.state as Partial<AppState>);
            const merged = mergeAppStates(localState, cloudState);
            skipNextAutoUploadRef.current = true;
            replaceState(merged);

            // Push merged state back up if local device held extra unsynced progress
            if (hasMeaningfulProgress(localState)) {
              const { error: mergeUpErr } = await client.from('user_progress').upsert(
                {
                  user_id: targetUser.id,
                  state: merged,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
              );
              if (mergeUpErr) throw mergeUpErr;
            }
            setSyncStatus('synced');
            setLastSyncedAt(new Date().toISOString());
          } else {
            // First time user on cloud -> upload current local progress automatically
            const { error: upErr } = await client.from('user_progress').upsert(
              {
                user_id: targetUser.id,
                state: localState,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' }
            );
            if (upErr) throw upErr;
            setSyncStatus('synced');
            setLastSyncedAt(new Date().toISOString());
          }
        } catch (err) {
          setSyncStatus('error');
          setSyncError(formatSyncError(err));
        } finally {
          inFlightPullRef.current = null;
        }
      })();

      inFlightPullRef.current = task;
      return task;
    },
    [replaceState]
  );

  // Initialize Supabase session & auth listener without duplicate pulls
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setAuthLoading(false);
      setUser(null);
      syncedUserIdRef.current = null;
      return undefined;
    }

    let active = true;
    setAuthLoading(true);

    const { data: sub } = client.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      const u = session?.user ?? null;
      setUser(u);
      setAuthLoading(false);

      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && u) {
        if (syncedUserIdRef.current !== u.id) {
          syncedUserIdRef.current = u.id;
          void pullAndMergeFromCloud(u);
        }
      } else if (event === 'SIGNED_OUT') {
        syncedUserIdRef.current = null;
        setSyncStatus('idle');
        setLastSyncedAt(null);
        setSyncError(null);
      }
    });

    // Fallback check in case INITIAL_SESSION doesn't fire synchronously/promptly
    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      const u = data.session?.user ?? null;
      setUser(u);
      setAuthLoading(false);
      if (u && syncedUserIdRef.current !== u.id) {
        syncedUserIdRef.current = u.id;
        void pullAndMergeFromCloud(u);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabaseConfigured, pullAndMergeFromCloud]);

  // Debounced auto-upload to Supabase only when study state actually changes while logged in
  useEffect(() => {
    if (!user) {
      prevStateRef.current = state;
      return undefined;
    }

    if (prevStateRef.current === state) {
      return undefined;
    }
    prevStateRef.current = state;

    if (skipNextAutoUploadRef.current) {
      skipNextAutoUploadRef.current = false;
      return undefined;
    }

    const client = getSupabaseClient();
    if (!client) return undefined;

    const timer = window.setTimeout(async () => {
      setSyncStatus('syncing');
      setSyncError(null);
      try {
        const { error } = await client.from('user_progress').upsert(
          {
            user_id: user.id,
            state: latestStateRef.current,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
        if (error) throw error;
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        setSyncStatus('error');
        setSyncError(formatSyncError(err));
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [state, user]);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      const client = getSupabaseClient();
      if (!client) {
        return { ok: false, error: 'Chưa cấu hình kết nối Supabase.' };
      }
      const { error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        return { ok: false, error: error.message };
      }
      return { ok: true };
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ ok: boolean; needsVerify?: boolean; error?: string }> => {
      const client = getSupabaseClient();
      if (!client) {
        return { ok: false, error: 'Chưa cấu hình kết nối Supabase.' };
      }
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) {
        return { ok: false, error: error.message };
      }
      const needsVerify = !data.session;
      return { ok: true, needsVerify };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    syncedUserIdRef.current = null;
    setUser(null);
    setSyncStatus('idle');
    setLastSyncedAt(null);
    setSyncError(null);
  }, []);

  const syncNow = useCallback(async (): Promise<void> => {
    if (!user) return;
    await pullAndMergeFromCloud(user);
  }, [user, pullAndMergeFromCloud]);

  const saveCloudConfig = useCallback((url: string, anonKey: string) => {
    saveSupabaseConfig(url, anonKey);
    syncedUserIdRef.current = null;
    setSupabaseConfigured(isSupabaseConfigured());
  }, []);

  const clearCloudConfig = useCallback(() => {
    clearSupabaseConfig();
    syncedUserIdRef.current = null;
    setUser(null);
    setSupabaseConfigured(false);
    setSyncStatus('idle');
    setLastSyncedAt(null);
    setSyncError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authLoading,
      supabaseConfigured,
      syncStatus,
      lastSyncedAt,
      syncError,
      authModalOpen,
      setAuthModalOpen,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      syncNow,
      saveCloudConfig,
      clearCloudConfig,
    }),
    [
      user,
      authLoading,
      supabaseConfigured,
      syncStatus,
      lastSyncedAt,
      syncError,
      authModalOpen,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      syncNow,
      saveCloudConfig,
      clearCloudConfig,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
