export type GradeLevel = 1 | 2 | 3 | 4;

export type SubjectId = 'math' | 'logic' | 'critical';

export interface SubjectInfo {
  id: SubjectId;
  title: string;
  subtitle: string;
  iconName: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    gradient: string;
  };
  description: string;
  totalQuestions: number;
}

export interface QuizQuestion {
  id: string;
  subjectId: SubjectId;
  grade: GradeLevel;
  question: string;
  imageOrEmoji?: string;
  hint?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  subjectId: SubjectId;
  grade: GradeLevel;
  title: string;
  durationMinutes: number;
  youtubeId: string;
  description: string;
  learningPoints: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredCoins?: number;
  requiredStreaks?: number;
  requiredQuizzes?: number;
  unlocked: boolean;
}

export interface UserProgress {
  name: string;
  grade: GradeLevel;
  coins: number;
  streaks: number;
  xp: number;
  completedLessons: string[];
  completedQuizzes: string[];
  soundEnabled: boolean;
  unlockedAchievements: string[];
}
