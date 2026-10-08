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

export type SmsType = 'inactivity_1day' | 'quiz_progress' | 'level_up' | 'system';

export interface SmsMessage {
  id: string;
  type: SmsType;
  recipientPhone: string;
  recipientName: string;
  studentName: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed' | 'simulated';
  metadata?: {
    score?: number;
    totalQuestions?: number;
    accuracy?: number;
    grade?: GradeLevel;
    earnedCoins?: number;
    lionStageTitle?: string;
    subjectTitle?: string;
    daysInactive?: number;
    streaks?: number;
  };
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  grade: GradeLevel;
  gender: 'boy' | 'girl';
  phoneNumber: string;
  parentPhoneNumber?: string;
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
  smsNotificationsEnabled?: boolean;
  lastActiveDate?: string;
  lastInactivitySmsSentDate?: string;
}

export type MarketCategory = 'outfit' | 'backpack' | 'hat' | 'accessory';

export interface MarketItem {
  id: string;
  name: string;
  category: MarketCategory;
  gender?: 'boy' | 'girl' | 'all';
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

export interface DailyGamesRecord {
  date: string; // YYYY-MM-DD (mahalliy sana)
  count: number;
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
  smsHistory?: SmsMessage[];
  dailyGames?: DailyGamesRecord;
}


