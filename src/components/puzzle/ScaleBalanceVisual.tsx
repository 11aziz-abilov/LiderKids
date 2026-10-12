'use client';

import React from 'react';
import { ScaleVisual } from '@/types/puzzle';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

interface ScaleBalanceVisualProps {
  scales: ScaleVisual[];
}

export default function ScaleBalanceVisual({ scales }: ScaleBalanceVisualProps) {
  return (
    <div className="space-y-4 my-4">
      {scales.map((scale, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-b from-amber-50/80 to-orange-50/50 dark:from-zinc-800/80 dark:to-zinc-900/80 p-4 sm:p-5 rounded-2xl border-2 border-amber-200/80 dark:border-zinc-700 shadow-inner"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/70 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              {scales.length > 1 ? `${idx + 1}-Tarozi (Muvozanat)` : 'Pallali Tarozi (Muvozanat)'}
            </span>
            {scale.note && (
              <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400">
                {scale.note}
              </span>
            )}
          </div>

          {/* SVG Animated Scale Drawing */}
          <div className="relative py-2 flex flex-col items-center">
            {/* Balance beam and pans */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3 sm:gap-6 items-end relative">
              {/* Left Pan */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                {/* Pan Content */}
                <div className="w-full bg-white dark:bg-zinc-850 p-3 rounded-2xl border-2 border-amber-300 dark:border-zinc-650 shadow-md flex flex-wrap items-center justify-center gap-2 min-h-[70px]">
                  {scale.leftItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-amber-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-zinc-700 shadow-xs"
                    >
                      <span className="text-2xl select-none">{item.emoji}</span>
                      <span className="text-xs font-black text-amber-950 dark:text-amber-100">
                        {item.count > 1 ? `× ${item.count}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Strings & Base */}
                <div className="w-0.5 h-6 bg-amber-400 dark:bg-zinc-600" />
                <div className="w-16 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" />
                <span className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 mt-1">
                  Chap palla
                </span>
              </motion.div>

              {/* Equals sign in center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-base shadow-md border-2 border-white dark:border-zinc-800">
                =
              </div>

              {/* Right Pan */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                {/* Pan Content */}
                <div className="w-full bg-white dark:bg-zinc-850 p-3 rounded-2xl border-2 border-amber-300 dark:border-zinc-650 shadow-md flex flex-wrap items-center justify-center gap-2 min-h-[70px]">
                  {scale.rightItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-orange-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-xl border border-orange-200 dark:border-zinc-700 shadow-xs"
                    >
                      <span className="text-2xl select-none">{item.emoji}</span>
                      <span className="text-xs font-black text-orange-950 dark:text-orange-100">
                        {item.count > 1 ? `× ${item.count}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Strings & Base */}
                <div className="w-0.5 h-6 bg-amber-400 dark:bg-zinc-600" />
                <div className="w-16 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
                <span className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 mt-1">
                  O‘ng palla
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
