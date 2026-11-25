import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Play,
  RotateCcw,
  Square,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LISTENING_PRACTICE } from '../../data/practiceData';
import { speakText, stopSpeaking } from '../../utils/tts';

interface ListeningPracticeProps {
  guideId: string;
}

export const ListeningPractice: React.FC<ListeningPracticeProps> = ({ guideId }) => {
  const { state } = useApp();
  const sections = LISTENING_PRACTICE[guideId] ?? [];

  const [examMode, setExamMode] = useState(false); // true = nghe 1 lần như thi thật
  const [playedOnce, setPlayedOnce] = useState<Record<string, boolean>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState<Record<string, boolean>>({});

  useEffect(() => {
    stopSpeaking();
    setPlayingId(null);
    setPlayedOnce({});
    setAnswers({});
    setSubmitted(false);
    setShowTranscript({});
  }, [guideId]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (sections.length === 0) {
    return null;
  }

  const allQuestions = sections.flatMap((s) => s.questions);
  const answeredCount = allQuestions.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = submitted
    ? allQuestions.filter((q) => answers[q.id] === q.answerIndex).length
    : 0;
  const scorePct = submitted
    ? Math.round((correctCount / allQuestions.length) * 100)
    : 0;

  const handlePlayAudio = (secId: string, text: string) => {
    if (examMode && playedOnce[secId]) return;
    setPlayingId(secId);
    setPlayedOnce((prev) => ({ ...prev, [secId]: true }));
    speakText(text, {
      accent: state.settings.ttsAccent,
      rate: state.settings.ttsRate,
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setPlayingId(null);
  };

  const handleReset = () => {
    handleStopAudio();
    setPlayedOnce({});
    setAnswers({});
    setSubmitted(false);
    setShowTranscript({});
  };

  return (
    <div className="space-y-5">
      {/* Control Banner */}
      <div className="rounded-2xl border border-sky-200 dark:border-sky-900/70 bg-sky-50/70 dark:bg-sky-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky-800 dark:text-sky-300">
            <Headphones className="w-4 h-4" />
            Bài nghe thực hành ({allQuestions.length} câu hỏi)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Bấm Phát âm thanh (giọng {state.settings.ttsAccent}, tốc độ {state.settings.ttsRate}x) để nghe và chọn đáp án.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExamMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              !examMode
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Luyện tập (Nghe lại)
          </button>
          <button
            type="button"
            onClick={() => {
              setExamMode(true);
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              examMode
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Thi thật (Nghe 1 lần)
          </button>
        </div>
      </div>

      {/* Sections */}
      {sections.map((sec) => {
        const isPlaying = playingId === sec.id;
        const lockedByExam = examMode && Boolean(playedOnce[sec.id]) && !isPlaying;
        const transcriptVisible = Boolean(showTranscript[sec.id]);

        return (
          <div
            key={sec.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-4 sm:p-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {sec.title}
              </h3>

              <div className="flex items-center gap-2">
                {isPlaying ? (
                  <button
                    type="button"
                    onClick={handleStopAudio}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Dừng phát
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={lockedByExam}
                    onClick={() => handlePlayAudio(sec.id, sec.speakerText)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
                  >
                    {playedOnce[sec.id] ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    {lockedByExam
                      ? 'Đã phát 1 lần'
                      : playedOnce[sec.id]
                      ? 'Nghe lại'
                      : 'Phát âm thanh'}
                  </button>
                )}

                {(!examMode || submitted) && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowTranscript((prev) => ({
                        ...prev,
                        [sec.id]: !prev[sec.id],
                      }))
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {transcriptVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Ẩn lời thoại
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        Lời thoại
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {transcriptVisible && (
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Transcript (Lời thoại trong băng):
                </div>
                {sec.transcriptDisplay}
              </div>
            )}

            <div className="space-y-3">
              {sec.questions.map((q, qIdx) => {
                const picked = answers[q.id];
                return (
                  <div
                    key={q.id}
                    className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2.5"
                  >
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Câu {qIdx + 1}: {q.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = picked === optIdx;
                        const isCorrect = optIdx === q.answerIndex;
                        let cls =
                          'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:border-sky-400 text-slate-700 dark:text-slate-200';
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
                            'border-sky-600 bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submitted}
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                            }
                            className={`text-left px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${cls}`}
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
                      <div className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-600 dark:text-slate-300">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Submit / Score Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {!submitted ? (
          <>
            <span className="text-xs text-slate-500">
              Đã chọn {answeredCount}/{allQuestions.length} câu
            </span>
            <button
              disabled={answeredCount < allQuestions.length}
              onClick={() => setSubmitted(true)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
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
              Kết quả: {correctCount}/{allQuestions.length} câu đúng ({scorePct}%)
            </span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại bài nghe
            </button>
          </>
        )}
      </div>
    </div>
  );
};
