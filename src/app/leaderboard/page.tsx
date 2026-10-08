'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { ActiveLearner, getStoredLearners, saveStoredLearner } from '@/data/leaderboardData';
import FullBodyLionCharacter from '@/components/FullBodyLionCharacter';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Flame,
  Crown,
  Search,
  Sparkles,
  MapPin,
  GraduationCap,
  Coins,
  ArrowRight,
  UserCheck,
  UserPlus,
  X,
  Check
} from 'lucide-react';
import { UZBEKISTAN_REGIONS } from '@/data/regionsData';

export default function LeaderboardPage() {
  const { progress, setIsRegistrationModalOpen } = useGame();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [storedList, setStoredList] = useState<ActiveLearner[]>([]);
  const [isAddClassmateOpen, setIsAddClassmateOpen] = useState(false);

  // Form for adding a real classmate in the same grade
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'boy' | 'girl'>('boy');
  const [newStudentRegion, setNewStudentRegion] = useState('Toshkent shahri');
  const [newStudentDistrict, setNewStudentDistrict] = useState(UZBEKISTAN_REGIONS['Toshkent shahri'][0] || '');
  const [newStudentSchool, setNewStudentSchool] = useState('');
  const [newStudentStreaks, setNewStudentStreaks] = useState(1);

  // Load stored active learners
  useEffect(() => {
    setStoredList(getStoredLearners());
  }, []);

  // Current user as an active learner
  const currentUserLearner: ActiveLearner = useMemo(() => {
    const isGirl = progress.profile?.gender === 'girl';
    const fullName = progress.profile
      ? `${progress.profile.firstName} ${progress.profile.lastName}`.trim()
      : progress.name;

    return {
      id: progress.profile?.phoneNumber || progress.name,
      name: fullName,
      grade: progress.grade,
      gender: isGirl ? 'girl' : 'boy',
      region: progress.profile?.region || 'Toshkent shahri',
      district: progress.profile?.district || '',
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
      isCurrentUser: true,
    };
  }, [progress]);

  // Merge stored list with current user, strictly for the user's current grade (NO OTHER GRADES, NO STRANGERS!)
  const gradeStudents = useMemo(() => {
    const currentId = currentUserLearner.id;

    // Filter stored list for only students in THIS GRADE, excluding duplicate of current user
    const peers = storedList.filter(
      (s) => s.grade === progress.grade && s.id !== currentId && s.name.toLowerCase() !== currentUserLearner.name.toLowerCase()
    );

    // Combine current user with other active learners in this grade
    const combined = [currentUserLearner, ...peers];

    // Sort strictly by Streaks (Olovchalar) descending, then XP
    return combined.sort((a, b) => {
      if (b.streaks !== a.streaks) {
        return b.streaks - a.streaks;
      }
      return b.xp - a.xp;
    });
  }, [storedList, currentUserLearner, progress.grade]);

  // Current user's rank within their grade
  const currentUserRank = useMemo(() => {
    const idx = gradeStudents.findIndex((s) => s.id === currentUserLearner.id);
    return idx !== -1 ? idx + 1 : 1;
  }, [gradeStudents, currentUserLearner.id]);

  // Filtered by search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return gradeStudents;
    const q = searchQuery.toLowerCase();
    return gradeStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.school.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q)
    );
  }, [gradeStudents, searchQuery]);

  // Top 3 Podium
  const topThree = useMemo(() => {
    return gradeStudents.slice(0, 3);
  }, [gradeStudents]);

  // Handle adding a new classmate
  const handleAddClassmate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newLearner: ActiveLearner = {
      id: `classmate-${Date.now()}`,
      name: newStudentName.trim(),
      grade: progress.grade, // Strictly current grade!
      gender: newStudentGender,
      region: newStudentRegion,
      district: newStudentDistrict,
      school: newStudentSchool.trim() || `${progress.grade}-sinf o‘quvchisi`,
      streaks: Number(newStudentStreaks) || 1,
      coins: 500 + Number(newStudentStreaks) * 50,
      xp: Number(newStudentStreaks) * 30,
      badge:
        Number(newStudentStreaks) >= 15
          ? 'Oltin Chempion 🥇'
          : Number(newStudentStreaks) >= 5
          ? 'Faol O‘quvchi ⚡'
          : 'Yosh Lider 🌱',
      equippedOutfit: newStudentGender === 'girl' ? 'school_apron_girl' : 'uniform_pm_boy',
    };

    saveStoredLearner(newLearner);
    setStoredList(getStoredLearners());
    setNewStudentName('');
    setNewStudentSchool('');
    setNewStudentStreaks(1);
    setIsAddClassmateOpen(false);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-24">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-pulse" />
              <span>{progress.grade}-sinf Olovchalar Reytingi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3">
              <span>{progress.grade}-sinf Liderlari Reytingi</span>
              <span>🔥</span>
            </h1>
            <p className="text-orange-100 text-sm sm:text-base font-medium">
              Faqat <strong>{progress.grade}-sinfda</strong> ta‘lim olayotgan va platformadan foydalanayotgan o‘quvchilar reytingi. Begonalar yo‘q — faqat siz va sizning sinfdoshlaringiz olovchalari!
            </p>
          </div>

          {/* User's own Rank Pill Box */}
          <div className="bg-white/15 backdrop-blur-md p-5 rounded-3xl border-2 border-white/25 shadow-inner flex flex-col items-center text-center min-w-[210px] w-full md:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> {progress.grade}-sinfda O‘rningiz
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

      {/* PODIUM (SHOXSUPA) - Faqat shu sinfdagilar */}
      {topThree.length >= 1 && (
        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-zinc-800 shadow-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>{progress.grade}-Sinfning Eng Faol O‘quvchilari</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
              {progress.grade}-Sinf Shon-Sharaf Shoxsupasi 🏆
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
            {/* 2-O'RIN (agar mavjud bo'lsa) */}
            {topThree[1] && (
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
                    grade={progress.grade}
                    equipped={{ outfit: topThree[1].equippedOutfit }}
                    action="idle"
                  />
                </div>

                <h3 className="font-black text-base sm:text-lg text-zinc-900 dark:text-white mt-2">
                  {topThree[1].name}
                  {topThree[1].id === currentUserLearner.id && (
                    <span className="ml-1 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Siz</span>
                  )}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {progress.grade}-sinf • {topThree[1].region}
                </p>

                <div className="mt-3 flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-black text-sm rounded-xl border border-orange-200 dark:border-orange-800">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span>{topThree[1].streaks} ta Olovcha</span>
                </div>
              </motion.div>
            )}

            {/* 1-O'RIN (ENG BALAND) */}
            {topThree[0] && (
              <motion.div
                whileHover={{ y: -8 }}
                className={`order-1 md:order-2 bg-gradient-to-t from-amber-100/90 via-amber-50 to-orange-50 dark:from-zinc-800 dark:to-amber-950/30 rounded-3xl p-6 border-4 border-amber-400 dark:border-amber-600 flex flex-col items-center text-center shadow-xl relative scale-105 z-10 ${
                  topThree.length === 1 ? 'md:col-span-3 max-w-sm mx-auto' : ''
                }`}
              >
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
                    grade={progress.grade}
                    equipped={{ outfit: topThree[0].equippedOutfit, hat: 'crown_gold' }}
                    action="wave"
                  />
                </div>

                <h3 className="font-black text-lg sm:text-xl text-zinc-900 dark:text-white mt-2">
                  {topThree[0].name}
                  {topThree[0].id === currentUserLearner.id && (
                    <span className="ml-1 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-black">Siz</span>
                  )}
                </h3>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full mt-0.5">
                  {topThree[0].badge}
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {progress.grade}-sinf • {topThree[0].region}
                </p>

                <div className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-base rounded-2xl shadow-md shadow-orange-500/20">
                  <Flame className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-pulse" />
                  <span>{topThree[0].streaks} ta Olovcha</span>
                </div>
              </motion.div>
            )}

            {/* 3-O'RIN (agar mavjud bo'lsa) */}
            {topThree[2] && (
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
                    grade={progress.grade}
                    equipped={{ outfit: topThree[2].equippedOutfit }}
                    action="idle"
                  />
                </div>

                <h3 className="font-black text-base sm:text-lg text-zinc-900 dark:text-white mt-2">
                  {topThree[2].name}
                  {topThree[2].id === currentUserLearner.id && (
                    <span className="ml-1 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Siz</span>
                  )}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {progress.grade}-sinf • {topThree[2].region}
                </p>

                <div className="mt-3 flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-black text-sm rounded-xl border border-orange-200 dark:border-orange-800">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span>{topThree[2].streaks} ta Olovcha</span>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* FILTER, SEARCH & CLASSMATE ACTIONS */}
      <section className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border-2 border-amber-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Active Class Badge (Locked to user's grade) */}
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Faqat {progress.grade}-sinf o‘quvchilari</span>
            </div>
            <span className="text-xs text-zinc-500 font-bold">
              ({filteredStudents.length} ta o‘quvchi)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ism bo‘yicha qidirish..."
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none focus:border-amber-500"
              />
            </div>

            {/* Add Classmate Button */}
            <button
              onClick={() => setIsAddClassmateOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 shrink-0"
              title="Yangi sinfdoshni reytingga qo‘shish"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Sinfdosh qo‘shish</span>
            </button>
          </div>
        </div>
      </section>

      {/* FULL LEADERBOARD LIST - Strictly User's Grade */}
      <section className="space-y-3">
        <div className="space-y-3">
          {filteredStudents.map((student, index) => {
            const rank = index + 1;
            const isCurrentUser = student.id === currentUserLearner.id;

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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

                  <div className="w-12 h-14 sm:w-14 sm:h-16 shrink-0 flex items-center justify-center bg-amber-100/60 dark:bg-zinc-800 rounded-2xl border border-amber-200 dark:border-zinc-700 p-0.5">
                    <FullBodyLionCharacter
                      size="sm"
                      gender={student.gender}
                      grade={progress.grade}
                      equipped={{ outfit: student.equippedOutfit }}
                      action="idle"
                    />
                  </div>

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
                        {progress.grade}-sinf
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{student.region}{student.district ? `, ${student.district}` : ''}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Streaks, Coins & XP */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="text-left sm:text-right hidden sm:block">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">Tangalar</div>
                    <div className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 flex items-center sm:justify-end gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{student.coins}</span>
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

      {/* MODAL: ADD REAL CLASSMATE */}
      <AnimatePresence>
        {isAddClassmateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-md w-full border-2 border-amber-300 dark:border-zinc-700 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                    {progress.grade}-sinfga O‘quvchi Qo‘shish
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddClassmateOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClassmate} className="space-y-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-zinc-500">Sinfdoshingiz Ismi Familiyasi *</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Masalan: Sardor Aliyev"
                    className="w-full p-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-zinc-500">Jinsi (Shercha qiyofasi) *</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setNewStudentGender('boy')}
                      className={`py-2 px-3 rounded-xl text-xs font-black border-2 flex items-center justify-center gap-1.5 ${
                        newStudentGender === 'boy'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-600'
                      }`}
                    >
                      👦 O‘g‘il bola
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewStudentGender('girl')}
                      className={`py-2 px-3 rounded-xl text-xs font-black border-2 flex items-center justify-center gap-1.5 ${
                        newStudentGender === 'girl'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-600'
                      }`}
                    >
                      👧 Qiz bola
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-black uppercase text-zinc-500">Viloyat</label>
                    <select
                      value={newStudentRegion}
                      onChange={(e) => {
                        const r = e.target.value;
                        setNewStudentRegion(r);
                        setNewStudentDistrict(UZBEKISTAN_REGIONS[r]?.[0] || '');
                      }}
                      className="w-full p-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold outline-none"
                    >
                      {Object.keys(UZBEKISTAN_REGIONS).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-zinc-500">Olovchalar soni 🔥</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={newStudentStreaks}
                      onChange={(e) => setNewStudentStreaks(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition hover:scale-[1.02]"
                >
                  ✅ {progress.grade}-sinf Reytingiga Qo‘shish
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
