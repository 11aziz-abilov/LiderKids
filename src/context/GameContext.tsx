'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GradeLevel, SubjectId, UserProgress, UserProfile, MarketItem, MarketCategory, SmsMessage, StreakPrize, StreakPrizeId, DailyPuzzleRecord } from '@/types';
import { ScheduledLessonProgressItem, WeeklyExamResult, WeakTopicRecord } from '@/types/schedule';
import { DayOfWeekKey, getWeekId, getTashkentTodayDateString } from '@/utils/tashkentTime';
import { STREAK_PRIZES } from '@/data/streakRewardsData';
import { sound } from '@/utils/sound';
import { smsService } from '@/utils/smsService';
import { notifications } from '@/utils/notifications';

import { getCurrentAcademicYear, getNextGrade } from '@/utils/academicYear';
import { saveStoredLearner, getOrCreateUniqueUserId } from '@/data/leaderboardData';

interface LionStage {
  title: string;
  stageName: string;
  badge: string;
  quote: string;
  description: string;
  color: string;
  xpNeededForNext: number;
}

const LION_STAGES: Record<GradeLevel, LionStage> = {
  1: {
    title: 'Kichkintoy Shercha',
    stageName: 'Baby Cub',
    badge: '🐾 1-sinf boshlovchisi',
    quote: 'Salom, do‘stim! Men bilan birga birinchi sarguzashtni boshlaysanmi?',
    description: 'Qiziqqon va quvnoq kichkintoy. Har bir to‘g‘ri javob bilan bo‘yi o‘sib boradi!',
    color: 'from-amber-300 to-yellow-500',
    xpNeededForNext: 100,
  },
  2: {
    title: 'O‘ynoqi Shercha',
    stageName: 'Playful Cub',
    badge: '⚡ 2-sinf izlanuvchisi',
    quote: 'Qani, tezroq jumboqlarni yechaylik! Men yanada kuchliroq bo‘lyapman!',
    description: 'Chaqqon va topqir shercha. Mantiqiy savollarni xursandchilik bilan yengadi!',
    color: 'from-orange-400 to-amber-500',
    xpNeededForNext: 250,
  },
  3: {
    title: 'O‘smir Sher',
    stageName: 'Teen Lion',
    badge: '🎯 3-sinf yetakchisi',
    quote: 'Biz har qanday murakkab masalani mag‘lub eta olamiz. Prezident maktabi bizni kutyapti!',
    description: 'Kuchli, aqlli va qat\'iyatli. Yoli ko‘rkam bo‘lib, liderlik xislatlari namoyon bo‘lmoqda.',
    color: 'from-amber-500 to-orange-600',
    xpNeededForNext: 500,
  },
  4: {
    title: 'Qirol Sher',
    stageName: 'Adult King Lion',
    badge: '👑 4-sinf Chempioni & PM Nomzodi',
    quote: 'Men haqiqiy Qirolga aylandim! Prezident maktabi cho‘qqisini birga zabt etamiz!',
    description: 'Oltin toj kiygan shohona sher! Imtihonlarga 100% tayyor haqiqiy bilim qiroli!',
    color: 'from-amber-400 via-orange-500 to-yellow-300',
    xpNeededForNext: 1000,
  },
};

interface GameContextType {
  progress: UserProgress;
  lionStage: LionStage;
  isLoaded: boolean;
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSmsModalOpen: boolean;
  setIsSmsModalOpen: (open: boolean) => void;
  smsHistory: SmsMessage[];
  refreshSmsHistory: () => void;
  sendInactivitySmsAlert: (forceDemo?: boolean) => Promise<void>;
  sendQuizReportSms: (params: {
    score: number;
    totalQuestions: number;
    earnedCoins: number;
    subjectTitle?: string;
  }) => Promise<SmsMessage | null>;
  setGrade: (grade: GradeLevel) => void;
  setName: (name: string) => void;
  addCoins: (amount: number) => void;
  addStreak: (amount: number) => void;
  setStreaksDirectly: (days: number) => void;
  claimStreakPrize: (
    prizeId: StreakPrizeId,
    deliveryData: {
      studentName: string;
      parentPhone: string;
      deliveryRegion: string;
      deliveryAddress: string;
      sizeOrVariant?: string;
    }
  ) => boolean;
  celebrationPrize: StreakPrize | null;
  setCelebrationPrize: (prize: StreakPrize | null) => void;
  isStreakClaimModalOpen: boolean;
  setIsStreakClaimModalOpen: (open: boolean) => void;
  selectedPrizeToClaim: StreakPrize | null;
  setSelectedPrizeToClaim: (prize: StreakPrize | null) => void;
  openClaimModalForPrize: (prize: StreakPrize) => void;
  markLessonCompleted: (lessonId: string) => boolean;
  markQuizCompleted: (quizId: string) => void;
  toggleSound: () => void;
  registerUser: (profileData: Omit<UserProfile, 'isRegistered' | 'registeredAt' | 'academicYear' | 'academicYearEndDate'>) => void;
  continueAsGuest: () => void;
  loginUserByPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  advanceAcademicYearManually: () => void;
  clearPromotionNotice: () => void;
  buyMarketItem: (item: MarketItem) => boolean;
  equipMarketItem: (category: MarketCategory, itemId: string) => void;
  unequipMarketItem: (category: MarketCategory) => void;
  resetProgress: () => void;
  updateLastActiveDate: () => void;
  dailyGamesCount: number;
  remainingGamesToday: number;
  canPlayGame: boolean;
  maxDailyGames: number;
  maxPlaysPerGame: number;
  recordGamePlay: (gameId?: string) => boolean;
  isGameLocked: (gameId: string) => boolean;
  getGamePlayCount: (gameId: string) => number;
  getDailyPuzzleRecord: (dateStr?: string) => DailyPuzzleRecord | null;
  submitDailyPuzzle: (params: {
    puzzleId: string;
    optionIndex: number;
    isCorrect: boolean;
    rewardCoins: number;
    rewardXp: number;
    usedHint: boolean;
  }) => boolean;
  dailyPuzzleStreak: number;
  isTodayPuzzleSolved: boolean;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  aiAssistantContext: { subject?: string; topic?: string; question?: string; grade?: number; lessonId?: string } | null;
  openAiAssistant: (ctx?: { subject?: string; topic?: string; question?: string; grade?: number; lessonId?: string }) => void;
  closeAiAssistant: () => void;
  // Haftalik dars jadvali va imtihon tizimi
  currentWeekId: string;
  markScheduledLessonCompleted: (lessonId: string, dayKey: DayOfWeekKey, subjectId: SubjectId, targetWeekId?: string) => boolean;
  isScheduledLessonCompleted: (lessonId: string, weekId?: string) => boolean;
  saveWeeklyExamResult: (result: WeeklyExamResult) => void;
  getWeeklyExamResult: (weekId?: string) => WeeklyExamResult | null;
  weakTopics: WeakTopicRecord[];
  refreshBotSyncCode: () => Promise<string>;
  checkBotLinkStatus: () => Promise<void>;
  syncResultToDb: (params: {
    subject: string;
    type: 'quiz' | 'lesson' | 'puzzle';
    correct: number;
    total: number;
  }) => Promise<void>;
}

