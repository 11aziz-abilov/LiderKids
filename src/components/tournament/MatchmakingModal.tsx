'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TournamentPlayer } from '@/types/tournament';
import { Search, Sparkles, Swords, Trophy, MapPin, X, CheckCircle2 } from 'lucide-react';
import { INITIAL_TOURNAMENT_STUDENTS } from '@/data/tournamentData';

interface MatchmakingModalProps {
  isOpen: boolean;
  userPlayer: {
    name: string;
    grade: number;
    rating: number;
    region: string;
  };
  matchedOpponent: TournamentPlayer | null;
  onMatchFound: () => void;
  onCancel: () => void;
}

export default function MatchmakingModal({
  isOpen,
  userPlayer,
  matchedOpponent,
  onMatchFound,
  onCancel,
}: MatchmakingModalProps) {
  const [phase, setPhase] = useState<'searching' | 'found'>('searching');
  const [countdown, setCountdown] = useState<number>(3);
  const [scannedIndex, setScannedIndex] = useState(0);

  // Searching animatsiyasi
  useEffect(() => {
    if (!isOpen) {
      setPhase('searching');
      setCountdown(3);
      return;
    }

    // Ismlarni tez almashtirib ko'rsatish (qidiruv effekti)
    const scanInterval = setInterval(() => {
      setScannedIndex((prev) => (prev + 1) % INITIAL_TOURNAMENT_STUDENTS.length);
    }, 280);

    // 2.2 soniyadan so'ng raqib topildi holatiga o'tish
    const foundTimeout = setTimeout(() => {
      clearInterval(scanInterval);
      setPhase('found');
    }, 2300);

    return () => {
      clearInterval(scanInterval);
      clearTimeout(foundTimeout);
    };
  }, [isOpen]);

  // Raqib topilgach orqaga sanash (3, 2, 1)
  useEffect(() => {
    if (phase !== 'found') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown tugagach o'yin boshlanadi
      onMatchFound();
    }
  }, [phase, countdown, onMatchFound]);

  if (!isOpen) return null;

  const currentScanned = INITIAL_TOURNAMENT_STUDENTS[scannedIndex];
  const finalOpponent = matchedOpponent || currentScanned;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 dark:border-amber-700 shadow-2xl max-w-lg w-full text-center relative overflow-hidden"
      >
        {/* Cancel button */}
        {phase === 'searching' && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Phase 1: Qidiruv */}
        {phase === 'searching' && (
          <div className="space-y-6 py-4">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Radar to'lqinlari */}
              <motion.div
                animate={{ scale: [1, 2, 2.4], opacity: [0.8, 0.4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-amber-400/30 border-2 border-amber-500"
              />
              <motion.div
                animate={{ scale: [1, 1.6, 2], opacity: [0.8, 0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-orange-400/25 border-2 border-orange-500"
              />
              <div className="relative z-10 w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-orange-500/30 text-white">
                <Swords className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                Jonli Matchmaking Tizimi 🔍
              </span>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
                Mos raqib qidirilmoqda...
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Sizning reytingingizga ({userPlayer.rating} 🏆) mos iqtidorli o‘quvchi saralanmoqda
              </p>
            </div>

            {/* Skanerlanayotgan o'quvchi kartochkasi */}
            <div className="bg-amber-50/70 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-amber-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentScanned.avatarEmoji}</span>
                <div className="text-left">
                  <div className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                    {currentScanned.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{currentScanned.region}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-amber-600 dark:text-amber-400">
                  {currentScanned.rating} 🏆
                </div>
                <div className="text-[10px] text-zinc-400">{currentScanned.grade}-sinf</div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Raqib topildi! */}
        {phase === 'found' && (
          <div className="space-y-6 py-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Raqib topildi! Bellashuvga tayyorlaning</span>
            </motion.div>

            {/* VS Qiyosiy Paneli */}
            <div className="grid grid-cols-2 gap-3 relative">
              {/* O'yinchi (Siz) */}
              <div className="bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-800/80 p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-700 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-400 flex items-center justify-center text-3xl shadow-md">
                  🦁
                </div>
                <div className="text-xs font-black text-zinc-900 dark:text-white mt-2 truncate w-full">
                  {userPlayer.name}
                </div>
                <div className="text-[10px] text-orange-600 font-bold">
                  {userPlayer.grade}-sinf (Siz)
                </div>
                <div className="mt-2 text-xs font-black px-2 py-0.5 rounded-lg bg-amber-200/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                  {userPlayer.rating} 🏆
                </div>
              </div>

              {/* O'rtadagi VS belgisi */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white">
                VS
              </div>

              {/* Raqib */}
              <div className="bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-800/80 p-4 rounded-2xl border-2 border-blue-300 dark:border-blue-700 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-3xl shadow-md">
                  {finalOpponent.avatarEmoji}
                </div>
                <div className="text-xs font-black text-zinc-900 dark:text-white mt-2 truncate w-full">
                  {finalOpponent.name}
                </div>
                <div className="text-[10px] text-blue-600 font-bold">
                  {finalOpponent.grade}-sinf • {finalOpponent.region.split(' ')[0]}
                </div>
                <div className="mt-2 text-xs font-black px-2 py-0.5 rounded-lg bg-blue-200/80 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                  {finalOpponent.rating} 🏆
                </div>
              </div>
            </div>

            {/* Countdown Display */}
            <div className="pt-2">
              <div className="text-xs font-bold text-zinc-500 uppercase">
                O‘yin boshlanmoqda:
              </div>
              <motion.div
                key={countdown}
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-1"
              >
                {countdown > 0 ? countdown : '🏁 Start!'}
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
