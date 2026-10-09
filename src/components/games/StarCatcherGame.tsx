'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GradeLevel } from '@/types';
import { motion } from 'framer-motion';
import { sound } from '@/utils/sound';
import GameTimer from './GameTimer';
import GameBreakModal from './GameBreakModal';
import { Sparkles, Trophy, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

interface FallingItem {
  id: number;
  x: number; // percentage 5% to 90%
  y: number; // percentage 0% to 100%
  type: 'gold' | 'blue' | 'cloud';
  emoji: string;
  speed: number;
}

interface StarCatcherGameProps {
  grade: GradeLevel;
  onBackToMenu: () => void;
}

export default function StarCatcherGame({ grade, onBackToMenu }: StarCatcherGameProps) {
  const isJunior = grade <= 2;

  // Game state
  const [basketX, setBasketX] = useState(50); // percentage 10% to 90%
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [starsCaught, setStarsCaught] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [comboText, setComboText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextItemIdRef = useRef(1);

  // Speed and rule settings based on grade
  const fallSpeedMultiplier = isJunior ? 0.35 : 0.65; // Junior: sekin va ohista tushadi

  // Reset / Start
  const restartGame = () => {
    setBasketX(50);
    setItems([]);
    setScore(0);
    setStarsCaught(0);
    setIsGameOver(false);
    setComboText(null);
  };

  useEffect(() => {
    restartGame();
  }, [grade]);

  // Main game loop (Falling objects and collision)
  useEffect(() => {
    if (isGameOver) return;

    // Spawn timer
    const spawnInterval = setInterval(() => {
      setItems((prev) => {
        if (prev.length >= (isJunior ? 4 : 6)) return prev;

        const xPos = Math.floor(Math.random() * 80) + 10;
        let type: 'gold' | 'blue' | 'cloud' = 'gold';
        let emoji = '⭐';

        if (!isJunior) {
          // 3-4 sinflarda har xil turdagi ob'ektlar tushadi
          const rand = Math.random();
          if (rand > 0.6) {
            type = 'gold';
            emoji = '🌟'; // Maqsadli oltin yulduz
          } else if (rand > 0.3) {
            type = 'blue';
            emoji = '💎'; // Ko'k kristall
          } else {
            type = 'cloud';
            emoji = '☁️'; // Xira bulutcha (olmaslik kerak)
          }
        }

        const newItem: FallingItem = {
          id: nextItemIdRef.current++,
          x: xPos,
          y: 0,
          type,
          emoji,
          speed: (Math.random() * 0.4 + 0.6) * fallSpeedMultiplier,
        };

        return [...prev, newItem];
      });
    }, isJunior ? 1400 : 900);

    // Physics tick (movement & collision)
    const tickInterval = setInterval(() => {
      setItems((prev) => {
        const remaining: FallingItem[] = [];

        prev.forEach((item) => {
          const nextY = item.y + item.speed * 2.5;

          // Check collision with basket near bottom (Y >= 82% and within basketX range)
          const isAtBasketY = nextY >= 78 && nextY <= 92;
          const isAtBasketX = Math.abs(item.x - basketX) < 14;

          if (isAtBasketY && isAtBasketX) {
            // Collision caught!
            if (isJunior || item.type === 'gold' || item.type === 'blue') {
              sound.playCoin();
              setScore((s) => s + (item.type === 'gold' ? 10 : 5));
              setStarsCaught((c) => c + 1);
              setComboText(item.type === 'gold' ? '+10 Oltin!' : '+5 Baraka!');
              setTimeout(() => setComboText(null), 800);
            } else {
              // Cloud touched (not a harsh punishment, just polite feedback)
              sound.playTap();
              setComboText('Bulutcha! ☁️');
              setTimeout(() => setComboText(null), 800);
            }
          } else if (nextY < 100) {
            remaining.push({ ...item, y: nextY });
          }
        });

        return remaining;
      });
    }, 40);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(tickInterval);
    };
  }, [basketX, isGameOver, isJunior, fallSpeedMultiplier]);

  // Touch / Mouse move handler across game container
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(10, Math.min(90, relativeX));
    setBasketX(clamped);
  };

  // Keyboard left / right arrow controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setBasketX((prev) => Math.max(10, prev - 8));
      } else if (e.key === 'ArrowRight') {
        setBasketX((prev) => Math.min(90, prev + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
            ⭐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
                Yulduz ushlash
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {isJunior ? '1-2 sinf (Sekin & Oson)' : '3-4 sinf (Oltin yulduzlar)'}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {isJunior
                ? 'Sherchani surib, tushayotgan barcha yulduzlarni savatchaga yig‘ing!'
                : 'Faqat 🌟 oltin yulduz va 💎 kristallarni tuting, bulutlardan qoching!'}
            </p>
          </div>
        </div>

        {/* 2-minute timer */}
        <GameTimer
          totalSeconds={120}
          isActive={!isGameOver}
          onTimeUp={() => setIsGameOver(true)}
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-2 text-xs font-black text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-zinc-700">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Yig‘ilgan ball: {score}</span>
        </div>
        <div className="bg-amber-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-zinc-700">
          <span>Ushlangan yulduzlar: {starsCaught} ta</span>
        </div>
        <button
          onClick={restartGame}
          className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Qaytadan</span>
        </button>
      </div>

      {/* Arcade Sky Game Arena */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-[380px] sm:h-[420px] rounded-3xl border-4 border-amber-300 dark:border-zinc-800 overflow-hidden select-none cursor-ew-resize bg-gradient-to-b from-sky-400 via-indigo-600 to-indigo-900 shadow-2xl"
      >
        {/* Floating clouds background decoration */}
        <div className="absolute top-4 left-6 text-2xl opacity-40 animate-pulse">☁️</div>
        <div className="absolute top-12 right-10 text-3xl opacity-30 animate-pulse">☁️</div>

        {/* Combo / Pop text */}
        {comboText && (
          <motion.div
            initial={{ scale: 0.5, y: 10, opacity: 0 }}
            animate={{ scale: 1.2, y: -20, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-30 font-black text-lg sm:text-xl text-yellow-300 drop-shadow-md"
          >
            {comboText}
          </motion.div>
        )}

        {/* Falling objects */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="text-3xl sm:text-4xl filter drop-shadow-lg transition-transform duration-75"
          >
            {item.emoji}
          </div>
        ))}

        {/* Catcher Basket / Lion at the bottom */}
        <div
          style={{
            position: 'absolute',
            left: `${basketX}%`,
            bottom: '15px',
            transform: 'translateX(-50%)',
          }}
          className="flex flex-col items-center justify-center transition-all duration-75 pointer-events-none"
        >
          <div className="text-4xl sm:text-5xl animate-bounce">
            🦁
          </div>
          <div className="bg-amber-400 text-amber-950 font-black text-[11px] px-3 py-1 rounded-full border-2 border-white shadow-lg flex items-center gap-1 -mt-1">
            <span>🧺 Savatcha</span>
          </div>
        </div>

        {/* Mobile touch helper guide buttons */}
        <div className="absolute bottom-2 inset-x-4 flex items-center justify-between pointer-events-none opacity-60 text-white text-xs font-bold">
          <span>👈 Barmog‘ingiz bilan suring</span>
          <span>👉</span>
        </div>
      </div>

      {/* Break completion modal */}
      <GameBreakModal
        isOpen={isGameOver}
        gameId="stars"
        gameTitle="Yulduz ushlash"
        score={score}
        bonusCoins={10}
        onRestart={restartGame}
        onChooseAnother={onBackToMenu}
      />
    </div>
  );
}
