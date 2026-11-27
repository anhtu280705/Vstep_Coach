import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CheckSquare,
  Copy,
  FileText,
  GraduationCap,
  Headphones,
  ListChecks,
  Mic,
  PenTool,
  Square,
  StickyNote,
} from 'lucide-react';
import { SKILL_GUIDES, SKILL_META } from '../../data/skillsData';
import { useApp } from '../../context/AppContext';
import { SkillType } from '../../types';
import { ExamTimer } from './ExamTimer';
import { WritingPracticePad } from './WritingPracticePad';
import { ListeningPractice } from './ListeningPractice';
import { ReadingPractice } from './ReadingPractice';
import { SpeakingPractice } from './SpeakingPractice';
import { Task2TemplateGuide } from './Task2TemplateGuide';

const SKILL_ORDER: { id: SkillType; icon: React.ReactNode }[] = [
  { id: 'listening', icon: <Headphones className="w-4 h-4" /> },
  { id: 'reading', icon: <BookOpenCheck className="w-4 h-4" /> },
  { id: 'writing', icon: <PenTool className="w-4 h-4" /> },
  { id: 'speaking', icon: <Mic className="w-4 h-4" /> },
];

export const SkillsView: React.FC = () => {
  const {
    state,
    deepLink,
    clearDeepLink,
    toggleSkillMastered,
    toggleSkillChecklist,
    saveSkillNote,
  } = useApp();

  const [activeSkill, setActiveSkill] = useState<SkillType>('listening');
  const [selectedGuideId, setSelectedGuideId] = useState<string>('listening-part1');
  const [viewMode, setViewMode] = useState<'strategy' | 'practice'>('strategy');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (deepLink && deepLink.tab === 'skills') {
      if (deepLink.itemId) {
        const normalizedItemId =
          deepLink.itemId === 'writing-task2-cause-adv'
            ? 'writing-task2-opinion'
            : deepLink.itemId;
        const found = SKILL_GUIDES.find((g) => g.id === normalizedItemId);
        if (found) {
          setActiveSkill(found.skill);
          setSelectedGuideId(found.id);
        }
      } else if (
        deepLink.mode &&
        (['listening', 'reading', 'writing', 'speaking'] as string[]).includes(
          deepLink.mode
        )
      ) {
        const s = deepLink.mode as SkillType;
        setActiveSkill(s);
        const first = SKILL_GUIDES.find((g) => g.skill === s);
        if (first) setSelectedGuideId(first.id);
      }

      if (deepLink.mode === 'practice') {
        setViewMode('practice');
      }
      clearDeepLink();
    }
  }, [deepLink, clearDeepLink]);

  const guidesForSkill = SKILL_GUIDES.filter((g) => g.skill === activeSkill);
  const activeGuide =
    guidesForSkill.find((g) => g.id === selectedGuideId) ?? guidesForSkill[0];
  const isTask2Guide = activeGuide.id === 'writing-task2-opinion';
  const meta = SKILL_META[activeSkill];
  const progress = state.skillProgress[activeGuide.id];

  const handleChangeSkill = (skill: SkillType) => {
    setActiveSkill(skill);
    const first = SKILL_GUIDES.find((g) => g.skill === skill);
    if (first) setSelectedGuideId(first.id);
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-amber-500" />
          Chiến thuật làm bài 4 Kỹ năng VSTEP
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Bám sát cấu trúc đề thi VSTEP 3–5 chính thức kèm khung câu mẫu và bấm giờ thực chiến.
        </p>
      </div>

      {/* 4 Skill Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SKILL_ORDER.map((s) => {
          const isActive = activeSkill === s.id;
          const sGuides = SKILL_GUIDES.filter((g) => g.skill === s.id);
          const doneCount = sGuides.filter(
            (g) => state.skillProgress[g.id]?.mastered
          ).length;

          return (
            <button
              key={s.id}
              onClick={() => handleChangeSkill(s.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-sm">
                  {s.icon}
                  {SKILL_META[s.id].label}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {doneCount}/{sGuides.length}
                </span>
              </div>
              <div
                className={`text-xs mt-1 ${
                  isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {SKILL_META[s.id].duration}
              </div>
            </button>
          );
        })}
      </div>

      {/* Skill Overview Banner */}
      <div className="rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-300">
        <span>
          <strong>{meta.labelVi}:</strong> {meta.structure}
        </span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          Thời gian thi thật: {meta.duration}
        </span>
      </div>

      {/* Part Selector + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-2.5">
          {guidesForSkill.map((g) => {
            const isSelected = g.id === activeGuide.id;
            const isDone = Boolean(state.skillProgress[g.id]?.mastered);
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGuideId(g.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {g.partLabel}
                    </span>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {g.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {g.duration}
                    </div>
                  </div>
                  {isDone && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            {/* Guide Title & Mastered Button */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activeGuide.partLabel} · {activeGuide.duration}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeGuide.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeGuide.taskInfo}
                </p>
              </div>
              <button
                onClick={() => toggleSkillMastered(activeGuide.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  progress?.mastered
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {progress?.mastered ? 'Đã nắm vững' : 'Đánh dấu nắm vững'}
              </button>
            </div>

            {/* Mode Switcher: Chiến thuật vs Thực hành đề mẫu */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('strategy')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'strategy'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isTask2Guide ? 'Bài mẫu & 4 dạng đề' : 'Chiến thuật & Mẫu câu'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('practice')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'practice'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                }`}
              >
                Thực hành đề mẫu ({activeSkill === 'listening' ? 'Nghe' : activeSkill === 'reading' ? 'Đọc' : activeSkill === 'writing' ? 'Viết' : 'Nói + Ghi âm'})
              </button>
            </div>

            {viewMode === 'practice' ? (
              <div className="space-y-4">
                {activeGuide.skill === 'listening' && (
                  <ListeningPractice guideId={activeGuide.id} />
                )}

                {activeGuide.skill === 'reading' && (
                  <ReadingPractice guideId={activeGuide.id} />
                )}

                {activeGuide.skill === 'writing' && (
                  <>
                    {activeGuide.timerPresets && activeGuide.timerPresets.length > 0 && (
                      <ExamTimer presets={activeGuide.timerPresets} />
                    )}
                    <WritingPracticePad
                      guideId={activeGuide.id}
                      targetWords={activeGuide.id.includes('task1') ? 120 : 250}
                    />
                  </>
                )}

                {activeGuide.skill === 'speaking' && (
                  <>
                    {activeGuide.timerPresets && activeGuide.timerPresets.length > 0 && (
                      <ExamTimer presets={activeGuide.timerPresets} />
                    )}
                    <SpeakingPractice guideId={activeGuide.id} />
                  </>
                )}
              </div>
            ) : isTask2Guide ? (
              <Task2TemplateGuide />
            ) : (
              <>
                {/* Step-by-step Strategy */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Quy trình từng bước làm bài
              </h3>
              <ol className="space-y-2">
                {activeGuide.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Common Traps */}
            <div className="rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Bẫy thường gặp & Cách né
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-disc pl-4">
                {activeGuide.traps.map((trap, i) => (
                  <li key={i}>{trap}</li>
                ))}
              </ul>
            </div>

            {/* Templates / Useful Phrases with Copy button */}
            {activeGuide.templates.map((tpl) => (
              <div key={tpl.label} className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {tpl.label}
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(tpl.phrases.join('\n'), `all-${tpl.label}`)
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {copiedKey === `all-${tpl.label}` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Đã chép tất cả
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Chép tất cả
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  {tpl.phrases.map((phrase, idx) => {
                    const key = `${tpl.label}-${idx}`;
                    return (
                      <div
                        key={key}
                        className="flex items-start justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                      >
                        <span className="leading-relaxed">{phrase}</span>
                        <button
                          onClick={() => handleCopy(phrase, key)}
                          title="Chép câu mẫu"
                          className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 shrink-0 cursor-pointer"
                        >
                          {copiedKey === key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Sample / Example */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                <FileText className="w-4 h-4" />
                {activeGuide.sample.title}
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {activeGuide.sample.content}
              </pre>
            </div>

            {/* Self-check Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Checklist tự kiểm tra trước khi nộp bài
              </h3>
              <div className="space-y-2">
                {activeGuide.checklist.map((item) => {
                  const checked = Boolean(progress?.checklistDone[item.id]);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleSkillChecklist(activeGuide.id, item.id)}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                        checked
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm">{item.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
              </>
            )}
          </div>

          {/* Personal Note */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <StickyNote className="w-4 h-4 text-amber-500" />
              Ghi chú / Dàn ý nháp cho phần này (tự động lưu)
            </label>
            <textarea
              rows={3}
              value={progress?.note ?? ''}
              onChange={(e) => saveSkillNote(activeGuide.id, e.target.value)}
              placeholder="Ví dụ: Tự viết dàn ý mẫu Speaking Part 2 hoặc lưu lại lỗi sai Writing của riêng bạn..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
