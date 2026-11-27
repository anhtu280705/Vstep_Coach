import { AppState } from '../types';
import { addDays, getTodayStr } from './date';

export const STORAGE_KEY = 'vstep_b1b2_app_state_v1';
const LEGACY_WRITING_PREFIX = 'vstep_writing_draft_';

/** Build a clean default AppState initialized around today's date. */
export function buildDefaultState(): AppState {
  const today = getTodayStr();
  return {
    version: 1,
    settings: {
      theme: 'light',
      autoSpeak: true,
      ttsAccent: 'en-US',
      ttsRate: 1,
      startDate: today,
      examDate: addDays(today, 13), // 14 ngày tính cả hôm nay (ngày 1..14)
      dailyVocabGoal: 12,
      showDragon: true,
    },
    vocabProgress: {},
    customWords: [],
    grammarProgress: {},
    skillProgress: {},
    roadmapCompletedTasks: {},
    activityLog: {},
    writingDrafts: {},
  };
}

/** Normalize an untrusted or partial state object into a complete AppState. */
export function normalizeAppState(parsed: Partial<AppState> | null | undefined): AppState {
  const base = buildDefaultState();
  if (!parsed || typeof parsed !== 'object') {
    return base;
  }

  return {
    ...base,
    ...parsed,
    settings: {
      ...base.settings,
      ...(parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {}),
    },
    vocabProgress:
      parsed.vocabProgress && typeof parsed.vocabProgress === 'object'
        ? parsed.vocabProgress
        : {},
    customWords: Array.isArray(parsed.customWords) ? parsed.customWords : [],
    grammarProgress:
      parsed.grammarProgress && typeof parsed.grammarProgress === 'object'
        ? parsed.grammarProgress
        : {},
    skillProgress:
      parsed.skillProgress && typeof parsed.skillProgress === 'object'
        ? parsed.skillProgress
        : {},
    roadmapCompletedTasks:
      parsed.roadmapCompletedTasks && typeof parsed.roadmapCompletedTasks === 'object'
        ? parsed.roadmapCompletedTasks
        : {},
    activityLog:
      parsed.activityLog && typeof parsed.activityLog === 'object' ? parsed.activityLog : {},
    writingDrafts:
      parsed.writingDrafts && typeof parsed.writingDrafts === 'object'
        ? parsed.writingDrafts
        : {},
  };
}

/** Collect any legacy standalone writing drafts (`vstep_writing_draft_*`) from localStorage. */
export function migrateLegacyWritingDrafts(): Record<string, string> {
  const drafts: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LEGACY_WRITING_PREFIX)) {
        const draftKey = key.slice(LEGACY_WRITING_PREFIX.length);
        const value = localStorage.getItem(key);
        if (draftKey && value) {
          drafts[draftKey] = value;
        }
      }
    }
  } catch {
    // Ignore storage access errors
  }
  return drafts;
}

/** Load AppState from localStorage, normalizing structure and migrating legacy writing drafts. */
export function loadLocalState(): AppState {
  const fallback = buildDefaultState();
  const legacyDrafts = migrateLegacyWritingDrafts();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return Object.keys(legacyDrafts).length > 0
        ? { ...fallback, writingDrafts: legacyDrafts }
        : fallback;
    }
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const normalized = normalizeAppState(parsed);
    return {
      ...normalized,
      writingDrafts: {
        ...legacyDrafts,
        ...normalized.writingDrafts,
      },
    };
  } catch {
    return Object.keys(legacyDrafts).length > 0
      ? { ...fallback, writingDrafts: legacyDrafts }
      : fallback;
  }
}

/** Persist AppState to localStorage safely. */
export function saveLocalState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota exceeded
  }
}
