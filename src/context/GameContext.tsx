'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GradeLevel, UserProgress, UserProfile, MarketItem, MarketCategory, SmsMessage } from '@/types';
import { sound } from '@/utils/sound';
import { smsService } from '@/utils/smsService';
import { notifications } from '@/utils/notifications';

import { getCurrentAcademicYear, getNextGrade } from '@/utils/academicYear';
import { saveStoredLearner } from '@/data/leaderboardData';

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
  markLessonCompleted: (lessonId: string) => boolean;
  markQuizCompleted: (quizId: string) => void;
  toggleSound: () => void;
  registerUser: (profileData: Omit<UserProfile, 'isRegistered' | 'registeredAt' | 'academicYear' | 'academicYearEndDate'>) => void;
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
}

export const MAX_PLAYS_PER_GAME = 1;
export const TOTAL_MINI_GAMES = 3;
export const MAX_DAILY_GAMES = 3;

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const STORAGE_KEY = 'liderkids_progress_v1';
const PROFILE_KEY = 'liderkids_user_profile_v1';

const defaultProfile: UserProfile = {
  firstName: 'Yosh',
  lastName: 'Lider',
  gender: 'boy',
  grade: 1,
  phoneNumber: '+998 (90) 123-45-67',
  parentPhoneNumber: '+998 (90) 123-45-67',
  parentName: 'Ota-ona',
  region: 'Toshkent shahri',
  district: 'Yunusobod tumani',
  school: '1-maktab',
  cardNumber: '8600 0000 0000 0000',
  cardExpiry: '12/28',
  cardHolder: 'YOSH LIDER',
  academicYear: '2026-2027',
  academicYearEndDate: new Date(2027, 4, 25, 23, 59, 59).toISOString(),
  isRegistered: true,
  registeredAt: new Date().toISOString(),
  smsNotificationsEnabled: true,
  lastActiveDate: new Date().toISOString(),
};

