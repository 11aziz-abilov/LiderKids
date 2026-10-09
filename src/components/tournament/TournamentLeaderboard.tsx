'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TournamentPlayer } from '@/types/tournament';
import { GradeLevel } from '@/types';
import { Trophy, Crown, Flame, MapPin, Search, Medal, Sparkles, UserCheck } from 'lucide-react';

interface TournamentLeaderboardProps {
  players: TournamentPlayer[];
  currentUserId: string;
}

export default function TournamentLeaderboard({
  players,
  currentUserId,
}: TournamentLeaderboardProps) {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrlash va saralash
  const filteredPlayers = useMemo(() => {
    return players
      .filter((p) => {
        if (selectedGrade !== 'all' && p.grade !== selectedGrade) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.region.toLowerCase().includes(q) ||
            p.school.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [players, selectedGrade, searchQuery]);

  // Top 3 o'yinchilar shohsupasi
  const topThree = filteredPlayers.slice(0, 3);
  const remainingPlayers = filteredPlayers.slice(3);

  // Joriy o'yinchi o'rni
  const currentUserRank = filteredPlayers.findIndex((p) => p.id === currentUserId) + 1;

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
        {/* Grade tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1.5 text-xs font-black rounded-xl transition ${
              selectedGrade === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            Barcha sinflar
          </button>
          {[1, 2, 3, 4].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g as GradeLevel)}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition ${
                selectedGrade === g
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {g}-sinf
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism yoki viloyat..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Top 3 Podium (agar kamida 3 ta o'yinchi bo'lsa) */}
      {topThree.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 pb-2 items-end max-w-2xl mx-auto">
          {/* 2nd place (Kumush) */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-400 border-2 border-slate-300 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                {topThree[1].avatarEmoji}
              </div>
              <span className="absolute -top-2.5 -right-1 text-lg sm:text-xl">🥈</span>
            </div>
            <div className="mt-2 text-center w-full px-1">
              <div className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white truncate">
                {topThree[1].name}
              </div>
              <div className="text-[10px] text-zinc-500 font-bold truncate">
                {topThree[1].grade}-sinf • {topThree[1].region.split(' ')[0]}
              </div>
            </div>
            <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-zinc-800 dark:to-zinc-750 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-4 border-slate-400 shadow-sm">
              <span className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300">
                2-o‘rin
              </span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                {topThree[1].rating} 🏆
              </span>
            </div>
          </div>

          {/* 1st place (Oltin Qirol) */}
          <div className="flex flex-col items-center -mt-6">
            <div className="relative">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400 border-4 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-amber-500/30"
              >
                {topThree[0].avatarEmoji}
              </motion.div>
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 drop-shadow-md absolute -top-4 left-1/2 -translate-x-1/2" />
            </div>
            <div className="mt-2 text-center w-full px-1">
              <div className="text-xs sm:text-base font-black text-amber-950 dark:text-amber-300 truncate">
                {topThree[0].name}
              </div>
              <div className="text-[11px] text-orange-600 font-bold truncate">
                👑 Chempion • {topThree[0].grade}-sinf
              </div>
            </div>
            <div className="w-full h-32 sm:h-36 bg-gradient-to-t from-amber-400 to-yellow-300 dark:from-amber-600 dark:to-yellow-500 rounded-t-3xl mt-2 flex flex-col items-center justify-center border-t-4 border-yellow-200 shadow-lg text-white">
              <span className="text-lg sm:text-xl font-black drop-shadow">1-o‘rin</span>
              <span className="text-sm font-black text-amber-950 dark:text-amber-100 bg-white/40 px-2 py-0.5 rounded-lg mt-0.5">
                {topThree[0].rating} 🏆
              </span>
            </div>
          </div>

          {/* 3rd place (Bronza) */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-600/40 to-orange-700/50 border-2 border-amber-700/60 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                {topThree[2].avatarEmoji}
              </div>
              <span className="absolute -top-2.5 -right-1 text-lg sm:text-xl">🥉</span>
            </div>
            <div className="mt-2 text-center w-full px-1">
              <div className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white truncate">
                {topThree[2].name}
              </div>
              <div className="text-[10px] text-zinc-500 font-bold truncate">
                {topThree[2].grade}-sinf • {topThree[2].region.split(' ')[0]}
              </div>
            </div>
            <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-amber-700/30 to-amber-600/20 dark:from-zinc-800 dark:to-zinc-750 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-4 border-amber-700/60 shadow-sm">
              <span className="text-sm sm:text-base font-black text-amber-800 dark:text-amber-300">
                3-o‘rin
              </span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                {topThree[2].rating} 🏆
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
              Shashka Chempionati Reytingi
            </h3>
          </div>
          {currentUserRank > 0 && (
            <div className="text-xs font-black px-3 py-1 bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-zinc-700">
              Sizning o‘rningiz: #{currentUserRank}
            </div>
          )}
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filteredPlayers.map((player, index) => {
            const rank = index + 1;
            const isUser = player.isCurrentUser || player.id === currentUserId;

            return (
              <div
                key={player.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between transition-colors ${
                  isUser
                    ? 'bg-amber-100/60 dark:bg-amber-950/40 border-l-4 border-l-amber-500'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank */}
                  <div
                    className={`w-7 sm:w-8 text-center text-xs sm:text-sm font-black ${
                      rank === 1
                        ? 'text-yellow-500'
                        : rank === 2
                        ? 'text-slate-400'
                        : rank === 3
                        ? 'text-amber-700'
                        : 'text-zinc-400'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-zinc-800 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {player.avatarEmoji}
                  </div>

                  {/* Name & Details */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                        {player.name}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded-md">
                          Siz
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>{player.grade}-sinf</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 truncate max-w-[120px] sm:max-w-none">
                        <MapPin className="w-3 h-3" />
                        {player.region}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Matches */}
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <div className="text-[11px] font-bold text-zinc-400">
                      G‘alaba: {player.wins}/{player.totalMatches}
                    </div>
                    <div className="text-[10px] text-zinc-400">{player.league}</div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">
                      {player.rating} 🏆
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 sm:hidden">
                      {player.wins} g‘alaba
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
