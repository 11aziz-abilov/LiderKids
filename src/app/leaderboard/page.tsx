'use client';

import React, { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { MOCK_LEADERBOARD_STUDENTS, LeaderboardStudent } from '@/data/leaderboardData';
import { GradeLevel } from '@/types';
import FullBodyLionCharacter from '@/components/FullBodyLionCharacter';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Flame,
  Trophy,
  Medal,
  Crown,
  Search,
  Filter,
  Sparkles,
  MapPin,
  GraduationCap,
  Coins,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export default function LeaderboardPage() {
  const { progress } = useGame();

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Current user object formatted as a Leaderboard student
  const currentUserStudent: LeaderboardStudent = useMemo(() => {
    const isGirl = progress.profile?.gender === 'girl';
    const fullName = progress.profile
      ? `${progress.profile.firstName} ${progress.profile.lastName}`.trim()
      : progress.name;

    return {
      id: 'current-user',
      name: fullName,
      grade: progress.grade,
      gender: isGirl ? 'girl' : 'boy',
      region: progress.profile?.region || 'Toshkent shahri',
      district: progress.profile?.district || 'Yunusobod tumani',
      school: progress.profile?.school || `${progress.grade}-sinf o‘quvchisi`,
      streaks: progress.streaks,
      coins: progress.coins,
      xp: progress.xp,
      badge:
        progress.streaks >= 30
          ? 'Afsonaviy Lider 👑'
          : progress.streaks >= 15
          ? 'Oltin Chempion 🥇'
          : progress.streaks >= 5
          ? 'Faol O‘quvchi ⚡'
          : 'Yangi Lider 🌱',
      equippedOutfit: progress.equippedItems?.outfit,
    };
  }, [progress]);

  // 2. Combine mock students with current user and sort strictly by streaks (flames) desc
  const allStudents = useMemo(() => {
    const list = [...MOCK_LEADERBOARD_STUDENTS, currentUserStudent];
    return list.sort((a, b) => {
      if (b.streaks !== a.streaks) {
        return b.streaks - a.streaks;
      }
      return b.xp - a.xp; // Tie-breaker with XP
    });
  }, [currentUserStudent]);

  // 3. Current user overall rank
  const currentUserRank = useMemo(() => {
    const idx = allStudents.findIndex((s) => s.id === 'current-user');
    return idx !== -1 ? idx + 1 : 1;
  }, [allStudents]);

  // 4. Filtered students list
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // Grade filter
      if (selectedGrade !== 'all' && student.grade !== selectedGrade) {
        return false;
      }

      // Region filter
      if (selectedRegion !== 'all' && student.region !== selectedRegion) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesRegion = student.region.toLowerCase().includes(q);
        const matchesDistrict = student.district.toLowerCase().includes(q);
        if (!matchesName && !matchesRegion && !matchesDistrict) return false;
      }

      return true;
    });
  }, [allStudents, selectedGrade, selectedRegion, searchQuery]);

  // Top 3 Podium Students (from the active filtered list or top 3 overall)
  const topThree = useMemo(() => {
    return filteredStudents.slice(0, 3);
  }, [filteredStudents]);

  // Regions list for filter dropdown
  const uniqueRegions = useMemo(() => {
    const set = new Set(allStudents.map((s) => s.region));
    return Array.from(set);
  }, [allStudents]);

  return (
    <div className="space-y-8 sm:space-y-10 pb-24">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-pulse" />
              <span>Olovchalar Reytingi (Streaks Leaderboard)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3">
              <span>Liderlar Reytingi</span>
              <span>🔥</span>
            </h1>
            <p className="text-orange-100 text-sm sm:text-base font-medium">
              Har kuni uzluksiz bilim olib, testlar yechayotgan va olovchalar (streak) to‘playotgan barcha yosh liderlar reytingi. Eng ko‘p olovcha to‘plagan o‘quvchilar Prezident maktabi yo‘lida eng oldingi o‘rinlarda!
            </p>
          </div>

          {/* User's own Rank Pill Box */}
          <div className="bg-white/15 backdrop-blur-md p-5 rounded-3xl border-2 border-white/25 shadow-inner flex flex-col items-center text-center min-w-[210px] w-full md:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Sizning O‘rningiz
            </span>
            <div className="flex items-center gap-2 text-3xl sm:text-4xl font-black my-1 text-white">
              <span>#{currentUserRank}</span>
              <span className="text-base font-bold text-orange-200">o‘rin</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-200 bg-white/10 px-3 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 text-orange-300 fill-orange-300" />
              <span>{progress.streaks} ta Olovcha</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 3 PODIUM (SHOXSUPA) */}
      {topThree.length >= 3 && (
        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-zinc-800 shadow-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Eng Ko‘p Olovcha To‘plaganlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
              Shon-Sharaf Shoxsupasi 🏆
            </h2>
          </div>

          {/* Podium Grid (2nd, 1st, 3rd) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
            {/* 2-O'RIN (KUMUSH) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="order-2 md:order-1 bg-gradient-to-t from-slate-100 to-slate-50 dark:from-zinc-800 dark:to-zinc-800/60 rounded-3xl p-5 border-2 border-slate-300 dark:border-zinc-700 flex flex-col items-center text-center shadow-md relative"
            >
              <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-800 flex items-center justify-center font-black text-lg shadow-lg border-2 border-white">
                🥈 2
              </div>

              <div className="mt-4 w-20 h-24 flex items-center justify-center">
                <FullBodyLionCharacter
                  size="sm"
                  gender={topThree[1].gender}
                  grade={topThree[1].grade}
                  equipped={{ outfit: topThree[1].equippedOutfit }}
                  action="idle"
                />
              </div>

              <h3 className="font-black text-base sm:text-lg text-zinc-900 dark:text-white mt-2">
                {topThree[1].name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {topThree[1].grade}-sinf • {topThree[1].region}
              </p>

              {/* Flame streak badge */}
              <div className="mt-3 flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-black text-sm rounded-xl border border-orange-200 dark:border-orange-800">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>{topThree[1].streaks} ta Olovcha</span>
              </div>
            </motion.div>

            {/* 1-O'RIN (OLTIN - MARKAZIY VA ENG BALAND) */}
            <motion.div
              whileHover={{ y: -8 }}
              className="order-1 md:order-2 bg-gradient-to-t from-amber-100/90 via-amber-50 to-orange-50 dark:from-zinc-800 dark:to-amber-950/30 rounded-3xl p-6 border-4 border-amber-400 dark:border-amber-600 flex flex-col items-center text-center shadow-xl relative scale-105 z-10"
            >
              {/* Crown on top */}
              <div className="absolute -top-9 text-4xl animate-bounce">
                👑
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-black text-xl shadow-lg border-2 border-white mt-1">
                🥇 1
              </div>

              <div className="mt-3 w-24 h-28 flex items-center justify-center">
                <FullBodyLionCharacter
                  size="sm"
                  gender={topThree[0].gender}
                  grade={topThree[0].grade}
                  equipped={{ outfit: topThree[0].equippedOutfit, hat: 'crown_gold' }}
                  action="wave"
                />
              </div>

              <h3 className="font-black text-lg sm:text-xl text-zinc-900 dark:text-white mt-2">
                {topThree[0].name}
              </h3>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full mt-0.5">
                {topThree[0].badge}
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {topThree[0].grade}-sinf • {topThree[0].region}
              </p>

              {/* Flame streak badge */}
              <div className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-base rounded-2xl shadow-md shadow-orange-500/20">
                <Flame className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-pulse" />
                <span>{topThree[0].streaks} ta Olovcha</span>
              </div>
            </motion.div>

            {/* 3-O'RIN (BRONZA) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="order-3 bg-gradient-to-t from-orange-100/70 to-amber-50 dark:from-zinc-800 dark:to-zinc-800/60 rounded-3xl p-5 border-2 border-amber-300/60 dark:border-zinc-700 flex flex-col items-center text-center shadow-md relative"
            >
              <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-lg shadow-lg border-2 border-white">
                🥉 3
              </div>

              <div className="mt-4 w-20 h-24 flex items-center justify-center">
                <FullBodyLionCharacter
                  size="sm"
                  gender={topThree[2].gender}
                  grade={topThree[2].grade}
                  equipped={{ outfit: topThree[2].equippedOutfit }}
                  action="idle"
                />
              </div>

              <h3 className="font-black text-base sm:text-lg text-zinc-900 dark:text-white mt-2">
                {topThree[2].name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {topThree[2].grade}-sinf • {topThree[2].region}
              </p>

              {/* Flame streak badge */}
              <div className="mt-3 flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-black text-sm rounded-xl border border-orange-200 dark:border-orange-800">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>{topThree[2].streaks} ta Olovcha</span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <section className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border-2 border-amber-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Grade filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-black text-zinc-400 uppercase mr-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Sinf:
            </span>
            {(['all', 1, 2, 3, 4] as (GradeLevel | 'all')[]).map((g) => {
              const isActive = selectedGrade === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-amber-50'
                  }`}
                >
                  {g === 'all' ? 'Barcha sinflar' : `${g}-sinf`}
                </button>
              );
            })}
          </div>

          {/* Region filter & Search input */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Region dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full sm:w-48 pl-3 pr-8 py-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black text-zinc-700 dark:text-zinc-200 outline-none focus:border-amber-500"
              >
                <option value="all">Barcha viloyatlar</option>
                {uniqueRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Search by Name */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ism yoki maktab qidirish..."
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FULL LEADERBOARD LIST */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">
            Jami o‘quvchilar: {filteredStudents.length} nafar
          </span>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            Olovchalar bo‘yicha tartiblangan
          </span>
        </div>

        <div className="space-y-3">
          {filteredStudents.map((student, index) => {
            const rank = index + 1;
            const isCurrentUser = student.id === 'current-user';

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-amber-500 dark:border-amber-400 shadow-md ring-2 ring-amber-400/20'
                    : rank === 1
                    ? 'bg-amber-50/80 dark:bg-zinc-900 border-amber-300 dark:border-zinc-700 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm'
                }`}
              >
                {/* Left: Rank, Avatar, Name & School */}
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {/* Rank badge */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shrink-0 shadow-sm ${
                      rank === 1
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black'
                        : rank === 2
                        ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800'
                        : rank === 3
                        ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </div>

                  {/* Mini character lion avatar */}
                  <div className="w-12 h-14 sm:w-14 sm:h-16 shrink-0 flex items-center justify-center bg-amber-100/60 dark:bg-zinc-800 rounded-2xl border border-amber-200 dark:border-zinc-700 p-0.5">
                    <FullBodyLionCharacter
                      size="sm"
                      gender={student.gender}
                      grade={student.grade}
                      equipped={{ outfit: student.equippedOutfit }}
                      action="idle"
                    />
                  </div>

                  {/* Student details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-sm sm:text-base text-zinc-900 dark:text-white truncate">
                        {student.name}
                      </h4>
                      {isCurrentUser && (
                        <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                          Siz
                        </span>
                      )}
                      <span className="text-[10px] sm:text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                        {student.grade}-sinf
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{student.region}, {student.district}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Streaks, Coins & XP */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  {/* Coins count */}
                  <div className="text-left sm:text-right hidden sm:block">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">Tangalar</div>
                    <div className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 flex items-center sm:justify-end gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{student.coins}</span>
                    </div>
                  </div>

                  {/* XP count */}
                  <div className="text-left sm:text-right hidden sm:block">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">Tajriba</div>
                    <div className="text-xs sm:text-sm font-black text-zinc-700 dark:text-zinc-300">
                      {student.xp} XP
                    </div>
                  </div>

                  {/* FIRE STREAKS (ASOSIY REYTING KO'RSATKICHI) */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 sm:py-2.5 rounded-2xl shadow-md shadow-orange-500/20 shrink-0">
                    <Flame className="w-5 h-5 fill-yellow-200 text-yellow-200 animate-pulse" />
                    <div>
                      <div className="text-[9px] uppercase font-black text-orange-100 leading-none">Olovcha</div>
                      <div className="text-base sm:text-lg font-black leading-none mt-0.5">
                        {student.streaks} ta
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW TO EARN MORE FLAMES SECTION */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-dashed border-amber-400 dark:border-zinc-700 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span>Qanday qilib reytingda yuqoriga ko‘tarilish mumkin?</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Har bir yangi video darsni ko‘ring va testlarni muvaffaqiyatli yeching. Har bir dars olovchangizni +1 ga oshiradi va sizni Prezident maktabi liderlari qatoriga olib chiqadi!
          </p>
        </div>
        <Link
          href="/lessons"
          className="shrink-0 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md transition flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <span>Darslarni Boshlash</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
