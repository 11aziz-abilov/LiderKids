'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import {
  WEEKLY_DAYS_CONFIG,
  getScheduledLessonsForDay,
  getScheduledLessonsForWeek,
} from '@/data/weeklyScheduleConfig';
import { ScheduledLesson } from '@/types/schedule';
import { SUBJECTS } from '@/data/mockData';
import {
  getTashkentDate,
  formatTashkentDateUz,
  DAY_NAMES_UZ,
  getCurrentWeekDates,
} from '@/utils/tashkentTime';
import ScheduledLessonModal from './ScheduledLessonModal';
import WeeklyScheduleModal from './WeeklyScheduleModal';
import WeeklyExamModal from './WeeklyExamModal';
import {
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Trophy,
  Flame,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TodayLessonsWidget() {
  const {
    progress,
    currentWeekId,
    isScheduledLessonCompleted,
    getWeeklyExamResult,
  } = useGame();

  const [selectedLesson, setSelectedLesson] = useState<ScheduledLesson | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const tashkentDate = getTashkentDate();
  const dayKey = tashkentDate.dayKey;
  const dayConfig = WEEKLY_DAYS_CONFIG.find((d) => d.dayKey === dayKey);
  const todayLessons = getScheduledLessonsForDay(progress.grade, dayKey);

  // O'tkazib yuborilgan darslarni aniqlash:
  // Shu haftaning avvalgi kunlarida bo'lib, bajarilmay qolgan darslar
  const weekDates = getCurrentWeekDates();
  const pastDaysKeys = weekDates
    .filter((d) => d.isPast)
    .map((d) => d.dayKey);

  const allWeekLessons = getScheduledLessonsForWeek(progress.grade);
  const missedLessons = allWeekLessons.filter(
    (l) => pastDaysKeys.includes(l.dayKey) && !isScheduledLessonCompleted(l.id, currentWeekId)
  );

  const examResult = getWeeklyExamResult(currentWeekId);
  const isSunday = dayKey === 'sunday';

  const handleOpenLesson = (lesson: ScheduledLesson) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  return (
    <>
      <section className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-7 border-2 border-amber-200 dark:border-zinc-800 shadow-md space-y-5">
        {/* Widget Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
              📅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  Bugungi Darslar
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black">
                  {DAY_NAMES_UZ[dayKey].full}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                {formatTashkentDateUz(tashkentDate.dateString)} • {progress.grade}-sinf haftalik rejasi
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-50 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 text-amber-700 dark:text-amber-300 text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95 border border-amber-200 dark:border-zinc-700 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>To‘liq haftalik jadval</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* O'tkazib yuborilgan darslar banneri (agar mavjud bo'lsa) */}
        {missedLessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-orange-300 dark:border-orange-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                <span className="font-black text-orange-700 dark:text-orange-400">
                  O‘tkazib yuborilgan darslar: {missedLessons.length} ta!
                </span>{' '}
                Xavotir olmang, darslar ochiq qolgan. Hafta oxirigacha bemalol o‘zlashtirib olishingiz mumkin.
              </div>
            </div>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer"
            >
              Bajarib olish →
            </button>
          </motion.div>
        )}

        {/* Bugungi darslar ko'rinishi */}
        {isSunday ? (
          /* Yakshanba: Haftalik Katta Test kartasi */
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-violet-500/10 dark:bg-purple-950/25 border-2 border-purple-300 dark:border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-lg shrink-0">
                🏆
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Yakshanba Katta Testi</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
                  Haftalik 20 ta Savolli Intellektual Sinov
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  Matematika, Ingliz tili, Muammoli masalalar va Tanqidiy fikrlash bo‘yicha 5 tadan savol!
                </p>
                {examResult && (
                  <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-black pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Natijangiz: {examResult.totalScore}/20 ball ({examResult.percentage}%)</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsExamModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{examResult ? 'Testni qayta topshirish' : 'Haftalik Testni Boshlash'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Dushanbadan Shanbagacha: 2 ta belgilangan dars */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayLessons.map((lesson, idx) => {
              const isCompleted = isScheduledLessonCompleted(lesson.id, currentWeekId);
              const subjectInfo = SUBJECTS.find((s) => s.id === lesson.subjectId);

              return (
                <div
                  key={lesson.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
                    isCompleted
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 hover:border-amber-400'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-white dark:bg-zinc-700 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 shadow-sm border border-zinc-200 dark:border-zinc-600">
                        {idx === 0 ? '1-DARS' : '2-DARS'} • {subjectInfo?.title}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-xs bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tugallangan ✅</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-extrabold text-xs bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Boshlanmagan</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 leading-snug">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                        Mavzu: <span className="font-bold text-zinc-700 dark:text-zinc-300">{lesson.topic}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {lesson.durationMinutes} daqiqa
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        +20 tanga & +40 XP
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenLesson(lesson)}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/20'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{isCompleted ? 'Qayta ko‘rish' : 'Darsni boshlash'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Darsni ochish modali */}
      <ScheduledLessonModal
        lesson={selectedLesson}
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        weekId={currentWeekId}
      />

      {/* Haftalik to'liq jadval modali */}
      <WeeklyScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onStartExam={() => setIsExamModalOpen(true)}
      />

      {/* Yakshanba haftalik katta testi modali */}
      <WeeklyExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />
    </>
  );
}
