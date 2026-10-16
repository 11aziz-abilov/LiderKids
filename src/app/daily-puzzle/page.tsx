'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame, getTodayDateString } from '@/context/GameContext';
import { GradeLevel } from '@/types';
import { getDailyPuzzleForDate, formatUzbekDate, DAILY_PUZZLES } from '@/data/dailyPuzzlesData';
import ScaleBalanceVisual from '@/components/puzzle/ScaleBalanceVisual';
import EquationVisual from '@/components/puzzle/EquationVisual';
import DetectiveCluesVisual from '@/components/puzzle/DetectiveCluesVisual';
import Scratchpad from '@/components/puzzle/Scratchpad';
import DailyPuzzleCelebrationModal from '@/components/puzzle/DailyPuzzleCelebrationModal';
import {
  Brain,
  Sparkles,
  Flame,
  Coins,
  Award,
  Clock,
  ArrowLeft,
  Lightbulb,
  Edit3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Calendar,
  Lock,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyPuzzlePage() {
  const {
    progress,
    setGrade,
    getDailyPuzzleRecord,
    submitDailyPuzzle,
    dailyPuzzleStreak,
    isTodayPuzzleSolved,
    openAiAssistant,
  } = useGame();

  const currentGrade = progress.grade || 1;
  const todayStr = getTodayDateString();
  const readableDate = formatUzbekDate(todayStr);

  const [activeGrade, setActiveGrade] = useState<GradeLevel>(currentGrade);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [wrongAttemptNotice, setWrongAttemptNotice] = useState<string | null>(null);

  // Sync activeGrade with progress grade
  useEffect(() => {
    setActiveGrade(progress.grade);
  }, [progress.grade]);

  // Retrieve today's record for this grade
  const todayRecord = getDailyPuzzleRecord(todayStr);
  const puzzle = getDailyPuzzleForDate(todayStr, activeGrade);

  // If already solved for today, set states
  useEffect(() => {
    if (todayRecord?.solved) {
      setSelectedOption(todayRecord.selectedOptionIndex);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
      setWrongAttemptNotice(null);
    }
  }, [todayRecord, activeGrade]);

  // Countdown to next puzzle (Midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectOption = (index: number) => {
    if (todayRecord?.solved) return;
    setSelectedOption(index);
    setWrongAttemptNotice(null);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !puzzle || todayRecord?.solved) return;

    const isCorrect = selectedOption === puzzle.correctOptionIndex;

    const recorded = submitDailyPuzzle({
      puzzleId: puzzle.id,
      optionIndex: selectedOption,
      isCorrect,
      rewardCoins: puzzle.rewardCoins,
      rewardXp: puzzle.rewardXp,
      usedHint: showHint,
    });

    if (isCorrect) {
      setIsSubmitted(true);
      setShowCelebrationModal(true);
    } else {
      setWrongAttemptNotice(
        'Javobingiz to‘g‘ri chiqmadi. Shercha maslahatini (yordam) ochib ko‘ring yoki yana bir bor tahlil qiling!'
      );
    }
  };

  const isSolved = Boolean(todayRecord?.solved);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 max-w-5xl mx-auto px-2 sm:px-4">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-amber-200 dark:border-zinc-700 text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-zinc-750 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Bosh sahifaga</span>
        </Link>

        {/* Date and Grade switcher */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs font-black text-amber-900 dark:text-amber-200">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{readableDate}</span>
          </div>

          {/* Grade selection */}
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-850 p-1 rounded-2xl border-2 border-amber-200 dark:border-zinc-700 shadow-xs">
            {([1, 2, 3, 4] as GradeLevel[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setActiveGrade(g);
                  setGrade(g);
                }}
                className={`px-2.5 py-1 text-xs font-black rounded-xl transition ${
                  activeGrade === g
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-600'
                }`}
              >
                {g}-sinf
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-yellow-200">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Kunlik Intellektual Sinov (1 kunda 1 dona)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              <span>Kun Boshqotirmasi 🧩</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-amber-100 max-w-xl">
              Oddiy testlardan farqli o‘laroq, bu yerda Prezident maktabiga xos chuqur mantiq,
              deduksiya va noan‘anaviy masalalar beriladi!
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="flex flex-col items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-center">
              <div className="flex items-center gap-1 text-amber-200 text-xs font-extrabold">
                <Flame className="w-4 h-4 text-orange-300 fill-orange-400 animate-pulse" />
                <span>Streak</span>
              </div>
              <span className="text-lg font-black">{dailyPuzzleStreak} kun</span>
            </div>

            <div className="flex flex-col items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-center">
              <div className="flex items-center gap-1 text-yellow-200 text-xs font-extrabold">
                <Coins className="w-4 h-4 text-yellow-300 fill-yellow-400" />
                <span>Mukofot</span>
              </div>
              <span className="text-lg font-black">+{puzzle.rewardCoins} 🪙</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solved Status & Countdown Card if already solved */}
      {isSolved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 dark:bg-emerald-950/40 border-3 border-emerald-300 dark:border-emerald-800 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-200">
                Bugungi boshqotirma muvaffaqiyatli yechildi! 🎉
              </h3>
              <p className="text-xs font-bold text-emerald-800/80 dark:text-emerald-400">
                Siz +{puzzle.rewardCoins} tanga va +{puzzle.rewardXp} XP yutib oldingiz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setShowCelebrationModal(true)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-extrabold text-xs sm:text-sm hover:scale-105 transition flex items-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Yechim sirini ko‘rish</span>
            </button>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 bg-emerald-900 text-white px-3.5 py-2 rounded-xl font-mono text-xs sm:text-sm font-black shadow-xs">
              <Clock className="w-4 h-4 text-emerald-300 animate-spin-slow" />
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Puzzle Card Main Workspace */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-8 border-4 border-amber-200 dark:border-zinc-800 shadow-xl space-y-6">
        {/* Category & Difficulty Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b-2 border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-black uppercase tracking-wider">
              {puzzle.categoryTitle}
            </span>
            <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500">
              {puzzle.grade}-sinf dasturi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              {'⭐'.repeat(puzzle.difficultyStars)} {puzzle.difficultyLabel}
            </span>
            <button
              onClick={() => setShowScratchpad(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-zinc-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-zinc-700 text-xs font-black flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-zinc-700 transition"
              title="Qoralama taxtasida chizish va hisoblash"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-500" />
              <span>Qoralama 📝</span>
            </button>
          </div>
        </div>

        {/* Puzzle Title & Story */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {puzzle.title}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {puzzle.story}
          </p>
        </div>

        {/* Visual Puzzle Area */}
        <div className="bg-zinc-50/70 dark:bg-zinc-850/60 p-4 sm:p-6 rounded-3xl border-2 border-amber-150 dark:border-zinc-750">
          {puzzle.visualData.type === 'scale' && puzzle.visualData.scales && (
            <ScaleBalanceVisual scales={puzzle.visualData.scales} />
          )}

          {puzzle.visualData.type === 'equation' && puzzle.visualData.equations && (
            <EquationVisual equations={puzzle.visualData.equations} />
          )}

          {puzzle.visualData.type === 'clues' && puzzle.visualData.clues && (
            <DetectiveCluesVisual clues={puzzle.visualData.clues} />
          )}
        </div>

        {/* Prompt Question */}
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700/60">
          <h3 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-200">
            ❓ Savol: {puzzle.questionPrompt}
          </h3>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {puzzle.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === puzzle.correctOptionIndex;
            const showCorrectStyle = isSolved && isCorrect;
            const showWrongStyle = isSubmitted && isSelected && !isCorrect;

            let borderClass = 'border-zinc-200 dark:border-zinc-750 hover:border-amber-400';
            let bgClass = 'bg-white dark:bg-zinc-800';

            if (showCorrectStyle) {
              borderClass = 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40';
            } else if (showWrongStyle) {
              borderClass = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40';
            } else if (isSelected) {
              borderClass = 'border-orange-500 ring-2 ring-orange-400/40 bg-orange-50/60 dark:bg-zinc-750';
            }

            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: isSolved ? 1 : 0.98 }}
                onClick={() => handleSelectOption(idx)}
                disabled={isSolved}
                className={`p-4 rounded-2xl border-3 text-left transition-all flex items-start gap-3 relative ${borderClass} ${bgClass}`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 ${
                    showCorrectStyle
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : isSelected
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-zinc-300 dark:border-zinc-600 text-zinc-500'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>

                <div className="flex-1">
                  <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 block">
                    {opt.text}
                  </span>
                  {opt.subtext && isSolved && (
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5 block">
                      {opt.subtext}
                    </span>
                  )}
                </div>

                {showCorrectStyle && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Wrong attempt alert notice if any */}
        {wrongAttemptNotice && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{wrongAttemptNotice}</span>
          </motion.div>
        )}

        {/* Hint (Shercha Maslahati) Toggle Card */}
        <div className="bg-amber-50/70 dark:bg-zinc-800/60 p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200 hover:text-orange-600 transition"
            >
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Shercha Maslahati (Yordam / Hint)</span>
              <span className="text-xs text-zinc-400">
                {showHint ? '▲ Yashirish' : '▼ Ko‘rish'}
              </span>
            </button>

            <span className="text-[11px] font-bold text-zinc-400">
              Javobni aytmaydi, fikrlashga yo‘naltiradi
            </span>
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-amber-200 dark:border-zinc-700"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl">🦁💬</span>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100 italic">
                      "{puzzle.hint}"
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        openAiAssistant({
                          question: `${puzzle.title}: ${puzzle.story} Savol: ${puzzle.questionPrompt}`,
                          subject: 'Mantiqiy Boshqotirma',
                          topic: puzzle.hint,
                          grade: activeGrade,
                        })
                      }
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-xs shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>🦁</span>
                      <span>Shercha bilan mantiqiy fikrlash</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-semibold text-zinc-400 text-center sm:text-left">
            {isSolved ? (
              <span>Ertaga soat 00:00 da yangi boshqotirma kutmoqda!</span>
            ) : (
              <span>1 kunda 1 dona jumboq beriladi. Shoshilmasdan tahlil qiling!</span>
            )}
          </div>

          {!isSolved ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base shadow-lg transition flex items-center justify-center gap-2 ${
                selectedOption !== null
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-orange-500/30'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <span>Javobni tekshirish</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <button
              onClick={() => setShowCelebrationModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:scale-103 transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Yechim siri va Tahlilni o‘qish</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Scratchpad Modal */}
      <Scratchpad isOpen={showScratchpad} onClose={() => setShowScratchpad(false)} />

      {/* Celebration & Solution Modal */}
      <DailyPuzzleCelebrationModal
        isOpen={showCelebrationModal}
        onClose={() => setShowCelebrationModal(false)}
        puzzle={puzzle}
        streak={dailyPuzzleStreak}
      />
    </div>
  );
}
