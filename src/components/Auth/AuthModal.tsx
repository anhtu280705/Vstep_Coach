import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Cloud,
  CloudOff,
  Copy,
  KeyRound,
  LogIn,
  LogOut,
  RefreshCw,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseConfig, SUPABASE_SETUP_SQL } from '../../utils/supabaseClient';

function translateAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Sai email hoặc mật khẩu. Vui lòng kiểm tra lại.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư đến (hoặc tắt Confirm email trong Supabase Auth).';
  }
  if (lower.includes('user already registered')) {
    return 'Email này đã được đăng ký trước đó. Hãy chuyển sang tab Đăng nhập.';
  }
  if (lower.includes('password should be at least')) {
    return 'Mật khẩu cần tối thiểu 6 ký tự.';
  }
  if (lower.includes('signups are disabled') || lower.includes('signup is disabled')) {
    return 'Đăng ký bằng Email đang bị tắt trên Supabase. Hãy vào Authentication → Providers → bật Email provider và Allow new users to sign up rồi bấm Save.';
  }
  return msg;
}

export const AuthModal: React.FC = () => {
  const {
    user,
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
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // Cloud config form
  const [showConfigEditor, setShowConfigEditor] = useState(!supabaseConfigured);
  const [cfgUrl, setCfgUrl] = useState(() => getSupabaseConfig().url);
  const [cfgKey, setCfgKey] = useState(() => getSupabaseConfig().anonKey);
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync form fields & clear stale feedback whenever modal opens or config changes
  useEffect(() => {
    if (!authModalOpen) return;
    const latestCfg = getSupabaseConfig();
    setCfgUrl(latestCfg.url);
    setCfgKey(latestCfg.anonKey);
    setShowConfigEditor(!supabaseConfigured);
    setFeedback(null);
    setPassword('');
  }, [authModalOpen, supabaseConfigured]);

  // Allow Escape key to close the modal
  useEffect(() => {
    if (!authModalOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [authModalOpen, setAuthModalOpen]);

  if (!authModalOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      setFeedback({
        type: 'error',
        text: 'Vui lòng nhập email hợp lệ và mật khẩu ít nhất 6 ký tự.',
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    if (authMode === 'login') {
      const res = await signInWithEmail(email, password);
      setSubmitting(false);
      if (!res.ok) {
        setFeedback({
          type: 'error',
          text: translateAuthError(res.error ?? 'Đăng nhập thất bại.'),
        });
      } else {
        setFeedback({
          type: 'success',
          text: 'Đăng nhập thành công! Đang đồng bộ tiến độ học tập...',
        });
      }
    } else {
      const res = await signUpWithEmail(email, password);
      setSubmitting(false);
      if (!res.ok) {
        setFeedback({
          type: 'error',
          text: translateAuthError(res.error ?? 'Đăng ký thất bại.'),
        });
      } else if (res.needsVerify) {
        setFeedback({
          type: 'success',
          text: 'Đăng ký thành công! Hãy mở email bấm link xác nhận rồi quay lại Đăng nhập.',
        });
      } else {
        setFeedback({
          type: 'success',
          text: 'Tạo tài khoản và đăng nhập thành công! Tiến độ hiện tại đang được lưu lên đám mây.',
        });
      }
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfgUrl.trim().startsWith('http') || cfgKey.trim().length <= 20) {
      setFeedback({
        type: 'error',
        text: 'Project URL (https://...) hoặc Anon Key chưa hợp lệ.',
      });
      return;
    }
    saveCloudConfig(cfgUrl, cfgKey);
    setShowConfigEditor(false);
    setFeedback({
      type: 'success',
      text: 'Đã lưu kết nối Supabase! Bây giờ bạn có thể đăng ký hoặc đăng nhập.',
    });
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div
      onClick={() => setAuthModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Tài khoản & Đồng bộ đa thiết bị
            </h3>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {feedback && (
            <div
              className={`rounded-xl p-3 text-xs sm:text-sm flex items-start gap-2 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Logged-in Dashboard */}
          {user && !showConfigEditor && (
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 p-4 space-y-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Đang đăng nhập với tài khoản:
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white break-all">
                  {user.email}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                      syncStatus === 'synced'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : syncStatus === 'syncing'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : syncStatus === 'error'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {syncStatus === 'synced'
                      ? 'Đã đồng bộ Cloud'
                      : syncStatus === 'syncing'
                      ? 'Đang đồng bộ...'
                      : syncStatus === 'error'
                      ? 'Lỗi đồng bộ'
                      : 'Sẵn sàng đồng bộ'}
                  </span>
                  {lastSyncedAt && (
                    <span className="text-slate-500 dark:text-slate-400">
                      Cập nhật lúc {new Date(lastSyncedAt).toLocaleTimeString('vi-VN')}
                    </span>
                  )}
                </div>
                {syncError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 pt-1">
                    Chi tiết: {syncError}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => void syncNow()}
                  disabled={syncStatus === 'syncing'}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
                  />
                  Đồng bộ ngay
                </button>

                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          {/* Sign In / Sign Up Form when configured */}
          {supabaseConfigured && !user && !showConfigEditor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setFeedback(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setFeedback(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Đăng ký tài khoản mới
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vd: anhtu@gmail.com"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu (tối thiểu 6 ký tự)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold cursor-pointer"
                >
                  {authMode === 'login' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      {submitting ? 'Đang đăng nhập...' : 'Đăng nhập & Đồng bộ'}
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </>
                  )}
                </button>
              </form>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Tiến độ bạn đã học trên máy hiện tại sẽ được tự động gộp và đẩy lên tài khoản ngay khi đăng nhập thành công.
              </p>
            </div>
          )}

          {/* Setup Supabase Config View */}
          {(!supabaseConfigured || showConfigEditor) && (
            <div className="space-y-3.5">
              {!supabaseConfigured && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <CloudOff className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Chưa kết nối Supabase Cloud. Làm nhanh 3 bước dưới đây (~2 phút, miễn phí) để bật đăng nhập và đồng bộ giữa máy tính ↔ điện thoại:
                  </span>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <strong>Bước 1:</strong> Tạo 1 project miễn phí tại{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-semibold underline"
                  >
                    supabase.com
                  </a>{' '}
                  (có thể vào <em>Authentication → Providers → Email</em> tắt mục <em>Confirm email</em> để đăng ký dùng ngay không cần xác nhận mail).
                </div>
                <div>
                  <strong>Bước 2:</strong> Mở mục <strong>SQL Editor</strong> trên Supabase, dán đoạn SQL sau và bấm <strong>Run</strong>:
                </div>
                <div className="relative">
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-32">
                    {SUPABASE_SETUP_SQL}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-semibold cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedSql ? 'Đã chép' : 'Copy SQL'}
                  </button>
                </div>
                <div>
                  <strong>Bước 3:</strong> Vào <strong>Project Settings → Data API / API Keys</strong>, dán 2 mã vào dưới đây:
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project URL
                  </label>
                  <input
                    type="url"
                    required
                    value={cfgUrl}
                    onChange={(e) => setCfgUrl(e.target.value)}
                    placeholder="https://xxxxxxxxxxxx.supabase.co"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Anon / Publishable Key
                  </label>
                  <input
                    type="text"
                    required
                    value={cfgKey}
                    onChange={(e) => setCfgKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {supabaseConfigured && (
                    <button
                      type="button"
                      onClick={() => {
                        clearCloudConfig();
                        setCfgUrl('');
                        setCfgKey('');
                      }}
                      className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      Ngắt kết nối hiện tại
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    {supabaseConfigured && (
                      <button
                        type="button"
                        onClick={() => setShowConfigEditor(false)}
                        className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Quay lại
                      </button>
                    )}
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Lưu kết nối
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Footer link to change Supabase config */}
          {supabaseConfigured && !showConfigEditor && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfigEditor(true)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-indigo-500 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                Cấu hình máy chủ Supabase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
