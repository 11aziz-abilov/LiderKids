'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameTimerProps {
  totalSeconds?: number; // default: 120
  isActive: boolean;
  onTimeUp: () => void;
}

export default function GameTimer({
  totalSeconds = 120,
  isActive,
  onTimeUp,
}: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const percentage = Math.max(0, (timeLeft / totalSeconds) * 100);

  const isLowTime = timeLeft <= 20;

  return (
    <div className="flex items-center gap-3 bg-white/90 dark:bg-zinc-850 px-4 py-2 rounded-2xl border-2 border-amber-300 dark:border-zinc-700 shadow-sm">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
          isLowTime
            ? 'bg-orange-500 text-white animate-pulse'
            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
        }`}
      >
        <Clock className="w-4 h-4" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3 text-xs font-black">
          <span className="text-zinc-500 dark:text-zinc-400">Tanaffus vaqti:</span>
          <span
            className={`font-mono text-sm ${
              isLowTime
                ? 'text-orange-600 dark:text-orange-400 font-black'
                : 'text-zinc-800 dark:text-zinc-100'
            }`}
          >
            {formattedTime}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-28 sm:w-36 h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden mt-1">
          <motion.div
            className={`h-full rounded-full transition-colors ${
              isLowTime
                ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${percentage}%` }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ ease: 'linear', duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
