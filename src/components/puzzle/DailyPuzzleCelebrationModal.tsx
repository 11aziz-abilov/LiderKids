'use client';

import React, { useState, useEffect } from 'react';
import { DailyPuzzle } from '@/types/puzzle';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Flame, Coins, Clock, ChevronRight, CheckCircle2, Award, X, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyPuzzleCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzle: DailyPuzzle;
  streak: number;
}

export default function DailyPuzzleCelebrationModal({
  isOpen,
  onClose,
  puzzle,
  streak,
}: DailyPuzzleCelebrationModalProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xl border-4 border-amber-300 dark:border-zinc-700 shadow-2xl overflow-hidden my-6 relative"
          >
            {/* Top Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur-xs"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-lg border-2 border-white/30 mb-3"
              >
                🦁👑
              </motion.div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-yellow-200 mb-2">
                <Sparkles className="w-4 h-4" />
                Kunlik G‘alaba!
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Qoyilmaqom, Lider! 🎉
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-100 max-w-md mx-auto mt-1">
                Bugungi eng murakkab boshqotirma mag‘lub etildi! Prezident maktabiga yana 1 qadam yaqinlashdingiz!
              </p>

              {/* Rewards Badges */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/30 font-black text-sm">
                  <Coins className="w-4 h-4 text-yellow-300 fill-yellow-400" />
                  <span>+{puzzle.rewardCoins} Tanga</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/30 font-black text-sm">
                  <Award className="w-4 h-4 text-sky-300" />
                  <span>+{puzzle.rewardXp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/30 font-black text-sm">
                  <Flame className="w-4 h-4 text-orange-300 fill-orange-400 animate-pulse" />
                  <span>{streak} kunlik Streak!</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[55vh] overflow-y-auto">
              {/* Solution steps */}
              <div className="bg-amber-50/70 dark:bg-zinc-800/80 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-amber-950 dark:text-amber-200">
                      Tahlil va Yechim Siri:
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Prezident maktabiga xos qadamma-qadam deduksiya
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {puzzle.thinkingSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white dark:bg-zinc-850 p-2.5 rounded-xl border border-amber-100 dark:border-zinc-750">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Key takeaway */}
                <div className="mt-3.5 pt-3 border-t border-amber-200 dark:border-zinc-700">
                  <div className="flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400 mb-1">
                    <span>💡 O‘rganilgan Daho Qoidasi:</span>
                  </div>
                  <p className="text-xs font-extrabold text-amber-950 dark:text-amber-200 italic">
                    "{puzzle.keyTakeaway}"
                  </p>
                </div>
              </div>

              {/* Countdown Card */}
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-4 rounded-2xl flex items-center justify-between border-2 border-zinc-700 shadow-md">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-amber-400 animate-spin-slow" />
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Ertangi yangi boshqotirma:
                    </span>
                    <span className="text-sm font-black text-zinc-100">
                      Yarim tunda (00:00) ochiladi
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono font-black text-base sm:text-lg bg-zinc-800/90 px-3 py-1.5 rounded-xl border border-zinc-650">
                  <span className="text-amber-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="text-amber-400">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="text-orange-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-850 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-md hover:scale-102 transition flex items-center justify-center gap-2"
              >
                <span>Ajoyib, tushundim!</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
