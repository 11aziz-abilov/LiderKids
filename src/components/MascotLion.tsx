'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Sparkles, Award, Zap, Heart } from 'lucide-react';

export default function MascotLion() {
  const { progress, lionStage } = useGame();
  const [isInteracting, setIsInteracting] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLionClick = () => {
    setIsInteracting(true);
    setClickCount((prev) => prev + 1);
    setTimeout(() => setIsInteracting(false), 1200);
  };

  // XP hisobi
  const currentGradeXP = progress.xp % lionStage.xpNeededForNext;
  const xpPercent = Math.min(100, Math.round((currentGradeXP / lionStage.xpNeededForNext) * 100));

  return (
    <div className="relative w-full bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-900/20 dark:to-transparent rounded-3xl p-6 sm:p-8 border-4 border-amber-300 dark:border-amber-800 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Background Decorative Rings & Floating Elements */}
      <div className="absolute top-2 right-4 text-3xl animate-bounce duration-1000 select-none">✨</div>
      <div className="absolute bottom-4 left-6 text-2xl animate-pulse select-none">⭐</div>
      <div className="absolute top-1/2 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Shercha Avatar qismi */}
        <div className="flex flex-col items-center">
          <div className="relative cursor-pointer group" onClick={handleLionClick} title="Sherchani bosing!">
            {/* Click Hearts / Stars Bubble */}
            <AnimatePresence>
              {isInteracting && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -40, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full shadow-lg border-2 border-amber-400 text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 z-20 whitespace-nowrap"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                  {clickCount % 2 === 0 ? "Barakalla, Lider!" : "Prezident maktabiga olg‘a!"}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Base Halo */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity" />

            {/* SVG Mascot Character based on Grade */}
            <motion.div
              animate={isInteracting ? { scale: [1, 1.15, 0.95, 1], rotate: [0, -8, 8, 0] } : { y: [0, -6, 0] }}
              transition={
                isInteracting
                  ? { duration: 0.6, ease: "easeInOut" }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center select-none"
            >
              {/* GRADE 1: Kichkintoy Shercha (Baby Cub) */}
              {progress.grade === 1 && (
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {/* Orqa fon nur */}
                  <circle cx="100" cy="100" r="85" fill="#FEF3C7" className="dark:fill-amber-950/40" />
                  
                  {/* Quloqlar */}
                  <circle cx="50" cy="65" r="24" fill="#F59E0B" />
                  <circle cx="50" cy="65" r="14" fill="#FDE68A" />
                  <circle cx="150" cy="65" r="24" fill="#F59E0B" />
                  <circle cx="150" cy="65" r="14" fill="#FDE68A" />

                  {/* Kichik jingalak soch/yolcha */}
                  <circle cx="100" cy="48" r="16" fill="#D97706" />
                  <circle cx="85" cy="52" r="12" fill="#D97706" />
                  <circle cx="115" cy="52" r="12" fill="#D97706" />

                  {/* Dumaloq bosh */}
                  <circle cx="100" cy="105" r="55" fill="#FBBF24" />

                  {/* Yanoqlar (pushti) */}
                  <circle cx="70" cy="115" r="10" fill="#FCA5A5" opacity="0.6" />
                  <circle cx="130" cy="115" r="10" fill="#FCA5A5" opacity="0.6" />

                  {/* Katta bolalarcha ko'zlar */}
                  <ellipse cx="80" cy="95" rx="9" ry="12" fill="#1F2937" />
                  <circle cx="83" cy="92" r="4" fill="#FFFFFF" />
                  <circle cx="78" cy="98" r="2" fill="#FFFFFF" />

                  <ellipse cx="120" cy="95" rx="9" ry="12" fill="#1F2937" />
                  <circle cx="123" cy="92" r="4" fill="#FFFFFF" />
                  <circle cx="118" cy="98" r="2" fill="#FFFFFF" />

                  {/* Burun va tabassum */}
                  <polygon points="100,108 93,116 107,116" fill="#B45309" rx="2" />
                  <path d="M 93 116 Q 100 126 107 116" stroke="#B45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 94 121 Q 100 132 106 121" fill="#EF4444" />

                  {/* Kichik yulduzcha marjon */}
                  <circle cx="100" cy="162" r="12" fill="#3B82F6" />
                  <path d="M 100 154 L 102 160 L 108 160 L 103 164 L 105 170 L 100 166 L 95 170 L 97 164 L 92 160 L 98 160 Z" fill="#FCD34D" />
                </svg>
              )}

              {/* GRADE 2: O‘ynoqi Shercha (Playful Cub) */}
              {progress.grade === 2 && (
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {/* Orqa fon */}
                  <circle cx="100" cy="100" r="85" fill="#FFEDD5" className="dark:fill-orange-950/40" />

                  {/* Katta quloqlar */}
                  <circle cx="45" cy="60" r="26" fill="#EA580C" />
                  <circle cx="45" cy="60" r="15" fill="#FED7AA" />
                  <circle cx="155" cy="60" r="26" fill="#EA580C" />
                  <circle cx="155" cy="60" r="15" fill="#FED7AA" />

                  {/* Rivojlanayotgan yol */}
                  <circle cx="70" cy="45" r="16" fill="#C2410C" />
                  <circle cx="100" cy="38" r="18" fill="#C2410C" />
                  <circle cx="130" cy="45" r="16" fill="#C2410C" />
                  <circle cx="50" cy="90" r="15" fill="#C2410C" />
                  <circle cx="150" cy="90" r="15" fill="#C2410C" />

                  {/* Bosh */}
                  <circle cx="100" cy="102" r="54" fill="#F97316" />

                  {/* O'ynoqi ko'z qisish (chap ko'z ochiq, o'ng ko'z quvnoq qisilgan) */}
                  <ellipse cx="78" cy="92" rx="9" ry="11" fill="#1F2937" />
                  <circle cx="81" cy="89" r="4" fill="#FFFFFF" />
                  
                  {/* Qisilgan ko'z (winking) */}
                  <path d="M 112 92 Q 122 84 132 92" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" fill="none" />

                  {/* Qizil yonoqlar */}
                  <circle cx="68" cy="112" r="9" fill="#FB7185" opacity="0.6" />
                  <circle cx="132" cy="112" r="9" fill="#FB7185" opacity="0.6" />

                  {/* Burun va keng kulgi */}
                  <polygon points="100,105 92,114 108,114" fill="#9A3412" rx="2" />
                  <path d="M 90 116 Q 100 135 110 116 Z" fill="#DC2626" />
                  <path d="M 94 116 L 106 116" stroke="#FFFFFF" strokeWidth="3" />

                  {/* Bo'yinbog' (Lider galstugi) */}
                  <polygon points="100,154 90,180 100,192 110,180" fill="#2563EB" />
                  <circle cx="100" cy="154" r="6" fill="#1D4ED8" />
                </svg>
              )}

              {/* GRADE 3: O‘smir Sher (Teen Lion) */}
              {progress.grade === 3 && (
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {/* Orqa fon */}
                  <circle cx="100" cy="100" r="85" fill="#FEF08A" className="dark:fill-yellow-950/40" />

                  {/* Katta qalin yol (Mane) */}
                  <circle cx="50" cy="65" r="26" fill="#B45309" />
                  <circle cx="150" cy="65" r="26" fill="#B45309" />
                  <circle cx="70" cy="40" r="24" fill="#B45309" />
                  <circle cx="100" cy="30" r="26" fill="#B45309" />
                  <circle cx="130" cy="40" r="24" fill="#B45309" />
                  <circle cx="45" cy="100" r="25" fill="#B45309" />
                  <circle cx="155" cy="100" r="25" fill="#B45309" />
                  <circle cx="60" cy="135" r="22" fill="#B45309" />
                  <circle cx="140" cy="135" r="22" fill="#B45309" />

                  {/* Quloqlar */}
                  <circle cx="55" cy="60" r="16" fill="#F59E0B" />
                  <circle cx="145" cy="60" r="16" fill="#F59E0B" />

                  {/* Bosh */}
                  <circle cx="100" cy="100" r="50" fill="#FBBF24" />

                  {/* Aqlli, qat'iyatli ko'zlar va ko'zoynak */}
                  <circle cx="80" cy="92" r="16" fill="none" stroke="#4F46E5" strokeWidth="3.5" />
                  <circle cx="120" cy="92" r="16" fill="none" stroke="#4F46E5" strokeWidth="3.5" />
                  <line x1="96" y1="92" x2="104" y2="92" stroke="#4F46E5" strokeWidth="3" />

                  {/* Qorachiqlar */}
                  <ellipse cx="80" cy="92" rx="7" ry="9" fill="#1F2937" />
                  <circle cx="82" cy="89" r="3" fill="#FFFFFF" />
                  <ellipse cx="120" cy="92" rx="7" ry="9" fill="#1F2937" />
                  <circle cx="122" cy="89" r="3" fill="#FFFFFF" />

                  {/* Qoshlar (jiddiy va dadil) */}
                  <path d="M 68 76 L 90 82" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 132 76 L 110 82" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />

                  {/* Burun va ishonchli tabassum */}
                  <polygon points="100,105 92,114 108,114" fill="#92400E" rx="2" />
                  <path d="M 90 118 Q 100 128 110 118" stroke="#92400E" strokeWidth="3" fill="none" strokeLinecap="round" />

                  {/* Lider yulduz medali */}
                  <circle cx="100" cy="162" r="14" fill="#E11D48" />
                  <path d="M 100 152 L 103 160 L 111 160 L 105 165 L 107 172 L 100 167 L 93 172 L 95 165 L 89 160 L 97 160 Z" fill="#FDE047" />
                </svg>
              )}

              {/* GRADE 4: Qirol Sher (Adult King Lion) */}
              {progress.grade === 4 && (
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {/* Orqa fon nur taratuvchi doira */}
                  <circle cx="100" cy="100" r="90" fill="#FEF9C3" className="dark:fill-amber-950/50" />

                  {/* Hashamatli Oltin/Jigarrang Yol */}
                  <circle cx="45" cy="65" r="30" fill="#92400E" />
                  <circle cx="155" cy="65" r="30" fill="#92400E" />
                  <circle cx="70" cy="38" r="28" fill="#B45309" />
                  <circle cx="100" cy="25" r="30" fill="#92400E" />
                  <circle cx="130" cy="38" r="28" fill="#B45309" />
                  <circle cx="35" cy="105" r="28" fill="#92400E" />
                  <circle cx="165" cy="105" r="28" fill="#92400E" />
                  <circle cx="50" cy="142" r="26" fill="#B45309" />
                  <circle cx="150" cy="142" r="26" fill="#B45309" />
                  <circle cx="100" cy="165" r="26" fill="#92400E" />

                  {/* Bosh */}
                  <circle cx="100" cy="102" r="54" fill="#F59E0B" />

                  {/* Shohona Oltin Toj (King Crown) */}
                  <path d="M 72 56 L 82 28 L 100 44 L 118 28 L 128 56 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                  <circle cx="82" cy="28" r="4" fill="#EF4444" />
                  <circle cx="100" cy="42" r="5" fill="#3B82F6" />
                  <circle cx="118" cy="28" r="4" fill="#10B981" />

                  {/* Mag‘rur va do‘stona ko‘zlar */}
                  <ellipse cx="78" cy="94" rx="8" ry="11" fill="#111827" />
                  <circle cx="81" cy="90" r="4" fill="#FFFFFF" />
                  <circle cx="77" cy="96" r="2" fill="#FFFFFF" />

                  <ellipse cx="122" cy="94" rx="8" ry="11" fill="#111827" />
                  <circle cx="125" cy="90" r="4" fill="#FFFFFF" />
                  <circle cx="121" cy="96" r="2" fill="#FFFFFF" />

                  {/* Qirol qoshlari */}
                  <path d="M 68 80 L 88 84" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 132 80 L 112 84" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Burun va Qirol tabassumi */}
                  <polygon points="100,106 90,116 110,116" fill="#78350F" rx="2" />
                  <path d="M 88 120 Q 100 134 112 120" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 94 125 Q 100 138 106 125" fill="#DC2626" />

                  {/* Mo‘ylovlar */}
                  <line x1="60" y1="112" x2="40" y2="108" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  <line x1="60" y1="118" x2="40" y2="122" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  <line x1="140" y1="112" x2="160" y2="108" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  <line x1="140" y1="118" x2="160" y2="122" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </motion.div>

            {/* Click me hint badge */}
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3 py-0.5 rounded-full shadow-md whitespace-nowrap transition-transform group-hover:scale-105">
              Meni bos! 🐾
            </span>
          </div>

          <div className="mt-3 text-center">
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-200">
              {lionStage.title}
            </h3>
            <span className="inline-block mt-1 text-xs sm:text-sm font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full">
              {lionStage.badge}
            </span>
          </div>
        </div>

        {/* Sherchaning xabari va Progress qismi */}
        <div className="flex-1 max-w-xl">
          {/* Muloqot buluti (Speech Bubble) */}
          <div className="relative bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-lg border-2 border-amber-300 dark:border-amber-700/60 mb-5">
            <div className="absolute -left-3 top-8 hidden lg:block w-4 h-4 bg-white dark:bg-zinc-900 border-l-2 border-b-2 border-amber-300 dark:border-amber-700/60 transform rotate-45" />
            
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Shercha aytadi:</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-100 italic">
              &quot;{lionStage.quote}&quot;
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {lionStage.description}
            </p>
          </div>

          {/* XP Progress Bar */}
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-extrabold text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
                  Shercha tajribasi (XP)
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                {currentGradeXP} / {lionStage.xpNeededForNext} XP
              </span>
            </div>

            {/* Progress track */}
            <div className="w-full h-4 sm:h-5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1 border border-zinc-200 dark:border-zinc-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span>{xpPercent}% to‘ldi</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Keyingi daraja yaqin!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
