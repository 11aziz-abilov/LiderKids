'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Sparkles,
  Flame,
  Award,
  Star,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Laptop,
  Tablet,
  Watch,
  Scroll,
  Swords,
  Brain,
} from 'lucide-react';

export default function OlympiadPage() {
  const prizes = [
    {
      place: 'Grand Prix',
      title: 'Zamonaviy Noutbuk 💻',
      subtitle: 'Oliy Lider Chempioniga',
      desc: 'Maktab va dasturlash darslari uchun yuqori unumdorlikka ega tezkor noutbuk.',
      gradient: 'from-amber-400 via-yellow-400 to-amber-500',
      badge: 'bg-yellow-500 text-amber-950',
      icon: Laptop,
    },
    {
      place: '1-O‘rin',
      title: 'Katta Ekranli Planshet 📱',
      subtitle: '1-darajali g‘olibga',
      desc: 'Kitob o‘qish, darslar ko‘rish va testlarni maroq bilan yechish uchun planshet.',
      gradient: 'from-orange-500 to-amber-500',
      badge: 'bg-orange-500 text-white',
      icon: Tablet,
    },
    {
      place: '2-O‘rin',
      title: 'Bolalar Smart Soati ⌚',
      subtitle: '2-darajali g‘olibga',
      desc: 'Ota-ona bilan aloqa, qadam hisoblagich va xavfsiz GPS tizimiga ega aqlli soat.',
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'bg-blue-600 text-white',
      icon: Watch,
    },
    {
      place: '3-O‘rin',
      title: 'LiderKids Chempion To‘plami 🎒',
      subtitle: '3-darajali g‘olibga',
      desc: 'Sifatli maktab ryukzaki, metall termos, paxtali kepka va brend ruchkalar to‘plami.',
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-600 text-white',
      icon: Gift,
    },
  ];

  const stages = [
    {
      step: '1-bosqich',
      title: 'Saralash Onlayn Testi',
      time: 'Tez kunda e‘lon qilinadi',
      desc: 'Prezident maktabiga xos 30 ta savoldan iborat onlayn test. Matematika, mantiq va tanqidiy fikrlash sinovi.',
      icon: '📝',
    },
    {
      step: '2-bosqich',
      title: 'Respublika Yarim Finali',
      time: 'Onlayn platformada',
      desc: 'Eng yuqori ball to‘plagan 100 nafar eng kuchli lider o‘quvchilar o‘rtasida tezkor javoblar jangi.',
      icon: '⚡',
    },
    {
      step: '3-bosqich',
      title: 'Katta Final & Taqdirlash',
      time: 'Tantanali bayram',
      desc: 'G‘oliblar noutbuk, planshet, kubok va rasmiy diplomlar bilan tantanali taqdirlanadi.',
      icon: '👑',
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-56 h-56 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-yellow-100">
              <Trophy className="w-4 h-4 text-yellow-200 fill-yellow-200" />
              <span>Respublika Miqyosidagi Bellashuv</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Katta Respublika Olimpiadasi — Tez kunda! 🏆
            </h1>

            <p className="text-amber-100 text-sm sm:text-base font-medium leading-relaxed">
              Tez orada 1–4-sinf o‘quvchilari o‘rtasida katta onlayn olimpiada boshlanadi. Tayyorgarlikni hozirdan boshlang!
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-yellow-100">
              <span className="bg-white/20 px-3 py-1 rounded-full">🎯 1–4-sinflar uchun</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🎁 Qimmatbaho sovg‘alar</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">📜 Rasmiy sertifikat</span>
            </div>
          </div>

          {/* Grand Trophy Visual */}
          <div className="bg-white/15 backdrop-blur-md p-6 rounded-3xl border border-white/25 flex flex-col items-center justify-center text-center shadow-inner shrink-0 self-center lg:self-auto">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-300 to-amber-500 flex items-center justify-center text-5xl shadow-lg shadow-orange-500/30 mb-3 animate-bounce duration-1000">
              🏆
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-100">
              LiderKids Kubogi
            </span>
            <span className="text-lg font-black text-white mt-0.5">
              1-Mavsum • 2026
            </span>
          </div>
        </div>
      </div>

      {/* Main Friendly Announcement Card */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border-2 border-amber-300 dark:border-zinc-700 shadow-xl relative overflow-hidden"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-orange-500" />
            <span>Katta intellektual sarguzasht</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Prezident maktabiga eng kuchli nomzodlar bellashuvi! 🦁
          </h2>

          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Olimpiada savollari Prezident maktablarining haqiqiy saralash imtihonlari andozasida tuziladi. Unda qatnashib, o‘z bilimlaringizni sinab ko‘rishingiz va butun O‘zbekiston bo‘ylab eng kuchli tengdoshlaringiz bilan do‘stona raqobat qilishingiz mumkin.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/quiz"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/25 transition active:scale-95 cursor-pointer"
            >
              <span>Testlar bilan tayyorlanish 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tournament"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-black text-sm rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 transition active:scale-95 cursor-pointer"
            >
              <Swords className="w-4 h-4 text-orange-500" />
              <span>Shashka turnirida bellashish 🏁</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              <span>Bosh sahifa</span>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Prizes Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            🎁
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
              Olimpiada G‘oliblariga Sovg‘alar
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Eng yuqori natija ko‘rsatgan qahramonlar taqdirlanadi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prizes.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-amber-400 dark:hover:border-zinc-700 hover:shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${p.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${p.badge}`}>
                      {p.place}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                    {p.title}
                  </h3>
                  <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 block mt-0.5">
                    {p.subtitle}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Eshikkacha bepul yetkaziladi</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stages Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
              Olimpiada Bosqichlari
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              3 bosqichli adolatli va ochiq intellektual tanlov
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stages.map((st, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{st.icon}</span>
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                  {st.step}
                </span>
              </div>

              <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1">
                {st.title}
              </h3>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mb-2">
                <Calendar className="w-3 h-3" />
                <span>{st.time}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Preparation Tips Box */}
      <section className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:bg-zinc-900/60 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 dark:border-zinc-700 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            🦁
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
              Sherchaning Olimpiada uchun 3 ta Oltin Maslahati:
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              Olimpiadaga hozirdan tayyorgarlik ko‘rib, g‘oliblik imkoniyatingizni 3 barobar oshiring!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-amber-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 font-black text-xs text-zinc-900 dark:text-zinc-100 mb-1">
              <span>🔥</span>
              <span>1. Har kuni 10 ta test</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Muntazam test yechish orqali tezkor hisoblash ko‘nikmangiz avtomatlashadi.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-amber-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 font-black text-xs text-zinc-900 dark:text-zinc-100 mb-1">
              <span>🧩</span>
              <span>2. Kun boshqotirmasi</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Har kuni yangilanadigan mantiqiy jumboqni yechib, +100 tanga va XP yig‘ing.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-amber-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 font-black text-xs text-zinc-900 dark:text-zinc-100 mb-1">
              <span>🏁</span>
              <span>3. Shashkada strategiya</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Tengdoshlar bilan shashka o‘ynash orqali bir necha qadam oldindan fikrlashni o‘rganasiz.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center sm:text-right">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <span>Hozirroq mashg‘ulotni boshlash 🚀</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
