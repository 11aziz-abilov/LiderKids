'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { ACHIEVEMENTS } from '@/data/mockData';
import { Trophy, Award, Lock, CheckCircle2, Sparkles, Coins, Flame, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AchievementsPage() {
  const { progress, lionStage } = useGame();

  const achievementsWithStatus = ACHIEVEMENTS.map((ach) => {
    let unlocked = false;
    if (ach.requiredCoins && progress.coins >= ach.requiredCoins) {
      unlocked = true;
    }
    if (ach.requiredStreaks && progress.streaks >= ach.requiredStreaks) {
      unlocked = true;
    }
    if (ach.requiredQuizzes && progress.completedQuizzes.length >= ach.requiredQuizzes) {
      unlocked = true;
    }
    if (ach.id === 'first-step' && (progress.coins > 0 || progress.completedQuizzes.length > 0)) {
      unlocked = true;
    }
    return { ...ach, unlocked };
  });

  const unlockedCount = achievementsWithStatus.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Shon-sharaf va Nishonlar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Mening Yutuqlarim 🏆
          </h1>
          <p className="text-purple-100 text-sm sm:text-base font-medium max-w-xl mt-1">
            Har bir topshiriq sizni Prezident maktabiga yaqinlashtiradi. Barcha nishonlarni to‘plang va Bilim Qiroliga aylaning!
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
          <div className="text-xs font-bold text-purple-200 uppercase">Ochilgan nishonlar</div>
          <div className="text-3xl font-black mt-1">
            {unlockedCount} / {achievementsWithStatus.length}
          </div>
        </div>
      </div>

      {/* Lion Progress Profile Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 dark:border-amber-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300">
            🦁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                {progress.name}
              </h2>
              <span className="text-xs font-black bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                {progress.grade}-sinf
              </span>
            </div>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">
              {lionStage.title} ({lionStage.stageName})
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Jami to‘plangan tajriba: {progress.xp} XP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 bg-amber-50 dark:bg-zinc-800 rounded-2xl border border-amber-200 dark:border-zinc-700">
            <Coins className="w-6 h-6 text-amber-500 mx-auto" />
            <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {progress.coins}
            </div>
            <div className="text-[11px] font-bold text-zinc-400">Tangalar</div>
          </div>

          <div className="text-center px-4 py-2 bg-orange-50 dark:bg-zinc-800 rounded-2xl border border-orange-200 dark:border-zinc-700">
            <Flame className="w-6 h-6 text-orange-500 mx-auto" />
            <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {progress.streaks}
            </div>
            <div className="text-[11px] font-bold text-zinc-400">Olovchalar</div>
          </div>

          <div className="text-center px-4 py-2 bg-emerald-50 dark:bg-zinc-800 rounded-2xl border border-emerald-200 dark:border-zinc-700">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {progress.completedQuizzes.length}
            </div>
            <div className="text-[11px] font-bold text-zinc-400">Yechilgan testlar</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">
          Nishonlar Ro‘yxati
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievementsWithStatus.map((ach) => (
            <motion.div
              key={ach.id}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-6 rounded-3xl border-4 flex items-start gap-4 transition-all shadow-md ${
                ach.unlocked
                  ? 'bg-white dark:bg-zinc-900 border-amber-400 dark:border-amber-700 shadow-amber-500/10'
                  : 'bg-zinc-100/70 dark:bg-zinc-850/50 border-zinc-200 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner ${
                  ach.unlocked
                    ? 'bg-gradient-to-tr from-amber-300 to-yellow-400 border-2 border-amber-400'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                }`}
              >
                {ach.unlocked ? ach.icon : <Lock className="w-6 h-6 text-zinc-400" />}
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="font-black text-lg text-zinc-900 dark:text-white">
                    {ach.title}
                  </h4>
                  {ach.unlocked && (
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {ach.description}
                </p>

                <div className="mt-3">
                  {ach.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Qo‘lga kiritildi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                      Qulflangan
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
