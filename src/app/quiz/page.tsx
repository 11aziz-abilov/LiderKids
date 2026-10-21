'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { QUIZ_QUESTIONS, SUBJECTS } from '@/data/mockData';
import { SubjectId, QuizQuestion, SmsMessage, GradeLevel, DifficultyLevel } from '@/types';
import { sound } from '@/utils/sound';
import { smsService } from '@/utils/smsService';
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
  Smartphone,
  MessageSquare,
  Check,
  BookOpen,
  GraduationCap,
  Layers,
  BarChart3,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject') as SubjectId | null;

  const {
    progress,
    addCoins,
    markQuizCompleted,
    sendQuizReportSms,
    setIsSmsModalOpen,
    updateLastActiveDate,
    openAiAssistant,
  } = useGame();

  const userGrade: GradeLevel = progress.grade || 4;
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    subjectParam || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [floatingCoin, setFloatingCoin] = useState(false);
  const [sentSms, setSentSms] = useState<SmsMessage | null>(null);

  // Filter questions for the user's grade, subject, and difficulty level
  const filteredQuestions: QuizQuestion[] = QUIZ_QUESTIONS.filter((q) => {
    const gradeMatch = q.grade === userGrade;
    const subjectMatch = selectedSubject === 'all' || q.subjectId === selectedSubject;
    const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return gradeMatch && subjectMatch && difficultyMatch;
  });

  // Reset quiz state when subject, grade, or difficulty changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setEarnedCoins(0);
    setQuizFinished(false);
    setSentSms(null);
  }, [selectedSubject, userGrade, selectedDifficulty]);

  const currentQ = filteredQuestions[currentQuestionIndex];

  // Coin reward based on question difficulty: Oson (30), O'rta (50), Qiyin (80)
  const questionCoins =
    currentQ?.difficulty === 'qiyin' ? 80 : currentQ?.difficulty === 'o‘rta' ? 50 : 30;

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setEarnedCoins((prev) => prev + questionCoins);
      addCoins(questionCoins);
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
      updateLastActiveDate();

      const currentSubInfo = SUBJECTS.find((s) => s.id === selectedSubject);
      const subjectTitle = currentSubInfo
        ? currentSubInfo.title
        : selectedSubject === 'all'
        ? 'Barcha fanlar'
        : selectedSubject;

      sendQuizReportSms({
        score,
        totalQuestions: filteredQuestions.length,
        earnedCoins,
        subjectTitle: `${userGrade}-sinf • ${subjectTitle}`,
      }).then((sms) => {
        if (sms) setSentSms(sms);
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setEarnedCoins(0);
    setQuizFinished(false);
    setSentSms(null);
  };

  const difficultyList: { id: DifficultyLevel | 'all'; label: string; icon: string; color: string }[] = [
    { id: 'all', label: 'Barchasi', icon: '⚡', color: 'border-zinc-300 dark:border-zinc-700' },
    { id: 'oson', label: 'Oson', icon: '🟢', color: 'border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300' },
    { id: 'o‘rta', label: 'O‘rta', icon: '🟡', color: 'border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300' },
    { id: 'qiyin', label: 'Qiyin', icon: '🔴', color: 'border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300' },
  ];

  // Render Filter Card
  const renderFilterCard = () => (
    <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm space-y-4">
      {/* 1. FAN KESIMI */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-200">
          <Layers className="w-4 h-4 text-emerald-500" />
          <span>Fan bo‘yicha:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Barchasi
          </button>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedSubject === s.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2. QIYINCHILIK DARAJASI */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-200">
          <BarChart3 className="w-4 h-4 text-violet-500" />
          <span>Qiyinchilik darajasi:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {difficultyList.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDifficulty(d.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedDifficulty === d.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 scale-105'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent'
              }`}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}

          {/* User Grade & Question count badge */}
          <span className="ml-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{userGrade}-sinf • {filteredQuestions.length} ta savol</span>
          </span>
        </div>
      </div>
    </div>
  );

  // If no questions match the current combination
  if (!currentQ && !quizFinished) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {renderFilterCard()}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-10 border-4 border-amber-200 dark:border-zinc-800 text-center space-y-4">
          <span className="text-5xl">🦁</span>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            Tanlangan filtrlarga mos savol topilmadi!
          </h2>
          <p className="text-zinc-500">
            {userGrade}-sinf uchun boshqa fan yoki qiyinchilik darajasini tanlab ko‘ring.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('all');
              setSelectedDifficulty('all');
            }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-md transition cursor-pointer"
          >
            Barcha savollarni ko‘rsatish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Filters (Sinflar, Fanlar, Qiyinchilik) */}
      {renderFilterCard()}

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
              {userGrade}-sinf • Prezident Maktabi Sari Katta Qadam!
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

          {/* SMS Xabarnoma bloki (Ota-onaga yuborilgan hisobot) */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800/90 dark:to-zinc-800/50 p-5 rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 text-left space-y-3 max-w-lg mx-auto shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center text-base shadow-sm">
                  📱
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>Ota-onaga SMS hisobot</span>
                    {sentSms?.status === 'sent' ? (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                        ✓ Yuborildi
                      </span>
                    ) : (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-extrabold px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
                        {smsService.getConfig().eskizToken ? 'Eskiz API' : 'Simulyatsiya'}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {progress.profile?.parentPhoneNumber
                      ? `${progress.profile?.parentName || 'Ota-ona'} (${progress.profile?.parentPhoneNumber}) raqamiga`
                      : 'Ota-ona raqami kiritilmagan'}
                  </p>
                </div>
              </div>
            </div>

            {sentSms && (
              <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-blue-100 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 font-medium space-y-1">
                <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  SMS matni:
                </div>
                <div className="italic font-mono text-[11px] bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {sentSms.message}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const currentSubInfo = SUBJECTS.find((s) => s.id === selectedSubject);
                  const subjectTitle = currentSubInfo
                    ? currentSubInfo.title
                    : selectedSubject === 'all'
                    ? 'Barcha fanlar'
                    : selectedSubject;
                  const customText = `Hurmatli ota-ona! Farzandingiz ${progress.name} LiderKids platformasida ${userGrade}-sinf ${subjectTitle} testini topshirdi. Natija: ${score}/${filteredQuestions.length} (${Math.round((score / filteredQuestions.length) * 100)}%). Ball: +${earnedCoins} tanga.`;
                  const smsUrl = `sms:${progress.profile?.parentPhoneNumber || ''}?body=${encodeURIComponent(customText)}`;
                  window.location.href = smsUrl;
                }}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>📲 Telefonimdan Real SMS jo‘natish</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSmsModalOpen(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>SMS Markazi & Eskiz sozlamalari</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-2xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
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
                <span>+{questionCoins}</span>
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
                  <Sparkles className="w-4 h-4" /> To‘g‘ri javob: +{questionCoins} 🪙
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
            {/* Meta badges: Subject, Grade, Difficulty, Topic */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5">
                <span>{currentQ.imageOrEmoji || '📚'}</span>
                <span>{SUBJECTS.find((s) => s.id === currentQ.subjectId)?.title || 'Fan'}</span>
              </span>

              <span className="text-xs font-black px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {currentQ.grade}-sinf
              </span>

              {currentQ.difficulty && (
                <span
                  className={`text-xs font-black px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                    currentQ.difficulty === 'oson'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : currentQ.difficulty === 'o‘rta'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                  }`}
                >
                  <span>
                    {currentQ.difficulty === 'oson' ? '🟢 Oson' : currentQ.difficulty === 'o‘rta' ? '🟡 O‘rta' : '🔴 Qiyin'}
                  </span>
                  <span className="text-[10px] opacity-75 font-semibold">({currentQ.difficultyLevel || 1}-daraja)</span>
                </span>
              )}

              {currentQ.topic && (
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  Mavzu: {currentQ.topic}
                </span>
              )}
            </div>

            {/* Reading Passage (if available, e.g. for Reading questions) */}
            {currentQ.passage && (
              <div className="bg-sky-50 dark:bg-sky-950/40 p-4 sm:p-5 rounded-2xl border-2 border-sky-300 dark:border-sky-800 mb-5 text-left shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>O‘qish matni (Reading Passage):</span>
                </div>
                <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {currentQ.passage}
                </p>
              </div>
            )}

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-snug">
              {currentQ.question}
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {currentQ.hint && !isAnswered && (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 w-fit">
                  <HelpCircle className="w-4 h-4" />
                  <span>{currentQ.hint}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  openAiAssistant({
                    question: currentQ.question,
                    subject: currentQ.subjectId,
                    topic: currentQ.hint || currentQ.explanation,
                    grade: currentQ.grade,
                  })
                }
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-xs shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer"
                title="Shercha AI bilan savolni birgalikda tahlil qilish"
              >
                <span>🦁</span>
                <span>Sherchadan tushuntirish so‘rash</span>
              </button>
            </div>
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
                  className={`p-4 sm:p-5 rounded-2xl flex items-center justify-between text-left font-extrabold text-base sm:text-lg transition-all cursor-pointer ${btnStyle}`}
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
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          openAiAssistant({
                            question: currentQ.question,
                            subject: currentQ.subjectId,
                            topic: currentQ.explanation,
                            grade: currentQ.grade,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300 bg-white/80 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 transition shadow-xs cursor-pointer"
                      >
                        <span>🦁 Shercha bilan batafsil suhbatlashish →</span>
                      </button>
                    </div>
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
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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
