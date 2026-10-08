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

export interface UserProfile {
  firstName: string;
  lastName: string;
  grade: GradeLevel;
  phoneNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardHolder: string;
  parentName: string;
  region: string;
  district: string;
  school?: string;
  registeredAt?: string;
  academicYear?: string;
  academicYearEndDate?: string;
  isRegistered: boolean;
}

export type MarketCategory = 'outfit' | 'backpack' | 'hat' | 'accessory';

export interface MarketItem {
  id: string;
  name: string;
  category: MarketCategory;
  price: number;
  emoji: string;
  description: string;
  badge: string;
  color: string;
}

export interface EquippedItems {
  outfit?: string;
  backpack?: string;
  hat?: string;
  accessory?: string;
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
  profile?: UserProfile;
  academicYearPromotionNotice?: {
    fromGrade: GradeLevel;
    toGrade: GradeLevel;
    year: string;
  } | null;
  inventory?: string[];
  equippedItems?: EquippedItems;
}


