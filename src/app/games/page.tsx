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
  Crown,
  Lock,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const {
    progress,
    setGrade,
    dailyGamesCount,
    remainingGamesToday,
    canPlayGame,
    isGameLocked,
    getGamePlayCount,
    recordGamePlay,
  } = useGame();
  const currentGrade = progress.grade || 1;
  const isJunior = currentGrade <= 2;

  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);
  const [selectedLockedGame, setSelectedLockedGame] = useState<GameInfo | null>(null);
  const [showLimitNoticeModal, setShowLimitNoticeModal] = useState(false);

  const handleStartGame = (game: GameInfo) => {
    if (isGameLocked(game.id)) {
      setSelectedLockedGame(game);
      setShowLimitNoticeModal(true);
      return;
    }

    const permitted = recordGamePlay(game.id);
    if (permitted) {
      setActiveGame(game.id);
    } else {
      setSelectedLockedGame(game);
      setShowLimitNoticeModal(true);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4 text-yellow-200" />
                <span>Darslar Oralig‘idagi Tanaffus</span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                  remainingGamesToday === 0
                    ? 'bg-red-500/80 text-white'
                    : 'bg-white/25 text-yellow-100'
                }`}
              >
                {remainingGamesToday === 0 ? <Lock className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>
                  O‘ynalgan: {dailyGamesCount}/3 ta | Har bir o‘yinga 1 martadan {remainingGamesToday === 0 ? '(Limit to‘ldi)' : `(${remainingGamesToday} ta ochiq)`}
                </span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              2 Daqiqalik Mini-O‘yinlar 🎮
            </h1>
            <p className="text-orange-100 text-sm sm:text-base font-medium max-w-xl mt-1">
              Darslar orasida miyangizni dam oldiring! Har bir o‘yinga kuniga 1 martadan cheklov qo‘yilgan va har bir o‘yinda +10 tanga bonus beriladi!
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
          {/* Daily Limit Warning Banner if all games completed */}
          {remainingGamesToday === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-rose-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-850 p-5 rounded-3xl border-2 border-rose-200 dark:border-rose-900/60 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  🔒
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Bugungi barcha mini-o‘yinlar yakunlandi (3/3)
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-0.5">
                    Har bir o‘yin kuniga ko‘pi bilan 1 marta o‘ynaladi. Bu ko‘zni toliqishdan saqlaydi va bilimga e’tibor qaratishga yordam beradi. Yangi imkoniyatlar ertaga yana ochiladi!
                  </p>
                </div>
              </div>
              <Link
                href="/lessons"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs rounded-2xl shadow-md shrink-0 hover:brightness-105 active:scale-95 transition"
              >
                Darslarga o‘tish 📚
              </Link>
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>O‘yinni tanlang</span>
              <span className="text-xs font-bold text-zinc-400">
                (Har biri 1 martadan, 2 daqiqa)
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
            {GAMES_LIST.map((game) => {
              const locked = isGameLocked(game.id);

              return (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: !locked ? 1.02 : 1, y: !locked ? -4 : 0 }}
                  whileTap={{ scale: !locked ? 0.98 : 1 }}
                  onClick={() => handleStartGame(game)}
                  className={`bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden ${
                    !locked
                      ? 'border-amber-200 dark:border-zinc-800 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 opacity-85 hover:border-rose-300 dark:hover:border-rose-900'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Icon & Status */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20`}
                      >
                        {game.emoji}
                      </div>

                      {locked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          <Lock className="w-3 h-3" />
                          <span>1/1 o‘ynalgan</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                          <Sparkles className="w-3 h-3" />
                          <span>1 imkoniyat ochiq</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                        {game.title}
                      </h3>
                      <span className="text-xs text-zinc-500 font-semibold block">
                        {game.subtitle}
                      </span>
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

                    {!locked ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl shadow-md">
                        <span>O‘ynash (1 marta)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Limit (1/1)</span>
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick info note */}
          <div className="bg-gradient-to-r from-amber-100/60 to-yellow-100/60 dark:from-zinc-850 dark:to-zinc-800 p-5 rounded-3xl border border-amber-300 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧘‍♂️</span>
              <div>
                <strong className="text-zinc-900 dark:text-white font-black block text-sm">
                  Pedagogik tanaffus qoidasi (har bir o‘yinga 1 martadan):
                </strong>
                Har bir o‘yin kuniga 1 marta (jami 3 ta mini-o‘yin) o‘ynaladi. Bu bolalarni ekranga bog‘lanib qolishidan asraydi va darslarga e’tiborni oshiradi!
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

      {/* Daily limit reached notification modal */}
      <AnimatePresence>
        {showLimitNoticeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-300 dark:border-zinc-700 shadow-2xl text-center space-y-5 relative"
            >
              <button
                onClick={() => {
                  setShowLimitNoticeModal(false);
                  setSelectedLockedGame(null);
                }}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
                {selectedLockedGame?.emoji || '🛑'}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 px-3 py-1 rounded-full">
                  Har bir o‘yinga 1 martalik cheklov
                </span>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                  {selectedLockedGame
                    ? `"${selectedLockedGame.title}" o‘yini limiti to‘ldi!`
                    : 'Bugungi barcha o‘yinlar limiti to‘ldi!'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {selectedLockedGame ? (
                    <>
                      Siz <strong>"{selectedLockedGame.title}"</strong> o‘yinini bugun 1 marta o‘ynadingiz. Qoidaga ko‘ra har bir o‘yinga kuniga faqat <strong>1 marta</strong> ruxsat beriladi.
                      {remainingGamesToday > 0
                        ? ` Sizda hali ${remainingGamesToday} ta boshqa mini-o‘yin ochiq!`
                        : ' Barcha mini-o‘yinlar imkoniyati tugadi.'}
                    </>
                  ) : (
                    <>
                      Har bir o‘yin uchun 1 martalik cheklovdan foydalandingiz (jami 3 ta o‘yin). Ko‘zlaringiz toliqmasligi uchun yangi imkoniyatlar ertaga yana ochiladi! 🌟
                    </>
                  )}
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-zinc-800/80 p-4 rounded-2xl border border-amber-200 dark:border-zinc-700 text-left text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5">
                <div className="font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Tavsiya:</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {remainingGamesToday > 0
                    ? 'Qolgan o‘yinlardan birini tanlang yoki darslarni ko‘rib yangi bilimlar oling!'
                    : 'Video darslarni ko‘rib bilim oling yoki testlarni yechib reytingdagi o‘rningizni oshiring!'}
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/lessons"
                  onClick={() => setShowLimitNoticeModal(false)}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 hover:brightness-105 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Darslarga o‘tish 📚</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/quiz"
                    onClick={() => setShowLimitNoticeModal(false)}
                    className="py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Testlar 📝</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowLimitNoticeModal(false);
                      setSelectedLockedGame(null);
                    }}
                    className="py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
                  >
                    <span>Tushundim</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
