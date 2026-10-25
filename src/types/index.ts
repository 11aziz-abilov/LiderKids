export type GradeLevel = 1 | 2 | 3 | 4;

export type SubjectId = 'math' | 'logic' | 'critical' | 'english';

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

export type DifficultyLevel = 'oson' | 'o‘rta' | 'qiyin';

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
  topic?: string;
  difficulty?: DifficultyLevel;
  difficultyLevel?: 1 | 2 | 3;
  passage?: string | null;
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

export type StreakPrizeId = 'streak_pen_7' | 'streak_cap_30' | 'streak_cup_60' | 'streak_tshirt_100';

export interface StreakPrize {
  id: StreakPrizeId;
  daysRequired: number; // 7, 30, 60, 100 kun
  periodLabel: string; // '1 hafta', '1 oy', '2 oy', '100 kun'
  name: string; // 'LiderKids Brend Ruchkasi', etc.
  category: 'pen' | 'cap' | 'cup' | 'tshirt';
  emoji: string;
  badge: string;
  description: string;
  detailedFeature: string;
  color: string;
  border: string;
  bgSoft: string;
  realGiftNote: string;
}

export interface StreakPrizeClaim {
  prizeId: StreakPrizeId;
  prizeName: string;
  periodLabel: string;
  claimedAt: string;
  studentName: string;
  parentPhone: string;
  deliveryRegion: string;
  deliveryAddress: string;
  sizeOrVariant?: string;
  status: 'processing' | 'shipped' | 'delivered';
  trackingCode: string;
}

export type SmsType = 'inactivity_1day' | 'quiz_progress' | 'level_up' | 'system' | 'streak_prize_won';

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
    prizeName?: string;
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
  botSyncCode?: string; // Telegram botga ulash uchun 6 xonali shaxsiy kod (masalan, "749201")
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
  gameCounts?: Record<string, number>; // har bir mini-o‘yin bo‘yicha o‘ynalgan soni (masalan { memory: 1, puzzle: 0 })
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
  streakClaims?: Record<string, StreakPrizeClaim>;
  celebratedMilestones?: number[];
  dailyPuzzleHistory?: Record<string, import('./puzzle').DailyPuzzleRecord>;
  dailyPuzzleStreak?: number;
  scheduledLessonsProgress?: Record<string, import('./schedule').ScheduledLessonProgressItem>;
  weeklyExamHistory?: Record<string, import('./schedule').WeeklyExamResult>;
  weakTopics?: import('./schedule').WeakTopicRecord[];
}

export * from './puzzle';
export * from './schedule';
