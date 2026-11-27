import React, { useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  Cloud,
  Compass,
  GraduationCap,
  Layers,
  LogIn,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TabId } from '../../types';

const NAV_ITEMS: { id: TabId; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Hôm nay & Lộ trình 14 ngày',
    shortLabel: 'Lộ trình',
    icon: <Compass className="w-5 h-5" />,
  },
  {
    id: 'vocab',
    label: 'Từ vựng Flashcard',
    shortLabel: 'Từ vựng',
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: 'grammar',
    label: 'Ngữ pháp B1–B2',
    shortLabel: 'Ngữ pháp',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'skills',
    label: 'Chiến thuật 4 Kỹ năng',
    shortLabel: '4 Kỹ năng',
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    id: 'settings',
    label: 'Cài đặt & Sao lưu',
    shortLabel: 'Cài đặt',
    icon: <Settings className="w-5 h-5" />,
  },
];

export const Sidebar: React.FC = () => {
  const {
    state,
    activeTab,
    setActiveTab,
    updateSettings,
    dueWordsToday,
    currentRoadmapDay,
    daysUntilExam,
    roadmapCompletionPercent,
  } = useApp();
  const { user, syncStatus, setAuthModalOpen } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = state.settings.theme === 'dark';

  const toggleTheme = () => {
    updateSettings({ theme: isDark ? 'light' : 'dark' });
  };

  const countdownBadge =
    daysUntilExam > 0
      ? `Còn ${daysUntilExam} ngày`
      : daysUntilExam === 0
      ? 'Hôm nay thi!'
      : 'Đã qua ngày thi';

  const handleSelect = (id: TabId) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const renderSidebarBody = () => (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-bold text-lg">
            V
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white leading-tight text-base">
              VSTEP Coach
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mục tiêu B1–B2 · 14 ngày</p>
          </div>
        </div>

        {/* Countdown card */}
        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-indigo-700 dark:text-indigo-300">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4" />
              Đếm ngược kỳ thi
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-semibold">
              {countdownBadge}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>Lộ trình: Ngày {currentRoadmapDay}/14</span>
            <span className="font-semibold">{roadmapCompletionPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-indigo-200/70 dark:bg-indigo-900 overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
              style={{ width: `${roadmapCompletionPercent}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {item.id === 'vocab' && dueWordsToday.length > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                    }`}
                  >
                    {dueWordsToday.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom toggles: Account + Dragon companion + Theme */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button
          onClick={() => {
            setAuthModalOpen(true);
            setMobileOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            {user ? (
              <Cloud className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <LogIn className="w-4 h-4 text-indigo-500 shrink-0" />
            )}
            <span className="truncate">
              {user ? user.email?.split('@')[0] : 'Đăng nhập / Đồng bộ'}
            </span>
          </span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-md font-semibold shrink-0 ${
              user
                ? syncStatus === 'error'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
            }`}
          >
            {user ? (syncStatus === 'syncing' ? 'Sync...' : 'Cloud') : 'Mở'}
          </span>
        </button>

        <button
          onClick={() => updateSettings({ showDragon: !state.settings.showDragon })}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Sparkles
              className={`w-4 h-4 ${
                state.settings.showDragon
                  ? 'text-indigo-500 dark:text-indigo-400'
                  : 'text-slate-400'
              }`}
            />
            <span>Rồng đồng hành</span>
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
              state.settings.showDragon
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {state.settings.showDragon ? 'Bật' : 'Tắt'}
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Chế độ Sáng' : 'Chế độ Tối'}</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block relative z-20 w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen">
        {renderSidebarBody()}
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
            V
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">VSTEP Coach</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-medium">
              Ngày {currentRoadmapDay}/14
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAuthModalOpen(true)}
            aria-label="Tài khoản và đồng bộ"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {user ? (
              <Cloud className="w-5 h-5 text-emerald-500" />
            ) : (
              <LogIn className="w-5 h-5 text-indigo-500" />
            )}
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Đổi giao diện Sáng/Tối"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-50">
            {renderSidebarBody()}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 px-1 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-medium ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.icon}
              <span className="mt-0.5 truncate max-w-full px-1">{item.shortLabel}</span>
              {item.id === 'vocab' && dueWordsToday.length > 0 && (
                <span className="absolute top-0.5 right-3 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
