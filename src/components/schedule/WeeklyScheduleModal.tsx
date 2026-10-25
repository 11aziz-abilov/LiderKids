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
  getCurrentWeekDates,
  formatTashkentDateUz,
  DayOfWeekKey,
} from '@/utils/tashkentTime';
import ScheduledLessonModal from './ScheduledLessonModal';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  ChevronRight,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartExam?: () => void;
}

export default function WeeklyScheduleModal({
  isOpen,
  onClose,
  onStartExam,
}: Props) {
  const {
    progress,
    currentWeekId,
    isScheduledLessonCompleted,
    getWeeklyExamResult,
  } = useGame();

  const [selectedLesson, setSelectedLesson] = useState<ScheduledLesson | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  if (!isOpen) return null;

  const currentTashkent = getTashkentDate();
  const weekDays = getCurrentWeekDates();
  const allWeekLessons = getScheduledLessonsForWeek(progress.grade);

  // Qancha dars bajarilganini hisoblaymiz
  const completedLessonsCount = allWeekLessons.filter((l) =>
    isScheduledLessonCompleted(l.id, currentWeekId)
  ).length;

  const totalLessonsCount = allWeekLessons.length; // 12 ta
  const progressPercent = totalLessonsCount > 0
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
    : 0;

  const examResult = getWeeklyExamResult(currentWeekId);

  const handleOpenLesson = (lesson: ScheduledLesson) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-zinc-700 overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 sm:p-6 text-white relative shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Haftalik Dars Jadvali
                </span>
                <span className="text-xs font-bold text-amber-100">
                  {progress.grade}-sinf • Asia/Tashkent
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Prezident Maktabiga Haftalik Reja 📅
                  </h2>
                  <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
                    Har bir fan haftasiga aynan 3 marta, yakshanba kuni esa Katta Test!
                  </p>
                </div>

                {/* Progress pill */}
                <div className="bg-white/15 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/25 flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center font-black text-sm shadow">
                    {progressPercent}%
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-amber-100">
                      Bajarilgan darslar
                    </div>
                    <div className="text-base font-black">
                      {completedLessonsCount} / {totalLessonsCount} ta
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Schedule Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Info banner */}
              <div className="bg-amber-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-amber-200 dark:border-zinc-700 flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Bolalar uchun erkin o‘rganish imkoniyati:</strong> Agar biror kun darsini o‘tkazib yuborsangiz, dars yopilmaydi. Hafta oxirigacha istalgan vaqtda kirib, darsni bemalol bajarib olishingiz mumkin!
                </p>
              </div>

              {/* 7 Days Grid / List */}
              <div className="space-y-3">
                {weekDays.map((dayObj) => {
                  const dayConfig = WEEKLY_DAYS_CONFIG.find((d) => d.dayKey === dayObj.dayKey);
                  const isToday = dayObj.isToday;
                  const isPast = dayObj.isPast;
                  const dayLessons = getScheduledLessonsForDay(progress.grade, dayObj.dayKey);

                  // Darslar holati
                  const dayCompletedCount = dayLessons.filter((l) =>
                    isScheduledLessonCompleted(l.id, currentWeekId)
                  ).length;
                  const isDayFullyCompleted =
                    dayLessons.length > 0 && dayCompletedCount === dayLessons.length;
                  const isMissed = isPast && !isDayFullyCompleted;

                  return (
                    <div
                      key={dayObj.dayKey}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isToday
                          ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600 shadow-md ring-2 ring-amber-400/30'
                          : isDayFullyCompleted
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-300 dark:border-emerald-800'
                          : isMissed
                          ? 'bg-orange-50/40 dark:bg-orange-950/15 border-orange-300 dark:border-orange-800'
                          : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {/* Day Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-700/60">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                              isToday
                                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                                : isDayFullyCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                            }`}
                          >
                            {dayObj.dayOfMonth}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                                {dayConfig?.dayName}
                              </h3>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                ({dayObj.monthNameUz})
                              </span>
                              {isToday && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
                                  Bugun
                                </span>
                              )}
                              {isDayFullyCompleted && (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Hammasi bajarildi
                                </span>
                              )}
                              {isMissed && (
                                <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs font-black bg-orange-100 dark:bg-orange-950/50 px-2 py-0.5 rounded-lg">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  O‘tkazib yuborilgan (bajarib oling)
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                              {dayConfig?.description}
                            </p>
                          </div>
                        </div>

                        {/* Fanlar nishonchalari */}
                        <div className="flex items-center gap-1.5">
                          {dayConfig?.subjects.map((subjId) => {
                            const subj = SUBJECTS.find((s) => s.id === subjId);
                            return (
                              <span
                                key={subjId}
                                className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                              >
                                {subj?.title}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Day Body: Yakshanba bo'lsa Test, boshqa kunlar bo'lsa 2 ta dars */}
                      {dayConfig?.isExamDay ? (
                        <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-violet-500/10 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                              🏆
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base font-black text-purple-950 dark:text-purple-200">
                                Yakshanba Haftalik Katta Testi (20 ta savol)
                              </h4>
                              <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                                4 ta fandan 5 tadan: Matematika, Ingliz tili, Muammoli masalalar, Tanqidiy fikrlash.
                              </p>
                              {examResult && (
                                <div className="mt-1 flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Topshirilgan: {examResult.totalScore}/20 ball ({examResult.percentage}%)</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              onClose();
                              if (onStartExam) onStartExam();
                            }}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{examResult ? 'Testni qayta ko‘rish' : 'Testni boshlash'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {dayLessons.map((lesson) => {
                            const isDone = isScheduledLessonCompleted(
                              lesson.id,
                              currentWeekId
                            );
                            const subj = SUBJECTS.find((s) => s.id === lesson.subjectId);

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleOpenLesson(lesson)}
                                className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-amber-400'
                                }`}
                              >
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                                      {subj?.title}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                                      <Clock className="w-3 h-3" />
                                      {lesson.durationMinutes} daq
                                    </span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 truncate">
                                    {lesson.title}
                                  </div>
                                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                    Mavzu: {lesson.topic}
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-1.5">
                                  {isDone ? (
                                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                      ✓
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shadow-sm">
                                      Ochish
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                LiderKids • Haftalik o‘quv rejasi
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs transition active:scale-95 cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Darsni ko'rish modali */}
      <ScheduledLessonModal
        lesson={selectedLesson}
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        weekId={currentWeekId}
      />
    </>
  );
}
