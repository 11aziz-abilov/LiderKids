'use client';

import React, { useState } from 'react';
import MascotLion from '@/components/MascotLion';
import SubjectCard from '@/components/SubjectCard';
import DailyQuests from '@/components/DailyQuests';
import { useGame } from '@/context/GameContext';
import { SUBJECTS, QUIZ_QUESTIONS, LESSONS } from '@/data/mockData';
import { MOCK_LEADERBOARD_STUDENTS } from '@/data/leaderboardData';
import { Sparkles, Trophy, Flame, Coins, Edit3, Check, Star, User, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const { progress, setName, setIsRegistrationModalOpen, setIsProfileModalOpen } = useGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.name);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>Prezident Maktabiga 1-qadam</span>
            </div>

            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-2xl sm:text-3xl font-black bg-white/30 text-white placeholder-white/70 px-3 py-1 rounded-xl outline-none focus:ring-2 focus:ring-white"
                    placeholder="Ismingizni kiriting"
                    maxLength={15}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition"
                  >
                    <Check className="w-5 h-5 font-black" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                    Salom, {progress.name}! 👋
                  </h1>
                  <button
                    onClick={() => {
                      setTempName(progress.name);
                      setIsEditingName(true);
                    }}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition text-white"
                    title="Ismni o‘zgartirish"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-amber-100 text-sm sm:text-base font-medium max-w-xl">
              Prezident maktabiga tayyorgarlik sari bugungi intellektual sarguzashtimizga xush kelibsiz! Testlar yeching, tangalar to‘plang va Sherchangizni rivojlantiring!
            </p>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shadow">
                🪙
              </div>
              <div>
                <div className="text-xs font-bold text-amber-100 uppercase">Jami tangalar</div>
                <div className="text-xl font-black">{progress.coins} ta</div>
              </div>
            </div>

            <div className="flex-1 md:flex-none flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow">
                🔥
              </div>
              <div>
                <div className="text-xs font-bold text-amber-100 uppercase">Olovchalar (Streak)</div>
                <div className="text-xl font-black">{progress.streaks} ta</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Callout / Active Profile Bar */}
      {!progress.profile?.isRegistered ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 border-2 border-dashed border-amber-400 dark:border-amber-600 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md shrink-0">
              🦁
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <span>Hali ro‘yxatdan o‘tmadingizmi?</span>
                <span className="bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  +100 🪙 Bonus!
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
                Ism, familiya, telefon va karta ma‘lumotlarini kiritib, barcha darslar va sovrinlarga ega bo‘ling!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="shrink-0 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md transition hover:scale-105 active:scale-95"
          >
            Hozir Ro‘yxatdan O‘tish ✨
          </button>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border-2 border-amber-200/80 dark:border-zinc-800 rounded-2xl p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-zinc-600 dark:text-zinc-400 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl text-xs font-black">
              <Check className="w-3.5 h-3.5" />
              <span>Ro‘yxatdan o‘tgan</span>
            </span>
            <span>•</span>
            <span className="text-amber-800 dark:text-amber-200 font-extrabold">
              {progress.grade}-sinf ({progress.profile.academicYear || "2026-2027"})
            </span>
            <span>•</span>
            <span className="text-zinc-800 dark:text-zinc-200">
              {progress.profile.region}{progress.profile.district ? `, ${progress.profile.district}` : ''}
            </span>
            <span>•</span>
            <span className="font-mono text-zinc-800 dark:text-zinc-200">
              Karta: {progress.profile.cardNumber.slice(0, 4)} ••••
            </span>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="text-amber-600 dark:text-amber-400 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <span>Profilni ko‘rish & sozlash</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Mascot Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦁</span>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
              Sening Sherchang (Qahramon)
            </h2>
          </div>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {progress.grade}-sinf bosqichi
          </span>
        </div>
        <MascotLion />
      </section>

      {/* 3 Main Directions (Subjects) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                Asosiy o‘quv yo‘nalishlari
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Prezident maktabi imtihonlariga tushuvchi asosiy 3 ta fan va ko‘nikmalar
            </p>
          </div>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 hover:text-amber-700 underline underline-offset-4"
          >
            <span>Barcha testlarni ko‘rish</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBJECTS.map((subject) => {
            const subjectQuestions = QUIZ_QUESTIONS.filter(
              (q) => q.subjectId === subject.id && q.grade === progress.grade
            );
            const subjectLessons = LESSONS.filter((l) => l.subjectId === subject.id);
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                questionCount={subjectQuestions.length}
                lessonCount={subjectLessons.length}
              />
            );
          })}
        </div>
      </section>

      {/* Daily Quests & Motivational Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyQuests />
        </div>

        {/* Motivational Sidebar */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl mb-4">
              🎯
            </div>
            <h3 className="text-2xl font-black mb-2">Prezident Maktabiga Tayyorlov Sirlari</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4">
              Har kuni 15 daqiqa muammoli masalalar yechish va mantiqiy fikrlash orqali siz o‘z iqtidoringizni 3 baravar oshirasiz!
            </p>
            <div className="space-y-2 text-xs font-semibold text-indigo-100">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>Har bir to‘g‘ri test: +10 🪙</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-300 fill-orange-300" />
                <span>Har bir video dars: +1 🔥</span>
              </div>
            </div>
          </div>

          <Link
            href="/quiz"
            className="mt-6 w-full py-3 bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-center rounded-2xl shadow-md transition-transform hover:scale-[1.02]"
          >
            Mashg‘ulotni boshlash 🚀
          </Link>
        </div>
      </section>

      {/* Top Leaders by Flames (Olovchalar Reytingi Preview) */}
      <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-zinc-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>Olovchalar Reytingi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              Haftaning Eng Kuchli Liderlari 🔥
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Barcha viloyatlar bo‘yicha eng ko‘p olovcha (streak) to‘plagan yosh iqtidorlar
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Trophy className="w-4 h-4" />
            <span>Barcha Liderlar Reytingi</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Top 3 Mock Students */}
          {MOCK_LEADERBOARD_STUDENTS.slice(0, 3).map((student, idx) => (
            <div
              key={student.id}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                idx === 0
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700 shadow-sm'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${
                  idx === 0
                    ? 'bg-amber-400 text-amber-950 shadow-sm'
                    : idx === 1
                    ? 'bg-slate-300 text-slate-800'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-sm text-zinc-900 dark:text-white truncate">
                  {student.name}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {student.grade}-sinf • {student.region}
                </p>
              </div>
              <div className="flex items-center gap-1 font-black text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/80 px-2.5 py-1 rounded-xl shrink-0">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{student.streaks}</span>
              </div>
            </div>
          ))}

          {/* Current User Card */}
          <div className="p-4 rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 shadow-sm flex items-center gap-3 ring-2 ring-amber-400/20">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
              Siz
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-sm text-zinc-900 dark:text-white truncate">
                {progress.profile ? `${progress.profile.firstName} ${progress.profile.lastName}` : progress.name}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {progress.grade}-sinf • {progress.profile?.region || 'O‘zbekiston'}
              </p>
            </div>
            <div className="flex items-center gap-1 font-black text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/80 px-2.5 py-1 rounded-xl shrink-0">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>{progress.streaks}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
