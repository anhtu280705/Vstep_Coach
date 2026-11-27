import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityDayLog,
  AppSettings,
  AppState,
  DeepLinkTarget,
  SkillProgress,
  TabId,
  VocabEase,
  VocabWord,
} from '../types';
import { DEFAULT_VOCAB_WORDS, VOCAB_TOPICS } from '../data/vocabData';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { SKILL_GUIDES } from '../data/skillsData';
import { ROADMAP_DAYS } from '../data/roadmapData';
import {
  computeStreak,
  getCurrentRoadmapDay,
  getDaysRemainingToExam,
  getTodayStr,
} from '../utils/date';
import {
  calculateNextReview,
  createInitialCardProgress,
  isWordDueToday,
} from '../utils/srs';
import {
  buildDefaultState,
  loadLocalState,
  normalizeAppState,
  saveLocalState,
} from '../utils/storage';

interface AppContextValue {
  state: AppState;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  deepLink: DeepLinkTarget | null;
  clearDeepLink: () => void;
  navigateTo: (target: DeepLinkTarget) => void;

  // Derived data
  allWords: VocabWord[];
  allTopics: typeof VOCAB_TOPICS;
  dueWordsToday: VocabWord[];
  bookmarkedWords: VocabWord[];
  masteredWordsCount: number;
  learningWordsCount: number;
  streak: number;
  currentRoadmapDay: number;
  daysUntilExam: number;
  roadmapCompletionPercent: number;
  grammarCompletionPercent: number;
  skillsCompletionPercent: number;

  // Vocab actions
  rateVocabCard: (wordId: string, ease: VocabEase) => void;
  recordQuizResults: (results: { wordId: string; isCorrect: boolean }[]) => void;
  toggleBookmark: (wordId: string) => void;
  addCustomWord: (word: Omit<VocabWord, 'id' | 'isCustom'>) => void;
  addCustomWordsBulk: (words: Omit<VocabWord, 'id' | 'isCustom'>[]) => void;
  updateCustomWord: (word: VocabWord) => void;
  deleteCustomWord: (wordId: string) => void;

  // Grammar actions
  saveGrammarAttempt: (topicId: string, scorePercent: number) => void;
  saveGrammarNote: (topicId: string, note: string) => void;
  toggleGrammarCompleted: (topicId: string) => void;

  // Skill actions
  toggleSkillMastered: (guideId: string) => void;
  toggleSkillChecklist: (guideId: string, itemId: string) => void;
  saveSkillNote: (guideId: string, note: string) => void;
  saveWritingDraft: (draftKey: string, content: string) => void;

  // Roadmap actions
  toggleRoadmapTask: (taskId: string) => void;

  // Settings & backup
  updateSettings: (partial: Partial<AppSettings>) => void;
  exportData: () => string;
  importData: (jsonText: string) => { ok: boolean; error?: string };
  resetData: () => void;
  replaceState: (next: AppState) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function bumpTodayActivity(
  prevLog: Record<string, ActivityDayLog>,
  delta: Partial<ActivityDayLog>
): Record<string, ActivityDayLog> {
  const today = getTodayStr();
  const cur = prevLog[today] ?? {
    cardsReviewed: 0,
    quizzesCompleted: 0,
    tasksCompleted: 0,
  };
  return {
    ...prevLog,
    [today]: {
      cardsReviewed: cur.cardsReviewed + (delta.cardsReviewed ?? 0),
      quizzesCompleted: cur.quizzesCompleted + (delta.quizzesCompleted ?? 0),
      tasksCompleted: cur.tasksCompleted + (delta.tasksCompleted ?? 0),
    },
  };
}

function getOrInitSkill(map: Record<string, SkillProgress>, guideId: string): SkillProgress {
  return (
    map[guideId] ?? {
      mastered: false,
      checklistDone: {},
      note: '',
    }
  );
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadLocalState);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [deepLink, setDeepLink] = useState<DeepLinkTarget | null>(null);

  // Persist state to localStorage
  useEffect(() => {
    saveLocalState(state);
  }, [state]);

  // Apply light/dark theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.theme]);

  const navigateTo = useCallback((target: DeepLinkTarget) => {
    setActiveTab(target.tab);
    setDeepLink(target);
  }, []);

