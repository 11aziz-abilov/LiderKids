'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Sparkles, Award, Zap, Heart, ShoppingBag, Music, Flame, Hand, Smile } from 'lucide-react';
import Link from 'next/link';
import FullBodyLionCharacter, { LionAction } from './FullBodyLionCharacter';

export default function MascotLion() {
  const { progress, lionStage } = useGame();
  const [action, setAction] = useState<LionAction>('idle');
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const isGirl = progress.profile?.gender === 'girl';

  // Action quotes and speech
  const actionQuotes: Record<LionAction, string[]> = {
    idle: [
      isGirl
        ? "Salom, go‘zal bilimdon! Bugun qanday darslarni o‘rganamiz? 🌸"
        : "Salom, bo‘lajak Lider! Yangi marralarni zabt etishga tayyormisan? 🦁",
      "Har kuni 10 daqiqa test yechsak, Prezident maktabi bizniki! 🎯",
    ],
    wave: [
      isGirl
        ? "Assalomu alaykum! Senga ajoyib va quvnoq kun tilayman! 👋✨"
        : "Salom do‘stim! Sen bilan birga o‘qiyotganimdan xursandman! 👋🔥",
      "Bugun rekord o‘rnatamiz! Olg‘a! 🚀",
    ],
    dance: [
      isGirl
        ? "La-la-la! Bilim olish — eng quvnoq bayram! Birga raqsga tushaylik! 💃🎶"
        : "Musiqani qo‘ying, liderlar raqsi boshlandi! 🕺🎵",
      "G‘alabaga to‘la kun uchun quvnoq kayfiyat! 🌟",
    ],
    jump: [
      isGirl
        ? "Yulduzlarga tomon baland sakraymiz! 100 ball — bizniki! ⭐🚀"
        : "Baland sakraymiz! Hech qanday to‘siq bizni to‘xtata olmaydi! 🏆💥",
      "A‘lo baholar sari olg‘a! ⚡",
    ],
    roar: [
      isGirl
        ? "Biz kuchli, bilimli va eng a‘lochi malikalarmiz! R-r-r-roar! 🦁💖"
        : "R-R-R-ROARRR! Prezident maktabiga biz albatta kiramiz! 🦁🔥",
      "Lider Kids chempionlari doimo birinchi o‘rinda! 🥇",
    ],
    flex: [
      isGirl
        ? "Qara, malikalar ham kuchli va chaqqon bo‘ladi! Olg‘a, darsga! 💪✨"
        : "Mushaklarni ko‘rdingmi? Har kungi dars — chempionlik kuchi! 💪🔥",
      "Darsni boshla! Kuch va bilim biz bilan! 💥",
    ],
    study: [
      isGirl
        ? "Kitob o‘qish va masalalar yechish — eng sevimli mashg‘ulotim! 📖🌸"
        : "Bilimdon Shercha tayyor! Bugungi yangi mavzuni zabt etamiz! 👓📚",
      "Har bir to‘g‘ri yechilgan masala — buyuk kelajak sari qadam! 🌟",
    ],
  };

  const triggerAction = (newAction: LionAction) => {
    setAction(newAction);
    const quotes = actionQuotes[newAction];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeechText(randomQuote);

    // Revert to idle after 3.5 seconds
    setTimeout(() => {
      setAction('idle');
    }, 3500);
  };

  const handleLionClick = () => {
    setClickCount((prev) => prev + 1);
    const actionsList: LionAction[] = ['flex', 'wave', 'study', 'dance', 'jump', 'roar'];
    const chosen = actionsList[clickCount % actionsList.length];
    triggerAction(chosen);
  };

  // XP hisobi
  const currentGradeXP = progress.xp % lionStage.xpNeededForNext;
  const xpPercent = Math.min(100, Math.round((currentGradeXP / lionStage.xpNeededForNext) * 100));

  const mascotTitle = isGirl
    ? progress.grade === 4
      ? 'Shohona Malika Shercha 👑'
      : progress.grade === 3
      ? 'Bilimdon Qiz Shercha 🎀'
      : progress.grade === 2
      ? 'O‘ynoqi Malika Shercha 🌸'
      : 'Kichkintoy Malika Shercha 💖'
    : lionStage.title;

  return (
    <div className="relative w-full bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-900/20 dark:to-transparent rounded-3xl p-6 sm:p-8 border-4 border-amber-300 dark:border-amber-800 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Background Decorative Rings */}
      <div className="absolute top-2 right-4 text-3xl animate-bounce duration-1000 select-none">✨</div>
      <div className="absolute bottom-4 left-6 text-2xl animate-pulse select-none">⭐</div>
      <div className="absolute top-1/2 -right-10 w-44 h-44 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Shercha Avatar & Interactive Controls */}
        <div className="flex flex-col items-center">
          <div
            className="relative cursor-pointer group flex flex-col items-center"
            onClick={handleLionClick}
            title="Sherchani bosing yoki harakatlarni tanlang!"
          >
            {/* Click Hearts / Stars Bubble */}
            <AnimatePresence>
              {action !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: 1, y: -20, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-4 z-30 bg-white dark:bg-zinc-800 px-3.5 py-1.5 rounded-full shadow-lg border-2 border-amber-400 text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>
                    {action === 'wave' && 'Salom berdi! 👋'}
                    {action === 'dance' && 'Raqsga tushmoqda! 💃🎶'}
                    {action === 'jump' && 'Baland sakradi! ⭐'}
                    {action === 'roar' && 'Qahramonona bo‘kirdi! 🦁🔥'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Base Halo */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-2xl opacity-35 group-hover:opacity-65 transition-opacity pointer-events-none" />

            {/* FULL-BODY LION / LIONESS SVG CHARACTER */}
            <FullBodyLionCharacter
              grade={progress.grade}
              gender={progress.profile?.gender || 'boy'}
              equipped={progress.equippedItems || {}}
              action={action}
              size="lg"
            />

            {/* Click me hint badge */}
            <span className="mt-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap transition-transform group-hover:scale-105 flex items-center gap-1">
              <span>Meni bos!</span>
              <span>🐾</span>
            </span>
          </div>

          {/* Harakatlar (Action buttons: Salom, Raqs, Sakrash, Bo'kirish) */}
          <div className="mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center max-w-xs">
            <button
              onClick={() => triggerAction('wave')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm ${
                action === 'wave'
                  ? 'bg-amber-500 text-white scale-105'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-amber-200 dark:border-zinc-700 hover:bg-amber-50'
              }`}
            >
              <Hand className="w-3.5 h-3.5 text-amber-500" />
              <span>Salom</span>
            </button>

            <button
              onClick={() => triggerAction('dance')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm ${
                action === 'dance'
                  ? 'bg-pink-500 text-white scale-105'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-pink-200 dark:border-zinc-700 hover:bg-pink-50'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-pink-500" />
              <span>Raqs</span>
            </button>

            <button
              onClick={() => triggerAction('jump')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm ${
                action === 'jump'
                  ? 'bg-indigo-500 text-white scale-105'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-indigo-200 dark:border-zinc-700 hover:bg-indigo-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sakrash</span>
            </button>

            <button
              onClick={() => triggerAction('roar')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm ${
                action === 'roar'
                  ? 'bg-orange-500 text-white scale-105'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-orange-200 dark:border-zinc-700 hover:bg-orange-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Bo‘kirish</span>
            </button>
          </div>

          <div className="mt-3 text-center flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-200">
              {mascotTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block text-xs sm:text-sm font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-3 py-0.5 rounded-full">
                {isGirl ? (progress.grade === 4 ? 'Shohona Malika' : 'A‘lochi Malika') : lionStage.badge}
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                {isGirl ? '👧 Qiz bola' : '👦 O‘g‘il bola'}
              </span>
            </div>

            {/* Market & Wardrobe Button */}
            <Link
              href="/market"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Garderob & Market</span>
              <span className="bg-white/25 px-2 py-0.5 rounded-full text-xs font-bold text-yellow-200">
                {progress.coins} 🪙
              </span>
            </Link>
          </div>
        </div>

        {/* Sherchaning xabari va Progress qismi */}
        <div className="flex-1 max-w-xl">
          {/* Muloqot buluti (Speech Bubble) */}
          <div className="relative bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-lg border-2 border-amber-300 dark:border-amber-700/60 mb-5">
            <div className="absolute -left-3 top-8 hidden lg:block w-4 h-4 bg-white dark:bg-zinc-900 border-l-2 border-b-2 border-amber-300 dark:border-amber-700/60 transform rotate-45" />

            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-1">
              <Smile className="w-4 h-4" />
              <span>{isGirl ? 'Malika Shercha aytadi:' : 'Shercha aytadi:'}</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-100 italic">
              &quot;{speechText || lionStage.quote}&quot;
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {lionStage.description}
            </p>
          </div>

          {/* XP Progress Bar */}
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-extrabold text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
                  {isGirl ? 'Malika shercha tajribasi (XP)' : 'Shercha tajribasi (XP)'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                {currentGradeXP} / {lionStage.xpNeededForNext} XP
              </span>
            </div>

            {/* Progress track */}
            <div className="w-full h-4 sm:h-5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1 border border-zinc-200 dark:border-zinc-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span>{xpPercent}% to‘ldi</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Keyingi daraja yaqin!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
