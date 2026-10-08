'use client';

import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { triggerConfetti } from './ConfettiEffect';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight, Award, GraduationCap } from 'lucide-react';

export default function AcademicYearPromotionModal() {
  const { progress, clearPromotionNotice } = useGame();
  const notice = progress.academicYearPromotionNotice;

  useEffect(() => {
    if (notice) {
      triggerConfetti();
    }
  }, [notice]);

  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-4 border-amber-400 dark:border-amber-600 w-full max-w-md overflow-hidden text-center p-6 sm:p-8 space-y-5"
      >
        {/* Animated mascot crown */}
        <div className="relative mx-auto w-24 h-24 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-400 rounded-3xl flex items-center justify-center text-5xl shadow-xl shadow-orange-500/30 animate-bounce">
          🦁
          <div className="absolute -top-3 -right-2 bg-yellow-300 text-yellow-950 p-1.5 rounded-full shadow border-2 border-white text-xs font-black">
            👑
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>O‘quv Yili Yakuni & Yangi Bosqich</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Tabriklaymiz, {progress.profile?.firstName || progress.name}! 🎉
          </h2>

          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
            O‘quv yili muvaffaqiyatli yakunlandi! Siz <span className="font-black text-orange-600 dark:text-orange-400">{notice.fromGrade}-sinf</span>ni a‘lo natijalar bilan tamomlab, avtomatik ravishda <span className="font-black text-amber-600 dark:text-amber-400">{notice.toGrade}-sinf</span>ga o‘tdingiz!
          </p>
        </div>

        {/* Transition Badge Card */}
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 p-4 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-600 flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-xs font-bold text-zinc-500">Tugallandi</div>
            <div className="text-lg font-black text-zinc-700 dark:text-zinc-300">{notice.fromGrade}-sinf</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-orange-600 dark:text-orange-400">Yangi bosqich</div>
            <div className="text-xl font-black text-orange-600 dark:text-orange-400">{notice.toGrade}-sinf 🌟</div>
          </div>
        </div>

        {/* Bonus reward */}
        <div className="flex items-center justify-center gap-4 text-xs font-black text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-zinc-800/80 py-2 px-4 rounded-xl border border-amber-200 dark:border-zinc-700">
          <span>🎁 Yillik mukofot:</span>
          <span>🪙 +50 Tanga</span>
          <span>•</span>
          <span>⚡ +50 XP</span>
        </div>

        <button
          onClick={clearPromotionNotice}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
        >
          🚀 {notice.toGrade}-sinf Sarguzashtini Boshlash!
        </button>
      </motion.div>
    </div>
  );
}
