'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { GradeLevel } from '@/types';
import { Flame, Coins, Volume2, VolumeX, BookOpen, CheckCircle2, Trophy, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const { progress, setGrade, toggleSound } = useGame();

  const navLinks = [
    { href: '/', label: 'Bosh sahifa', icon: Crown },
    { href: '/quiz', label: 'Testlar', icon: CheckCircle2 },
    { href: '/lessons', label: 'Darslar', icon: BookOpen },
    { href: '/achievements', label: 'Yutuqlar', icon: Trophy },
  ];

  const grades: GradeLevel[] = [1, 2, 3, 4];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b-2 border-amber-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md text-2xl"
            >
              🦁
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-amber-500 group-hover:text-amber-600 transition-colors">
                Lider<span className="text-orange-500">Kids</span>
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest -mt-1 hidden sm:block">
                Prezident Maktabiga Tayyorlov
              </span>
            </div>
          </Link>

          {/* Sinf Tanlash (Grades 1-4) */}
          <div className="flex items-center bg-amber-50 dark:bg-zinc-800/80 p-1.5 rounded-2xl border-2 border-amber-200 dark:border-zinc-700">
            <span className="text-xs font-black text-amber-900 dark:text-amber-200 px-2 hidden md:inline">
              Sinf:
            </span>
            <div className="flex gap-1">
              {grades.map((g) => {
                const isActive = progress.grade === g;
                return (
                  <motion.button
                    key={g}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setGrade(g)}
                    className={`px-3 py-1 text-xs sm:text-sm font-extrabold rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-600 hover:bg-white/60 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    {g}-sinf
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Mukofotlar & Sozlamalar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Coins */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-2xl border-2 border-amber-300 dark:border-amber-700 shadow-sm"
              title="Sizning tangalaringiz"
            >
              <Coins className="w-5 h-5 text-amber-500 fill-amber-400 animate-spin-slow" />
              <span className="font-black text-sm sm:text-base">{progress.coins}</span>
            </motion.div>

            {/* Streaks / Fire */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 bg-orange-100/80 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 px-3 py-1.5 rounded-2xl border-2 border-orange-300 dark:border-orange-700 shadow-sm"
              title="Ko‘rilgan video darslar / Olovcha"
            >
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="font-black text-sm sm:text-base">{progress.streaks}</span>
            </motion.div>

            {/* Ovoz tugmasi */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleSound}
              className={`p-2 rounded-2xl border-2 transition-all ${
                progress.soundEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400'
              }`}
              title={progress.soundEnabled ? "Ovoz yoqilgan" : "Ovoz o‘chirilgan"}
            >
              {progress.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs (Pastki qator) */}
        <nav className="flex items-center justify-center sm:justify-start gap-2 py-2 overflow-x-auto border-t border-zinc-100 dark:border-zinc-800/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
