'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { sound } from '@/utils/sound';

export default function FloatingAiAssistantButton() {
  const { isAiAssistantOpen, openAiAssistant, progress } = useGame();
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleTextIndex, setBubbleTextIndex] = useState(0);

  const bubblePhrases = [
    "Tushunmadingmi? Mendan so‘ra! 🦁✨",
    "Prezident maktabiga birga tayyorlanamiz! 👑",
    "Qiziq jumboq eshitishni xohlaysanmi? 🧩",
    "Matematikadan yordam kerakmi? ⚡",
  ];

  // Rotate encouraging speech bubbles periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleTextIndex((prev) => (prev + 1) % bubblePhrases.length);
      setShowBubble(true);
    }, 14000);

    return () => clearInterval(interval);
  }, [bubblePhrases.length]);

  if (isAiAssistantOpen) return null;

  return (
    <div className="fixed bottom-6 left-5 sm:left-6 z-40 flex items-end gap-2 pointer-events-auto">
      {/* Main Avatar Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          if (progress.soundEnabled) sound.playClick();
          openAiAssistant();
        }}
        className="relative group p-1 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-400 shadow-xl shadow-orange-500/30 border-2 border-white dark:border-zinc-800 cursor-pointer flex items-center justify-center transition-transform"
        title="Shercha AI yordamchisi bilan suhbatlashish"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 dark:bg-zinc-900 flex items-center justify-center relative overflow-hidden">
          {/* Animated Lion Face / Emoji */}
          <motion.div
            animate={{
              rotate: [0, -6, 6, -6, 0],
              y: [0, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: 'easeInOut',
            }}
            className="text-3xl sm:text-4xl select-none"
          >
            🦁
          </motion.div>

          {/* AI Badge Pill */}
          <span className="absolute bottom-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 fill-white" />
            AI
          </span>
        </div>

        {/* Pulse Ring */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
        </span>
      </motion.button>

      {/* Speech bubble on the right side of the avatar */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="hidden sm:flex items-center gap-2 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border-2 border-amber-300 dark:border-amber-500/50 mb-2 cursor-pointer max-w-xs"
            onClick={() => {
              if (progress.soundEnabled) sound.playClick();
              openAiAssistant();
            }}
          >
            <span className="text-xs font-black text-amber-950 dark:text-amber-200">
              {bubblePhrases[bubbleTextIndex]}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
