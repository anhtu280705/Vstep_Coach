import React, { useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  Briefcase,
  Building2,
  Cpu,
  Edit3,
  Feather,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Layers,
  Leaf,
  Plane,
  Play,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Smile,
  Sparkles,
  Star,
  Trash2,
  Tv,
  Upload,
  Users,
  Volume2,
  Wallet,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VocabWord } from '../../types';
import { speakText } from '../../utils/tts';
import { FlashcardSession } from './FlashcardSession';
import { PostStudyQuiz } from './PostStudyQuiz';
import { CustomWordModal } from './CustomWordModal';
import { BulkImportModal } from './BulkImportModal';

type VocabViewMode =
  | { type: 'home' }
  | { type: 'flashcard'; title: string; words: VocabWord[] }
  | { type: 'quiz'; title: string; words: VocabWord[] };

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  Feather: <Feather className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

const CHECKPOINT_SIZE = 10;

export const VocabView: React.FC = () => {
  const {
    state,
    allWords,
    allTopics,
    dueWordsToday,
    bookmarkedWords,
    deepLink,
    clearDeepLink,
    toggleBookmark,
    addCustomWord,
    addCustomWordsBulk,
    updateCustomWord,
    deleteCustomWord,
  } = useApp();

  const [mode, setMode] = useState<VocabViewMode>({ type: 'home' });
  const [filterTab, setFilterTab] = useState<'topics' | 'bookmarked' | 'all'>('topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null);

  const getUnmasteredOrAll = (topicWords: VocabWord[]): VocabWord[] => {
    const unmastered = topicWords.filter(
      (w) => state.vocabProgress[w.id]?.status !== 'mastered'
    );
    return unmastered.length > 0 ? unmastered : topicWords;
  };

  const pickSpeedReviewWords = (): VocabWord[] => {
    const studied = allWords.filter((w) => {
      const p = state.vocabProgress[w.id];
      return p && (p.status === 'learning' || p.status === 'mastered');
    });
    if (studied.length < 4) {
      return allWords.slice(0, 20);
    }
    // Ưu tiên từ hay sai hoặc đang ôn trước, sau đó lấy thêm ngẫu nhiên cho đủ 20 từ
    const prioritized = [...studied].sort((a, b) => {
      const pa = state.vocabProgress[a.id];
      const pb = state.vocabProgress[b.id];
      const scoreA = (pa?.wrongCount ?? 0) * 3 + (pa?.status === 'learning' ? 2 : 0);
      const scoreB = (pb?.wrongCount ?? 0) * 3 + (pb?.status === 'learning' ? 2 : 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return Math.random() - 0.5;
    });
    return prioritized.slice(0, 20);
  };

  // Handle deep link from Dashboard / Roadmap
  useEffect(() => {
    if (deepLink && deepLink.tab === 'vocab') {
      if (deepLink.mode === 'srs') {
        const wordsToReview =
          dueWordsToday.length > 0
            ? dueWordsToday
            : allWords.slice(0, 20);
        setMode({
          type: 'flashcard',
          title:
            dueWordsToday.length > 0
              ? `Ôn tập SRS hôm nay (${wordsToReview.length} từ)`
              : `Ôn tập nhanh ${wordsToReview.length} từ tiêu biểu`,
          words: wordsToReview,
        });
      } else if (deepLink.mode === 'speed') {
        const speedWords = pickSpeedReviewWords();
        setMode({
          type: 'quiz',
          title: `Speed Review (${speedWords.length} từ đã học)`,
          words: speedWords,
        });
      } else if (deepLink.mode === 'bookmarked') {
        setFilterTab('bookmarked');
        setMode({ type: 'home' });
      } else if (deepLink.itemId) {
        const topic = allTopics.find((t) => t.id === deepLink.itemId);
        const topicWords = allWords.filter((w) => w.topicId === deepLink.itemId);
        if (topic && topicWords.length > 0) {
          const studyList = getUnmasteredOrAll(topicWords);
          setMode({
            type: 'flashcard',
            title: `${topic.title} (${studyList.length} từ)`,
            words: studyList,
          });
        }
      }
      clearDeepLink();
    }
  }, [deepLink, dueWordsToday, allWords, allTopics, clearDeepLink]);

  const filteredWordsList = useMemo(() => {
    const base = filterTab === 'bookmarked' ? bookmarkedWords : allWords;
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.collocations.some((c) => c.toLowerCase().includes(q))
    );
  }, [filterTab, bookmarkedWords, allWords, searchQuery]);

  if (mode.type === 'flashcard') {
    return (
      <FlashcardSession
        title={mode.title}
        words={mode.words}
        checkpointSize={CHECKPOINT_SIZE}
        onBack={() => setMode({ type: 'home' })}
      />
    );
  }

  if (mode.type === 'quiz') {
    return (
      <PostStudyQuiz
        title={mode.title}
        words={mode.words}
        onBack={() => setMode({ type: 'home' })}
      />
    );
  }

  const getStatusBadge = (wordId: string) => {
    const p = state.vocabProgress[wordId];
    if (!p || p.status === 'new') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          Chưa học
        </span>
      );
    }
    if (p.status === 'mastered') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          Đã thuộc
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
        Đang ôn
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Kho từ vựng VSTEP B1–B2 ({allWords.length} từ)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            14 chủ đề trọng tâm · Tự động bật bài ôn tập (chọn từ, điền từ, nghe) sau mỗi 10 từ vừa học.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Nhập hàng loạt
          </button>
          <button
            onClick={() => {
              setEditingWord(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Thêm từ mới
          </button>
        </div>
      </div>

      {/* SRS Due Banner */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          dueWordsToday.length > 0
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/70'
            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/70'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              dueWordsToday.length > 0
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {dueWordsToday.length > 0
                ? `Bạn có ${dueWordsToday.length} từ cần ôn tập hôm nay (SRS)`
                : 'Hôm nay chưa có thẻ nào quá hạn ôn tập'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {dueWordsToday.length > 0
                ? 'Hệ thống lặp lại ngắt quãng chọn ra các từ bạn sắp quên để ôn lại đúng thời điểm.'
                : 'Hãy chọn một chủ đề bên dưới để học từng chặng 10 từ mới và tự động làm Mini-Quiz.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              const speedWords = pickSpeedReviewWords();
              setMode({
                type: 'quiz',
                title: `Speed Review (${speedWords.length} từ)`,
                words: speedWords,
              });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold cursor-pointer shadow-xs"
          >
            <Zap className="w-4 h-4" />
            Ôn nhanh 20 từ đã học
          </button>
          {dueWordsToday.length > 0 && (
            <>
              <button
                onClick={() =>
                  setMode({
                    type: 'flashcard',
                    title: `Ôn tập SRS (${dueWordsToday.length} từ)`,
                    words: dueWordsToday,
                  })
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                Ôn Flashcard SRS
              </button>
              <button
                onClick={() =>
                  setMode({
                    type: 'quiz',
                    title: `Quiz ôn tập SRS (${dueWordsToday.length} từ)`,
                    words: dueWordsToday,
                  })
                }
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Kiểm tra SRS
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('topics')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              filterTab === 'topics'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Chủ đề ({allTopics.length})
          </button>
          <button
            onClick={() => setFilterTab('bookmarked')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              filterTab === 'bookmarked'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Hay quên ({bookmarkedWords.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            Tất cả từ ({allWords.length})
          </button>
        </div>

        {filterTab !== 'topics' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm từ hoặc nghĩa..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Topic Grid OR Word Table */}
      {filterTab === 'topics' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTopics.map((topic) => {
            const topicWords = allWords.filter((w) => w.topicId === topic.id);
            const mastered = topicWords.filter(
              (w) => state.vocabProgress[w.id]?.status === 'mastered'
            ).length;
            const learning = topicWords.filter(
              (w) => state.vocabProgress[w.id]?.status === 'learning'
            ).length;
            const remaining = topicWords.length - mastered;
            const pct =
              topicWords.length > 0
                ? Math.round((mastered / topicWords.length) * 100)
                : 0;
            const studyList = getUnmasteredOrAll(topicWords);

            return (
              <div
                key={topic.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        {TOPIC_ICONS[topic.iconName] ?? <Layers className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {topic.title}
                        </h3>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {topic.titleVi}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      {topicWords.length} từ
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Đã thuộc:{' '}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {mastered}/{topicWords.length}
                        </strong>
                        {learning > 0 && ` · Đang ôn: ${learning}`}
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    disabled={topicWords.length === 0}
                    onClick={() =>
                      setMode({
                        type: 'flashcard',
                        title: `${topic.title} (${studyList.length} từ)`,
                        words: studyList,
                      })
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    {remaining > 0
                      ? `Học ${studyList.length} từ (Ôn mỗi 10 từ)`
                      : `Ôn lại ${topicWords.length} từ`}
                  </button>
                  {remaining > 0 && remaining < topicWords.length && (
                    <button
                      onClick={() =>
                        setMode({
                          type: 'flashcard',
                          title: `${topic.title} (Cả ${topicWords.length} từ)`,
                          words: topicWords,
                        })
                      }
                      className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      Học hết ({topicWords.length})
                    </button>
                  )}
                  <button
                    disabled={topicWords.length === 0}
                    onClick={() =>
                      setMode({
                        type: 'quiz',
                        title: `${topic.title} (${studyList.length} câu)`,
                        words: studyList,
                      })
                    }
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-50"
                  >
                    Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWordsList.length > 0 && filterTab === 'bookmarked' && (
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setMode({
                    type: 'flashcard',
                    title: `Từ hay quên (${filteredWordsList.length} từ)`,
                    words: filteredWordsList,
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Ôn Flashcard nhóm từ hay quên
              </button>
            </div>
          )}

          {filteredWordsList.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-sm text-slate-500">
              {filterTab === 'bookmarked'
                ? 'Bạn chưa đánh dấu ngôi sao từ nào. Khi học Flashcard, bấm biểu tượng ngôi sao để lưu từ khó nhớ vào đây.'
                : 'Không tìm thấy từ vựng phù hợp.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredWordsList.map((w) => {
                const isMarked = Boolean(state.vocabProgress[w.id]?.bookmarked);
                return (
                  <div
                    key={w.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-base">
                          {w.word}
                        </span>
                        <span className="font-mono text-xs text-slate-400">{w.ipa}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {w.pos} · {w.level}
                        </span>
                        {getStatusBadge(w.id)}
                        {w.isCustom && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 font-medium">
                            Cá nhân
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                        {w.meaning}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {w.example}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() =>
                          speakText(w.word, {
                            accent: state.settings.ttsAccent,
                            rate: state.settings.ttsRate,
                          })
                        }
                        title="Nghe phát âm"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(w.id)}
                        title="Đánh dấu hay quên"
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isMarked
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-400'
                          }`}
                        />
                      </button>
                      {w.isCustom && (
                        <>
                          <button
                            onClick={() => {
                              setEditingWord(w);
                              setModalOpen(true);
                            }}
                            title="Sửa từ"
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCustomWord(w.id)}
                            title="Xóa từ"
                            className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Custom Word Modal */}
      {modalOpen && (
        <CustomWordModal
          initialWord={editingWord}
          onClose={() => {
            setModalOpen(false);
            setEditingWord(null);
          }}
          onSave={(data, existingId) => {
            if (existingId) {
              updateCustomWord({ ...data, id: existingId, isCustom: true });
            } else {
              addCustomWord(data);
            }
            setModalOpen(false);
            setEditingWord(null);
          }}
        />
      )}

      {/* Bulk Import Modal */}
      {bulkModalOpen && (
        <BulkImportModal
          onClose={() => setBulkModalOpen(false)}
          onImport={(words) => {
            addCustomWordsBulk(words);
            setBulkModalOpen(false);
            setFilterTab('all');
          }}
        />
      )}
    </div>
  );
};
