import { ActivityDayLog } from '../types';

export function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayStr(): string {
  return formatDateStr(new Date());
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDateStr(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateStr(date);
}

export function daysBetween(startStr: string, endStr: string): number {
  const start = parseDateStr(startStr);
  const end = parseDateStr(endStr);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseDateStr(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Tính ngày hiện tại trong lộ trình 14 ngày (1..14).
 * Dựa vào startDate, hoặc lùi từ examDate nếu user thay đổi ngày thi.
 */
export function getCurrentRoadmapDay(startDate: string): number {
  const today = getTodayStr();
  const diff = daysBetween(startDate, today) + 1;
  if (diff < 1) return 1;
  if (diff > 14) return 14;
  return diff;
}

export function getDaysRemainingToExam(examDate: string): number {
  const today = getTodayStr();
  const diff = daysBetween(today, examDate);
  return diff;
}

export function computeStreak(activityLog: Record<string, ActivityDayLog>): number {
  const today = getTodayStr();
  const hasActivity = (dateStr: string): boolean => {
    const log = activityLog[dateStr];
    if (!log) return false;
    return log.cardsReviewed > 0 || log.quizzesCompleted > 0 || log.tasksCompleted > 0;
  };

  let streak = 0;
  let cursor = today;

  // Nếu hôm nay chưa học, kiểm tra từ hôm qua để giữ streak còn sống
  if (!hasActivity(cursor)) {
    cursor = addDays(today, -1);
    if (!hasActivity(cursor)) {
      return 0;
    }
  }

  while (hasActivity(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}
