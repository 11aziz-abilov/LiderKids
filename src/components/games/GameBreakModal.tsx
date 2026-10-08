'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { triggerConfetti } from '@/components/ConfettiEffect';
import { useGame } from '@/context/GameContext';
import { sound } from '@/utils/sound';
import { Sparkles, ArrowRight, RotateCcw, Home, BookOpen, Coins } from 'lucide-react';

interface GameBreakModalProps {
  isOpen: boolean;
  gameTitle: string;
  score?: number;
  bonusCoins?: number;
  onRestart: () => void;
  onChooseAnother: () => void;
}

export default function GameBreakModal({
  isOpen,
  gameTitle,
  score,
  bonusCoins = 10,
  onRestart,
  onChooseAnother,
}: GameBreakModalProps) {
  const router = useRouter();
  const {
    addCoins,
    progress,
    dailyGamesCount,
    remainingGamesToday,
    canPlayGame,
    recordGamePlay,
  } = useGame();
  const cappedCoins = Math.min(10, Math.max(1, bonusCoins));

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
      addCoins(cappedCoins);
      if (progress.soundEnabled) {
        sound.playVictory();
      }
    }
  }, [isOpen]);

  const handleRestart = () => {
    if (canPlayGame) {
      const ok = recordGamePlay();
      if (ok) {
        onRestart();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 dark:border-amber-700 shadow-2xl max-w-md w-full text-center space-y-5"
      >
        {/* Mascot & Celebration Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 rounded-3xl flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 animate-bounce">
            🦁
          </div>
          <span className="absolute -top-2 -right-2 text-2xl">🎉</span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            Dam olish yakunlandi ✨
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
            Barakalla! Yaxshi dam olding, endi darsga qaytamiz!
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            Miyangiz yangilandi va diqqatingiz oshdi. Yangi video darslar va bilim cho‘qqilari sizni kutmoqda!
          </p>

          {/* Daily Games quota badge */}
          <div className="pt-1">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-xl border ${
                dailyGamesCount >= 2
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
            >
              <span>🎮 Bugungi o‘yinlar:</span>
              <span>{dailyGamesCount} / 2</span>
              {dailyGamesCount >= 2 ? (
                <span className="text-rose-600 dark:text-rose-400 font-extrabold">(Bugungi limit to‘ldi)</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold">({remainingGamesToday} ta imkoniyat qoldi)</span>
              )}
            </span>
          </div>
        </div>

        {/* Bonus reward card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-800/80 p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-700 flex items-center justify-around">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-500 fill-amber-400 animate-spin-slow" />
            <div className="text-left">
              <div className="text-[10px] font-bold text-zinc-400 uppercase">Dam olish bonusi</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">+{cappedCoins} Tanga</div>
            </div>
          </div>
          {typeof score === 'number' && (
            <div className="text-right border-l border-zinc-200 dark:border-zinc-700 pl-4">
              <div className="text-[10px] font-bold text-zinc-400 uppercase">To‘plangan ball</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{score} ball</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Main Action: Go back to lessons */}
          <button
            onClick={() => router.push('/lessons')}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>Darslarga qaytish 🚀</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {canPlayGame ? (
              <button
                onClick={handleRestart}
                className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yana o‘ynash ({remainingGamesToday}) 🔄</span>
              </button>
            ) : (
              <div
                className="py-2.5 px-3 bg-zinc-100/70 dark:bg-zinc-800/70 text-zinc-400 dark:text-zinc-500 font-black text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
                title="Bugun faqat 2 marta o‘ynash mumkin. Limitga yetdingiz!"
              >
                <span>Limit tugadi (2/2) 🔒</span>
              </div>
            )}

            <button
              onClick={onChooseAnother}
              className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{canPlayGame ? 'Boshqa o‘yin 🎮' : 'Menyu 🎮'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
