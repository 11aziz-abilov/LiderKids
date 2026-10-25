import { SubjectId, GradeLevel } from './index';
import { DayOfWeekKey } from '@/utils/tashkentTime';

export type { DayOfWeekKey };

export interface ScheduledLesson {
  id: string; // e.g. "sch-g4-mon-math"
  dayKey: DayOfWeekKey;
  subjectId: SubjectId;
  grade: GradeLevel;
  title: string;
  topic: string;
  durationMinutes: number;
  youtubeId: string;
  description: string;
  learningPoints: string[];
}

export interface DayScheduleConfig {
  dayKey: DayOfWeekKey;
  dayName: string;
  subjects: SubjectId[];
  isExamDay?: boolean;
  description: string;
}

export interface ScheduledLessonProgressItem {
  lessonId: string;
  weekId: string;
  dayKey: DayOfWeekKey;
  subjectId: SubjectId;
  completedAt: string; // ISO string or Tashkent date
  isCompleted: boolean;
}

export interface WeeklyExamSubjectScore {
  subjectId: SubjectId;
  subjectTitle: string;
  score: number;
  total: number;
  percentage: number;
}

export interface WeeklyExamResult {
  id: string;
  weekId: string;
  date: string; // YYYY-MM-DD
  grade: GradeLevel;
  totalScore: number;
  maxScore: number; // 20
  percentage: number;
  scoresBySubject: Record<SubjectId, WeeklyExamSubjectScore>;
  weakTopics: string[];
  rewardCoins: number;
  rewardXp: number;
  completedAt: string;
}

export interface WeakTopicRecord {
  topic: string;
  subjectId: SubjectId;
  grade: GradeLevel;
  mistakeCount: number;
  lastTestedAt: string;
  sampleQuestion?: string;
}

export interface ParentWeeklySummary {
  studentName: string;
  grade: GradeLevel;
  weekId: string;
  periodLabel: string; // e.g. "19-oktabr — 25-oktabr, 2026"
  lessonsScheduledCount: number; // 12 ta (6 kun x 2 ta dars)
  lessonsCompletedCount: number;
  lessonsCompletionRate: number; // foizda
  missedLessonsCount: number;
  weeklyExamTaken: boolean;
  weeklyExamResult?: WeeklyExamResult | null;
  weakTopics: WeakTopicRecord[];
  strengths: string[];
  telegramMessageText: string;
  generatedAt: string;
}
