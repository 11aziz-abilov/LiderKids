'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import FullBodyLionCharacter, { LionAction } from './FullBodyLionCharacter';
import { sound } from '@/utils/sound';
import { 
  X, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Bell, 
  Volume2, 
  VolumeX,
  BookOpen,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface ReminderPreset {
  id: string;
  action: LionAction;
  streakText: string;
  title: string;
  titleUz: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  accentBg: string;
}

export default function MascotReminderWidget() {
  const { progress } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserNotificationAllowed, setBrowserNotificationAllowed] = useState(false);

  const isGirl = progress.profile?.gender === 'girl';
  const streaksCount = Math.max(1, progress.streaks || 1);

  // Reminder variations featuring the Lion in different poses/roles
  const reminders: ReminderPreset[] = [
    {
      id: 'flex-workout',
      action: 'flex',
      streakText: `${streaksCount}`,
      title: 'Start a lesson!',
      titleUz: 'Darsni boshla!',
      subtitle: isGirl
        ? 'Shercha qizcha mashg‘ulotga shay! Bugungi bilimingni ko‘rsat va olovchangni oshir! 💪🌸'
        : 'Shercha muskullarini chiniqtirmoqda! Bugungi 1 ta darsni tugatib, kuchingni ko‘rsat! 💪🔥',
      buttonText: 'Darsni boshlash 🚀',
      buttonHref: '/lessons',
      accentBg: 'from-[#0094F7] via-[#0074E8] to-[#004EB8]',
    },
    {
      id: 'roar-fire',
      action: 'roar',
      streakText: `${streaksCount}`,
      title: 'Keep the fire alive!',
      titleUz: 'Olovchang o‘chmasin!',
      subtitle: 'Har kuni uzluksiz o‘qisang, Prezident maktabiga kirish imkoniyating 10 barobar oshadi! 🔥🦁',
      buttonText: 'Test yechish 📝',
      buttonHref: '/quiz',
      accentBg: 'from-[#0284C7] via-[#0369A1] to-[#075985]',
    },
    {
      id: 'study-genius',
      action: 'study',
      streakText: `${streaksCount}`,
      title: '10 min daily challenge!',
      titleUz: 'Bugungi 10 daqiqa!',
      subtitle: 'Bilimdon shercha kitobni ochdi. Matematika va mantiqdan 5 ta savol yechib, 100 tanga ol! 📚✨',
      buttonText: 'Masala yechish 🧠',
      buttonHref: '/lessons',
      accentBg: 'from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A]',
    },
    {
      id: 'wave-friend',
      action: 'wave',
      streakText: `${streaksCount}`,
      title: 'Hey there, Leader!',
      titleUz: 'Salom, Lider!',
      subtitle: isGirl
        ? 'Seni sog‘indim! Keling, birgalikda a‘lo baholar olib yangi ko‘ylakchalar sotib olamiz! 🎀👋'
        : 'Seni kutayotgan edim! Yangi g‘alabalar va sovg‘alar seni kutmoqda, olg‘a! 👋⭐',
      buttonText: 'O‘rganishga o‘tish 🌟',
      buttonHref: '/lessons',
      accentBg: 'from-[#0284C7] via-[#2563EB] to-[#4338CA]',
    },
    {
      id: 'jump-champion',
      action: 'jump',
      streakText: `${streaksCount}`,
      title: 'Climb the ranking!',
      titleUz: 'Reytingda 1-o‘rin!',
      subtitle: `${progress.grade}-sinf o‘quvchilari orasida yetakchilikni qo‘lga kirit! Har bir test — yangi ball! 🏆`,
      buttonText: 'Reytingni ko‘rish 🏆',
      buttonHref: '/leaderboard',
      accentBg: 'from-[#0369A1] via-[#0284C7] to-[#1D4ED8]',
    },
  ];

  const currentReminder = reminders[currentIndex];

  // Auto-open reminder card on initial visit after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      if (soundEnabled) {
        sound.playNotification();
      }
    }, 2500);

    // Check existing notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setBrowserNotificationAllowed(true);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // Periodic reminder toggle / attention grabber every 75 seconds if minimized
  useEffect(() => {
    const interval = setInterval(() => {
      // Switch to next pose randomly or sequentially
      setCurrentIndex((prev) => (prev + 1) % reminders.length);
    }, 18000);

    return () => clearInterval(interval);
  }, [reminders.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reminders.length);
    if (soundEnabled) sound.playFire();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reminders.length) % reminders.length);
    if (soundEnabled) sound.playFire();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
    if (soundEnabled) sound.playNotification();
  };

  const handleClose = () => {
    setIsOpen(false);
    setHasInteracted(true);
  };

  // Request browser native notification
  const requestBrowserNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert("Brauzeringizda bildirishnomalar qo‘llab-quvvatlanmaydi.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserNotificationAllowed(true);
        new Notification("🦁 LiderKids Eslatmasi", {
          body: `🔥 Olovchang ${streaksCount} ta! Bugungi darsni yechishni unutmang!`,
          icon: '/favicon.ico',
        });
      }
    } catch {
      // Ignored
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. FLOATING MINIMIZED PILL (ALWAYS AVAILABLE IN CORNER)   */}
      {/* ======================================================== */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleOpen}
            className="relative flex items-center gap-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white pl-2 pr-4 py-2 rounded-full shadow-2xl border-2 border-white/50 backdrop-blur-md cursor-pointer hover:shadow-sky-500/50 transition-shadow"
            title="Shercha eslatmasini ochish"
          >
            {/* Animated Mascot Head Thumbnail */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center overflow-hidden border-2 border-white shadow-inner">
              <div className="w-14 h-14 -mt-1 scale-110 flex items-center justify-center">
                <FullBodyLionCharacter
                  grade={progress.grade}
                  gender={progress.profile?.gender || 'boy'}
                  equipped={progress.equippedItems}
                  action={currentReminder.action}
                  size="sm"
                />
              </div>
            </div>

            {/* Streak flame & Callout */}
            <div className="flex flex-col items-start leading-tight">
              <div className="flex items-center gap-1 font-black text-sm text-amber-300 drop-shadow">
                <span className="text-base animate-pulse">🔥</span>
                <span>{streaksCount}</span>
                <span className="text-xs text-white/90 font-medium ml-1">seriya</span>
              </div>
              <span className="text-[11px] font-bold text-white/95">
                Darsni boshla! 💪
              </span>
            </div>

            {/* Pulsing Attention Ping */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white"></span>
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* 2. FULL EXPANDED DUOLINGO-STYLE NOTIFICATION WIDGET       */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.88 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[340px]"
          >
            {/* DUOLINGO WIDGET CONTAINER */}
            <div
              className={`relative rounded-[2rem] bg-gradient-to-b ${currentReminder.accentBg} p-5 text-white shadow-2xl border-4 border-white/30 backdrop-blur-md overflow-hidden select-none transition-colors duration-500`}
              style={{
                boxShadow: '0 20px 45px -10px rgba(0, 102, 255, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
              }}
            >
              {/* Background ambient radial glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />

              {/* Top Controls Bar */}
              <div className="relative z-10 flex items-center justify-between mb-2">
                {/* Pose switch dots & navigation */}
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                  <button
                    onClick={handlePrev}
                    aria-label="Oldingi ko‘rinish"
                    className="hover:text-amber-300 transition-colors p-0.5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 px-1">
                    {reminders.map((r, i) => (
                      <span
                        key={r.id}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    aria-label="Keyingi ko‘rinish"
                    className="hover:text-amber-300 transition-colors p-0.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sound & Close Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    aria-label="Ovozni yoqish/o‘chirish"
                    className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white"
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    aria-label="Yopish"
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors text-white font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DUOLINGO TOP TITLE: FIRE STREAK & CALLOUT (IDENTICAL TO SCREENSHOT) */}
              <div className="relative z-10 flex flex-col items-center justify-center pt-1 pb-2 text-center">
                {/* Large Flame Streak Header: 🔥 1 */}
                <motion.div
                  key={`streak-${currentReminder.streakText}`}
                  initial={{ scale: 0.8, y: -6 }}
                  animate={{ scale: 1, y: 0 }}
                  className="flex items-center gap-2 text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] tracking-tight"
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow">🔥</span>
                  <span>{currentReminder.streakText}</span>
                </motion.div>

                {/* Subtitle text: "Start a lesson!" / "Darsni boshla!" */}
                <motion.p
                  key={`title-${currentReminder.title}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base sm:text-lg font-bold text-white/95 mt-0.5 drop-shadow-sm tracking-wide"
                >
                  {currentReminder.title}
                </motion.p>
                <span className="text-xs font-semibold text-amber-200/95 -mt-0.5">
                  ({currentReminder.titleUz})
                </span>
              </div>

              {/* CENTER: MASCOT IN ACTION (FLEXING, WAVING, ROARING, ETC.) */}
              <div 
                onClick={handleNext}
                className="relative z-10 my-2 flex items-center justify-center cursor-pointer group"
                title="Boshqa harakatga almashtirish uchun bosing"
              >
                <div className="relative w-48 h-52 sm:w-52 sm:h-56 flex items-center justify-center">
                  {/* Subtle ground shadow */}
                  <div className="absolute bottom-3 w-36 h-6 bg-black/25 rounded-full blur-md" />

                  {/* Character */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReminder.action}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <FullBodyLionCharacter
                        grade={progress.grade}
                        gender={progress.profile?.gender || 'boy'}
                        equipped={progress.equippedItems}
                        action={currentReminder.action}
                        size="md"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* MASCOT SPEECH BUBBLE / MOTIVATION TEXT */}
              <div className="relative z-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 text-center mb-3.5 shadow-inner">
                <p className="text-xs sm:text-[13px] font-semibold text-white/95 leading-snug">
                  {currentReminder.subtitle}
                </p>
              </div>

              {/* ACTION BUTTON (START LESSON / QUIZ) */}
              <div className="relative z-10 flex flex-col gap-2">
                <Link
                  href={currentReminder.buttonHref}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-amber-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>{currentReminder.buttonText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                {/* Sub-actions footer: Browser notifications & minimization */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-white/80 pt-1 px-1">
                  {!browserNotificationAllowed ? (
                    <button
                      onClick={requestBrowserNotification}
                      className="hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                      <Bell className="w-3 h-3" />
                      <span>Eslatmalarni yoqish</span>
                    </button>
                  ) : (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <span>✓</span> Eslatmalar faol
                    </span>
                  )}

                  <button
                    onClick={handleClose}
                    className="hover:text-white transition-colors underline decoration-white/40"
                  >
                    Keyinroq
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
