import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Circle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  StickyNote,
  XCircle,
} from 'lucide-react';
import { GRAMMAR_TOPICS } from '../../data/grammarData';
import { useApp } from '../../context/AppContext';

export const GrammarView: React.FC = () => {
  const {
    state,
    deepLink,
    clearDeepLink,
    saveGrammarAttempt,
    saveGrammarNote,
    toggleGrammarCompleted,
  } = useApp();

  const [selectedId, setSelectedId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Deep link support
  useEffect(() => {
    if (deepLink && deepLink.tab === 'grammar') {
      if (deepLink.itemId && GRAMMAR_TOPICS.some((g) => g.id === deepLink.itemId)) {
        setSelectedId(deepLink.itemId);
        setQuizAnswers({});
        setSubmitted(false);
      }
      clearDeepLink();
    }
  }, [deepLink, clearDeepLink]);

  const topic = GRAMMAR_TOPICS.find((g) => g.id === selectedId) ?? GRAMMAR_TOPICS[0];
  const progress = state.grammarProgress[topic.id];

  const handleSelectTopic = (id: string) => {
    setSelectedId(id);
    setQuizAnswers({});
    setSubmitted(false);
  };

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (submitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    const correctCount = topic.quiz.filter(
      (q) => quizAnswers[q.id] === q.answerIndex
    ).length;
    const scorePct = Math.round((correctCount / topic.quiz.length) * 100);
    setSubmitted(true);
    saveGrammarAttempt(topic.id, scorePct);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setSubmitted(false);
  };

  const answeredCount = topic.quiz.filter((q) => quizAnswers[q.id] !== undefined).length;
  const currentScorePct = submitted
    ? Math.round(
        (topic.quiz.filter((q) => quizAnswers[q.id] === q.answerIndex).length /
          topic.quiz.length) *
          100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Ngữ pháp trọng tâm VSTEP B1–B2
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          8 chuyên đề ăn điểm trong bài thi Đọc, Viết & Nói kèm bài tập có giải thích chi tiết.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Topic Selector List */}
        <div className="lg:col-span-4 space-y-2">
          {GRAMMAR_TOPICS.map((g, idx) => {
            const gp = state.grammarProgress[g.id];
            const isSelected = g.id === topic.id;
            return (
              <button
                key={g.id}
                onClick={() => handleSelectTopic(g.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          g.level === 'B2'
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                            : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        }`}
                      >
                        {g.level}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {g.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {g.subtitle}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {gp?.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                    )}
                    {gp && gp.attempts > 0 && (
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {gp.bestScore}%
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Topic Detail & Quiz */}
        <div className="lg:col-span-8 space-y-5">
          {/* Theory Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Mục tiêu {topic.level}
                  </span>
                  {progress && progress.attempts > 0 && (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Điểm cao nhất: <strong>{progress.bestScore}%</strong> ({progress.attempts} lần làm)
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                  {topic.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {topic.summary}
                </p>
              </div>

              <button
                onClick={() => toggleGrammarCompleted(topic.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  progress?.completed
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {progress?.completed ? 'Đã hoàn thành' : 'Đánh dấu đã học'}
              </button>
            </div>

            {/* Formulas */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Công thức cốt lõi
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {topic.formulas.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3.5 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {f.label}
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      {f.structure}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 italic">
                      Ví dụ: {f.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal words + VSTEP usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="rounded-xl bg-sky-50/70 dark:bg-sky-950/25 border border-sky-200 dark:border-sky-900/60 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-300 uppercase">
                  <Sparkles className="w-4 h-4" />
                  Dấu hiệu & Quy tắc nhớ nhanh
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 list-disc pl-4">
                  {topic.signalWords.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/60 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
                  <Lightbulb className="w-4 h-4" />
                  Ứng dụng ăn điểm VSTEP
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {topic.vstepUsage}
                </p>
              </div>
            </div>

            {/* Common mistakes */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Lỗi sai thường gặp cần tránh
              </h3>
              <div className="space-y-2">
                {topic.commonMistakes.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-rose-200/70 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/15 p-3.5 space-y-1 text-xs"
                  >
                    <div className="text-rose-700 dark:text-rose-400">
                      <strong>Sai:</strong> <span className="line-through">{m.wrong}</span>
                    </div>
                    <div className="text-emerald-700 dark:text-emerald-400">
                      <strong>Đúng:</strong> {m.right}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 pt-0.5">
                      → {m.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Mini-Quiz */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Bài tập vận dụng ({topic.quiz.length} câu)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Đạt từ 65% trở lên để tự động hoàn thành chuyên đề này.
                </p>
              </div>
              {submitted && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      currentScorePct >= 65
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    Kết quả: {currentScorePct}%
                  </span>
                  <button
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Làm lại
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {topic.quiz.map((q, qIdx) => {
                const picked = quizAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                  >
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Câu {qIdx + 1}: {q.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = picked === optIdx;
                        const isCorrect = optIdx === q.answerIndex;

                        let cls =
                          'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:border-indigo-400 text-slate-700 dark:text-slate-200';
                        if (submitted) {
                          if (isCorrect) {
                            cls =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
                          } else if (isSelected) {
                            cls =
                              'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                          } else {
                            cls =
                              'border-slate-200 dark:border-slate-800 text-slate-400';
                          }
                        } else if (isSelected) {
                          cls =
                            'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                          >
                            <span>
                              <strong className="mr-1.5">
                                {String.fromCharCode(65 + optIdx)}.
                              </strong>
                              {opt}
                            </span>
                            {submitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {submitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-600 dark:text-slate-300">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!submitted && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Đã chọn {answeredCount}/{topic.quiz.length} câu
                </span>
                <button
                  disabled={answeredCount < topic.quiz.length}
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
                >
                  Chấm điểm & Xem giải thích
                </button>
              </div>
            )}
          </div>

          {/* Personal Note */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <StickyNote className="w-4 h-4 text-amber-500" />
              Ghi chú cá nhân cho chuyên đề này (tự động lưu)
            </label>
            <textarea
              rows={3}
              value={progress?.note ?? ''}
              onChange={(e) => saveGrammarNote(topic.id, e.target.value)}
              placeholder="Ghi lại cấu trúc bạn hay quên hoặc câu ví dụ tự đặt cho bài thi..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
