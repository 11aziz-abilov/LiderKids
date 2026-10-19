'use client';

import React, { useState, useEffect } from 'react';
import { GradeLevel } from '@/types';
import { motion } from 'framer-motion';
import { sound } from '@/utils/sound';
import GameTimer from './GameTimer';
import GameBreakModal from './GameBreakModal';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';

interface MemoryCard {
  id: number;
  pairId: number;
  emoji: string;
  nameUz: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 1-2 sinflar uchun katta va aniq emojilar (4 ta juftlik = 8 ta karta, 4x2 yoki 3x2)
const JUNIOR_ITEMS = [
  { pairId: 1, emoji: '🦁', nameUz: 'Shercha' },
  { pairId: 2, emoji: '👑', nameUz: 'Toj' },
  { pairId: 3, emoji: '🍎', nameUz: 'Olma' },
  { pairId: 4, emoji: '🚀', nameUz: 'Raketa' },
];

// 3-4 sinflar uchun ko'proq diqqat talab qiluvchi belgilar (8 ta juftlik = 16 ta karta, 4x4)
const SENIOR_ITEMS = [
  { pairId: 1, emoji: '📐', nameUz: 'Chizg‘ich' },
  { pairId: 2, emoji: '🔬', nameUz: 'Mikroskop' },
  { pairId: 3, emoji: '🪐', nameUz: 'Sayyora' },
  { pairId: 4, emoji: '⚡', nameUz: 'Chaqmoq' },
  { pairId: 5, emoji: '🏆', nameUz: 'Kubok' },
  { pairId: 6, emoji: '🧠', nameUz: 'Mantiq' },
  { pairId: 7, emoji: '🎨', nameUz: 'Bo‘yoq' },
  { pairId: 8, emoji: '🎯', nameUz: 'Nishon' },
];

interface MemoryGameProps {
  grade: GradeLevel;
  onBackToMenu: () => void;
}

export default function MemoryGame({ grade, onBackToMenu }: MemoryGameProps) {
  const isJunior = grade <= 2;
  const targetPairCount = isJunior ? 3 : 8; // 1-2 sinfda 6 ta (3x2) yoki 8 ta, 3-4 sinfda 16 ta (4x4)

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize deck based on grade
  const initializeGame = () => {
    const baseItems = isJunior
      ? JUNIOR_ITEMS.slice(0, targetPairCount)
      : SENIOR_ITEMS.slice(0, targetPairCount);

    const deck: MemoryCard[] = [];
    baseItems.forEach((item, index) => {
      // 2 ta nusxa (juftlik)
      deck.push({
        id: index * 2,
        pairId: item.pairId,
        emoji: item.emoji,
        nameUz: item.nameUz,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: index * 2 + 1,
        pairId: item.pairId,
        emoji: item.emoji,
        nameUz: item.nameUz,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairsCount(0);
    setMoves(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, [grade]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    sound.playTap();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playCorrect();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          const newMatched = matchedPairsCount + 1;
          setMatchedPairsCount(newMatched);

          if (newMatched >= targetPairCount) {
            setTimeout(() => {
              setIsGameOver(true);
            }, 600);
          }
        }, 400);
      } else {
        // Not matched, flip back gently
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
            🃏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
                Juftini top
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {isJunior ? '1-2 sinf (Kichiklar)' : '3-4 sinf (Kattaroqlar)'}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {isJunior
                ? '6 ta katta karta — bir xil rasmlarni toping!'
                : '16 ta karta (4x4) — diqqatingizni jamlang!'}
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
          <span>Topilgan juftliklar: {matchedPairsCount} / {targetPairCount}</span>
        </div>
        <div className="bg-amber-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-zinc-700">
          <span>Harakatlar: {moves} ta</span>
        </div>
        <button
          onClick={initializeGame}
          className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Qaytadan</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-3 sm:gap-4 p-4 bg-white/70 dark:bg-zinc-900/70 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-inner ${
          isJunior
            ? 'grid-cols-3 sm:grid-cols-3 max-w-md mx-auto min-h-[300px]'
            : 'grid-cols-4 sm:grid-cols-4 max-w-lg mx-auto min-h-[360px]'
        }`}
      >
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer select-none transition-all shadow-md ${
                card.isMatched
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-400 opacity-90'
                  : isRevealed
                  ? 'bg-amber-100 dark:bg-zinc-800 border-2 border-amber-400 shadow-amber-500/20'
                  : 'bg-gradient-to-tr from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-2 border-yellow-300 text-white shadow-orange-500/20'
              }`}
            >
              {isRevealed ? (
                <motion.div
                  initial={{ scale: 0.5, rotateY: 90 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className={isJunior ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}>
                    {card.emoji}
                  </span>
                  {isJunior && (
                    <span className="text-[10px] font-extrabold text-zinc-600 dark:text-zinc-300 mt-1">
                      {card.nameUz}
                    </span>
                  )}
                </motion.div>
              ) : (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-2xl sm:text-3xl opacity-80"
                >
                  🦁
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Break completion modal */}
      <GameBreakModal
        isOpen={isGameOver}
        gameId="memory"
        gameTitle="Juftini top"
        score={matchedPairsCount * 15}
        bonusCoins={10}
        onRestart={initializeGame}
        onChooseAnother={onBackToMenu}
      />
    </div>
  );
}