export const MAX_PLAYS_PER_GAME = 1;
export const TOTAL_MINI_GAMES = 4;
export const MAX_DAILY_GAMES = 4;

export const generateBotSyncCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const STORAGE_KEY = 'liderkids_progress_v2';
const PROFILE_KEY = 'liderkids_user_profile_v2';

const emptyProfile: UserProfile = {
  id: '',
  firstName: '',
  lastName: '',
  gender: 'boy',
  grade: 1,
  phoneNumber: '',
  parentPhoneNumber: '',
  parentName: '',
  region: 'Toshkent shahri',
  district: '',
  school: '',
  academicYear: '2026-2027',
  academicYearEndDate: new Date(2027, 4, 25, 23, 59, 59).toISOString(),
  isRegistered: false,
  isGuest: false,
  registeredAt: '',
  smsNotificationsEnabled: true,
  lastActiveDate: '',
  botSyncCode: '',
  isBotLinked: false,
};

const defaultProgress: UserProgress = {
  name: 'O‘quvchi',
  grade: 1,
  coins: 0,
  streaks: 0,
  xp: 0,
  completedLessons: [],
  completedQuizzes: [],
  soundEnabled: true,
  unlockedAchievements: [],
  inventory: [],
  equippedItems: {},
  profile: emptyProfile,
  dailyGames: {
    date: getTodayDateString(),
    count: 0,
    gameCounts: {},
  },
  scheduledLessonsProgress: {},
  weeklyExamHistory: {},
  weakTopics: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsHistory, setSmsHistory] = useState<SmsMessage[]>([]);
  const [celebrationPrize, setCelebrationPrize] = useState<StreakPrize | null>(null);
  const [isStreakClaimModalOpen, setIsStreakClaimModalOpen] = useState(false);
  const [selectedPrizeToClaim, setSelectedPrizeToClaim] = useState<StreakPrize | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiAssistantContext, setAiAssistantContext] = useState<{
    subject?: string;
    topic?: string;
    question?: string;
    grade?: number;
    lessonId?: string;
  } | null>(null);

  const openAiAssistant = useCallback(
    (ctx?: { subject?: string; topic?: string; question?: string; grade?: number; lessonId?: string }) => {
      if (ctx) {
        setAiAssistantContext(ctx);
      }
      setIsAiAssistantOpen(true);
    },
    []
  );

  const closeAiAssistant = useCallback(() => {
    setIsAiAssistantOpen(false);
  }, []);

  const openClaimModalForPrize = useCallback((prize: StreakPrize) => {
    setSelectedPrizeToClaim(prize);
    setIsStreakClaimModalOpen(true);
  }, []);

  const todayStr = getTodayDateString();
  const isDateToday = progress.dailyGames?.date === todayStr;
  const gameCounts = isDateToday ? (progress.dailyGames?.gameCounts || {}) : {};

  const getGamePlayCount = useCallback((gameId: string): number => {
    return gameCounts[gameId] || 0;
  }, [gameCounts]);

  const isGameLocked = useCallback((gameId: string): boolean => {
    return (gameCounts[gameId] || 0) >= MAX_PLAYS_PER_GAME;
  }, [gameCounts]);

  // Jami 4 ta mini-o‘yindan nechtasi 1 martalik limitiga yetgan
  const allGameIds = ['memory', 'puzzle', 'stars', 'checkers'];
  const playedDistinctGames = allGameIds.filter((id) => (gameCounts[id] || 0) >= MAX_PLAYS_PER_GAME).length;
  const dailyGamesCount = playedDistinctGames;
  const remainingGamesToday = Math.max(0, TOTAL_MINI_GAMES - playedDistinctGames);
  const canPlayGame = remainingGamesToday > 0;

  const recordGamePlay = useCallback((gameId?: string): boolean => {
    const currentToday = getTodayDateString();
    let permitted = false;

    setProgress((prev) => {
      const isToday = prev.dailyGames?.date === currentToday;
      const prevGameCounts = isToday ? (prev.dailyGames?.gameCounts || {}) : {};
      const prevCount = isToday ? (prev.dailyGames?.count || 0) : 0;

      if (gameId) {
        const countForThisGame = prevGameCounts[gameId] || 0;
        if (countForThisGame >= MAX_PLAYS_PER_GAME) {
          permitted = false;
          return prev;
        }

        permitted = true;
        return {
          ...prev,
          dailyGames: {
            date: currentToday,
            count: prevCount + 1,
            gameCounts: {
              ...prevGameCounts,
              [gameId]: countForThisGame + 1,
            },
          },
        };
      }

      if (prevCount >= TOTAL_MINI_GAMES) {
        permitted = false;
        return prev;
      }

      permitted = true;
      return {
        ...prev,
        dailyGames: {
          date: currentToday,
          count: prevCount + 1,
          gameCounts: prevGameCounts,
        },
      };
    });

    return permitted;
  }, []);

  const refreshSmsHistory = useCallback(() => {
    setSmsHistory(smsService.getHistory());
  }, []);

  // Load from database & localStorage on client mount
  useEffect(() => {
    async function initProfile() {
      try {
        setSmsHistory(smsService.getHistory());

        const saved = localStorage.getItem(STORAGE_KEY);
        let parsedProgress: any = null;

        if (saved) {
          parsedProgress = JSON.parse(saved);
        }

        // Check if saved profile is old demo profile "Yosh Lider" without real DB id
        const isOldDemo =
          parsedProgress?.profile?.firstName === 'Yosh' &&
          parsedProgress?.profile?.lastName === 'Lider' &&
          !parsedProgress?.profile?.id;

        const storedStudentId = localStorage.getItem('liderkids_student_id') || (!isOldDemo ? parsedProgress?.profile?.id : null);

        if (storedStudentId) {
          // Fetch real fresh data from Supabase
          try {
            const res = await fetch(`/api/auth/student?studentId=${storedStudentId}`);
            if (res.ok) {
              const data = await res.json();
              if (data.student) {
                const s = data.student;
                const { academicYear, endDate } = getCurrentAcademicYear();
                const loadedProgress: UserProgress = {
                  ...defaultProgress,
                  ...(parsedProgress || {}),
                  name: s.name,
                  grade: s.grade || 1,
                  coins: s.coins ?? 0,
                  xp: s.xp ?? 0,
                  streaks: s.streak ?? 0,
                  profile: {
                    id: s.id,
                    firstName: s.name.split(' ')[0] || s.name,
                    lastName: s.name.split(' ').slice(1).join(' ') || '',
                    grade: s.grade || 1,
                    gender: parsedProgress?.profile?.gender || 'boy',
                    phoneNumber: s.parent_phone || '',
                    parentPhoneNumber: s.parent_phone || '',
                    parentName: s.parent_name || 'Ota-ona',
                    region: s.region || 'Toshkent shahri',
                    district: s.school || '',
                    school: s.school || '',
                    academicYear,
                    academicYearEndDate: endDate.toISOString(),
                    isRegistered: true,
                    registeredAt: s.created_at || new Date().toISOString(),
                    smsNotificationsEnabled: true,
                    lastActiveDate: new Date().toISOString(),
                    isBotLinked: s.isBotLinked || false,
                  },
                };

                setProgress(loadedProgress);
                setIsLoaded(true);
                return;
              }
            }
          } catch (e) {
            console.warn('Supabase profile yuklash xatosi:', e);
          }
        }

        const isGuestSaved = localStorage.getItem('liderkids_is_guest') === 'true';

        if (parsedProgress && !isOldDemo && (parsedProgress.profile?.isRegistered || parsedProgress.profile?.isGuest || isGuestSaved)) {
          setProgress((prev) => ({ ...prev, ...parsedProgress }));
        } else {
          // New visitor: Show registration modal, 0 coins, 0 streak, 0 xp
          setProgress(defaultProgress);
          setIsRegistrationModalOpen(true);
        }
      } catch {
        setProgress(defaultProgress);
        setIsRegistrationModalOpen(true);
      } finally {
        setIsLoaded(true);
      }
    }

    initProfile();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

        const studentName = (
          progress.profile?.firstName
            ? `${progress.profile.firstName} ${progress.profile.lastName}`
            : progress.name || 'Yosh Lider'
        ).trim();

        saveStoredLearner({
          id: getOrCreateUniqueUserId(),
          name: studentName,
          grade: progress.grade || 1,
          gender: progress.profile?.gender || 'boy',
          region: progress.profile?.region || 'Toshkent shahri',
          district: progress.profile?.district || '',
          school: progress.profile?.school || `${progress.grade || 1}-sinf o‘quvchisi`,
          streaks: progress.streaks || 1,
          coins: progress.coins || 0,
          xp: progress.xp || 0,
          badge:
            (progress.streaks || 1) >= 30
              ? 'Afsonaviy Lider 👑'
              : (progress.streaks || 1) >= 15
              ? 'Oltin Chempion 🥇'
              : (progress.streaks || 1) >= 5
              ? 'Faol O‘quvchi ⚡'
              : 'Yosh Izlanuvchi 🌱',
          equippedOutfit: progress.equippedItems?.outfit,
        });
      } catch {
        // ignore
      }
    }
  }, [progress, isLoaded]);

  const setGrade = (grade: GradeLevel) => {
    setProgress((prev) => ({
      ...prev,
      grade,
      profile: prev.profile ? { ...prev.profile, grade } : undefined,
    }));
  };

  const setName = (name: string) => {
    setProgress((prev) => ({ ...prev, name }));
  };

  const toggleSound = () => {
    setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const addCoins = (amount: number) => {
    setProgress((prev) => {
      const nextCoins = prev.coins + amount;
      const nextXp = prev.xp + amount;
      return {
        ...prev,
        coins: nextCoins,
        xp: nextXp,
      };
    });
    if (progress.soundEnabled) {
      sound.playCoin();
    }
  };

  const checkAndCelebrateMilestone = (newStreaks: number, prevProgress: UserProgress): number[] => {
    const prevCelebrated = prevProgress.celebratedMilestones || [];
    const milestone = STREAK_PRIZES.find(
      (p) => newStreaks >= p.daysRequired && !prevCelebrated.includes(p.daysRequired)
    );
    if (milestone) {
      setCelebrationPrize(milestone);
      if (prevProgress.soundEnabled) {
        sound.playVictory();
      }
      const parentPhone =
        prevProgress.profile?.parentPhoneNumber ||
        prevProgress.profile?.phoneNumber ||
        '+998 (90) 123-45-67';
      const parentName = prevProgress.profile?.parentName || 'Ota-ona';
      const studentName = (
        prevProgress.profile?.firstName
          ? `${prevProgress.profile.firstName} ${prevProgress.profile.lastName}`
          : prevProgress.name || 'Yosh Lider'
      ).trim();

      smsService
        .sendStreakPrizeWonAlert({
          parentPhone,
          parentName,
          studentName,
          prizeName: milestone.name,
          periodLabel: milestone.periodLabel,
          streaks: newStreaks,
        })
        .then(() => {
          setSmsHistory(smsService.getHistory());
        });

      return [...prevCelebrated, milestone.daysRequired];
    }
    return prevCelebrated;
  };

  const addStreak = (amount: number = 1) => {
    setProgress((prev) => {
      const nextStreaks = prev.streaks + amount;
      const updatedCelebrated = checkAndCelebrateMilestone(nextStreaks, prev);
      return {
        ...prev,
        streaks: nextStreaks,
        celebratedMilestones: updatedCelebrated,
        xp: prev.xp + amount * 25,
      };
    });
    if (progress.soundEnabled) {
      sound.playFire();
    }
  };

  const setStreaksDirectly = (days: number) => {
    setProgress((prev) => {
      const nextStreaks = Math.max(0, days);
      const updatedCelebrated = checkAndCelebrateMilestone(nextStreaks, prev);
      return {
        ...prev,
        streaks: nextStreaks,
        celebratedMilestones: updatedCelebrated,
        xp: Math.max(prev.xp, nextStreaks * 20),
      };
    });
    if (progress.soundEnabled) {
      sound.playFire();
    }
  };

  const claimStreakPrize = (
    prizeId: StreakPrizeId,
    deliveryData: {
      studentName: string;
      parentPhone: string;
      deliveryRegion: string;
      deliveryAddress: string;
      sizeOrVariant?: string;
    }
  ): boolean => {
    const prize = STREAK_PRIZES.find((p) => p.id === prizeId);
    if (!prize) return false;
    if (progress.streaks < prize.daysRequired) return false;

    const trackingCode = `LK-${prize.daysRequired}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newClaim = {
      prizeId,
      prizeName: prize.name,
      periodLabel: prize.periodLabel,
      claimedAt: new Date().toISOString(),
      studentName: deliveryData.studentName,
      parentPhone: deliveryData.parentPhone,
      deliveryRegion: deliveryData.deliveryRegion,
      deliveryAddress: deliveryData.deliveryAddress,
      sizeOrVariant: deliveryData.sizeOrVariant,
      status: 'processing' as const,
      trackingCode,
    };

    setProgress((prev) => ({
      ...prev,
      streakClaims: {
        ...(prev.streakClaims || {}),
        [prizeId]: newClaim,
      },
    }));

    if (progress.soundEnabled) {
      sound.playVictory();
    }

    return true;
  };

  const markLessonCompleted = (lessonId: string): boolean => {
    if (progress.completedLessons.includes(lessonId)) {
      return false; // already completed
    }

    setProgress((prev) => {
      const nextStreaks = prev.streaks + 1;
      const updatedCelebrated = checkAndCelebrateMilestone(nextStreaks, prev);
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        streaks: nextStreaks,
        celebratedMilestones: updatedCelebrated,
        xp: prev.xp + 30,
      };
    });

    if (progress.soundEnabled) {
      sound.playFire();
    }
    syncResultToDb({
      subject: 'general',
      type: 'lesson',
      correct: 1,
      total: 1,
    });
    return true;
  };

  const currentWeekId = useMemo(() => getWeekId(), []);

  const isScheduledLessonCompleted = useCallback(
    (lessonId: string, weekId?: string): boolean => {
      const targetWeek = weekId || currentWeekId;
      const progressKey = `${targetWeek}_${lessonId}`;
      const item = progress.scheduledLessonsProgress?.[progressKey];
      return !!item?.isCompleted;
    },
    [currentWeekId, progress.scheduledLessonsProgress]
  );

  const markScheduledLessonCompleted = useCallback(
    (
      lessonId: string,
      dayKey: DayOfWeekKey,
      subjectId: SubjectId,
      targetWeekId?: string
    ): boolean => {
      const targetWeek = targetWeekId || currentWeekId;
      const progressKey = `${targetWeek}_${lessonId}`;

      if (progress.scheduledLessonsProgress?.[progressKey]?.isCompleted) {
        return false; // Allaqachon yakunlangan
      }

      setProgress((prev) => {
        const nextStreaks = prev.streaks + 1;
        const updatedCelebrated = checkAndCelebrateMilestone(nextStreaks, prev);
        const prevScheduled = prev.scheduledLessonsProgress || {};

        const updatedScheduled: Record<string, ScheduledLessonProgressItem> = {
          ...prevScheduled,
          [progressKey]: {
            lessonId,
            weekId: targetWeek,
            dayKey,
            subjectId,
            completedAt: new Date().toISOString(),
            isCompleted: true,
          },
        };

        const alreadyInGeneral = prev.completedLessons.includes(lessonId);
        const updatedCompleted = alreadyInGeneral
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId];

        return {
          ...prev,
          completedLessons: updatedCompleted,
          scheduledLessonsProgress: updatedScheduled,
          streaks: nextStreaks,
          celebratedMilestones: updatedCelebrated,
          coins: prev.coins + 20, // Har bir dars uchun +20 tanga
          xp: prev.xp + 40, // +40 XP
        };
      });

      if (progress.soundEnabled) {
        sound.playCorrect();
      }

      syncResultToDb({
        subject: subjectId,
        type: 'lesson',
        correct: 1,
        total: 1,
      });

      return true;
    },
    [currentWeekId, progress.scheduledLessonsProgress, progress.soundEnabled]
  );

  const saveWeeklyExamResult = useCallback((result: WeeklyExamResult) => {
    setProgress((prev) => {
      const prevExamHistory = prev.weeklyExamHistory || {};
      const updatedHistory = {
        ...prevExamHistory,
        [result.weekId]: result,
      };

      // Zaif mavzularni yangilash
      const prevWeak = [...(prev.weakTopics || [])];
      result.weakTopics.forEach((topicName) => {
        const existingIdx = prevWeak.findIndex(
          (w) => w.topic.toLowerCase() === topicName.toLowerCase() && w.grade === result.grade
        );

        if (existingIdx >= 0) {
          prevWeak[existingIdx] = {
            ...prevWeak[existingIdx],
            mistakeCount: prevWeak[existingIdx].mistakeCount + 1,
            lastTestedAt: result.completedAt,
          };
        } else {
          // Qaysi fan ekanligini aniqlaymiz (agar topilsa)
          let matchedSubj: SubjectId = 'math';
          if (topicName.toLowerCase().includes('english') || topicName.toLowerCase().includes('reading')) matchedSubj = 'english';
          else if (topicName.toLowerCase().includes('mantiq') || topicName.toLowerCase().includes('taroz')) matchedSubj = 'logic';
          else if (topicName.toLowerCase().includes('fazov') || topicName.toLowerCase().includes('kub')) matchedSubj = 'critical';

          prevWeak.push({
            topic: topicName,
            subjectId: matchedSubj,
            grade: result.grade,
            mistakeCount: 1,
            lastTestedAt: result.completedAt,
          });
        }
      });

      return {
        ...prev,
        weeklyExamHistory: updatedHistory,
        weakTopics: prevWeak,
        coins: prev.coins + result.rewardCoins,
        xp: prev.xp + result.rewardXp,
      };
    });

    if (progress.soundEnabled) {
      sound.playVictory();
    }
  }, [progress.soundEnabled]);

  const getWeeklyExamResult = useCallback(
    (weekId?: string): WeeklyExamResult | null => {
      const targetWeek = weekId || currentWeekId;
      return progress.weeklyExamHistory?.[targetWeek] || null;
    },
    [currentWeekId, progress.weeklyExamHistory]
  );

  const weakTopics = useMemo(() => progress.weakTopics || [], [progress.weakTopics]);

  const markQuizCompleted = (quizId: string) => {
    if (!progress.completedQuizzes.includes(quizId)) {
      setProgress((prev) => ({
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, quizId],
      }));
    }
  };

  const syncResultToDb = useCallback(
    async (params: {
      subject: string;
      type: 'quiz' | 'lesson' | 'puzzle';
      correct: number;
      total: number;
    }) => {
      const studentId = progress.profile?.id;
      if (!studentId) return;

      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            subject: params.subject,
            type: params.type,
            correct: params.correct,
            total: params.total,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.student) {
            setProgress((prev) => ({
              ...prev,
              coins: data.student.coins,
              xp: data.student.xp,
              streaks: data.student.streak,
            }));
          }
        }
      } catch (err) {
        console.warn('syncResultToDb error:', err);
      }
    },
    [progress.profile?.id]
  );

  const checkBotLinkStatus = useCallback(async () => {
    const studentId = progress.profile?.id;
    if (!studentId) return;
    try {
      const res = await fetch(`/api/auth/student?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.student) {
          setProgress((prev) => ({
            ...prev,
            coins: data.student.coins,
            xp: data.student.xp,
            streaks: data.student.streak,
            profile: prev.profile
              ? {
                  ...prev.profile,
                  isBotLinked: Boolean(data.student.isBotLinked),
                }
              : undefined,
          }));
        }
      }
    } catch {}
  }, [progress.profile?.id]);

  const refreshBotSyncCode = useCallback(async (): Promise<string> => {
    const studentId = progress.profile?.id;
    if (!studentId) return '';

    try {
      const res = await fetch('/api/link-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (data.code) {
        setProgress((prev) => {
          if (!prev.profile) return prev;
          const nextProf = {
            ...prev.profile,
            botSyncCode: data.code,
          };
          try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProf));
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, profile: nextProf }));
          } catch {}
          return {
            ...prev,
            profile: nextProf,
          };
        });
        return data.code;
      }
    } catch (e) {
      console.warn('refreshBotSyncCode error:', e);
    }
    return '';
  }, [progress.profile?.id]);

  const registerUser = async (profileData: Omit<UserProfile, 'isRegistered' | 'registeredAt' | 'academicYear' | 'academicYearEndDate'>) => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    const { academicYear, endDate } = getCurrentAcademicYear();

    try {
      const res = await fetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          grade: profileData.grade,
          region: profileData.region,
          school: profileData.school,
          parentName: profileData.parentName,
          parentPhone: profileData.parentPhoneNumber || profileData.phoneNumber,
        }),
      });

      let studentDbId = '';
      let initialCoins = 0;
      let initialXp = 0;
      let initialStreak = 0;

      if (res.ok) {
        const data = await res.json();
        if (data.student) {
          studentDbId = data.student.id;
          initialCoins = data.student.coins ?? 0;
          initialXp = data.student.xp ?? 0;
          initialStreak = data.student.streak ?? 0;
          localStorage.setItem('liderkids_student_id', studentDbId);
        }
      }

      const nextProfile: UserProfile = {
        ...profileData,
        id: studentDbId,
        academicYear,
        academicYearEndDate: endDate.toISOString(),
        isRegistered: true,
        registeredAt: new Date().toISOString(),
        isBotLinked: false,
      };

      const nextProgress: UserProgress = {
        ...progress,
        name: fullName,
        grade: profileData.grade,
        coins: initialCoins,
        xp: initialXp,
        streaks: initialStreak,
        profile: nextProfile,
      };

      setProgress(nextProgress);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
        localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
      } catch {}

      // Fetch first 15-minute link code for bot
      if (studentDbId) {
        fetch(`/api/link-code?studentId=${studentDbId}`)
          .then((r) => r.json())
          .then((cd) => {
            if (cd?.code) {
              setProgress((p) => (p.profile ? { ...p, profile: { ...p.profile, botSyncCode: cd.code } } : p));
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      console.warn('registerUser error:', err);
    }

    if (progress.soundEnabled) {
      sound.playVictory();
    }
  };

  const continueAsGuest = useCallback(() => {
    const { academicYear, endDate } = getCurrentAcademicYear();
    const guestProfile: UserProfile = {
      ...emptyProfile,
      firstName: 'Mehmon',
      lastName: 'o‘quvchi',
      isRegistered: false,
      isGuest: true,
      academicYear,
      academicYearEndDate: endDate.toISOString(),
      registeredAt: new Date().toISOString(),
    };

    const guestProgress: UserProgress = {
      ...progress,
      name: 'Mehmon o‘quvchi',
      profile: guestProfile,
    };

    setProgress(guestProgress);
    setIsRegistrationModalOpen(false);

    try {
      localStorage.setItem('liderkids_is_guest', 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestProgress));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(guestProfile));
    } catch (e) {
      console.warn('Failed to save guest state:', e);
    }

    if (progress.soundEnabled) {
      sound.playVictory();
    }
  }, [progress]);

  const loginUserByPhone = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanPhone = phone.trim();
      const res = await fetch(`/api/auth/student?phone=${encodeURIComponent(cleanPhone)}`);
      if (!res.ok) {
        return { success: false, error: 'Server xatoligi yuz berdi' };
      }
      const data = await res.json();
      if (!data.student) {
        return {
          success: false,
          error: 'Ushbu telefon raqamiga biriktirilgan o‘quvchi topilmadi. Iltimos, raqamni tekshiring yoki yangi o‘quvchi sifatida ro‘yxatdan o‘ting.',
        };
      }

      const s = data.student;
      const { academicYear, endDate } = getCurrentAcademicYear();
      const names = (s.name || '').trim().split(' ');
      const firstName = names[0] || 'O‘quvchi';
      const lastName = names.slice(1).join(' ') || '';

      const loadedProfile: UserProfile = {
        id: s.id,
        firstName,
        lastName,
        grade: (s.grade || 1) as GradeLevel,
        gender: 'boy',
        phoneNumber: s.parent_phone || cleanPhone,
        parentPhoneNumber: s.parent_phone || cleanPhone,
        parentName: s.parent_name || 'Ota-ona',
        region: s.region || 'Toshkent shahri',
        district: s.school || '',
        school: s.school || '',
        academicYear,
        academicYearEndDate: endDate.toISOString(),
        isRegistered: true,
        registeredAt: s.created_at || new Date().toISOString(),
        smsNotificationsEnabled: true,
        lastActiveDate: new Date().toISOString(),
        isBotLinked: s.isBotLinked || false,
      };

      const loadedProgress: UserProgress = {
        ...progress,
        name: s.name,
        grade: (s.grade || 1) as GradeLevel,
        coins: s.coins ?? 0,
        xp: s.xp ?? 0,
        streaks: s.streak ?? 0,
        profile: loadedProfile,
      };

      setProgress(loadedProgress);
      setIsRegistrationModalOpen(false);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedProgress));
        localStorage.setItem(PROFILE_KEY, JSON.stringify(loadedProfile));
        localStorage.setItem('liderkids_student_id', s.id);
      } catch {}

      if (progress.soundEnabled) {
        sound.playVictory();
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Tarmoq xatoligi yuz berdi' };
    }
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    setProgress((prev) => {
      if (!prev.profile) return prev;
      const updatedProfile = { ...prev.profile, ...profileData, isRegistered: true };
      const fullName = `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim();
      const nextProgress: UserProgress = {
        ...prev,
        name: fullName || prev.name,
        grade: updatedProfile.grade || prev.grade,
        profile: updatedProfile,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
        localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProgress.profile));
      } catch {}

      return nextProgress;
    });
  };

  const advanceAcademicYearManually = () => {
    setProgress((prev) => {
      if (prev.grade >= 4) return prev;
      const fromGrade = prev.grade;
      const toGrade = getNextGrade(fromGrade);
      const nextYearInfo = getCurrentAcademicYear();
      return {
        ...prev,
        grade: toGrade,
        coins: prev.coins + 50,
        xp: prev.xp + 50,
        profile: prev.profile
          ? {
              ...prev.profile,
              grade: toGrade,
              academicYear: nextYearInfo.academicYear,
              academicYearEndDate: nextYearInfo.endDate.toISOString(),
            }
          : undefined,
        academicYearPromotionNotice: {
          fromGrade,
          toGrade,
          year: nextYearInfo.academicYear,
        },
      };
    });
    if (progress.soundEnabled) {
      sound.playVictory();
    }
  };

  const clearPromotionNotice = () => {
    setProgress((prev) => ({
      ...prev,
      academicYearPromotionNotice: null,
    }));
  };

  const buyMarketItem = (item: MarketItem): boolean => {
    if (progress.coins < item.price) return false;
    if (progress.inventory?.includes(item.id)) return false;

    setProgress((prev) => {
      const nextCoins = prev.coins - item.price;
      const inventory = [...(prev.inventory || []), item.id];
      const equippedItems = {
        ...(prev.equippedItems || {}),
        [item.category]: item.id,
      };
      return {
        ...prev,
        coins: nextCoins,
        inventory,
        equippedItems,
      };
    });

    if (progress.soundEnabled) {
      sound.playCoin();
    }
    return true;
  };

  const equipMarketItem = (category: MarketCategory, itemId: string) => {
    setProgress((prev) => ({
      ...prev,
      equippedItems: {
        ...(prev.equippedItems || {}),
        [category]: itemId,
      },
    }));
    if (progress.soundEnabled) {
      sound.playFire();
    }
  };

  const unequipMarketItem = (category: MarketCategory) => {
    setProgress((prev) => {
      const updated = { ...(prev.equippedItems || {}) };
      delete updated[category];
      return {
        ...prev,
        equippedItems: updated,
      };
    });
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateLastActiveDate = useCallback(() => {
    setProgress((prev) => {
      if (!prev.profile) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          lastActiveDate: new Date().toISOString(),
        },
      };
    });
  }, []);

  const sendInactivitySmsAlert = async (forceDemo: boolean = false) => {
    const parentPhone = progress.profile?.parentPhoneNumber || progress.profile?.phoneNumber || '+998 (90) 123-45-67';
    const parentName = progress.profile?.parentName || 'Ota-ona';
    const studentName = progress.name || `${progress.profile?.firstName || 'Yosh'} ${progress.profile?.lastName || 'Lider'}`.trim();
    const streaks = progress.streaks || 1;
    const todayStr = new Date().toISOString().slice(0, 10);

    await smsService.sendInactivityAlert({
      parentPhone,
      parentName,
      studentName,
      streaks,
      daysInactive: 1,
    });

    // Native / Web push eslatmasi
    await notifications.showNotification({
      title: '📱 Ota-onaga SMS xabarnoma yuborildi!',
      body: `${parentName}ga farzandining 1 kun dars qoldirgani haqida ogohlantirish SMS yuborildi.`,
      streaks,
      url: '/lessons',
    });

    setProgress((prev) => {
      if (!prev.profile) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          lastInactivitySmsSentDate: todayStr,
        },
      };
    });
    refreshSmsHistory();
  };

  const sendQuizReportSms = async ({
    score,
    totalQuestions,
    earnedCoins,
    subjectTitle,
  }: {
    score: number;
    totalQuestions: number;
    earnedCoins: number;
    subjectTitle?: string;
  }): Promise<SmsMessage | null> => {
    if (progress.profile?.smsNotificationsEnabled === false) return null;

    const parentPhone = progress.profile?.parentPhoneNumber || progress.profile?.phoneNumber || '+998 (90) 123-45-67';
    const parentName = progress.profile?.parentName || 'Ota-ona';
    const studentName = progress.name || `${progress.profile?.firstName || 'Yosh'} ${progress.profile?.lastName || 'Lider'}`.trim();
    const currentLionStage = LION_STAGES[progress.grade] || LION_STAGES[1];

    const sms = await smsService.sendQuizProgressReport({
      parentPhone,
      parentName,
      studentName,
      score,
      totalQuestions,
      earnedCoins,
      grade: progress.grade,
      lionStageTitle: currentLionStage.title,
      streaks: progress.streaks,
      subjectTitle,
    });

    refreshSmsHistory();
    return sms;
  };

  const getDailyPuzzleRecord = useCallback((dateStr?: string): DailyPuzzleRecord | null => {
    const targetDate = dateStr || getTodayDateString();
    return progress.dailyPuzzleHistory?.[targetDate] || null;
  }, [progress.dailyPuzzleHistory]);

  const isTodayPuzzleSolved = Boolean(
    progress.dailyPuzzleHistory?.[getTodayDateString()]?.solved
  );

  const dailyPuzzleStreak = progress.dailyPuzzleStreak || 0;

  const submitDailyPuzzle = useCallback((params: {
    puzzleId: string;
    optionIndex: number;
    isCorrect: boolean;
    rewardCoins: number;
    rewardXp: number;
    usedHint: boolean;
  }): boolean => {
    const todayStr = getTodayDateString();
    const existing = progress.dailyPuzzleHistory?.[todayStr];
    if (existing?.solved) {
      return false;
    }

    const nextRecord: DailyPuzzleRecord = {
      date: todayStr,
      puzzleId: params.puzzleId,
      grade: progress.grade,
      solved: params.isCorrect,
      selectedOptionIndex: params.optionIndex,
      attempts: (existing?.attempts || 0) + 1,
      usedHint: params.usedHint,
      solvedAt: new Date().toISOString(),
      rewardCoins: params.isCorrect ? params.rewardCoins : 0,
      rewardXp: params.isCorrect ? params.rewardXp : 0,
    };

    setProgress((prev) => {
      const nextHistory = {
        ...(prev.dailyPuzzleHistory || {}),
        [todayStr]: nextRecord,
      };

      if (!params.isCorrect) {
        return {
          ...prev,
          dailyPuzzleHistory: nextHistory,
        };
      }

      const nextStreak = (prev.dailyPuzzleStreak || 0) + 1;
      const nextCoins = prev.coins + params.rewardCoins;
      const nextXp = prev.xp + params.rewardXp;
      const nextStreaks = prev.streaks + 1;
      const updatedCelebrated = checkAndCelebrateMilestone(nextStreaks, prev);

      return {
        ...prev,
        coins: nextCoins,
        xp: nextXp,
        streaks: nextStreaks,
        dailyPuzzleStreak: nextStreak,
        celebratedMilestones: updatedCelebrated,
        dailyPuzzleHistory: nextHistory,
      };
    });

    if (params.isCorrect) {
      if (progress.soundEnabled) {
        sound.playVictory();
      }
    } else {
      if (progress.soundEnabled) {
        sound.playIncorrect();
      }
    }

    syncResultToDb({
      subject: 'puzzle',
      type: 'puzzle',
      correct: params.isCorrect ? 1 : 0,
      total: 1,
    });

    return params.isCorrect;
  }, [progress.dailyPuzzleHistory, progress.grade, progress.soundEnabled, checkAndCelebrateMilestone, syncResultToDb]);

  const lionStage = LION_STAGES[progress.grade] || LION_STAGES[1];

  const handleSetIsRegistrationModalOpen = useCallback((open: boolean) => {
    // Only block closing if the user has neither completed registration nor chosen guest mode
    if (!open && !progress.profile?.isRegistered && !progress.profile?.isGuest) {
      return;
    }
    setIsRegistrationModalOpen(open);
  }, [progress.profile?.isRegistered, progress.profile?.isGuest]);

  return (
    <GameContext.Provider
      value={{
        progress,
        lionStage,
        isLoaded,
        isRegistrationModalOpen: isLoaded ? ((!progress.profile?.isRegistered && !progress.profile?.isGuest) || isRegistrationModalOpen) : false,
        setIsRegistrationModalOpen: handleSetIsRegistrationModalOpen,
        continueAsGuest,
        loginUserByPhone,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSmsModalOpen,
        setIsSmsModalOpen,
        smsHistory,
        refreshSmsHistory,
        sendInactivitySmsAlert,
        sendQuizReportSms,
        setGrade,
        setName,
        addCoins,
        addStreak,
        setStreaksDirectly,
        claimStreakPrize,
        celebrationPrize,
        setCelebrationPrize,
        isStreakClaimModalOpen,
        setIsStreakClaimModalOpen,
        selectedPrizeToClaim,
        setSelectedPrizeToClaim,
        openClaimModalForPrize,
        markLessonCompleted,
        markQuizCompleted,
        toggleSound,
        registerUser,
        updateProfile,
        advanceAcademicYearManually,
        clearPromotionNotice,
        buyMarketItem,
        equipMarketItem,
        unequipMarketItem,
        resetProgress,
        updateLastActiveDate,
        dailyGamesCount,
        remainingGamesToday,
        canPlayGame,
        maxDailyGames: MAX_DAILY_GAMES,
        maxPlaysPerGame: MAX_PLAYS_PER_GAME,
        recordGamePlay,
        isGameLocked,
        getGamePlayCount,
        getDailyPuzzleRecord,
        submitDailyPuzzle,
        dailyPuzzleStreak,
        isTodayPuzzleSolved,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        aiAssistantContext,
        openAiAssistant,
        closeAiAssistant,
        // Haftalik dars va imtihon
        currentWeekId,
        markScheduledLessonCompleted,
        isScheduledLessonCompleted,
        saveWeeklyExamResult,
        getWeeklyExamResult,
        weakTopics,
        refreshBotSyncCode,
        checkBotLinkStatus,
        syncResultToDb,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
