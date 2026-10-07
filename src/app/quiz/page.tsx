'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { QUIZ_QUESTIONS, SUBJECTS } from '@/data/mockData';
import { SubjectId, QuizQuestion } from '@/types';
import { sound } from '@/utils/sound';
import { triggerConfetti } from '@/components/ConfettiEffect';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Home,
  Flame,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject') as SubjectId | null;

  const { progress, addCoins, markQuizCompleted } = useGame();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    subjectParam || 'all'
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [floatingCoin, setFloatingCoin] = useState(false);

  // Filter questions for the current student's grade and subject
  const filteredQuestions: QuizQuestion[] = QUIZ_QUESTIONS.filter((q) => {
    const gradeMatch = q.grade === progress.grade;
    if (selectedSubject === 'all') return gradeMatch;
    return gradeMatch && q.subjectId === selectedSubject;
  });

  // Reset quiz state when subject or grade changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setEarnedCoins(0);
    setQuizFinished(false);
  }, [selectedSubject, progress.grade]);

  const currentQ = filteredQuestions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setEarnedCoins((prev) => prev + 10);
      addCoins(10);
      markQuizCompleted(currentQ.id);

      if (progress.soundEnabled) {
        sound.playCorrect();
      }

      setFloatingCoin(true);
      triggerConfetti();
      setTimeout(() => setFloatingCoin(false), 1500);
    } else {
      if (progress.soundEnabled) {
        sound.playIncorrect();
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < filteredQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (progress.soundEnabled) {
        sound.playVictory();
      }
      triggerConfetti();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setEarnedCoins(0);
    setQuizFinished(false);
  };

  // If no questions match for this grade
  if (!currentQ && !quizFinished) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-10 border-4 border-amber-200 dark:border-zinc-800 text-center space-y-4">
        <span className="text-5xl">🦁</span>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
          Ushbu fan bo‘yicha hozircha savollar tayyorlanmoqda!
        </h2>
        <p className="text-zinc-500">
          Iltimos, boshqa fanni yoki barcha fanlarni tanlab ko‘ring.
        </p>
        <button
          onClick={() => setSelectedSubject('all')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-md"
        >
          Barcha fanlarni tanlash
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Subject Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
            Fan bo‘yicha:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              selectedSubject === 'all'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Hammasi
          </button>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                selectedSubject === s.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* QUIZ FINISHED RESULTS SCREEN */}
      {quizFinished ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border-4 border-amber-300 dark:border-amber-800 shadow-2xl text-center space-y-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-5xl shadow-xl shadow-amber-500/20 animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-4 py-1 rounded-full">
              Prezident Maktabi Sari Katta Qadam!
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
              Ofarin, {progress.name}!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-base max-w-md mx-auto">
              Siz testni ajoyib natija bilan yakunladingiz va Sherchangizni yana bir pog‘onaga yaqinlashtirdingiz!
            </p>
          </div>

          {/* Results Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto py-2">
            <div className="bg-amber-50 dark:bg-zinc-800/80 p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-700">
              <div className="text-xs font-bold text-zinc-500">To‘g‘ri javoblar</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {score} / {filteredQuestions.length}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-zinc-800/80 p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-700">
              <div className="text-xs font-bold text-zinc-500">Qo‘lga kiritildi</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1 flex items-center justify-center gap-1">
                <span>+{earnedCoins}</span>
                <span className="text-xl">🪙</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-amber-50 dark:bg-zinc-800/80 p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-700">
              <div className="text-xs font-bold text-zinc-500">Aniqlik</div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {filteredQuestions.length > 0
                  ? Math.round((score / filteredQuestions.length) * 100)
                  : 0}
                %
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Yana yechish</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-extrabold rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 transition"
            >
              <Home className="w-5 h-5" />
              <span>Bosh sahifaga qaytish</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        /* ACTIVE QUESTION SCREEN */
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border-4 border-amber-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
          {/* Floating Coin animation on correct */}
          <AnimatePresence>
            {floatingCoin && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: 1.5 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 bg-amber-400 text-amber-950 font-black px-6 py-3 rounded-full shadow-2xl border-2 border-yellow-200 text-2xl"
              >
                <span>+10</span>
                <span>🪙</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Header */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
              <span className="text-zinc-500 dark:text-zinc-400">
                Savol {currentQuestionIndex + 1} / {filteredQuestions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
                  <Sparkles className="w-4 h-4" /> To‘g‘ri javob: +10 🪙
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />
            </div>
          </div>

          {/* Question Text Card */}
          <div className="bg-amber-50/60 dark:bg-zinc-800/40 p-6 sm:p-8 rounded-2xl border-2 border-amber-200 dark:border-zinc-700/80 mb-6">
            {currentQ.imageOrEmoji && (
              <div className="text-4xl sm:text-5xl mb-4 select-none animate-pulse">
                {currentQ.imageOrEmoji}
              </div>
            )}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-snug">
              {currentQ.question}
            </h3>

            {currentQ.hint && !isAnswered && (
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 w-fit">
                <HelpCircle className="w-4 h-4" />
                <span>Yordam: {currentQ.hint}</span>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQ.correctAnswerIndex;

              let btnStyle =
                'bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-zinc-750';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md ring-2 ring-emerald-400/50';
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    'bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-900 dark:text-rose-200 shadow-md';
                } else {
                  btnStyle =
                    'bg-zinc-50 dark:bg-zinc-850 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-60';
                }
              }

              const letters = ['A', 'B', 'C', 'D'];

              return (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectOption(index)}
                  disabled={isAnswered}
                  className={`p-4 sm:p-5 rounded-2xl flex items-center justify-between text-left font-extrabold text-base sm:text-lg transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-sm font-black text-zinc-700 dark:text-zinc-300">
                      {letters[index]}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 animate-bounce" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border-2 mb-6 ${
                  selectedAnswer === currentQ.correctAnswerIndex
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {selectedAnswer === currentQ.correctAnswerIndex ? '🎉' : '💡'}
                  </span>
                  <div>
                    <h4 className="font-black text-base">
                      {selectedAnswer === currentQ.correctAnswerIndex
                        ? 'To‘g‘ri javob! Barakalla!'
                        : 'Yechim tushuntirishi:'}
                    </h4>
                    <p className="text-sm font-semibold mt-1">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <span>
                  {currentQuestionIndex + 1 < filteredQuestions.length
                    ? 'Keyingi savol'
                    : 'Natijalarni ko‘rish'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-bold text-zinc-500">
          Savollar yuklanmoqda... 🦁
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