const defaultProgress: UserProgress = {
  name: 'Yosh Lider',
  grade: 1,
  coins: 500, // boshlang'ich bonus market uchun
  streaks: 2,
  xp: 70,
  completedLessons: [],
  completedQuizzes: [],
  soundEnabled: true,
  unlockedAchievements: ['first-step'],
  inventory: ['backpack_red'],
  equippedItems: { backpack: 'backpack_red' },
  profile: defaultProfile,
  dailyGames: {
    date: getTodayDateString(),
    count: 0,
    gameCounts: {},
  },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsHistory, setSmsHistory] = useState<SmsMessage[]>([]);

  const todayStr = getTodayDateString();
  const isDateToday = progress.dailyGames?.date === todayStr;
  const gameCounts = isDateToday ? (progress.dailyGames?.gameCounts || {}) : {};

  const getGamePlayCount = useCallback((gameId: string): number => {
    return gameCounts[gameId] || 0;
  }, [gameCounts]);

  const isGameLocked = useCallback((gameId: string): boolean => {
    return (gameCounts[gameId] || 0) >= MAX_PLAYS_PER_GAME;
  }, [gameCounts]);

  // Jami 3 ta mini-o‘yindan nechtasi 1 martalik limitiga yetgan
  const allGameIds = ['memory', 'puzzle', 'stars'];
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

  // Load from localStorage on client mount: foydalanuvchi to'g'ridan-to'g'ri o'z profiliga kiradi!
  useEffect(() => {
    try {
      setSmsHistory(smsService.getHistory());

      const saved = localStorage.getItem(STORAGE_KEY);
      let parsedProgress: any = null;

      if (saved) {
        parsedProgress = JSON.parse(saved);
      } else {
        // Fallback profile key tekshirish
        const savedProfile = localStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
          const parsedProf = JSON.parse(savedProfile);
          parsedProgress = {
            ...defaultProgress,
            profile: parsedProf,
            name: `${parsedProf.firstName} ${parsedProf.lastName}`.trim(),
            grade: parsedProf.grade || 1,
          };
        }
      }

      if (parsedProgress) {
        if (!parsedProgress.profile) {
          parsedProgress.profile = defaultProfile;
        } else {
          parsedProgress.profile.isRegistered = true;
          if (!parsedProgress.profile.parentPhoneNumber) {
            parsedProgress.profile.parentPhoneNumber = parsedProgress.profile.phoneNumber || '+998 (90) 123-45-67';
          }
          if (parsedProgress.profile.smsNotificationsEnabled === undefined) {
            parsedProgress.profile.smsNotificationsEnabled = true;
          }
          if (!parsedProgress.profile.academicYear || parsedProgress.profile.academicYear === '2025-2026') {
            const currentYearInfo = getCurrentAcademicYear();
            parsedProgress.profile.academicYear = currentYearInfo.academicYear;
            parsedProgress.profile.academicYearEndDate = currentYearInfo.endDate.toISOString();
          }
        }

        // --- 1 KUN KIRMASH (INACTIVITY) NAZORATI VA SMS YUBORISH ---
        const lastActive = parsedProgress.profile?.lastActiveDate;
        const now = Date.now();
        const todayStr = new Date().toISOString().slice(0, 10);

        if (lastActive) {
          const lastActiveTime = new Date(lastActive).getTime();
          const diffHours = (now - lastActiveTime) / (1000 * 60 * 60);
          const lastSmsSentDate = parsedProgress.profile?.lastInactivitySmsSentDate;

          // Agar oxirgi kirishdan beri 24 soat (1 kun) o'tgan bo'lsa va bugun SMS jo'natilmagan bo'lsa:
          if (diffHours >= 24 && lastSmsSentDate !== todayStr && parsedProgress.profile?.smsNotificationsEnabled !== false) {
            const parentPhone = parsedProgress.profile?.parentPhoneNumber || parsedProgress.profile?.phoneNumber || '+998 (90) 123-45-67';
            const parentName = parsedProgress.profile?.parentName || 'Ota-ona';
            const studentName = parsedProgress.name || `${parsedProgress.profile?.firstName || 'Yosh'} ${parsedProgress.profile?.lastName || 'Lider'}`.trim();
            const daysInactive = Math.max(1, Math.floor(diffHours / 24));

            smsService.sendInactivityAlert({
              parentPhone,
              parentName,
              studentName,
              streaks: parsedProgress.streaks || 1,
              daysInactive,
            }).then(() => {
              setSmsHistory(smsService.getHistory());
            });

            parsedProgress.profile.lastInactivitySmsSentDate = todayStr;
          }
        }

        // Oxirgi faollik vaqtini hozirga yangilash
        if (parsedProgress.profile) {
          parsedProgress.profile.lastActiveDate = new Date().toISOString();
        }

        if (parsedProgress.profile?.academicYearEndDate) {
          const endDate = new Date(parsedProgress.profile.academicYearEndDate);
          const nowDate = new Date();
          if (nowDate > endDate && parsedProgress.grade < 4) {
            const nextYearInfo = getCurrentAcademicYear(nowDate);
            const fromGrade = parsedProgress.grade;
            const toGrade = getNextGrade(fromGrade);
            parsedProgress.grade = toGrade;
            parsedProgress.profile.grade = toGrade;
            parsedProgress.profile.academicYear = nextYearInfo.academicYear;
            parsedProgress.profile.academicYearEndDate = nextYearInfo.endDate.toISOString();
            parsedProgress.academicYearPromotionNotice = {
              fromGrade,
              toGrade,
              year: nextYearInfo.academicYear,
            };
          }
        }
        setProgress((prev) => ({ ...prev, ...parsedProgress }));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        if (progress.profile?.isRegistered) {
          saveStoredLearner({
            id: progress.profile.phoneNumber || progress.name,
            name: `${progress.profile.firstName} ${progress.profile.lastName}`.trim(),
            grade: progress.grade,
            gender: progress.profile.gender || 'boy',
            region: progress.profile.region || 'Toshkent shahri',
            district: progress.profile.district || '',
            school: progress.profile.school || '',
            streaks: progress.streaks,
            coins: progress.coins,
            xp: progress.xp,
            badge:
              progress.streaks >= 30
                ? 'Afsonaviy Lider 👑'
                : progress.streaks >= 15
                ? 'Oltin Chempion 🥇'
                : progress.streaks >= 5
                ? 'Faol O‘quvchi ⚡'
                : 'Yosh Izlanuvchi 🌱',
            equippedOutfit: progress.equippedItems?.outfit,
          });
        }
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

  const addStreak = (amount: number = 1) => {
    setProgress((prev) => ({
      ...prev,
      streaks: prev.streaks + amount,
      xp: prev.xp + amount * 25,
    }));
    if (progress.soundEnabled) {
      sound.playFire();
    }
  };

  const markLessonCompleted = (lessonId: string): boolean => {
    if (progress.completedLessons.includes(lessonId)) {
      return false; // already completed
    }

    setProgress((prev) => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      streaks: prev.streaks + 1,
      xp: prev.xp + 30,
    }));

    if (progress.soundEnabled) {
      sound.playFire();
    }
    return true;
  };

  const markQuizCompleted = (quizId: string) => {
    if (!progress.completedQuizzes.includes(quizId)) {
      setProgress((prev) => ({
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, quizId],
      }));
    }
  };

  const registerUser = (profileData: Omit<UserProfile, 'isRegistered' | 'registeredAt' | 'academicYear' | 'academicYearEndDate'>) => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    const { academicYear, endDate } = getCurrentAcademicYear();
    setProgress((prev) => {
      const isFirstReg = !prev.profile?.isRegistered;
      const nextProgress: UserProgress = {
        ...prev,
        name: fullName,
        grade: profileData.grade,
        coins: isFirstReg ? prev.coins + 500 : prev.coins,
        xp: isFirstReg ? prev.xp + 50 : prev.xp,
        profile: {
          ...profileData,
          academicYear,
          academicYearEndDate: endDate.toISOString(),
          isRegistered: true,
          registeredAt: prev.profile?.registeredAt || new Date().toISOString(),
        },
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
        localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProgress.profile));
      } catch {}

      return nextProgress;
    });

    setIsRegistrationModalOpen(false);

    if (progress.soundEnabled) {
      sound.playVictory();
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

  const lionStage = LION_STAGES[progress.grade] || LION_STAGES[1];

  return (
    <GameContext.Provider
      value={{
        progress,
        lionStage,
        isLoaded,
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
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
