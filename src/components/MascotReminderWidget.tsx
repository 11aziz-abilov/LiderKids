'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import FullBodyLionCharacter, { LionAction } from './FullBodyLionCharacter';
import { sound } from '@/utils/sound';
import { notifications } from '@/utils/notifications';
import { 
  X, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Bell, 
  BellRing,
  Volume2, 
  VolumeX,
  ExternalLink,
  Smartphone,
  Download,
  Pin
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
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [pipActive, setPipActive] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

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
    {
      id: 'parent-sms-notice',
      action: 'study',
      streakText: `${streaksCount}`,
      title: 'Parent SMS Alerts',
      titleUz: '1 kun kirmasa SMS!',
      subtitle: 'Agar 1 kun ilovaga kirmasang, ota-onangga ogohlantirish SMS yuboriladi! Har kuni 1 ta test ishlab bilimingni oshir! 📱🦁',
      buttonText: 'Test ishlash 🎯',
      buttonHref: '/quiz',
      accentBg: 'from-[#1D4ED8] via-[#2563EB] to-[#0284C7]',
    },
  ];

  const currentReminder = reminders[currentIndex];

  // Initialize service worker, permissions, and exit event listeners
  useEffect(() => {
    notifications.init();

    // Check permission
    notifications.hasPermission().then((granted) => {
      setNotificationAllowed(granted);
    });

    // Capture PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Initial popup on page load
    const timer = setTimeout(() => {
      setIsOpen(true);
      if (soundEnabled) {
        sound.playNotification();
      }
    }, 2500);

    // AUTO EXIT REMINDER: When user switches tabs, minimizes or leaves the app!
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        notifications.scheduleExitReminder(streaksCount, isGirl);
      }
    };

    const handlePageHide = () => {
      notifications.scheduleExitReminder(streaksCount, isGirl);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
    };
  }, [streaksCount, isGirl, soundEnabled]);

  // Periodic reminder toggle / attention grabber every 18 seconds
  useEffect(() => {
    const interval = setInterval(() => {
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

  // Request notifications permission (both Web & Capacitor Android)
  const enableNotifications = async () => {
    const granted = await notifications.requestPermission();
    setNotificationAllowed(granted);
    if (granted) {
      if (soundEnabled) sound.playVictory();
      notifications.showNotification({
        title: `🔥 ${streaksCount} — Bildirishnomalar yoqildi!`,
        body: 'Endi ilovadan yoki saytdan chiqsangiz ham Shercha sizga eslatib turadi! 🦁✨',
        streaks: streaksCount,
        url: '/lessons',
      });
      setStatusFeedback("Bildirishnoma yoqildi! Chiqqanda ham eslatiladi.");
      setTimeout(() => setStatusFeedback(null), 4000);
    } else {
      alert("Bildirishnomalarni yoqish uchun brauzeringiz sozlamalarida ruxsat bering.");
    }
  };

  // Floating Picture-in-Picture (Always on top across other apps!)
  const togglePictureInPicture = async () => {
    if (typeof window === 'undefined') return;

    // Check Document Picture-in-Picture API
    if ('documentPictureInPicture' in window) {
      try {
        const docPip = (window as any).documentPictureInPicture;
        
        // If already active, close it
        if (docPip.window) {
          docPip.window.close();
          setPipActive(false);
          return;
        }

        const pipWin = await docPip.requestWindow({
          width: 320,
          height: 440,
        });

        // Copy styles into PiP window
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach((styleSheet) => {
          pipWin.document.head.appendChild(styleSheet.cloneNode(true));
        });

        pipWin.document.title = '🔥 LiderKids — Shercha Vidjeti';

        const wrapper = pipWin.document.createElement('div');
        wrapper.innerHTML = `
          <div style="font-family: system-ui, -apple-system, sans-serif; background: linear-gradient(180deg, #0094F7 0%, #0074E8 50%, #004EB8 100%); color: white; padding: 20px; border-radius: 28px; text-align: center; height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; border: 4px solid rgba(255,255,255,0.3); box-shadow: inset 0 2px 10px rgba(255,255,255,0.2);">
            <div>
              <div style="font-size: 34px; font-weight: 900; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🔥 ${streaksCount}</div>
              <div style="font-size: 19px; font-weight: 800; margin-top: 4px;">Start a lesson!</div>
              <div style="font-size: 12px; font-weight: 600; color: #FDE047;">(Darsni boshla!)</div>
            </div>
            <div style="font-size: 80px; margin: 10px 0; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">
              ${isGirl ? '🦁🌸' : '🦁💪'}
            </div>
            <div style="font-size: 13px; font-weight: 600; background: rgba(255,255,255,0.18); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.3); line-height: 1.4;">
              ${isGirl 
                ? 'Shercha qizcha kutmoqda! Olovchangiz o‘chmasligi uchun darsni boshlang! 🌸' 
                : 'Sherchang kuchga to‘ldi! Bugungi 1 ta darsni tugatib olovchangni saqla! 💪🔥'}
            </div>
            <button id="pip-action-btn" style="background: #FBBF24; color: #78350F; border: none; border-radius: 16px; padding: 14px; font-weight: 900; font-size: 16px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: transform 0.2s;">
              Darsga kirish 🚀
            </button>
          </div>
        `;

        pipWin.document.body.style.margin = '0';
        pipWin.document.body.style.overflow = 'hidden';
        pipWin.document.body.appendChild(wrapper);

        const btn = pipWin.document.getElementById('pip-action-btn');
        if (btn) {
          btn.onclick = () => {
            window.focus();
            window.location.href = '/lessons';
            pipWin.close();
          };
        }

        setPipActive(true);
        setStatusFeedback("Suzuvchi vidjet ekranga chiqdi! Boshqa ilovalarda ham turadi.");
        setTimeout(() => setStatusFeedback(null), 4000);

        pipWin.addEventListener('pagehide', () => {
          setPipActive(false);
        });
      } catch (err) {
        console.warn('PiP window failed:', err);
      }
    } else {
      // Fallback: Enable background system notifications
      enableNotifications();
    }
  };

  // Trigger PWA installation to Home Screen
  const handleInstallApp = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setStatusFeedback("LiderKids telefoningiz ekraniga o‘rnatildi! 🎉");
      }
      setDeferredInstallPrompt(null);
    } else {
      alert("Ilovani ekranga o‘rnatish uchun brauzer menyusidan 'Bosh ekranga qo‘shish' (Add to Home screen) ni tanlang.");
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. FLOATING MINIMIZED PILL (ALWAYS PINNED ON SCREEN)     */}
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

              {/* Status feedback toast if triggered */}
              {statusFeedback && (
                <div className="relative z-20 mb-2 bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-xl text-center shadow-lg animate-bounce">
                  {statusFeedback}
                </div>
              )}

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

                {/* Picture-in-Picture, Sound & Close Actions */}
                <div className="flex items-center gap-1">
                  {/* Floating PiP Widget Button */}
                  <button
                    onClick={togglePictureInPicture}
                    title="Ekranda suzuvchi vidjet qilib qo‘yish (boshqa ilovalarda ham turadi)"
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors text-white ${
                      pipActive ? 'bg-amber-400 text-amber-950 font-bold' : 'bg-white/15 hover:bg-white/25'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

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

              {/* DUOLINGO TOP TITLE: FIRE STREAK & CALLOUT (EXACTLY MATCHING SCREENSHOT) */}
              <div className="relative z-10 flex flex-col items-center justify-center pt-1 pb-2 text-center">
                <motion.div
                  key={`streak-${currentReminder.streakText}`}
                  initial={{ scale: 0.8, y: -6 }}
                  animate={{ scale: 1, y: 0 }}
                  className="flex items-center gap-2 text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] tracking-tight"
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow">🔥</span>
                  <span>{currentReminder.streakText}</span>
                </motion.div>

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

              {/* CENTER: MASCOT IN ACTION (FLEXING MUSCLES, WAVING, ROARING, ETC.) */}
              <div 
                onClick={handleNext}
                className="relative z-10 my-2 flex items-center justify-center cursor-pointer group"
                title="Boshqa harakatga almashtirish uchun bosing"
              >
                <div className="relative w-48 h-52 sm:w-52 sm:h-56 flex items-center justify-center">
                  <div className="absolute bottom-3 w-36 h-6 bg-black/25 rounded-full blur-md" />

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
              <div className="relative z-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 text-center mb-3 shadow-inner">
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

                {/* Sub-actions footer: Exit notification trigger & PWA Install */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-white/90 px-1">
                    {!notificationAllowed ? (
                      <button
                        onClick={enableNotifications}
                        className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-amber-200 font-bold underline decoration-amber-200/50"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Saytdan chiqqanda eslatish 🔔</span>
                      </button>
                    ) : (
                      <span className="text-emerald-300 flex items-center gap-1">
                        <span>✓</span> Chiqqanda eslatiladi
                      </span>
                    )}

                    <button
                      onClick={handleClose}
                      className="hover:text-white transition-colors underline decoration-white/40"
                    >
                      Keyinroq
                    </button>
                  </div>

                  {/* Extra helper: Pin to screen / Install to home screen */}
                  <div className="flex items-center justify-center gap-3 pt-1 border-t border-white/15 text-[11px] text-white/80">
                    <button
                      onClick={togglePictureInPicture}
                      className="hover:text-white flex items-center gap-1 transition-colors"
                      title="Ekranda doimiy turuvchi suzuvchi oyna"
                    >
                      <Pin className="w-3 h-3 text-amber-300" />
                      <span>Ekranda qoldirish</span>
                    </button>

                    {deferredInstallPrompt && (
                      <button
                        onClick={handleInstallApp}
                        className="hover:text-white flex items-center gap-1 transition-colors text-amber-200 font-bold"
                      >
                        <Download className="w-3 h-3" />
                        <span>Bosh ekranga qo‘shish</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
