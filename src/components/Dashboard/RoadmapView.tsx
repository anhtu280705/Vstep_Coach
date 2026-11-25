import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  GraduationCap,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { ROADMAP_DAYS } from '../../data/roadmapData';
import { useApp } from '../../context/AppContext';
import { RoadmapCategory, RoadmapTask } from '../../types';
import { addDays, formatDisplayDate } from '../../utils/date';

const CATEGORY_META: Record<
  RoadmapCategory,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  vocab: {
    label: 'Từ vựng',
    badgeClass:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    icon: <Layers className="w-3.5 h-3.5" />,
  },
  grammar: {
    label: 'Ngữ pháp',
    badgeClass:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  skills: {
    label: '4 Kỹ năng',
    badgeClass:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
  review: {
    label: 'Ôn tập SRS',
    badgeClass:
      'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
    icon: <RotateCcw className="w-3.5 h-3.5" />,
  },
};

export const RoadmapView: React.FC = () => {
  const {
    state,
    currentRoadmapDay,
    toggleRoadmapTask,
    navigateTo,
    allWords,
    dueWordsToday,
  } = useApp();
  const [selectedDay, setSelectedDay] = useState<number>(currentRoadmapDay);

  const dayPlan = ROADMAP_DAYS.find((d) => d.day === selectedDay) ?? ROADMAP_DAYS[0];
  const dayDateStr = addDays(state.settings.startDate, dayPlan.day - 1);

  const getTaskLiveHint = (task: RoadmapTask): string | null => {
    const { tab, itemId, mode } = task.targetNav;
    if (tab === 'vocab') {
      if (mode === 'srs') {
        return dueWordsToday.length > 0
          ? `Hiện có ${dueWordsToday.length} từ đến hạn ôn`
          : 'Đã quét sạch thẻ đến hạn hôm nay';
      }
      if (itemId) {
        const topicWords = allWords.filter((w) => w.topicId === itemId);
        const mastered = topicWords.filter(
          (w) => state.vocabProgress[w.id]?.status === 'mastered'
        ).length;
        return `Tiến độ chủ đề: ${mastered}/${topicWords.length} từ đã thuộc`;
      }
    }
    if (tab === 'grammar' && itemId) {
      const gp = state.grammarProgress[itemId];
      if (!gp || gp.attempts === 0) return 'Chưa làm bài tập';
      return `Điểm cao nhất: ${gp.bestScore}%${gp.completed ? ' · Đã đạt' : ''}`;
    }
    if (tab === 'skills' && itemId) {
      const sp = state.skillProgress[itemId];
      if (sp?.mastered) return 'Đã đánh dấu nắm vững';
    }
    return null;
  };

  const renderWeekGrid = (week: 1 | 2, title: string) => {
    const days = ROADMAP_DAYS.filter((d) => d.week === week);
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const doneCount = d.tasks.filter(
              (t) => state.roadmapCompletedTasks[t.id]
            ).length;
            const isAllDone = doneCount === d.tasks.length;
            const isSelected = d.day === selectedDay;
            const isToday = d.day === currentRoadmapDay;

            return (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`relative rounded-xl p-2 text-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : isAllDone
                    ? 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isToday && (
                  <span
                    title="Ngày hôm nay"
                    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                      isSelected
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    Nay
                  </span>
                )}
                <div className="text-xs font-bold mt-0.5">N{d.day}</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isSelected
                      ? 'text-indigo-100'
                      : isAllDone
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {doneCount}/{d.tasks.length}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const completedInDay = dayPlan.tasks.filter(
    (t) => state.roadmapCompletedTasks[t.id]
  ).length;

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Lộ trình ôn thi cấp tốc 14 ngày
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Chọn từng ngày để xem nhiệm vụ và chuyển thẳng tới bài học tương ứng.
          </p>
        </div>
        {selectedDay !== currentRoadmapDay && (
          <button
            onClick={() => setSelectedDay(currentRoadmapDay)}
            className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
          >
            Quay về Hôm nay (Ngày {currentRoadmapDay})
          </button>
        )}
      </div>

      {/* 14-day selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderWeekGrid(1, 'Tuần 1 (Ngày 1–7): Xây nền Từ vựng, Ngữ pháp & Nghe/Đọc')}
        {renderWeekGrid(2, 'Tuần 2 (Ngày 8–14): Bứt tốc Writing, Speaking & Tổng duyệt')}
      </div>

      {/* Selected Day Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                Ngày {dayPlan.day}/14
              </span>
              {dayPlan.day === currentRoadmapDay && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  Mục tiêu hôm nay
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDisplayDate(dayDateStr)} · {dayPlan.phaseLabel}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
              {dayPlan.focusTitle}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />~{dayPlan.totalMinutes} phút
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {completedInDay}/{dayPlan.tasks.length} hoàn thành
            </span>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2.5">
          {dayPlan.tasks.map((task) => {
            const done = Boolean(state.roadmapCompletedTasks[task.id]);
            const cat = CATEGORY_META[task.category];
            const liveHint = getTaskLiveHint(task);

            return (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                  done
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleRoadmapTask(task.id)}
                    aria-label={`Đánh dấu hoàn thành ${task.title}`}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${cat.badgeClass}`}
                      >
                        {cat.icon}
                        {cat.label}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.minutes}p
                      </span>
                      {liveHint && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {liveHint}
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-semibold ${
                        done
                          ? 'line-through text-slate-500 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo(task.targetNav)}
                  className="self-end sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Học ngay
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