  const clearDeepLink = useCallback(() => setDeepLink(null), []);

  const allWords = useMemo(
    () => [...DEFAULT_VOCAB_WORDS, ...state.customWords],
    [state.customWords]
  );

  const allTopics = useMemo(() => {
    const hasCustom = state.customWords.length > 0;
    const customTopicExists = VOCAB_TOPICS.some((t) => t.id === 'custom');
    if (hasCustom && !customTopicExists) {
      return [
        ...VOCAB_TOPICS,
        {
          id: 'custom',
          title: 'Personal Vocabulary',
          titleVi: 'Từ vựng cá nhân của bạn',
          description: 'Các từ mới bạn tự thêm để ôn luyện riêng.',
          iconName: 'Sparkles',
          color: 'indigo',
          isCustom: true,
        },
      ];
    }
    return VOCAB_TOPICS;
  }, [state.customWords.length]);

  const dueWordsToday = useMemo(
    () => allWords.filter((w) => isWordDueToday(state.vocabProgress[w.id])),
    [allWords, state.vocabProgress]
  );

  const bookmarkedWords = useMemo(
    () => allWords.filter((w) => state.vocabProgress[w.id]?.bookmarked),
    [allWords, state.vocabProgress]
  );

  const masteredWordsCount = useMemo(
    () => allWords.filter((w) => state.vocabProgress[w.id]?.status === 'mastered').length,
    [allWords, state.vocabProgress]
  );

  const learningWordsCount = useMemo(
    () => allWords.filter((w) => state.vocabProgress[w.id]?.status === 'learning').length,
    [allWords, state.vocabProgress]
  );

  const streak = useMemo(() => computeStreak(state.activityLog), [state.activityLog]);

  const currentRoadmapDay = useMemo(
    () => getCurrentRoadmapDay(state.settings.startDate),
    [state.settings.startDate]
  );

  const daysUntilExam = useMemo(
    () => getDaysRemainingToExam(state.settings.examDate),
    [state.settings.examDate]
  );

  const roadmapCompletionPercent = useMemo(() => {
    const totalTasks = ROADMAP_DAYS.reduce((acc, d) => acc + d.tasks.length, 0);
    if (totalTasks === 0) return 0;
    const done = ROADMAP_DAYS.reduce(
      (acc, d) =>
        acc + d.tasks.filter((t) => Boolean(state.roadmapCompletedTasks[t.id])).length,
      0
    );
    return Math.round((done / totalTasks) * 100);
  }, [state.roadmapCompletedTasks]);

  const grammarCompletionPercent = useMemo(() => {
    const done = GRAMMAR_TOPICS.filter((g) => state.grammarProgress[g.id]?.completed).length;
    return Math.round((done / GRAMMAR_TOPICS.length) * 100);
  }, [state.grammarProgress]);

  const skillsCompletionPercent = useMemo(() => {
    const done = SKILL_GUIDES.filter((s) => state.skillProgress[s.id]?.mastered).length;
    return Math.round((done / SKILL_GUIDES.length) * 100);
  }, [state.skillProgress]);

  const rateVocabCard = useCallback((wordId: string, ease: VocabEase) => {
    setState((prev) => ({
      ...prev,
      vocabProgress: {
        ...prev.vocabProgress,
        [wordId]: calculateNextReview(prev.vocabProgress[wordId], ease),
      },
      activityLog: bumpTodayActivity(prev.activityLog, { cardsReviewed: 1 }),
    }));
  }, []);

  const recordQuizResults = useCallback((results: { wordId: string; isCorrect: boolean }[]) => {
    setState((prev) => {
      const nextVocab = { ...prev.vocabProgress };
      for (const item of results) {
        const cur = nextVocab[item.wordId] ?? createInitialCardProgress();
        if (item.isCorrect) {
          nextVocab[item.wordId] = calculateNextReview(cur, 'good');
        } else {
          const updated = calculateNextReview(cur, 'again');
          nextVocab[item.wordId] = {
            ...updated,
            bookmarked: cur.bookmarked,
          };
        }
      }
      return {
        ...prev,
        vocabProgress: nextVocab,
        activityLog: bumpTodayActivity(prev.activityLog, {
          quizzesCompleted: 1,
          cardsReviewed: results.length,
        }),
      };
    });
  }, []);

