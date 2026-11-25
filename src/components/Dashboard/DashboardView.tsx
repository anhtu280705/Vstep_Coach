import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  GraduationCap,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROADMAP_DAYS } from '../../data/roadmapData';
import { GRAMMAR_TOPICS } from '../../data/grammarData';
import { SKILL_GUIDES } from '../../data/skillsData';
import { RoadmapView } from './RoadmapView';
import { StudyFocusBar } from './StudyFocusBar';

export const DashboardView: React.FC = () => {
  const {
    state,
    allWords,
    dueWordsToday,
    masteredWordsCount,
    learningWordsCount,
    streak,
    currentRoadmapDay,
    daysUntilExam,
    roadmapCompletionPercent,
    grammarCompletionPercent,
    skillsCompletionPercent,
    toggleRoadmapTask,
    navigateTo,
  } = useApp();

  const todayPlan =
    ROADMAP_DAYS.find((d) => d.day === currentRoadmapDay) ?? ROADMAP_DAYS[0];
  const todayDoneCount = todayPlan.tasks.filter(
    (t) => state.roadmapCompletedTasks[t.id]
  ).length;
  const todayDoneMinutes = todayPlan.tasks
    .filter((t) => state.roadmapCompletedTasks[t.id])
    .reduce((acc, t) => acc + t.minutes, 0);
  const todayAllDone = todayDoneCount === todayPlan.tasks.length;

  const nextUnfinishedGrammar = GRAMMAR_TOPICS.find(
    (g) => !state.grammarProgress[g.id]?.completed
  );
  const nextUnfinishedSkill = SKILL_GUIDES.find(
    (s) => !state.skillProgress[s.id]?.mastered
  );

  const countdownLabel =
    daysUntilExam > 0
      ? `Còn ${daysUntilExam} ngày đến kỳ thi`
      : daysUntilExam === 0
      ? 'Hôm nay là ngày thi VSTEP!'
      : 'Chặng ôn 14 ngày đã hoàn tất';

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white p-5 sm:p-6 shadow-lg shadow-indigo-500/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {countdownLabel} · Ngày {currentRoadmapDay}/14
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Kế hoạch ôn thi VSTEP B1–B2 hôm nay
            </h1>
            <p className="text-sm text-indigo-100 max-w-2xl">
              {todayPlan.focusTitle} — Hoàn thành từng mục nhỏ dưới đây để giữ vững nhịp độ 2 tuần về đích.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {dueWordsToday.length > 0 && (
              <button
                onClick={() => navigateTo({ tab: 'vocab', mode: 'srs' })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Ôn {dueWordsToday.length} từ đến hạn
              </button>
            )}
            <button
              onClick={() => navigateTo(todayPlan.tasks[0].targetNav)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-sm transition-colors cursor-pointer"
            >
              Bắt đầu học hôm nay
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-hour Focus Timer & Today's Time Progress */}
      <StudyFocusBar
        dayNumber={todayPlan.day}
        doneMinutes={todayDoneMinutes}
        totalMinutes={todayPlan.totalMinutes}
      />

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Từ vựng đã thuộc</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {masteredWordsCount}
            <span className="text-sm font-normal text-slate-400">/{allWords.length}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Đang học: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{learningWordsCount}</span> từ
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Cần ôn hôm nay (SRS)</span>
            <RotateCcw className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {dueWordsToday.length}
            <span className="text-sm font-normal text-slate-400"> từ</span>
          </div>
          <div className="text-xs">
            {dueWordsToday.length > 0 ? (
              <button
                onClick={() => navigateTo({ tab: 'vocab', mode: 'srs' })}
                className="font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Ôn ngay để không quên →
              </button>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Sạch thẻ đến hạn hôm nay
              </span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Chuỗi ngày học</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {streak}
            <span className="text-sm font-normal text-slate-400"> ngày</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {streak > 0 ? 'Đang duy trì phong độ tốt!' : 'Học 1 thẻ để mở chuỗi ngay'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Tiến độ 14 ngày</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {roadmapCompletionPercent}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${roadmapCompletionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Today's Checklist & Quick Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Việc cần hoàn thành hôm nay (Ngày {todayPlan.day}/14)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {todayAllDone
                  ? 'Tuyệt vời! Bạn đã hoàn thành toàn bộ mục tiêu hôm nay.'
                  : `Đã xong ${todayDoneCount}/${todayPlan.tasks.length} đầu việc · Ước tính ~${todayPlan.totalMinutes} phút`}
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                todayAllDone
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              }`}
            >
              {todayDoneCount}/{todayPlan.tasks.length} xong
            </span>
          </div>

          <div className="space-y-2.5">
            {todayPlan.tasks.map((task) => {
              const done = Boolean(state.roadmapCompletedTasks[task.id]);
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                    done
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleRoadmapTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer shrink-0"
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div
                        className={`text-sm font-semibold ${
                          done
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        ~{task.minutes} phút · {task.description}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo(task.targetNav)}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                  >
                    Mở bài
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Progress Snapshot */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tổng quan từng kỹ năng
            </h2>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  Ngữ pháp B1–B2
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {grammarCompletionPercent}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${grammarCompletionPercent}%` }}
                />
              </div>
              {nextUnfinishedGrammar && (
                <button
                  onClick={() =>
                    navigateTo({ tab: 'grammar', itemId: nextUnfinishedGrammar.id })
                  }
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Tiếp theo: {nextUnfinishedGrammar.title} →
                </button>
              )}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  Chiến thuật 4 Kỹ năng
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {skillsCompletionPercent}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${skillsCompletionPercent}%` }}
                />
              </div>
              {nextUnfinishedSkill && (
                <button
                  onClick={() =>
                    navigateTo({
                      tab: 'skills',
                      itemId: nextUnfinishedSkill.id,
                      mode: nextUnfinishedSkill.skill,
                    })
                  }
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Tiếp theo: {nextUnfinishedSkill.partLabel} →
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Mẹo nhớ lâu:</strong> Mỗi lần học xong một chủ đề Flashcard, hãy bấm ngay bài <em>Quiz ôn tập</em> cuối phiên để tăng khả năng ghi nhớ gấp 2 lần.
          </div>
        </div>
      </div>

      {/* Interactive 14-Day Roadmap */}
      <RoadmapView />
    </div>
  );
};
