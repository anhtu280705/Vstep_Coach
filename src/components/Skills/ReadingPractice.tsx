import React, { useEffect, useState } from 'react';
import { BookOpenCheck, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { READING_PRACTICE } from '../../data/practiceData';

interface ReadingPracticeProps {
  guideId: string;
}

export const ReadingPractice: React.FC<ReadingPracticeProps> = ({ guideId }) => {
  const passage = READING_PRACTICE[guideId];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [guideId]);

  if (!passage) return null;

  const answeredCount = passage.questions.filter(
    (q) => answers[q.id] !== undefined
  ).length;
  const correctCount = submitted
    ? passage.questions.filter((q) => answers[q.id] === q.answerIndex).length
    : 0;
  const scorePct = submitted
    ? Math.round((correctCount / passage.questions.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* Passage Card */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-200/70 dark:border-emerald-900/60">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            <BookOpenCheck className="w-4 h-4" />
            {passage.title}
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {passage.topicTag}
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
          {passage.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3.5">
        {passage.questions.map((q, qIdx) => {
          const picked = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Câu {qIdx + 1}: {q.question}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = picked === optIdx;
                  const isCorrect = optIdx === q.answerIndex;
                  let cls =
                    'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400 text-slate-700 dark:text-slate-200';
                  if (submitted) {
                    if (isCorrect) {
                      cls =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
                    } else if (isSelected) {
                      cls =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                    } else {
                      cls = 'border-slate-200 dark:border-slate-800 text-slate-400';
                    }
                  } else if (isSelected) {
                    cls =
                      'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={`text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${cls}`}
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
                <div className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-600 dark:text-slate-300">
                  <strong>Giải thích:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Score Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {!submitted ? (
          <>
            <span className="text-xs text-slate-500">
              Đã chọn {answeredCount}/{passage.questions.length} câu
            </span>
            <button
              disabled={answeredCount < passage.questions.length}
              onClick={() => setSubmitted(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
            >
              Nộp bài & Chấm điểm
            </button>
          </>
        ) : (
          <>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                scorePct >= 60
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              Kết quả: {correctCount}/{passage.questions.length} câu đúng ({scorePct}%)
            </span>
            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại bài đọc
            </button>
          </>
        )}
      </div>
    </div>
  );
};