  const toggleBookmark = useCallback((wordId: string) => {
    setState((prev) => {
      const cur = prev.vocabProgress[wordId] ?? createInitialCardProgress();
      return {
        ...prev,
        vocabProgress: {
          ...prev.vocabProgress,
          [wordId]: {
            ...cur,
            bookmarked: !cur.bookmarked,
          },
        },
      };
    });
  }, []);

  const addCustomWord = useCallback((wordInput: Omit<VocabWord, 'id' | 'isCustom'>) => {
    const newWord: VocabWord = {
      ...wordInput,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      isCustom: true,
    };
    setState((prev) => ({
      ...prev,
      customWords: [newWord, ...prev.customWords],
    }));
  }, []);

  const addCustomWordsBulk = useCallback((wordsInput: Omit<VocabWord, 'id' | 'isCustom'>[]) => {
    const now = Date.now();
    const created: VocabWord[] = wordsInput.map((wordInput, idx) => ({
      ...wordInput,
      id: `custom-${now}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
      isCustom: true,
    }));
    setState((prev) => ({
      ...prev,
      customWords: [...created, ...prev.customWords],
    }));
  }, []);

  const updateCustomWord = useCallback((updatedWord: VocabWord) => {
    setState((prev) => ({
      ...prev,
      customWords: prev.customWords.map((w) => (w.id === updatedWord.id ? updatedWord : w)),
    }));
  }, []);

  const deleteCustomWord = useCallback((wordId: string) => {
    setState((prev) => {
      const nextProgress = { ...prev.vocabProgress };
      delete nextProgress[wordId];
      return {
        ...prev,
        customWords: prev.customWords.filter((w) => w.id !== wordId),
        vocabProgress: nextProgress,
      };
    });
  }, []);

  const saveGrammarAttempt = useCallback((topicId: string, scorePercent: number) => {
    setState((prev) => {
      const cur = prev.grammarProgress[topicId] ?? {
        completed: false,
        bestScore: 0,
        attempts: 0,
        note: '',
      };
      const bestScore = Math.max(cur.bestScore, scorePercent);
      return {
        ...prev,
        grammarProgress: {
          ...prev.grammarProgress,
          [topicId]: {
            ...cur,
            completed: cur.completed || scorePercent >= 65,
            bestScore,
            lastScore: scorePercent,
            attempts: cur.attempts + 1,
            lastStudiedAt: new Date().toISOString(),
          },
        },
        activityLog: bumpTodayActivity(prev.activityLog, { quizzesCompleted: 1 }),
      };
    });
  }, []);

  const saveGrammarNote = useCallback((topicId: string, note: string) => {
    setState((prev) => {
      const cur = prev.grammarProgress[topicId] ?? {
        completed: false,
        bestScore: 0,
        attempts: 0,
        note: '',
      };
      return {
        ...prev,
        grammarProgress: {
          ...prev.grammarProgress,
          [topicId]: { ...cur, note },
        },
      };
    });
  }, []);

  const toggleGrammarCompleted = useCallback((topicId: string) => {
    setState((prev) => {
      const cur = prev.grammarProgress[topicId] ?? {
        completed: false,
        bestScore: 0,
        attempts: 0,
        note: '',
      };
      return {
        ...prev,
        grammarProgress: {
          ...prev.grammarProgress,
          [topicId]: {
            ...cur,
            completed: !cur.completed,
            lastStudiedAt: new Date().toISOString(),
          },
        },
        activityLog: bumpTodayActivity(prev.activityLog, {
          tasksCompleted: !cur.completed ? 1 : 0,
        }),
      };
    });
  }, []);

  const toggleSkillMastered = useCallback((guideId: string) => {
    setState((prev) => {
      const cur = getOrInitSkill(prev.skillProgress, guideId);
      const nextVal = !cur.mastered;
      return {
        ...prev,
        skillProgress: {
          ...prev.skillProgress,
          [guideId]: {
            ...cur,
            mastered: nextVal,
            lastUpdatedAt: new Date().toISOString(),
          },
        },
        activityLog: bumpTodayActivity(prev.activityLog, {
          tasksCompleted: nextVal ? 1 : 0,
        }),
      };
    });
  }, []);

  const toggleSkillChecklist = useCallback((guideId: string, itemId: string) => {
    setState((prev) => {
      const cur = getOrInitSkill(prev.skillProgress, guideId);
      const nextCheck = !cur.checklistDone[itemId];
      return {
        ...prev,
        skillProgress: {
          ...prev.skillProgress,
          [guideId]: {
            ...cur,
            checklistDone: {
              ...cur.checklistDone,
              [itemId]: nextCheck,
            },
            lastUpdatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const saveSkillNote = useCallback((guideId: string, note: string) => {
    setState((prev) => {
      const cur = getOrInitSkill(prev.skillProgress, guideId);
      return {
        ...prev,
        skillProgress: {
          ...prev.skillProgress,
          [guideId]: {
            ...cur,
            note,
            lastUpdatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const saveWritingDraft = useCallback((draftKey: string, content: string) => {
    setState((prev) => {
      const nextDrafts = { ...prev.writingDrafts };
      if (content === '') {
        delete nextDrafts[draftKey];
      } else {
        nextDrafts[draftKey] = content;
      }
      return {
        ...prev,
        writingDrafts: nextDrafts,
      };
    });
  }, []);

  const toggleRoadmapTask = useCallback((taskId: string) => {
    setState((prev) => {
      const nextDone = !prev.roadmapCompletedTasks[taskId];
      return {
        ...prev,
        roadmapCompletedTasks: {
          ...prev.roadmapCompletedTasks,
          [taskId]: nextDone,
        },
        activityLog: bumpTodayActivity(prev.activityLog, {
          tasksCompleted: nextDone ? 1 : 0,
        }),
      };
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importData = useCallback((jsonText: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<AppState>;
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof parsed.settings !== 'object'
      ) {
        return { ok: false, error: 'Tệp JSON không đúng định dạng sao lưu của VSTEP App.' };
      }
      setState(normalizeAppState(parsed));
      return { ok: true };
    } catch {
      return { ok: false, error: 'Không thể đọc tệp JSON. Vui lòng kiểm tra lại.' };
    }
  }, []);

  const resetData = useCallback(() => {
    setState(buildDefaultState());
  }, []);

  const replaceState = useCallback((next: AppState) => {
    setState(next);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      activeTab,
      setActiveTab,
      deepLink,
      clearDeepLink,
      navigateTo,
      allWords,
      allTopics,
      dueWordsToday,
      bookmarkedWords,
      masteredWordsCount,
      learningWordsCount,
      streak,
      currentRoadmapDay,
      daysUntilExam,
      roadmapCompletionPercent,
      grammarCompletionPercent,
      skillsCompletionPercent,
      rateVocabCard,
      recordQuizResults,
      toggleBookmark,
      addCustomWord,
      addCustomWordsBulk,
      updateCustomWord,
      deleteCustomWord,
      saveGrammarAttempt,
      saveGrammarNote,
      toggleGrammarCompleted,
      toggleSkillMastered,
      toggleSkillChecklist,
      saveSkillNote,
      saveWritingDraft,
      toggleRoadmapTask,
      updateSettings,
      exportData,
      importData,
      resetData,
      replaceState,
    }),
    [
      state,
      activeTab,
      deepLink,
      clearDeepLink,
      navigateTo,
      allWords,
      allTopics,
      dueWordsToday,
      bookmarkedWords,
      masteredWordsCount,
      learningWordsCount,
      streak,
      currentRoadmapDay,
      daysUntilExam,
      roadmapCompletionPercent,
      grammarCompletionPercent,
      skillsCompletionPercent,
      rateVocabCard,
      recordQuizResults,
      toggleBookmark,
      addCustomWord,
      addCustomWordsBulk,
      updateCustomWord,
      deleteCustomWord,
      saveGrammarAttempt,
      saveGrammarNote,
      toggleGrammarCompleted,
      toggleSkillMastered,
      toggleSkillChecklist,
      saveSkillNote,
      saveWritingDraft,
      toggleRoadmapTask,
      updateSettings,
      exportData,
      importData,
      resetData,
      replaceState,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
