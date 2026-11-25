import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Keyboard,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VocabEase, VocabWord } from '../../types';
import { getNextIntervalLabel } from '../../utils/srs';
import { isTtsSupported, speakText, stopSpeaking } from '../../utils/tts';
import { PostStudyQuiz } from './PostStudyQuiz';

interface FlashcardSessionProps {
  title: string;
  words: VocabWord[];
  checkpointSize?: number;
  onBack: () => void;
}

type SessionPhase = 'flashcard' | 'checkpoint_quiz' | 'all_done';

export const FlashcardSession: React.FC<FlashcardSessionProps> = ({
  title,
  words,
  checkpointSize = 10,
  onBack,
}) => {
  const { state, rateVocabCard, toggleBookmark, updateSettings } = useApp();

  const chunks = useMemo(() => {
    if (words.length === 0) return [];
    const size = Math.max(1, checkpointSize);
    const result: VocabWord[][] = [];
    for (let i = 0; i < words.length; i += size) {
      result.push(words.slice(i, i + size));
    }
    return result;
  }, [words, checkpointSize]);

  const [chunkIndex, setChunkIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [phase, setPhase] = useState<SessionPhase>('flashcard');
  const [sessionRatings, setSessionRatings] = useState<Record<VocabEase, number>>({
    again: 0,
    hard: 0,
    good: 0,
  });

  const currentChunk = chunks[chunkIndex] ?? [];
  const currentWord = currentChunk[cardIndex];
  const cardProgress = currentWord ? state.vocabProgress[currentWord.id] : undefined;
  const ttsAvailable = isTtsSupported();

  const globalIndex = chunkIndex * checkpointSize + cardIndex;
  const remainingInChunk = currentChunk.length - (cardIndex + 1);

  const speakCurrentWord = useCallback(() => {
    if (!currentWord) return;
    speakText(currentWord.word, {
      accent: state.settings.ttsAccent,
      rate: state.settings.ttsRate,
    });
  }, [currentWord, state.settings.ttsAccent, state.settings.ttsRate]);

  const speakCurrentExample = useCallback(() => {
    if (!currentWord) return;
    speakText(currentWord.example, {
      accent: state.settings.ttsAccent,
      rate: state.settings.ttsRate,
    });
  }, [currentWord, state.settings.ttsAccent, state.settings.ttsRate]);

  // Auto-speak only during flashcard phase
  useEffect(() => {
    if (phase === 'flashcard' && currentWord && state.settings.autoSpeak) {
      const timer = setTimeout(() => {
        speakCurrentWord();
      }, 150);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, chunkIndex, cardIndex, currentWord, state.settings.autoSpeak, speakCurrentWord]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleRate = useCallback(
    (ease: VocabEase) => {
      if (!currentWord || phase !== 'flashcard') return;
      rateVocabCard(currentWord.id, ease);
      setSessionRatings((prev) => ({ ...prev, [ease]: prev[ease] + 1 }));

      if (cardIndex + 1 < currentChunk.length) {
        setFlipped(false);
        setCardIndex((i) => i + 1);
      } else {
        // Finished this 10-word chunk -> immediately enter checkpoint quiz!
        stopSpeaking();
        setFlipped(false);
        setPhase('checkpoint_quiz');
      }
    },
    [currentWord, phase, cardIndex, currentChunk.length, rateVocabCard]
  );

  // Keyboard shortcuts ONLY when phase === 'flashcard'
  useEffect(() => {
    if (phase !== 'flashcard' || !currentWord) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        speakCurrentWord();
      } else if (e.key === '1') {
        e.preventDefault();
        handleRate('again');
      } else if (e.key === '2') {
        e.preventDefault();
        handleRate('hard');
      } else if (e.key === '3') {
        e.preventDefault();
        handleRate('good');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, currentWord, speakCurrentWord, handleRate]);

  if (words.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Không có từ nào trong phiên học này.
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

  // CHECKPOINT QUIZ PHASE (every 10 words!)
  if (phase === 'checkpoint_quiz') {
    const startNum = chunkIndex * checkpointSize + 1;
    const endNum = startNum + currentChunk.length - 1;
    const hasNextChunk = chunkIndex + 1 < chunks.length;
    const nextChunkCount = hasNextChunk ? chunks[chunkIndex + 1].length : 0;

    return (
      <PostStudyQuiz
        title={`${title} · Ôn tập từ ${startNum}–${endNum}`}
        words={currentChunk}
        checkpointBadge={`Chặng ${chunkIndex + 1}/${chunks.length} · Ôn ngay ${currentChunk.length} từ vừa học`}
        continueLabel={
          hasNextChunk
            ? `Tiếp tục học ${nextChunkCount} từ tiếp theo (Chặng ${chunkIndex + 2}/${chunks.length})`
            : `Hoàn tất toàn bộ ${words.length} từ`
        }
        onContinueNextChunk={() => {
          if (hasNextChunk) {
            setChunkIndex((c) => c + 1);
            setCardIndex(0);
            setFlipped(false);
            setPhase('flashcard');
          } else {
            setPhase('all_done');
          }
        }}
        onBack={() => {
          stopSpeaking();
          onBack();
        }}
      />
    );
  }

  // FINAL COMPLETION SCREEN
  if (phase === 'all_done') {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Xuất sắc! Hoàn thành trọn vẹn {words.length} từ!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title} · Bạn đã học qua {chunks.length} chặng kèm kiểm tra xen kẽ từng 10 từ.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
            <div className="text-xs text-rose-700 dark:text-rose-400">Chưa nhớ</div>
            <div className="text-xl font-bold text-rose-700 dark:text-rose-400">
              {sessionRatings.again}
            </div>
          </div>
          <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="text-xs text-amber-700 dark:text-amber-400">Còn phân vân</div>
            <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
              {sessionRatings.hard}
            </div>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <div className="text-xs text-emerald-700 dark:text-emerald-400">Đã thuộc</div>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {sessionRatings.good}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setChunkIndex(0);
              setCardIndex(0);
              setFlipped(false);
              setPhase('flashcard');
              setSessionRatings({ again: 0, hard: 0, good: 0 });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Học lại từ đầu
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Về danh sách chủ đề
          </button>
        </div>
      </div>
    );
  }

  const isBookmarked = Boolean(cardProgress?.bookmarked);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => {
            stopSpeaking();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {title}
        </button>

        {/* TTS Quick Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => updateSettings({ autoSpeak: !state.settings.autoSpeak })}
            title="Bật/tắt tự phát âm khi mở thẻ mới"
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
              state.settings.autoSpeak
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            {state.settings.autoSpeak ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            Tự đọc: {state.settings.autoSpeak ? 'Bật' : 'Tắt'}
          </button>

          <button
            onClick={() =>
              updateSettings({
                ttsAccent: state.settings.ttsAccent === 'en-US' ? 'en-GB' : 'en-US',
              })
            }
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {state.settings.ttsAccent === 'en-GB' ? 'UK' : 'US'}
          </button>

          <button
            onClick={() =>
              updateSettings({
                ttsRate: state.settings.ttsRate === 1 ? 0.75 : 1,
              })
            }
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {state.settings.ttsRate}x
          </button>
        </div>
      </div>

      {/* Chunk & Checkpoint Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            Chặng {chunkIndex + 1}/{chunks.length} · Thẻ {cardIndex + 1}/{currentChunk.length}
            <span className="text-slate-400 font-normal">
              (Tổng {globalIndex + 1}/{words.length})
            </span>
          </span>
          <span>
            {remainingInChunk > 0
              ? `Còn ${remainingInChunk} thẻ nữa → Ôn tập Mini-Quiz`
              : 'Thẻ cuối chặng → Xong thẻ này ôn tập ngay!'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((cardIndex + 1) / currentChunk.length) * 100}%` }}
          />
        </div>
      </div>

      {!ttsAvailable && (
        <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-xl px-3 py-2">
          Trình duyệt hiện tại chưa hỗ trợ Web Speech API phát âm tự động.
        </div>
      )}

      {/* 3D Flip Card */}
      <div className="perspective-1000">
        <div
          onClick={() => setFlipped((f) => !f)}
          className={`relative w-full min-h-[340px] sm:min-h-[360px] transition-transform duration-500 transform-style-3d cursor-pointer ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  {currentWord.level}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  ({currentWord.pos})
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(currentWord.id);
                }}
                title="Đánh dấu từ hay quên"
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Star
                  className={`w-5 h-5 ${
                    isBookmarked
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
              </button>
            </div>

            <div className="text-center space-y-3 my-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentWord.word}
              </h2>
              <div className="font-mono text-base text-slate-500 dark:text-slate-400">
                {currentWord.ipa}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakCurrentWord();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  Phát âm (R)
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Bấm vào thẻ hoặc nhấn{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                Space
              </kbd>{' '}
              để xem nghĩa & ví dụ
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentWord.word}
                </span>
                <span className="ml-2 font-mono text-xs text-slate-400">
                  {currentWord.ipa}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakCurrentWord();
                }}
                className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 my-auto py-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Nghĩa tiếng Việt
                </div>
                <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                  {currentWord.meaning}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Ví dụ ngữ cảnh VSTEP
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakCurrentExample();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Đọc câu
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  “{currentWord.example}”
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentWord.exampleVi}
                </p>
              </div>

              {currentWord.collocations.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Cụm từ ăn điểm (Collocations)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentWord.collocations.map((col) => (
                      <span
                        key={col}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-slate-400">
              Chọn mức độ ghi nhớ bên dưới để chuyển thẻ tiếp theo
            </div>
          </div>
        </div>
      </div>

      {/* SRS Rating Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleRate('again')}
          className="rounded-2xl p-3 border border-rose-200 dark:border-rose-900/80 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 text-center transition-colors cursor-pointer"
        >
          <div className="text-sm font-bold text-rose-700 dark:text-rose-300">
            1 · Chưa nhớ
          </div>
          <div className="text-[11px] text-rose-600/80 dark:text-rose-400 mt-0.5">
            {getNextIntervalLabel(cardProgress, 'again')}
          </div>
        </button>

        <button
          onClick={() => handleRate('hard')}
          className="rounded-2xl p-3 border border-amber-200 dark:border-amber-900/80 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/60 text-center transition-colors cursor-pointer"
        >
          <div className="text-sm font-bold text-amber-700 dark:text-amber-300">
            2 · Còn phân vân
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-0.5">
            {getNextIntervalLabel(cardProgress, 'hard')}
          </div>
        </button>

        <button
          onClick={() => handleRate('good')}
          className="rounded-2xl p-3 border border-emerald-200 dark:border-emerald-900/80 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/60 text-center transition-colors cursor-pointer"
        >
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            3 · Đã thuộc
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-0.5">
            {getNextIntervalLabel(cardProgress, 'good')}
          </div>
        </button>
      </div>

      {/* Shortcut hint */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-1">
        <span className="inline-flex items-center gap-1">
          <Keyboard className="w-3.5 h-3.5" />
          Phím tắt:
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">
            Space
          </kbd>{' '}
          Lật thẻ
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">
            R
          </kbd>{' '}
          Nghe lại
        </span>
        <span className="inline-flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">
            1 / 2 / 3
          </kbd>{' '}
          Đánh giá
        </span>
      </div>
    </div>
  );
};
