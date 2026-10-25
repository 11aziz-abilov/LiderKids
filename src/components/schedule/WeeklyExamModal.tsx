'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { getWeeklyExamQuestions } from '@/data/weeklyScheduleConfig';
import { QuizQuestion, SubjectId } from '@/types';
import { WeeklyExamResult, WeeklyExamSubjectScore } from '@/types/schedule';
import { SUBJECTS } from '@/data/mockData';
import { triggerConfetti } from '@/components/ConfettiEffect';
import { sound } from '@/utils/sound';
import { getTashkentTodayDateString } from '@/utils/tashkentTime';
import {
  X,
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WeeklyExamModal({ isOpen, onClose }: Props) {
  const {
    progress,
    currentWeekId,
    saveWeeklyExamResult,
    getWeeklyExamResult,
  } = useGame();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Javoblar xaritasi: questionId -> { isCorrect: boolean; selectedIndex: number; question: QuizQuestion }
  const [userAnswers, setUserAnswers] = useState<
    Record<string, { isCorrect: boolean; selectedIndex: number; question: QuizQuestion }>
  >({});

  const [isFinished, setIsFinished] = useState(false);
  const existingResult = getWeeklyExamResult(currentWeekId);

  // Savollarni yuklash
  useEffect(() => {
    if (isOpen) {
      const qList = getWeeklyExamQuestions(progress.grade);
      setQuestions(qList);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setUserAnswers({});
      setIsFinished(false);
    }
  }, [isOpen, progress.grade]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const subjectInfo = SUBJECTS.find((s) => s.id === currentQ?.subjectId);

  const handleSelectOption = (index: number) => {
    if (isSubmitted || !currentQ) return;
    setSelectedOption(index);
    setIsSubmitted(true);

    const isCorrect = index === currentQ.correctAnswerIndex;
    if (progress.soundEnabled) {
      if (isCorrect) sound.playCorrect();
      else sound.playIncorrect();
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        isCorrect,
        selectedIndex: index,
        question: currentQ,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Test yakunlandi
      finishExam();
    }
  };

  const finishExam = () => {
    const subjectsList: SubjectId[] = ['math', 'logic', 'critical', 'english'];
    const scoresBySubject: Record<SubjectId, WeeklyExamSubjectScore> = {
      math: { subjectId: 'math', subjectTitle: 'Matematika', score: 0, total: 5, percentage: 0 },
      logic: { subjectId: 'logic', subjectTitle: 'Muammoli masalalar', score: 0, total: 5, percentage: 0 },
      critical: { subjectId: 'critical', subjectTitle: 'Tanqidiy fikrlash', score: 0, total: 5, percentage: 0 },
      english: { subjectId: 'english', subjectTitle: 'Ingliz tili', score: 0, total: 5, percentage: 0 },
    };

    let totalScore = 0;
    const weakTopicsSet = new Set<string>();

    Object.values(userAnswers).forEach((ans) => {
      const subj = ans.question.subjectId;
      if (scoresBySubject[subj]) {
        if (ans.isCorrect) {
          scoresBySubject[subj].score += 1;
          totalScore += 1;
        } else {
          // Xato qilingan mavzu
          if (ans.question.topic) {
            weakTopicsSet.add(ans.question.topic);
          }
        }
      }
    });

    subjectsList.forEach((s) => {
      scoresBySubject[s].percentage = Math.round(
        (scoresBySubject[s].score / scoresBySubject[s].total) * 100
      );
    });

    const percentage = Math.round((totalScore / 20) * 100);
    const weakTopics = Array.from(weakTopicsSet);

    const finalResult: WeeklyExamResult = {
      id: `exam-${currentWeekId}-${Date.now()}`,
      weekId: currentWeekId,
      date: getTashkentTodayDateString(),
      grade: progress.grade,
      totalScore,
      maxScore: 20,
      percentage,
      scoresBySubject,
      weakTopics,
      rewardCoins: totalScore * 3, // har bir to'g'ri javobga 3 tanga
      rewardXp: totalScore * 5,
      completedAt: new Date().toISOString(),
    };

    saveWeeklyExamResult(finalResult);
    setIsFinished(true);
    triggerConfetti();
  };

  // Natijalarni hisoblash
  const currentTotalCorrect = Object.values(userAnswers).filter((a) => a.isCorrect).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-purple-400 dark:border-purple-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 p-5 sm:p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                Haftalik Katta Test
              </span>
              <span className="text-xs font-bold text-purple-200">
                {progress.grade}-sinf • 20 ta savol
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Yakshanba Intellektual Sinovi 🦁
                </h2>
                <p className="text-purple-100 text-xs sm:text-sm mt-0.5">
                  Shu haftada o‘tilgan barcha 4 ta fan bo‘yicha 5 tadan savol!
                </p>
              </div>

              {!isFinished && questions.length > 0 && (
                <div className="text-right shrink-0">
                  <div className="text-xs uppercase font-extrabold text-purple-200">
                    Savol
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {currentIndex + 1} <span className="text-purple-300 text-sm">/ {questions.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {!isFinished && questions.length > 0 && (
              <div className="w-full bg-white/20 h-2.5 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-300 to-amber-400 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Test Jarayoni yoki Natijalar Ko'rinishi */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {!isFinished && currentQ ? (
              <div className="space-y-6">
                {/* Fan va Mavzu yorlig'i */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-black">
                    <span>{subjectInfo?.title}</span>
                    <span>•</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      {currentQ.topic || 'Haftalik mavzu'}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-zinc-400">
                    Fandagi savol: {(currentIndex % 5) + 1} / 5
                  </span>
                </div>

                {/* Savol matni */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  {currentQ.imageOrEmoji && (
                    <div className="text-3xl sm:text-4xl mb-3 text-center">
                      {currentQ.imageOrEmoji}
                    </div>
                  )}
                  {currentQ.passage && (
                    <div className="mb-3 p-3 bg-white dark:bg-zinc-900 rounded-xl text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic border border-zinc-200 dark:border-zinc-800">
                      "{currentQ.passage}"
                    </div>
                  )}
                  <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>

                {/* Variantlar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((option, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctAnswerIndex;

                    let btnStyle =
                      'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-purple-400 text-zinc-800 dark:text-zinc-200';

                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400';
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          'bg-red-500 text-white border-red-600 shadow-md ring-2 ring-red-400';
                      } else {
                        btnStyle =
                          'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 border-transparent opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 cursor-pointer ${btnStyle} active:scale-98`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isSubmitted && (isCorrect || isSelected)
                              ? 'bg-white/30 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {letters[idx]}
                        </span>
                        <span className="text-sm sm:text-base font-bold flex-1">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Tushuntirish va Keyingi savol */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3"
                  >
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-purple-900 dark:text-purple-200 font-medium">
                      <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Izoh:</strong> {currentQ.explanation}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                      >
                        <span>
                          {currentIndex < questions.length - 1
                            ? 'Keyingi savol'
                            : 'Test natijasini ko‘rish'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : isFinished ? (
              /* Yakuniy Natijalar Ekrani */
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 mx-auto flex items-center justify-center text-4xl shadow-xl">
                  🏆
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
                    Haftalik Test Yakunlandi! 🎉
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                    Umumiy natija: <strong className="text-purple-600 dark:text-purple-400 text-lg">{currentTotalCorrect} / 20 ball</strong> ({Math.round((currentTotalCorrect / 20) * 100)}%)
                  </p>
                </div>

                {/* 4 ta fan bo'yicha batafsil infografika */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {(['math', 'logic', 'critical', 'english'] as SubjectId[]).map((subjId) => {
                    const subj = SUBJECTS.find((s) => s.id === subjId);
                    // Ushbu fanga tegishli savollar bo'yicha to'g'ri javoblar
                    const subjCorrect = Object.values(userAnswers).filter(
                      (a) => a.question.subjectId === subjId && a.isCorrect
                    ).length;
                    const percent = Math.round((subjCorrect / 5) * 100);

                    return (
                      <div
                        key={subjId}
                        className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-zinc-800 dark:text-zinc-200">
                            {subj?.title}
                          </span>
                          <span
                            className={
                              subjCorrect >= 4
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }
                          >
                            {subjCorrect} / 5 ({percent}%)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              subjCorrect >= 4
                                ? 'bg-emerald-500'
                                : subjCorrect >= 2
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Zaif mavzular bo'limi */}
                {Object.values(userAnswers).filter((a) => !a.isCorrect).length > 0 && (
                  <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-left space-y-2">
                    <h4 className="text-xs font-black uppercase text-orange-700 dark:text-orange-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Qayta takrorlash tavsiya etiladigan mavzular (Zaif mavzular):
                    </h4>
                    <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                      {Array.from(
                        new Set(
                          Object.values(userAnswers)
                            .filter((a) => !a.isCorrect && a.question.topic)
                            .map((a) => a.question.topic!)
                        )
                      ).map((topic, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-center pt-2">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl transition hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Bosh sahifaga qaytish ✨
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
