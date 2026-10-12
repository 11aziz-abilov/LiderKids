'use client';

import React from 'react';
import { DetectiveClueVisual } from '@/types/puzzle';
import { motion } from 'framer-motion';
import { FileSearch } from 'lucide-react';

interface DetectiveCluesVisualProps {
  clues: DetectiveClueVisual[];
}

export default function DetectiveCluesVisual({ clues }: DetectiveCluesVisualProps) {
  return (
    <div className="space-y-2.5 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/70 text-violet-800 dark:text-violet-300 text-xs font-black uppercase tracking-wider">
          <FileSearch className="w-3.5 h-3.5" />
          Mavjud Dalillar & Ko‘rsatmalar
        </span>
      </div>

      {clues.map((clue, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border-2 border-zinc-200 dark:border-zinc-700/80 shadow-xs hover:border-violet-300 dark:hover:border-violet-700 transition"
        >
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-zinc-700 text-violet-600 dark:text-violet-400 flex items-center justify-center font-black text-xs flex-shrink-0 border border-violet-200 dark:border-zinc-650 shadow-xs">
            {clue.icon ? (
              <span className="text-base select-none">{clue.icon}</span>
            ) : (
              clue.number
            )}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm sm:text-base font-extrabold text-zinc-800 dark:text-zinc-200 leading-snug">
              {clue.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
