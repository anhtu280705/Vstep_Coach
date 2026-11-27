import { AppState, VocabWord } from '../types';

export function hasMeaningfulProgress(state: AppState): boolean {
  const hasDrafts = Object.values(state.writingDrafts ?? {}).some(
    (v) => typeof v === 'string' && v.trim().length > 0
  );
  return (
    Object.keys(state.vocabProgress).length > 0 ||
    state.customWords.length > 0 ||
    Object.keys(state.grammarProgress).length > 0 ||
    Object.keys(state.skillProgress).length > 0 ||
    Object.keys(state.roadmapCompletedTasks).length > 0 ||
    hasDrafts
  );
}

function pickNewerTimestamp(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  const timeA = Date.parse(a);
  const timeB = Date.parse(b);
  if (Number.isNaN(timeA)) return b;
  if (Number.isNaN(timeB)) return a;
  return timeA >= timeB ? a : b;
}

/**
 * Gộp thông minh tiến độ giữa máy cục bộ và dữ liệu đám mây
 * để khi đăng nhập trên thiết bị mới hoặc đồng bộ giữa PC ↔ Điện thoại
 * không làm mất từ đã thuộc, điểm cao nhất, bài viết nháp hay lịch học.
 */
export function mergeAppStates(local: AppState, cloud: AppState): AppState {
  const mergedVocab = { ...cloud.vocabProgress };
  for (const [wordId, locCard] of Object.entries(local.vocabProgress)) {
    const clCard = mergedVocab[wordId];
    if (!clCard) {
      mergedVocab[wordId] = locCard;
    } else {
      const locTime = locCard.lastReviewedAt ? Date.parse(locCard.lastReviewedAt) : 0;
      const clTime = clCard.lastReviewedAt ? Date.parse(clCard.lastReviewedAt) : 0;
      const chosen = locTime >= clTime ? locCard : clCard;
      mergedVocab[wordId] = {
        ...chosen,
        bookmarked: locCard.bookmarked || clCard.bookmarked,
      };
    }
  }

  const customMap = new Map<string, VocabWord>();
  for (const w of cloud.customWords ?? []) customMap.set(w.id, w);
  for (const w of local.customWords ?? []) customMap.set(w.id, w);

  const mergedGrammar = { ...cloud.grammarProgress };
  for (const [id, locG] of Object.entries(local.grammarProgress)) {
    const clG = mergedGrammar[id];
    if (!clG) {
      mergedGrammar[id] = locG;
    } else {
      mergedGrammar[id] = {
        completed: locG.completed || clG.completed,
        bestScore: Math.max(locG.bestScore, clG.bestScore),
        lastScore: locG.lastScore ?? clG.lastScore,
        attempts: Math.max(locG.attempts, clG.attempts),
        note: locG.note.length >= clG.note.length ? locG.note : clG.note,
        lastStudiedAt: pickNewerTimestamp(locG.lastStudiedAt, clG.lastStudiedAt),
      };
    }
  }

  const mergedSkills = { ...cloud.skillProgress };
  for (const [id, locS] of Object.entries(local.skillProgress)) {
    const clS = mergedSkills[id];
    if (!clS) {
      mergedSkills[id] = locS;
    } else {
      const checklistDone: Record<string, boolean> = { ...clS.checklistDone };
      for (const [k, v] of Object.entries(locS.checklistDone)) {
        if (v) checklistDone[k] = true;
      }
      mergedSkills[id] = {
        mastered: locS.mastered || clS.mastered,
        checklistDone,
        note: locS.note.length >= clS.note.length ? locS.note : clS.note,
        lastUpdatedAt: pickNewerTimestamp(locS.lastUpdatedAt, clS.lastUpdatedAt),
      };
    }
  }

  const mergedRoadmap: Record<string, boolean> = { ...cloud.roadmapCompletedTasks };
  for (const [k, v] of Object.entries(local.roadmapCompletedTasks)) {
    if (v) mergedRoadmap[k] = true;
  }

  const mergedActivity = { ...cloud.activityLog };
  for (const [day, locLog] of Object.entries(local.activityLog)) {
    const clLog = mergedActivity[day];
    if (!clLog) {
      mergedActivity[day] = locLog;
    } else {
      mergedActivity[day] = {
        cardsReviewed: Math.max(locLog.cardsReviewed, clLog.cardsReviewed),
        quizzesCompleted: Math.max(locLog.quizzesCompleted, clLog.quizzesCompleted),
        tasksCompleted: Math.max(locLog.tasksCompleted, clLog.tasksCompleted),
      };
    }
  }

  const mergedWritingDrafts: Record<string, string> = { ...(cloud.writingDrafts ?? {}) };
  for (const [k, locDraft] of Object.entries(local.writingDrafts ?? {})) {
    const clDraft = mergedWritingDrafts[k] ?? '';
    if (locDraft.length >= clDraft.length) {
      mergedWritingDrafts[k] = locDraft;
    }
  }

  const localHasData = hasMeaningfulProgress(local);
  const cloudHasData = hasMeaningfulProgress(cloud);
  // Fresh device with no local progress should adopt cloud schedule/settings instead of overwriting them with defaults
  const mergedSettings =
    !localHasData && cloudHasData
      ? { ...local.settings, ...cloud.settings }
      : { ...cloud.settings, ...local.settings };

  return {
    version: Math.max(local.version, cloud.version ?? 1),
    settings: mergedSettings,
    vocabProgress: mergedVocab,
    customWords: Array.from(customMap.values()),
    grammarProgress: mergedGrammar,
    skillProgress: mergedSkills,
    roadmapCompletedTasks: mergedRoadmap,
    activityLog: mergedActivity,
    writingDrafts: mergedWritingDrafts,
  };
}
