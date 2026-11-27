'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Swords,
  ChevronRight,
  Flame,
  Star,
  GraduationCap,
} from 'lucide-react';
import { SUBJECTS } from '@/data/mockData';

const UPCOMING_LESSONS_PREVIEW = [
  {
    id: 'math',
    title: 'Matematika',
    icon: '📐',
    desc: 'Prezident maktabiga xos oson va tez hisoblash usullari, geometrik sirlar hamda tenglamalar.',
    topics: ['Sonlar pillapoyasi', 'Tezkor karra jadvali', 'Geometrik shakllar sehri', 'Mantiqiy amallar'],
    accent: 'from-blue-500 to-indigo-600',
    badge: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'logic',
    title: 'Muammoli masalalar',
    icon: '🧩',
    desc: 'Hayotiy vaziyatlar, qiziqarli jumboqlar va mantiqiy chalkashliklarni yechish mahorati.',
    topics: ['O‘rmon hayvonlari poygasi', 'Tarozi va og‘irlik sirlari', 'Soat va vaqt hisobi', 'Yo‘l va tezlik jumboqlari'],
    accent: 'from-amber-500 to-orange-600',
    badge: 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'critical',
    title: 'Tanqidiy fikrlash',
    icon: '💡',
    desc: 'Ketma-ketliklarni topish, ortiqcha narsani ajratish, fazoviy shakllar va chuqur tahlil sirlari.',
    topics: ['Sehrli naqshlar ketma-ketligi', 'Fazoviy kubiklar aylanishi', 'Ortiqchasini top', 'Qonuniyatni aniqlash'],
    accent: 'from-emerald-500 to-teal-600',
    badge: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'english',
    title: 'Ingliz tili',
    icon: '🇬🇧',
    desc: 'Prezident maktabi uchun ingliz tili: yangi so‘zlar, qiziqarli grammatika va quvnoq listening mashqlari.',
    topics: ['Numbers & Animals', 'School & Classroom', 'My Family & Friends', 'Colors & Shapes'],
    accent: 'from-purple-500 to-pink-600',
    badge: 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
  },
];

export default function LessonsPage() {
  const [showSyllabus, setShowSyllabus] = useState(false);

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Top Banner with "Tez kunda" indicator */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-yellow-100">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>Yangi Bo‘lim • Tez Kunda</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3 flex-wrap">
              <span>Video Darslar Olami</span>
              <span className="text-2xl sm:text-3xl">🎬</span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider bg-white text-orange-600 px-3 py-1 rounded-xl shadow-md">
                Tez kunda
              </span>
            </h1>

            <p className="text-amber-100 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
              Prezident maktabiga tayyorgarlik uchun animatsion va qiziqarli videodarslar bo‘limi tayyorlanmoqda.
            </p>
          </div>

          {/* Quick badge box */}
          <div className="bg-white/15 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/25 flex items-center gap-3.5 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              🦁
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
                Shercha studiyasi
              </div>
              <div className="text-sm font-black text-white">
                Darslar tasvirga olinmoqda 🎥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Friendly "Tez kunda" Hero Card */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border-2 border-amber-300 dark:border-zinc-700 shadow-xl text-center relative overflow-hidden"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Animated Lion & Clapperboard */}
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-400 flex items-center justify-center text-5xl sm:text-6xl shadow-xl shadow-orange-500/25 mx-auto animate-bounce duration-1000">
              🦁
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-amber-300 dark:border-zinc-700 flex items-center justify-center text-xl shadow-md">
              🎬
            </div>
          </div>

          {/* Main Title & Message */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Jarayon qizg‘in davom etmoqda</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              Videodarslar tez kunda! 🚀
            </h2>

            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base font-medium leading-relaxed max-w-xl mx-auto">
              Hozir ustozlarimiz bilan eng qiziqarli videodarslarni tayyorlayapmiz. Ungacha testlar va mantiqiy o‘yinlarni sinab ko‘ring!
            </p>
          </div>

          {/* Highlights / Features coming soon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="bg-amber-50/70 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-amber-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                  5–7 daqiqalik darslar
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Zeriktirmaydigan qisqa, aniq va animatsion tushuntirishlar.
              </p>
            </div>

            <div className="bg-amber-50/70 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-amber-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                  +1 🔥 Har bir dars uchun
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Darsni ko‘rib, olovcha energiyangizni oshirasiz.
              </p>
            </div>

            <div className="bg-amber-50/70 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-amber-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                  Prezident maktabi sirlari
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Kuchli repetitorlar tomonidan saralangan masalalar.
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/quiz"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition active:scale-95 cursor-pointer"
            >
              <span>Testlar yechishni boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tournament"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-black text-sm rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 transition active:scale-95 cursor-pointer"
            >
              <Swords className="w-4 h-4 text-orange-500" />
              <span>Shashka o‘ynash 🏁</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              <span>Bosh sahifaga qaytish</span>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Upcoming Curriculum Preview Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              📚
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                Tayyorlanayotgan Fanlar va Darslar
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Prezident maktabiga kirish imtihonlari dasturi asosida tuzilmoqda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSyllabus(!showSyllabus)}
            className="text-xs font-black text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
          >
            {showSyllabus ? 'Yashirish ▲' : 'Batafsil ko‘rish ▼'}
          </button>
        </div>

        {/* 4 Subject Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING_LESSONS_PREVIEW.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-amber-400 dark:hover:border-zinc-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-2xl shadow-sm">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badge}`}>
                    Tez kunda
                  </span>
                </div>

                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-4">
                  {item.desc}
                </p>

                {showSyllabus && (
                  <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in">
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">
                      Rejadagi mavzular:
                    </span>
                    {item.topics.map((top, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{top}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-auto">
                <Link
                  href={`/quiz?subject=${item.id === 'logic' ? 'muammoli-masalalar' : item.id === 'critical' ? 'tanqidiy-fikrlash' : item.id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-amber-900 dark:text-amber-200 text-xs font-black transition cursor-pointer"
                >
                  <span>Mavzu bo‘yicha test yechish</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
