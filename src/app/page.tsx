'use client';

import React, { useState } from 'react';
import MascotLion from '@/components/MascotLion';
import SubjectCard from '@/components/SubjectCard';
import DailyQuests from '@/components/DailyQuests';
import { useGame } from '@/context/GameContext';
import { SUBJECTS, QUIZ_QUESTIONS, LESSONS } from '@/data/mockData';
import { Sparkles, Trophy, Flame, Coins, Edit3, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const { progress, setName } = useGame();
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
    </div>
  );
}
