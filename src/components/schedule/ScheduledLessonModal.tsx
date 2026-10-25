'use client';

import React, { useState } from 'react';
import { ScheduledLesson } from '@/types/schedule';
import { useGame } from '@/context/GameContext';
import { SUBJECTS } from '@/data/mockData';
import { triggerConfetti } from '@/components/ConfettiEffect';
import {
  X,
  Play,
  CheckCircle2,
  Sparkles,
  Flame,
  Coins,
  Clock,
  BookOpen,
  HelpCircle,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  lesson: ScheduledLesson | null;
  isOpen: boolean;
  onClose: () => void;
  weekId?: string;
}

export default function ScheduledLessonModal({
  lesson,
  isOpen,
  onClose,
  weekId,
}: Props) {
  const {
    isScheduledLessonCompleted,
    markScheduledLessonCompleted,
    openAiAssistant,
  } = useGame();

  const [justCompleted, setJustCompleted] = useState(false);

  if (!isOpen || !lesson) return null;

  const isCompleted = isScheduledLessonCompleted(lesson.id, weekId);
  const subjectInfo = SUBJECTS.find((s) => s.id === lesson.subjectId);

  const handleComplete = () => {
    const isNew = markScheduledLessonCompleted(
      lesson.id,
      lesson.dayKey,
      lesson.subjectId,
      weekId
    );
    if (isNew) {
      triggerConfetti();
      setJustCompleted(true);
      setTimeout(() => {
        setJustCompleted(false);
      }, 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-zinc-700 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 sm:p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                {subjectInfo?.title || 'Dars'}
              </span>
              <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lesson.durationMinutes} daqiqa
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Bajarilgan ✅
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {lesson.title}
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1">
              Mavzu: <span className="font-extrabold text-white">{lesson.topic}</span>
            </p>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-zinc-200 dark:border-zinc-800">
              <iframe
                src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&autoplay=1`}
                title={lesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Dars haqida & O'rganish nuqtalari */}
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-amber-200 dark:border-zinc-700">
                <h4 className="text-xs font-black uppercase text-amber-700 dark:text-amber-300 tracking-wider mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Dars maqsadi va tavsifi
                </h4>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Ushbu darsda o‘rganiladigan asosiy sirlar:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lesson.learningPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mukofotlar va Yakunlash tugmasi */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs font-black">
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60">
                  <Coins className="w-4 h-4" />
                  <span>+20 tanga</span>
                </div>
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-900/60">
                  <Flame className="w-4 h-4" />
                  <span>+40 XP & Energiya</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    openAiAssistant({
                      subject: subjectInfo?.title,
                      topic: lesson.topic,
                      lessonId: lesson.id,
                      grade: lesson.grade,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Tushunmadim</span>
                </button>

                {isCompleted ? (
                  <button
                    disabled
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-sm flex items-center justify-center gap-2 border border-emerald-300"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dars o‘zlashtirildi</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Darsni yakunlash</span>
                  </button>
                )}
              </div>
            </div>

            {justCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500 text-white p-3 rounded-2xl text-center font-black text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-200" />
                <span>Tabriklaymiz! Dars yakunlandi: +20 tanga va +40 XP berildi! 🎉</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
