'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { STREAK_PRIZES, getNextStreakPrize } from '@/data/streakRewardsData';
import { StreakPrize } from '@/types';
import { motion } from 'framer-motion';
import { Flame, Gift, CheckCircle2, Lock, Sparkles, ChevronRight, Truck, Info, Award, HelpCircle } from 'lucide-react';

export default function StreakRewardsSection() {
  const {
    progress,
    openClaimModalForPrize,
    setStreaksDirectly,
    addStreak,
  } = useGame();

  const [showTester, setShowTester] = useState(false);
  const currentStreak = progress.streaks || 0;
  const nextPrize = getNextStreakPrize(currentStreak);

  return (
    <section id="streak-rewards" className="scroll-mt-24 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-amber-300/80 dark:border-amber-700/60 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
            <Flame className="w-4 h-4 fill-white animate-bounce" />
            <span>LiderKids Brend Sovg‘alari</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <span>Uzluksiz Dars Sovrinlari</span>
            <span className="text-2xl">🎁</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-medium max-w-2xl mt-1">
            Har kuni uzluksiz dars qilib olovchani saqlang va LiderKids brendi ostidagi haqiqiy jismoniy sovg‘alarni qo‘lga kiriting! Sovg‘alar eshigingizgacha bepul yetkaziladi.
          </p>
        </div>

        {/* Current streak pill badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-5 py-3 rounded-2xl border-2 border-orange-300 dark:border-orange-800 shadow-md shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl shadow-inner">
            🔥
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Joriy Olovcha
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {currentStreak} kun
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative z-10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-amber-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">
            Sovg‘alar Yo‘lagi (Roadmap)
          </span>
          {nextPrize ? (
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
              Keyingi sovg‘a: {nextPrize.name} ({nextPrize.daysRequired - currentStreak} kun qoldi)
            </span>
          ) : (
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
              Barcha sovg‘alar ochildi! 🎉 Grand Chempion!
            </span>
          )}
        </div>

        {/* Progress Bar Track */}
        <div className="relative w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (currentStreak / 100) * 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-full"
          />
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STREAK_PRIZES.map((prize) => {
            const isUnlocked = currentStreak >= prize.daysRequired;
            const claim = progress.streakClaims?.[prize.id];
            const isClaimed = Boolean(claim);
            const daysLeft = Math.max(0, prize.daysRequired - currentStreak);
            const progressPercent = Math.min(100, Math.round((currentStreak / prize.daysRequired) * 100));

            return (
              <motion.div
                key={prize.id}
                whileHover={{ y: -4 }}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border-2 transition shadow-sm ${
                  isUnlocked
                    ? 'bg-white dark:bg-zinc-900 border-amber-400 dark:border-amber-600 shadow-amber-500/10'
                    : 'bg-zinc-50/80 dark:bg-zinc-850/60 border-zinc-200 dark:border-zinc-800 opacity-90'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${prize.bgSoft}`}>
                    {prize.periodLabel} ({prize.daysRequired} kun)
                  </span>

                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Yuborilmoqda
                    </span>
                  ) : isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 animate-pulse">
                      <Sparkles className="w-3 h-3" /> Yutib olindi!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> {daysLeft} kun qoldi
                    </span>
                  )}
                </div>

                {/* Prize Image & Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ${
                      isUnlocked
                        ? `bg-gradient-to-br ${prize.color} text-white shadow-md`
                        : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  >
                    {prize.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-zinc-900 dark:text-white leading-tight">
                      {prize.name}
                    </h3>
                    <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {prize.badge}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                  {prize.description}
                </p>

                {/* Mini Progress */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-black text-zinc-500">
                    <span>Olovcha jarayoni:</span>
                    <span className={isUnlocked ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500'}>
                      {Math.min(currentStreak, prize.daysRequired)} / {prize.daysRequired} kun ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isUnlocked ? 'bg-amber-500' : 'bg-orange-400'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                {isClaimed ? (
                  <button
                    onClick={() => openClaimModalForPrize(prize)}
                    className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl font-black text-xs border border-emerald-300 dark:border-emerald-700 flex items-center justify-center gap-1.5 transition"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Yetkazish holatini ko‘rish</span>
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => openClaimModalForPrize(prize)}
                    className={`w-full py-2.5 px-3 bg-gradient-to-r ${prize.color} text-white rounded-xl font-black text-xs shadow-md hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5 transition animate-bounce`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Sovg‘ani qabul qilish 🎁</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Yana {daysLeft} kun dars qiling</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Info footer & Quick Testing Simulator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-amber-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <b>Eslatma:</b> Darslar orasida 1 kundan ortiq uzilish bo‘lmasa, olovcha davom etadi. Sovrinlar O‘zbekiston bo‘ylab bepul yetkaziladi.
          </span>
        </div>

        {/* Tester Button toggle */}
        <button
          onClick={() => setShowTester(!showTester)}
          className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/50 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 shrink-0 transition"
        >
          {showTester ? '✕ Sinov panelini yopish' : '🧪 Olovchani sinab ko‘rish'}
        </button>
      </div>

      {/* Simulator Toolbar for testing milestones */}
      {showTester && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-600 space-y-2 text-xs"
        >
          <div className="font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <span>🧪 Tezkor Sinov Paneli (Olovcha bosqichlarini sinash):</span>
            <span className="text-[11px] font-normal text-zinc-500">
              Tugmani bosing va sovg‘a ochilishini darhol ko‘ring!
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addStreak(1)}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold rounded-lg text-zinc-800 dark:text-zinc-200"
            >
              +1 kun dars qilish 🔥
            </button>
            <button
              onClick={() => setStreaksDirectly(7)}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/60 font-black rounded-lg text-blue-800 dark:text-blue-300 border border-blue-300"
            >
              7 kun (🖊️ Ruchka yutish)
            </button>
            <button
              onClick={() => setStreaksDirectly(30)}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 font-black rounded-lg text-amber-800 dark:text-amber-300 border border-amber-300"
            >
              30 kun (🧢 Kepka yutish)
            </button>
            <button
              onClick={() => setStreaksDirectly(60)}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 font-black rounded-lg text-emerald-800 dark:text-emerald-300 border border-emerald-300"
            >
              60 kun (☕ Stakan yutish)
            </button>
            <button
              onClick={() => setStreaksDirectly(100)}
              className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 font-black rounded-lg text-purple-800 dark:text-purple-300 border border-purple-300"
            >
              100 kun (👕 Futbolka yutish)
            </button>
            <button
              onClick={() => setStreaksDirectly(2)}
              className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 font-bold rounded-lg text-zinc-700 dark:text-zinc-300"
            >
              Tiklash (2 kun)
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
