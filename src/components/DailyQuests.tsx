'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { CheckCircle2, Circle, Flame, Coins, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyQuests() {
  const { progress } = useGame();

  const quests = [
    {
      id: 'q1',
      title: 'Ilk test savolini yech',
      reward: '+10 🪙',
      completed: progress.completedQuizzes.length >= 1,
      progressText: `${Math.min(1, progress.completedQuizzes.length)} / 1`,
    },
    {
      id: 'q2',
      title: 'Bitta video darsni to‘liq ko‘r',
      reward: '+1 🔥',
      completed: progress.completedLessons.length >= 1,
      progressText: `${Math.min(1, progress.completedLessons.length)} / 1`,
    },
    {
      id: 'q3',
      title: 'Jami 60 tanga to‘pla',
      reward: '+20 🪙 Bonus',
      completed: progress.coins >= 60,
      progressText: `${Math.min(60, progress.coins)} / 60 🪙`,
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 border-4 border-amber-200 dark:border-zinc-800 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
              Bugungi topshiriqlar (Quests)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Har kuni yangilanadi, bajaring va qo‘shimcha tangalar oling!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {quests.map((q) => (
          <motion.div
            key={q.id}
            whileHover={{ scale: 1.01 }}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              q.completed
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-750'
            }`}
          >
            <div className="flex items-center gap-3">
              {q.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 flex-shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-zinc-300 dark:text-zinc-600 flex-shrink-0" />
              )}
              <div>
                <h4
                  className={`text-sm sm:text-base font-extrabold ${
                    q.completed
                      ? 'text-emerald-900 dark:text-emerald-300 line-through opacity-80'
                      : 'text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  {q.title}
                </h4>
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  Holat: {q.progressText}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-xl text-xs sm:text-sm font-black border border-amber-300 dark:border-amber-700 whitespace-nowrap">
              <span>{q.reward}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
