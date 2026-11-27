import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Ear,
  HelpCircle,
  Keyboard,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VocabWord } from '../../types';
import {
  buildHintMask,
  buildQuizQuestions,
  normalizeAnswer,
  QuizQuestionItem,
} from '../../utils/quizGenerator';
import { speakText } from '../../utils/tts';

interface PostStudyQuizProps {
  title: string;
  words: VocabWord[];
  onBack: () => void;
  checkpointBadge?: string;
  continueLabel?: string;
  onContinueNextChunk?: () => void;
}

export const PostStudyQuiz: React.FC<PostStudyQuizProps> = ({
  title,
  words,
  onBack,
  checkpointBadge,
  continueLabel,
  onContinueNextChunk,
}) => {
  const { state, allWords, recordQuizResults } = useApp();
  const allWordsRef = useRef(allWords);
  allWordsRef.current = allWords;

  const [activeWords, setActiveWords] = useState<VocabWord[]>(words);
  const [questions, setQuestions] = useState<QuizQuestionItem[]>(() =>
    buildQuizQuestions(words, allWords)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Multiple-choice state
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  // Typing ("Điền từ đúng nghĩa") state
  const [typedInput, setTypedInput] = useState('');
  const [typeSubmitted, setTypeSubmitted] = useState(false);
  const [typeCorrect, setTypeCorrect] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const [answers, setAnswers] = useState<{ wordId: string; isCorrect: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentQ = questions[currentIndex];
  const isAnswered =
    currentQ?.kind === 'type' ? typeSubmitted : selectedWordId !== null;

  // Reset cleanly whenever incoming words chunk changes (without resetting on background customWords sync)
  useEffect(() => {
    setActiveWords(words);
    setQuestions(buildQuizQuestions(words, allWordsRef.current));
    setCurrentIndex(0);
    setSelectedWordId(null);
    setTypedInput('');
    setTypeSubmitted(false);
    setTypeCorrect(false);
    setHintLevel(0);
    setAnswers([]);
    setFinished(false);
  }, [words]);

  useEffect(() => {
    if (!finished && currentQ) {
      if (
        currentQ.kind === 'listen' ||
        (currentQ.kind === 'meaning' && state.settings.autoSpeak)
      ) {
        speakText(currentQ.wordObj.word, {
          accent: state.settings.ttsAccent,
          rate: state.settings.ttsRate,
        });
      }
      if (currentQ.kind === 'type') {
        setTimeout(() => inputRef.current?.focus(), 60);
      }
    }
  }, [
    currentIndex,
    finished,
    currentQ,
    state.settings.autoSpeak,
    state.settings.ttsAccent,
    state.settings.ttsRate,
  ]);

  const handleSelectOption = (optionWordId: string) => {
    if (selectedWordId !== null || !currentQ) return;
    setSelectedWordId(optionWordId);
    const isCorrect = optionWordId === currentQ.correctWordId;
    setAnswers((prev) => [...prev, { wordId: currentQ.wordObj.id, isCorrect }]);

    speakText(currentQ.wordObj.word, {
      accent: state.settings.ttsAccent,
      rate: state.settings.ttsRate,
    });
  };

  const handleCheckTyped = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeSubmitted || !currentQ) return;
    const isCorrect =
      normalizeAnswer(typedInput) === normalizeAnswer(currentQ.wordObj.word);
    setTypeSubmitted(true);
    setTypeCorrect(isCorrect);
    setAnswers((prev) => [...prev, { wordId: currentQ.wordObj.id, isCorrect }]);

    speakText(currentQ.wordObj.word, {
      accent: state.settings.ttsAccent,
      rate: state.settings.ttsRate,
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedWordId(null);
      setTypedInput('');
      setTypeSubmitted(false);
      setTypeCorrect(false);
      setHintLevel(0);
    } else {
      recordQuizResults(answers);
      setFinished(true);
    }
  };

  // Keyboard shortcuts: Enter to advance after answering, 1-4 to pick options, R to replay audio
  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandlerRef.current = (e: KeyboardEvent) => {
    if (e.repeat) return;

    if (finished) {
      if (e.key === 'Enter' && onContinueNextChunk) {
        e.preventDefault();
        onContinueNextChunk();
      }
      return;
    }

    if (!currentQ) return;

    if (e.key === 'Enter' && isAnswered) {
      e.preventDefault();
      handleNext();
      return;
    }

    if (!isAnswered && currentQ.kind !== 'type') {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const opt = currentQ.options[Number(e.key) - 1];
        if (opt) {
          e.preventDefault();
          handleSelectOption(opt.wordId);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        speakText(currentQ.wordObj.word, {
          accent: state.settings.ttsAccent,
          rate: state.settings.ttsRate,
        });
      }
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const wrongWords = useMemo(() => {
    const wrongIds = new Set(answers.filter((a) => !a.isCorrect).map((a) => a.wordId));
    return activeWords.filter((w) => wrongIds.has(w.id));
  }, [answers, activeWords]);

  const handleRetryWrong = () => {
    if (wrongWords.length === 0) return;
    setActiveWords(wrongWords);
    setQuestions(buildQuizQuestions(wrongWords, allWordsRef.current));
    setCurrentIndex(0);
    setSelectedWordId(null);
    setTypedInput('');
    setTypeSubmitted(false);
    setTypeCorrect(false);
    setHintLevel(0);
    setAnswers([]);
    setFinished(false);
  };

  const handleRetryAll = () => {
    setQuestions(buildQuizQuestions(activeWords, allWordsRef.current));
    setCurrentIndex(0);
    setSelectedWordId(null);
    setTypedInput('');
    setTypeSubmitted(false);
    setTypeCorrect(false);
    setHintLevel(0);
    setAnswers([]);
    setFinished(false);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Chưa đủ từ để tạo bài kiểm tra.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold cursor-pointer"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (finished) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const scorePct = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center space-y-2">
          {checkpointBadge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              {checkpointBadge}
            </span>
          )}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {onContinueNextChunk
              ? `Hoàn thành ôn tập ${activeWords.length} từ vừa học!`
              : 'Hoàn thành bài ôn tập!'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title} · Trạng thái từng từ đã được lưu tự động vào lịch ôn SRS.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500">Điểm số</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {scorePct}%
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-900">
            <div className="text-xs text-emerald-700 dark:text-emerald-400">Trả lời đúng</div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {correctCount}
            </div>
          </div>
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-3 border border-rose-200 dark:border-rose-900">
            <div className="text-xs text-rose-700 dark:text-rose-400">Cần xem lại</div>
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">
              {wrongWords.length}
            </div>
          </div>
        </div>

        {wrongWords.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Các từ làm sai trong chặng này:
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {wrongWords.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {w.word}{' '}
                      <span className="font-mono text-xs font-normal text-slate-500">
                        {w.ipa}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {w.meaning}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      speakText(w.word, {
                        accent: state.settings.ttsAccent,
                        rate: state.settings.ttsRate,
                      })
                    }
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {onContinueNextChunk && (
          <button
            onClick={onContinueNextChunk}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-colors cursor-pointer"
          >
            {continueLabel ?? 'Tiếp tục học 10 từ tiếp theo'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Về danh sách chủ đề
          </button>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRetryAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Ôn lại chặng này
            </button>
            {wrongWords.length > 0 && (
              <button
                onClick={handleRetryWrong}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Ôn lại {wrongWords.length} từ sai
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const kindBadge =
    currentQ.kind === 'meaning'
      ? { label: 'Chọn nghĩa đúng', icon: <HelpCircle className="w-3.5 h-3.5" /> }
      : currentQ.kind === 'word'
      ? { label: 'Chọn từ đúng nghĩa', icon: <Sparkles className="w-3.5 h-3.5" /> }
      : currentQ.kind === 'type'
      ? { label: 'Điền từ đúng nghĩa', icon: <Keyboard className="w-3.5 h-3.5" /> }
      : { label: 'Nghe & Chọn từ', icon: <Ear className="w-3.5 h-3.5" /> };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Thoát
        </button>

        <div className="flex items-center gap-2">
          {checkpointBadge && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {checkpointBadge}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Câu {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{
            width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {kindBadge.icon}
            {kindBadge.label}
          </span>
          <button
            type="button"
            onClick={() =>
              speakText(currentQ.wordObj.word, {
                accent: state.settings.ttsAccent,
                rate: state.settings.ttsRate,
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Nghe phát âm
          </button>
        </div>

        <div className="text-center py-2 space-y-2">
          {currentQ.kind === 'listen' && (
            <button
              type="button"
              onClick={() =>
                speakText(currentQ.wordObj.word, {
                  accent: state.settings.ttsAccent,
                  rate: state.settings.ttsRate,
                })
              }
              className="w-16 h-16 mx-auto rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 cursor-pointer mb-2"
            >
              <Volume2 className="w-7 h-7" />
            </button>
          )}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.promptTitle}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{currentQ.promptSub}</p>
        </div>

        {/* TYPING MODE ("Điền từ đúng nghĩa") */}
        {currentQ.kind === 'type' ? (
          <form onSubmit={handleCheckTyped} className="space-y-4">
            {currentQ.maskedSentence && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-1">
                <div className="text-[11px] font-semibold uppercase text-slate-400">
                  Ngữ cảnh câu ví dụ:
                </div>
                <p className="font-medium">“{currentQ.maskedSentence}”</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-mono tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                Gợi ý: {buildHintMask(currentQ.wordObj.word, hintLevel)} (
                {currentQ.wordObj.word.length} ký tự)
              </span>
              {!typeSubmitted && hintLevel < 2 && (
                <button
                  type="button"
                  onClick={() => setHintLevel((h) => h + 1)}
                  className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Mở thêm gợi ý
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                ref={inputRef}
                type="text"
                disabled={typeSubmitted}
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Nhập từ tiếng Anh rồi nhấn Enter..."
                autoComplete="off"
                spellCheck={false}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-base font-semibold focus:outline-none transition-colors ${
                  typeSubmitted
                    ? typeCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                      : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500'
                }`}
              />
              {!typeSubmitted && (
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold cursor-pointer shrink-0"
                >
                  Kiểm tra
                </button>
              )}
            </div>

            {typeSubmitted && (
              <div
                className={`rounded-xl p-3.5 border text-sm flex items-center gap-2.5 ${
                  typeCorrect
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                    : 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                }`}
              >
                {typeCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  {typeCorrect ? (
                    <span>Chính xác!</span>
                  ) : (
                    <span>
                      Đáp án đúng là:{' '}
                      <strong className="font-mono text-base">
                        {currentQ.wordObj.word}
                      </strong>{' '}
                      <span className="opacity-75">{currentQ.wordObj.ipa}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </form>
        ) : (
          /* MULTIPLE CHOICE MODES */
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt, i) => {
              const isPicked = selectedWordId === opt.wordId;
              const isCorrectOpt = opt.wordId === currentQ.correctWordId;

              let btnStyle =
                'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-800 dark:text-slate-100';
              if (selectedWordId !== null) {
                if (isCorrectOpt) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200';
                } else if (isPicked) {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200';
                } else {
                  btnStyle =
                    'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-slate-400';
                }
              }

              return (
                <button
                  key={opt.wordId + '-' + i}
                  disabled={selectedWordId !== null}
                  onClick={() => handleSelectOption(opt.wordId)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{opt.label}</div>
                      {opt.sub && <div className="text-xs opacity-75 font-mono">{opt.sub}</div>}
                    </div>
                  </div>
                  {selectedWordId !== null && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {selectedWordId !== null && isPicked && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback & Next */}
        {isAnswered && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
              <div>
                <strong>{currentQ.wordObj.word}</strong> ({currentQ.wordObj.pos}):{' '}
                {currentQ.wordObj.meaning}
              </div>
              <div className="italic text-slate-500">{currentQ.wordObj.example}</div>
            </div>
            <button
              onClick={handleNext}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold cursor-pointer"
            >
              {currentIndex + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả chặng'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
