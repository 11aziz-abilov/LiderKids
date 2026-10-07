'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { LESSONS, SUBJECTS } from '@/data/mockData';
import { Lesson, SubjectId } from '@/types';
import {
  PlayCircle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  X,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function LessonsContent() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject') as SubjectId | null;

  const { progress, markLessonCompleted } = useGame();
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    subjectParam || 'all'
  );
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedNotification, setCompletedNotification] = useState(false);

  const filteredLessons = LESSONS.filter((lesson) => {
    if (selectedSubject === 'all') return true;
    return lesson.subjectId === selectedSubject;
  });

  const handleCompleteLesson = (lessonId: string) => {
    const isNew = markLessonCompleted(lessonId);
    if (isNew) {
      setCompletedNotification(true);
      setTimeout(() => setCompletedNotification(false), 2500);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-orange-200 fill-orange-200" />
              <span>Bilim energiyasi va Olovchalar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Video Darslar Olami 🎬
            </h1>
            <p className="text-orange-100 text-sm sm:text-base font-medium max-w-xl mt-1">
              Prezident maktabiga tushuvchi qiziqarli darslarni ko‘ring va har bir dars uchun +1 🔥 olovcha energiya jamg‘aring!
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/25 flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-300 fill-orange-300 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-orange-100 uppercase">
                O‘zlashtirilgan darslar
              </div>
              <div className="text-2xl font-black">
                {progress.completedLessons.length} ta dars
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
            Fanlar bo‘yicha darslar:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              selectedSubject === 'all'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Barchasi
          </button>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                selectedSubject === s.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          const currentSubject = SUBJECTS.find((s) => s.id === lesson.subjectId);

          return (
            <motion.div
              key={lesson.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`bg-white dark:bg-zinc-900 rounded-3xl p-6 border-4 flex flex-col justify-between shadow-lg transition-all ${
                isCompleted
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20'
                  : 'border-amber-200 dark:border-zinc-800'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      currentSubject?.themeColor.badge || 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentSubject?.title} • {lesson.grade}-sinf
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.durationMinutes} daqiqa</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 leading-tight">
                  {lesson.title}
                </h3>

                <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {lesson.description}
                </p>

                {/* Key Points */}
                <div className="space-y-1.5 mb-6 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    Darsda o‘rganiladi:
                  </span>
                  {lesson.learningPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setActiveLesson(lesson)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Darsni ko‘rish</span>
                </button>

                <div className="flex items-center justify-between text-xs font-bold pt-1 px-1">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Dars yakunlangan (+1 🔥)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <Flame className="w-4 h-4" /> Yakunlasangiz: +1 🔥 olovcha
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {activeLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border-4 border-amber-300 dark:border-amber-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveLesson(null)}
                className="absolute top-5 right-5 p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Lesson Details */}
              <div className="mb-4 pr-10">
                <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Video dars
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                  {activeLesson.title}
                </h2>
              </div>

              {/* Video Embed Player */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-6 shadow-inner border border-zinc-200 dark:border-zinc-800">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtubeId}?autoplay=1&rel=0`}
                  title={activeLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Lesson Description & Complete Action */}
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
                  {activeLesson.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-orange-600 dark:text-orange-400">
                    <Flame className="w-5 h-5 fill-orange-500" />
                    <span>Darsni yakunlab, olovcha hisobingizni oshiring!</span>
                  </div>

                  <button
                    onClick={() => handleCompleteLesson(activeLesson.id)}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md transition-transform hover:scale-105 active:scale-95 ${
                      progress.completedLessons.includes(activeLesson.id)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {progress.completedLessons.includes(activeLesson.id)
                        ? 'Dars yakunlangan (Qayta ko‘rilmoqda)'
                        : 'Darsni yakunlash (+1 🔥)'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Notification for Flame Earned */}
      <AnimatePresence>
        {completedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-yellow-300"
          >
            <Flame className="w-8 h-8 fill-yellow-200 text-yellow-200 animate-bounce" />
            <div>
              <div className="font-black text-lg">Ajoyib! +1 🔥 Olovcha berildi!</div>
              <div className="text-xs font-semibold text-orange-100">
                Sherchangiz energiyasi ortdi!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-bold text-zinc-500">
          Video darslar yuklanmoqda... 🎬
        </div>
      }
    >
      <LessonsContent />
    </Suspense>
  );
}
