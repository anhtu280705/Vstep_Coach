export type TabId = 'dashboard' | 'vocab' | 'grammar' | 'skills' | 'settings';

export type VocabLevel = 'B1' | 'B2';
export type VocabStatus = 'new' | 'learning' | 'mastered';
export type VocabEase = 'again' | 'hard' | 'good';

export interface VocabTopic {
  id: string;
  title: string;
  titleVi: string;
  description: string;
  iconName: string;
  color: string;
  isCustom?: boolean;
}

export interface VocabWord {
  id: string;
  topicId: string;
  word: string;
  ipa: string;
  pos: string;
  level: VocabLevel;
  meaning: string;
  example: string;
  exampleVi: string;
  collocations: string[];
  isCustom?: boolean;
}

export interface VocabCardProgress {
  status: VocabStatus;
  ease: VocabEase;
  intervalDays: number;
  nextReviewDate: string; // YYYY-MM-DD
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  bookmarked: boolean;
  lastReviewedAt?: string;
}

export interface GrammarFormula {
  label: string;
  structure: string;
  example: string;
}

export interface GrammarMistake {
  wrong: string;
  right: string;
  reason: string;
}

export interface GrammarQuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  subtitle: string;
  level: VocabLevel;
  summary: string;
  formulas: GrammarFormula[];
  signalWords: string[];
  vstepUsage: string;
  commonMistakes: GrammarMistake[];
  quiz: GrammarQuizQuestion[];
}

export interface GrammarTopicProgress {
  completed: boolean;
  bestScore: number; // percentage 0-100
  lastScore?: number;
  attempts: number;
  note: string;
  lastStudiedAt?: string;
}

export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking';

export interface SkillTemplate {
  label: string;
  phrases: string[];
}

export interface SkillChecklistItem {
  id: string;
  text: string;
}

export interface TimerPreset {
  label: string;
  seconds: number;
}

export interface SkillGuide {
  id: string;
  skill: SkillType;
  partLabel: string;
  title: string;
  duration: string;
  taskInfo: string;
  steps: string[];
  traps: string[];
  templates: SkillTemplate[];
  sample: {
    title: string;
    content: string;
  };
  checklist: SkillChecklistItem[];
  timerPresets?: TimerPreset[];
}

export interface SkillProgress {
  mastered: boolean;
  checklistDone: Record<string, boolean>;
  note: string;
  lastUpdatedAt?: string;
}

export type RoadmapCategory = 'vocab' | 'grammar' | 'skills' | 'review';

export interface DeepLinkTarget {
  tab: TabId;
  itemId?: string;
  mode?: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  category: RoadmapCategory;
  minutes: number;
  targetNav: DeepLinkTarget;
}

export interface RoadmapDay {
  day: number;
  week: 1 | 2;
  phaseLabel: string;
  focusTitle: string;
  totalMinutes: number;
  tasks: RoadmapTask[];
}

export type TtsAccent = 'en-GB' | 'en-US';
export type TtsRate = 0.75 | 1 | 1.15;

export interface AppSettings {
  theme: 'light' | 'dark';
  autoSpeak: boolean;
  ttsAccent: TtsAccent;
  ttsRate: TtsRate;
  startDate: string; // YYYY-MM-DD
  examDate: string; // YYYY-MM-DD
  dailyVocabGoal: number;
  showDragon: boolean;
}

export interface ActivityDayLog {
  cardsReviewed: number;
  quizzesCompleted: number;
  tasksCompleted: number;
}

export interface AppState {
  version: number;
  settings: AppSettings;
  vocabProgress: Record<string, VocabCardProgress>;
  customWords: VocabWord[];
  grammarProgress: Record<string, GrammarTopicProgress>;
  skillProgress: Record<string, SkillProgress>;
  roadmapCompletedTasks: Record<string, boolean>;
  activityLog: Record<string, ActivityDayLog>;
}
