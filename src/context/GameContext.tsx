'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GradeLevel, UserProgress, UserProfile } from '@/types';
import { sound } from '@/utils/sound';

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
  setGrade: (grade: GradeLevel) => void;
  setName: (name: string) => void;
  addCoins: (amount: number) => void;
  addStreak: (amount: number) => void;
  markLessonCompleted: (lessonId: string) => boolean;
  markQuizCompleted: (quizId: string) => void;
  toggleSound: () => void;
  registerUser: (profileData: Omit<UserProfile, 'isRegistered' | 'registeredAt'>) => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'liderkids_progress_v1';

const defaultProgress: UserProgress = {
  name: 'Yosh Lider',
  grade: 1,
  coins: 50, // boshlang'ich bonus qiziqtirish uchun
  streaks: 2,
  xp: 70,
  completedLessons: [],
  completedQuizzes: [],
  soundEnabled: true,
  unlockedAchievements: ['first-step'],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress((prev) => ({ ...prev, ...parsed }));
        if (!parsed.profile?.isRegistered) {
          setIsRegistrationModalOpen(true);
        }
      } else {
        setIsRegistrationModalOpen(true);
      }
    } catch {
      setIsRegistrationModalOpen(true);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

  const registerUser = (profileData: Omit<UserProfile, 'isRegistered' | 'registeredAt'>) => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    setProgress((prev) => {
      const isFirstReg = !prev.profile?.isRegistered;
      return {
        ...prev,
        name: fullName,
        grade: profileData.grade,
        coins: isFirstReg ? prev.coins + 100 : prev.coins,
        xp: isFirstReg ? prev.xp + 50 : prev.xp,
        profile: {
          ...profileData,
          isRegistered: true,
          registeredAt: prev.profile?.registeredAt || new Date().toISOString(),
        },
      };
    });
    if (progress.soundEnabled) {
      sound.playVictory();
    }
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    setProgress((prev) => {
      if (!prev.profile) return prev;
      const updatedProfile = { ...prev.profile, ...profileData };
      const fullName = `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim();
      return {
        ...prev,
        name: fullName || prev.name,
        grade: updatedProfile.grade || prev.grade,
        profile: updatedProfile,
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
        setGrade,
        setName,
        addCoins,
        addStreak,
        markLessonCompleted,
        markQuizCompleted,
        toggleSound,
        registerUser,
        updateProfile,
        resetProgress,
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
