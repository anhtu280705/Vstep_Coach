import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Cloud,
  Download,
  LogIn,
  Moon,
  RefreshCw,
  RotateCcw,
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  Upload,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TtsAccent, TtsRate } from '../../types';
import { addDays, getTodayStr } from '../../utils/date';
import { speakText } from '../../utils/tts';

export const SettingsView: React.FC = () => {
  const {
    state,
    currentRoadmapDay,
    daysUntilExam,
    updateSettings,
    exportData,
    importData,
    resetData,
  } = useApp();
  const { user, syncStatus, setAuthModalOpen, syncNow } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vstep-b1b2-backup-${getTodayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({
      type: 'success',
      text: 'Đã tải xuống tệp sao lưu JSON tiến độ học tập của bạn.',
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? '');
      const res = importData(content);
      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: 'Khôi phục dữ liệu học tập thành công!',
        });
      } else {
        setStatusMsg({
          type: 'error',
          text: res.error ?? 'Tệp không hợp lệ.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleStartDateChange = (newStart: string) => {
    if (!newStart) return;
    updateSettings({
      startDate: newStart,
      examDate: addDays(newStart, 13),
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Cài đặt & Sao lưu tiến độ
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Tùy chỉnh lịch thi 14 ngày, giọng đọc phát âm và sao lưu trạng thái học tập cá nhân.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`rounded-xl p-3.5 text-sm flex items-center gap-2 border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Cloud Sync & Account */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-500" />
              Tài khoản &amp; Đồng bộ đám mây (PC ↔ Điện thoại)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user
                ? `Đang đăng nhập: ${user.email} · Trạng thái: ${
                    syncStatus === 'synced'
                      ? 'Đã đồng bộ'
                      : syncStatus === 'syncing'
                      ? 'Đang đồng bộ...'
                      : syncStatus === 'error'
                      ? 'Lỗi đồng bộ'
                      : 'Sẵn sàng'
                  }`
                : 'Đăng nhập bằng email để tự động lưu và đồng bộ tiến độ giữa nhiều thiết bị.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {user && (
              <button
                onClick={() => void syncNow()}
                disabled={syncStatus === 'syncing'}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
                />
                Đồng bộ ngay
              </button>
            )}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              {user ? 'Quản lý tài khoản' : 'Đăng nhập / Kết nối Supabase'}
            </button>
          </div>
        </div>
      </section>

      {/* Schedule Settings */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Lịch ôn thi 2 tuần (14 ngày)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Ngày bắt đầu lộ trình (Ngày 1)
            </label>
            <input
              type="date"
              value={state.settings.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Ngày thi dự kiến
            </label>
            <input
              type="date"
              value={state.settings.examDate}
              onChange={(e) => updateSettings({ examDate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <span>
            Tiến độ hiện tại theo lịch: <strong className="text-slate-800 dark:text-slate-200">Ngày {currentRoadmapDay}/14</strong>
          </span>
          <span>
            {daysUntilExam >= 0
              ? `Còn ${daysUntilExam} ngày tới ngày thi`
              : 'Đã qua ngày thi dự kiến'}
          </span>
        </div>
      </section>

      {/* TTS & Appearance */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-indigo-500" />
          Phát âm tự động (Text-to-Speech) & Giao diện
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Tự động phát âm khi lật sang thẻ Flashcard mới
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Giúp bạn ghi nhớ mặt chữ và cách phát âm cùng lúc.
            </div>
          </div>
          <button
            onClick={() => updateSettings({ autoSpeak: !state.settings.autoSpeak })}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              state.settings.autoSpeak
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {state.settings.autoSpeak ? 'Đang bật' : 'Đang tắt'}
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Hiệu ứng Rồng Á Đông bay lượn quanh thẻ
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Trang trí nền sinh động phía sau lớp kính mờ, không che chữ và có thể tắt bất cứ lúc nào.
            </div>
          </div>
          <button
            onClick={() => updateSettings({ showDragon: !state.settings.showDragon })}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 ${
              state.settings.showDragon
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {state.settings.showDragon ? 'Đang bật' : 'Đang tắt'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Giọng đọc tiếng Anh
            </label>
            <select
              value={state.settings.ttsAccent}
              onChange={(e) =>
                updateSettings({ ttsAccent: e.target.value as TtsAccent })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
            >
              <option value="en-US">Anh – Mỹ (en-US)</option>
              <option value="en-GB">Anh – Anh (en-GB)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Tốc độ đọc
            </label>
            <select
              value={state.settings.ttsRate}
              onChange={(e) =>
                updateSettings({ ttsRate: Number(e.target.value) as TtsRate })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
            >
              <option value={0.75}>0.75x (Chậm, rõ từng âm)</option>
              <option value={1}>1.0x (Tốc độ tự nhiên)</option>
              <option value={1.15}>1.15x (Nhanh hơn)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() =>
              speakText('Sustainable development is crucial for our future.', {
                accent: state.settings.ttsAccent,
                rate: state.settings.ttsRate,
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            Nghe thử giọng đọc hiện tại
          </button>

          <button
            onClick={() =>
              updateSettings({
                theme: state.settings.theme === 'dark' ? 'light' : 'dark',
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {state.settings.theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                Chuyển sang giao diện Sáng
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                Chuyển sang giao diện Tối
              </>
            )}
          </button>
        </div>
      </section>

      {/* Backup & Restore */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white">
          Sao lưu & Khôi phục dữ liệu cá nhân
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Mọi tiến độ học từ vựng, lịch ôn SRS, điểm bài tập ngữ pháp, ghi chú và danh sách từ cá nhân đều được lưu tự động trên trình duyệt này. Bạn có thể xuất tệp JSON để sao lưu hoặc chuyển sang thiết bị khác.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu (JSON)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Nhập dữ liệu từ JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>

        {/* Reset Danger Zone */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại toàn bộ tiến độ về ban đầu
            </button>
          ) : (
            <div className="rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4" />
                Bạn chắc chắn muốn xóa toàn bộ tiến độ và từ cá nhân? Hành động này không thể hoàn tác.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetData();
                    setConfirmReset(false);
                    setStatusMsg({
                      type: 'success',
                      text: 'Đã đặt lại toàn bộ dữ liệu về mặc định.',
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Xác nhận xóa
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
