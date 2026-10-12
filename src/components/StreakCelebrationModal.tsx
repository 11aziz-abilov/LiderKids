'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { StreakPrize } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerConfetti } from './ConfettiEffect';
import { X, Sparkles, Trophy, Gift, ArrowRight } from 'lucide-react';

interface Props {
  prize: StreakPrize | null;
  onClose: () => void;
  onClaim: (prize: StreakPrize) => void;
}

export default function StreakCelebrationModal({ prize, onClose, onClaim }: Props) {
  if (!prize) return null;

  const handleOpenClaim = () => {
    const targetPrize = prize;
    onClose();
    onClaim(targetPrize);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Graphic */}
          <div className={`p-8 bg-gradient-to-br ${prize.color} text-white relative overflow-hidden`}>
            {/* Background sparkle effects */}
            <div className="absolute top-2 left-4 text-3xl animate-bounce">✨</div>
            <div className="absolute bottom-3 right-4 text-3xl animate-pulse">🎉</div>

            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center text-5xl shadow-2xl mb-3"
            >
              {prize.emoji}
            </motion.div>

            <span className="inline-block px-3 py-1 bg-white/25 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              🏆 {prize.badge}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black drop-shadow">
              TABRIKLAYMIZ! 🎉
            </h2>

            <p className="text-white/95 text-xs sm:text-sm font-semibold mt-1">
              Siz {prize.periodLabel} ({prize.daysRequired} kun) uzluksiz dars qildingiz!
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                Siz <span className="text-amber-500">{prize.name}</span> sovrinini yutib oldingiz!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {prize.description}
              </p>
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-left text-xs space-y-1">
              <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Haqiqiy jismoniy sovg‘a:</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                {prize.detailedFeature}
              </p>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                ✓ Bepul yetkazib berish (Ota-onangizga SMS ogohlantirish yuborildi)
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleOpenClaim}
                className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Sovg‘ani qabul qilish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
