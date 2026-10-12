'use client';

import React from 'react';
import { EquationVisual as EquationVisualType } from '@/types/puzzle';
import { motion } from 'framer-motion';

interface EquationVisualProps {
  equations: EquationVisualType[];
}

export default function EquationVisual({ equations }: EquationVisualProps) {
  return (
    <div className="space-y-3 my-4">
      {equations.map((eq, idx) => {
        const isQuestionLine = eq.result === '?';

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
              isQuestionLine
                ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/15 border-amber-400 dark:border-amber-600 shadow-md ring-2 ring-amber-400/30'
                : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 shadow-xs'
            }`}
          >
            {/* Left Items with Operations */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
              {eq.leftItems.map((item, itemIdx) => (
                <React.Fragment key={itemIdx}>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-zinc-700/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-zinc-600 shadow-xs">
                    <span className="text-2xl sm:text-3xl select-none">{item.emoji}</span>
                    {item.count && item.count > 1 && (
                      <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                        × {item.count}
                      </span>
                    )}
                  </div>
                  {item.op && (
                    <span className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400">
                      {item.op}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Equals sign and Result */}
            <div className="flex items-center gap-2 sm:gap-3 ml-2 flex-shrink-0">
              <span className="text-lg sm:text-xl font-black text-zinc-400 dark:text-zinc-500">
                =
              </span>
              <div
                className={`min-w-[48px] h-11 px-3 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shadow-xs ${
                  isQuestionLine
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse shadow-md shadow-orange-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-600'
                }`}
              >
                {eq.result}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
