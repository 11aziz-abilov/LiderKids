'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { GradeLevel } from '@/types';
import { MiniGameId, getDifficultyGroup } from '@/types/games';
import MemoryGame from '@/components/games/MemoryGame';
import PuzzleGame from '@/components/games/PuzzleGame';
import StarCatcherGame from '@/components/games/StarCatcherGame';
import {
  Sparkles,
  Gamepad2,
  Clock,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Flame,
  Award,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameInfo {
  id: MiniGameId;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  juniorBadge: string;
  seniorBadge: string;
  juniorDesc: string;
  seniorDesc: string;
}

const GAMES_LIST: GameInfo[] = [
  {
    id: 'memory',
    title: 'Juftini top',
    subtitle: 'Diqqat va xotirani charxlovchi kartalar',
    emoji: '🃏',
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    juniorBadge: '3x2 Katta kartalar (6-8 ta)',
    seniorBadge: '4x4 Murakkab panjara (16 ta)',
    juniorDesc: 'Katta va aniq belgilar, bir xil juftliklarni topib olovchangizni oshiring!',
    seniorDesc: 'Prezident maktabi fanlari va geometrik belgilar bilan diqqatni sinang!',
  },
  {
    id: 'puzzle',
    title: 'Mini-pazl',
    subtitle: 'Mantiqiy tasavvurni rivojlantiruvchi mozaika',
    emoji: '🧩',
    gradient: 'from-blue-500 via-indigo-500 to-sky-500',
    juniorBadge: '4 ta yirik bo‘lak (Konturli)',
    seniorBadge: '9 ta bo‘lakli to‘liq pazl',
    juniorDesc: 'Xira fon yo‘naltiruvchisi yordamida rasmni osongina birlashtiring.',
    seniorDesc: 'Bo‘laklar o‘rnini almashtirib (swap), haqiqiy chempiondek yig‘ing!',
  },
  {
    id: 'stars',
    title: 'Yulduz ushlash',
    subtitle: 'Epchillik va tezkorlik arkadasi',
    emoji: '⭐',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    juniorBadge: 'Sekin tushuvchi yulduzlar',
    seniorBadge: 'Dinamik tezlik & Oltin yulduzlar',
    juniorDesc: 'Ob‘ektlar sekin tushadi, savatchani qulay surib barchasini tuting!',
    seniorDesc: 'Faqat 🌟 oltin yulduzlarni tanlab oling va bulutlardan qoching!',
  },
];

export default function GamesPage() {
  const { progress, setGrade } = useGame();
  const currentGrade = progress.grade || 1;
  const isJunior = currentGrade <= 2;

  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Gamepad2 className="w-4 h-4 text-yellow-200" />
              <span>Darslar Oralig‘idagi Tanaffus</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              2 Daqiqalik Mini-O‘yinlar 🎮
            </h1>
            <p className="text-orange-100 text-sm sm:text-base font-medium max-w-xl mt-1">
              Darslar orasida miyangizni dam oldiring va yangi energiya to‘plang! Hech qanday jazosiz, faqat xursandchilik va +30 tanga bonus!
            </p>
          </div>

          {/* Grade indicator & Quick switch */}
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/25 flex flex-col items-end gap-1">
            <div className="text-[10px] font-bold text-orange-100 uppercase">
              Moslashtirilgan qiyinchilik:
            </div>
            <div className="text-base sm:text-lg font-black flex items-center gap-2">
              <span>{isJunior ? '🐾 1-2 sinflar (Kichiklar)' : '🎯 3-4 sinflar (Kattalar)'}</span>
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g as GradeLevel)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-extrabold transition ${
                    currentGrade === g
                      ? 'bg-white text-orange-600 shadow'
                      : 'bg-white/30 text-white hover:bg-white/40'
                  }`}
                  title={`${g}-sinf darajasiga o‘tish`}
                >
                  {g}-sinf
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Either Active Game or Selection Hub */}
      {activeGame ? (
        <div className="space-y-4">
          <button
            onClick={() => setActiveGame(null)}
            className="inline-flex items-center gap-2 text-xs font-black text-amber-600 dark:text-amber-400 hover:underline bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-amber-200 dark:border-zinc-800 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>O‘yinlar ro‘yxatiga qaytish</span>
          </button>

          {activeGame === 'memory' && (
            <MemoryGame
              grade={currentGrade}
              onBackToMenu={() => setActiveGame(null)}
            />
          )}

          {activeGame === 'puzzle' && (
            <PuzzleGame
              grade={currentGrade}
              onBackToMenu={() => setActiveGame(null)}
            />
          )}

          {activeGame === 'stars' && (
            <StarCatcherGame
              grade={currentGrade}
              onBackToMenu={() => setActiveGame(null)}
            />
          )}
        </div>
      ) : (
        /* Game Selection Hub */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>O‘yinni tanlang</span>
              <span className="text-xs font-bold text-zinc-400">
                (Har biri aniq 2 daqiqalik)
              </span>
            </h2>
            <Link
              href="/lessons"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Darslarga o‘tish</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAMES_LIST.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveGame(game.id)}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-amber-200 dark:border-zinc-800 shadow-md hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20`}
                    >
                      {game.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                        {game.title}
                      </h3>
                      <span className="text-xs text-zinc-500 font-semibold block">
                        {game.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Difficulty Tag */}
                  <div className="bg-amber-50 dark:bg-zinc-800/80 p-3 rounded-2xl border border-amber-200/80 dark:border-zinc-700 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-black">
                      <span className="text-amber-800 dark:text-amber-300">
                        {isJunior ? '🐾 1-2 sinf formati:' : '🎯 3-4 sinf formati:'}
                      </span>
                      <span className="text-orange-600 dark:text-orange-400 font-bold">
                        {isJunior ? game.juniorBadge : game.seniorBadge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-snug">
                      {isJunior ? game.juniorDesc : game.seniorDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2 daqiqa</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl shadow-md">
                    <span>O‘ynash</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick info note */}
          <div className="bg-gradient-to-r from-amber-100/60 to-yellow-100/60 dark:from-zinc-850 dark:to-zinc-800 p-5 rounded-3xl border border-amber-300 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧘‍♂️</span>
              <div>
                <strong className="text-zinc-900 dark:text-white font-black block text-sm">
                  Pedagogik tanaffus qoidasi:
                </strong>
                Har 20-30 daqiqa video dars yoki testdan so‘ng 2 daqiqalik mini-o‘yin diqqatni 40% ga oshiradi va ko‘zni toliqtirmaydi!
              </div>
            </div>

            <Link
              href="/lessons"
              className="px-5 py-2.5 bg-white dark:bg-zinc-750 text-amber-700 dark:text-amber-300 font-black rounded-2xl border border-amber-300 dark:border-zinc-600 shadow-sm shrink-0 hover:bg-amber-50"
            >
              Darslarni ko‘rish 🎬
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
