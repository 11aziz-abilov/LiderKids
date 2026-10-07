'use client';

import React from 'react';
import Link from 'next/link';
import { SubjectInfo } from '@/types';
import { Calculator, Lightbulb, Brain, ArrowRight, PlayCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Calculator,
  Lightbulb,
  Brain,
};

export default function SubjectCard({
  subject,
  questionCount,
  lessonCount,
}: {
  subject: SubjectInfo;
  questionCount: number;
  lessonCount: number;
}) {
  const IconComponent = iconMap[subject.iconName as keyof typeof iconMap] || Brain;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative rounded-3xl p-6 sm:p-7 border-4 ${subject.themeColor.border} ${subject.themeColor.bg} shadow-lg flex flex-col justify-between overflow-hidden group`}
    >
      {/* Decorative gradient blur */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${subject.themeColor.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${subject.themeColor.gradient} text-white flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:rotate-6 transition-transform`}>
            <IconComponent className="w-8 h-8" />
          </div>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${subject.themeColor.badge}`}>
            {subject.subtitle}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
          {subject.title}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6">
          {subject.description}
        </p>

        {/* Statistics Pills */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>{questionCount} ta test savoli</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <PlayCircle className="w-4 h-4 text-orange-500" />
            <span>{lessonCount} ta video dars</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link
          href={`/quiz?subject=${subject.id}`}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r ${subject.themeColor.gradient} text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]`}
        >
          <span>Test yechish</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/lessons?subject=${subject.id}`}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 font-extrabold text-sm border-2 border-zinc-200 dark:border-zinc-700 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlayCircle className="w-4 h-4 text-orange-500" />
          <span>Darsni ko‘rish</span>
        </Link>
      </div>
    </motion.div>
  );
}
