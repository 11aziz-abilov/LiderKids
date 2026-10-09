'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { triggerConfetti } from '@/components/ConfettiEffect';
import { sound } from '@/utils/sound';
import { TournamentPlayer, TournamentLeague } from '@/types/tournament';
import { Trophy, Coins, Sparkles, RotateCcw, ArrowRight, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MatchResultModalProps {
  isOpen: boolean;
  result: 'win' | 'loss' | 'draw';
  opponent: TournamentPlayer | null;
  ratingChange: number;
  newRating: number;
  newLeague: TournamentLeague;
  coinsEarned: number;
  xpEarned: number;
  isPvp?: boolean;
  pvpWinnerName?: string;
  onPlayAgain: () => void;
  onGoToHub: () => void;
}

export default function MatchResultModal({
  isOpen,
  result,
  opponent,
  ratingChange,
  newRating,
  newLeague,
  coinsEarned,
  xpEarned,
  isPvp,
  pvpWinnerName,
  onPlayAgain,
  onGoToHub,
}: MatchResultModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    if (result === 'win') {
      triggerConfetti();
      sound.playVictory();
    } else {
      sound.playClick();
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  const isWin = result === 'win';
  const isDraw = result === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 dark:border-amber-700 shadow-2xl max-w-md w-full text-center space-y-5"
      >
        {/* Result Mascot Badge */}
        <div className="relative inline-block">
          <div
            className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-xl animate-bounce ${
              isWin
                ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 shadow-amber-500/30'
                : isDraw
                ? 'bg-gradient-to-tr from-blue-400 to-indigo-500 shadow-blue-500/30'
                : 'bg-gradient-to-tr from-stone-400 to-zinc-600 shadow-zinc-500/30'
            }`}
          >
            {isWin ? '🦁' : isDraw ? '🤝' : '🎖️'}
          </div>
          <span className="absolute -top-2 -right-2 text-2xl">
            {isWin ? '👑' : isDraw ? '⚖️' : '💪'}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <span
            className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
              isWin
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300'
                : isDraw
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300'
                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300'
            }`}
          >
            {isPvp ? 'Do‘stona O‘yin Natijasi' : 'Turnir O‘yini Yakuni'}
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
            {isPvp
              ? `${pvpWinnerName} G‘alaba Qozondi!`
              : isWin
              ? 'Ajoyib G‘alaba! Tabriklaymiz!'
              : isDraw
              ? 'Teng kurash — Durang!'
              : 'Yaxshi harakat! Tajriba oshdi!'}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            {isPvp
              ? 'Ikkala o‘yinchi ham mahorat ko‘rsatdi! Ajoyib partiya bo‘ldi.'
              : isWin
              ? `Siz ${opponent?.name || 'raqibingiz'} ustidan g‘alaba qozonib yangi reyting ballariga ega bo‘ldingiz!`
              : isDraw
              ? 'Kuchlar teng keldi. Turnir reytingingiz mustahkamlandi.'
              : 'Har bir mag‘lubiyat yangi taktikani o‘rgatadi. Keyingi o‘yinda g‘alaba sizniki!'}
          </p>
        </div>

        {/* Rewards / Rating Card */}
        {!isPvp && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-800/80 p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-700 grid grid-cols-3 gap-2 text-center">
            {/* Rating */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Reyting</span>
              </div>
              <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {newRating}
              </div>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                +{ratingChange} 🏆
              </span>
            </div>

            {/* Coins */}
            <div className="flex flex-col items-center border-x border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                <Coins className="w-3.5 h-3.5 text-yellow-500" />
                <span>Tangalar</span>
              </div>
              <div className="text-base sm:text-lg font-black text-yellow-600 dark:text-yellow-400 mt-0.5">
                +{coinsEarned}
              </div>
              <span className="text-[10px] font-bold text-zinc-400">bonus 🪙</span>
            </div>

            {/* League */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                <Award className="w-3.5 h-3.5 text-orange-500" />
                <span>Liga</span>
              </div>
              <div className="text-xs font-black text-orange-600 dark:text-orange-400 mt-1 truncate max-w-full">
                {newLeague.split(' ')[0]}
              </div>
              <span className="text-[10px] font-bold text-zinc-400">daraja</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yana o‘ynash 🔄</span>
          </button>

          <button
            onClick={onGoToHub}
            className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Turnir zaliga qaytish</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
