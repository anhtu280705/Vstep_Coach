import { VocabCardProgress, VocabEase } from '../types';
import { addDays, getTodayStr } from './date';

export function createInitialCardProgress(): VocabCardProgress {
  return {
    status: 'new',
    ease: 'again',
    intervalDays: 0,
    nextReviewDate: getTodayStr(),
    reviewCount: 0,
    correctCount: 0,
    wrongCount: 0,
    bookmarked: false,
  };
}

export function calculateNextReview(
  current: VocabCardProgress | undefined,
  ease: VocabEase
): VocabCardProgress {
  const base = current ?? createInitialCardProgress();
  const today = getTodayStr();

  let intervalDays = 0;
  let status: VocabCardProgress['status'] = 'learning';
  let correctDelta = 0;
  let wrongDelta = 0;

  if (ease === 'again') {
    intervalDays = 0;
    status = 'learning';
    wrongDelta = 1;
  } else if (ease === 'hard') {
    intervalDays = 1;
    status = 'learning';
    correctDelta = 1;
  } else {
    // ease === 'good'
    if (base.intervalDays < 1) {
      intervalDays = 3;
    } else if (base.intervalDays <= 3) {
      intervalDays = 7;
    } else {
      intervalDays = 14;
    }
    status = 'mastered';
    correctDelta = 1;
  }

  return {
    ...base,
    status,
    ease,
    intervalDays,
    nextReviewDate: addDays(today, intervalDays),
    reviewCount: base.reviewCount + 1,
    correctCount: base.correctCount + correctDelta,
    wrongCount: base.wrongCount + wrongDelta,
    lastReviewedAt: new Date().toISOString(),
  };
}

export function isWordDueToday(progress: VocabCardProgress | undefined): boolean {
  if (!progress || progress.status === 'new') return false;
  const today = getTodayStr();
  return progress.nextReviewDate <= today;
}

export function getNextIntervalLabel(
  current: VocabCardProgress | undefined,
  ease: VocabEase
): string {
  if (ease === 'again') return 'Ôn lại hôm nay';
  if (ease === 'hard') return '1 ngày';
  const prev = current?.intervalDays ?? 0;
  if (prev < 1) return '3 ngày';
  if (prev <= 3) return '7 ngày';
  return '14 ngày';
}
