'use client';

import React, { useState, useEffect } from 'react';
import { GradeLevel } from '@/types';
import { motion } from 'framer-motion';
import { sound } from '@/utils/sound';
import GameTimer from './GameTimer';
import GameBreakModal from './GameBreakModal';
import { Sparkles, Trophy, RotateCcw, Eye, HelpCircle } from 'lucide-react';

interface PuzzlePiece {
  id: number;
  currentPos: number; // 0, 1, 2, ...
  correctPos: number; // 0, 1, 2, ...
  labelEmoji: string;
  color: string;
}

// Chiroyli mavzular (Shercha rasmi va belgilar)
const THEME_PIECES_4 = [
  { correctPos: 0, labelEmoji: '🦁', color: 'from-amber-400 to-yellow-500' },
  { correctPos: 1, labelEmoji: '👑', color: 'from-orange-400 to-amber-500' },
  { correctPos: 2, labelEmoji: '🌟', color: 'from-yellow-400 to-amber-400' },
  { correctPos: 3, labelEmoji: '🏆', color: 'from-amber-500 to-orange-600' },
];

const THEME_PIECES_9 = [
  { correctPos: 0, labelEmoji: '🦁', color: 'from-amber-400 to-yellow-400' },
  { correctPos: 1, labelEmoji: '👑', color: 'from-yellow-400 to-amber-500' },
  { correctPos: 2, labelEmoji: '🎓', color: 'from-orange-400 to-amber-500' },
  { correctPos: 3, labelEmoji: '📚', color: 'from-amber-500 to-orange-500' },
  { correctPos: 4, labelEmoji: '⭐', color: 'from-yellow-300 to-amber-400' },
  { correctPos: 5, labelEmoji: '🚀', color: 'from-orange-500 to-red-500' },
  { correctPos: 6, labelEmoji: '🎯', color: 'from-amber-400 to-orange-500' },
  { correctPos: 7, labelEmoji: '🧠', color: 'from-orange-400 to-yellow-500' },
  { correctPos: 8, labelEmoji: '🏆', color: 'from-amber-500 to-yellow-400' },
];

interface PuzzleGameProps {
  grade: GradeLevel;
  onBackToMenu: () => void;
}

export default function PuzzleGame({ grade, onBackToMenu }: PuzzleGameProps) {
  const isJunior = grade <= 2;
  const gridSize = isJunior ? 2 : 3; // 2x2 = 4 bo'lak (kichiklar) yoki 3x3 = 9 bo'lak (kattalar)
  const totalPieces = gridSize * gridSize;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(isJunior); // 1-2 sinfda kontur yo'naltiruvchi doim yoqilgan
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const initializePuzzle = () => {
    const base = isJunior ? THEME_PIECES_4 : THEME_PIECES_9;

    // Shuffle current positions
    const positions = Array.from({ length: totalPieces }, (_, i) => i);
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

    // Make sure it doesn't accidentally start fully solved
    let isAlreadySolved = shuffledPositions.every((pos, i) => pos === i);
    if (isAlreadySolved && totalPieces > 1) {
      [shuffledPositions[0], shuffledPositions[1]] = [shuffledPositions[1], shuffledPositions[0]];
    }

    const newPieces: PuzzlePiece[] = base.map((item, index) => ({
      id: index,
      currentPos: shuffledPositions[index],
      correctPos: item.correctPos,
      labelEmoji: item.labelEmoji,
      color: item.color,
    }));

    setPieces(newPieces);
    setSelectedPieceIndex(null);
    setMoves(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initializePuzzle();
  }, [grade]);

  // Check if puzzle is completed
  const checkCompletion = (currentPieces: PuzzlePiece[]) => {
    const isCompleted = currentPieces.every((p) => p.currentPos === p.correctPos);
    if (isCompleted) {
      sound.playVictory();
      setTimeout(() => {
        setIsGameOver(true);
      }, 500);
    }
  };

  const handleTileClick = (index: number) => {
    sound.playTap();

    if (selectedPieceIndex === null) {
      // First selection
      setSelectedPieceIndex(index);
    } else if (selectedPieceIndex === index) {
      // Deselect
      setSelectedPieceIndex(null);
    } else {
      // Swap positions between selectedPieceIndex and index
      setMoves((m) => m + 1);

      const updated = [...pieces];
      const posA = updated[selectedPieceIndex].currentPos;
      const posB = updated[index].currentPos;

      updated[selectedPieceIndex].currentPos = posB;
      updated[index].currentPos = posA;

      setPieces(updated);
      setSelectedPieceIndex(null);

      // Check if correct placement was achieved
      if (updated[selectedPieceIndex].currentPos === updated[selectedPieceIndex].correctPos ||
          updated[index].currentPos === updated[index].correctPos) {
        sound.playCorrect();
      }

      checkCompletion(updated);
    }
  };

  // Find piece currently at grid cell `cellPos`
  const getPieceAtCell = (cellPos: number) => {
    return pieces.find((p) => p.currentPos === cellPos);
  };

  const correctlyPlacedCount = pieces.filter((p) => p.currentPos === p.correctPos).length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
            🧩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
                Mini-pazl
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {isJunior ? '1-2 sinf (4 ta yirik bo‘lak)' : '3-4 sinf (9 ta bo‘lak)'}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {isJunior
                ? 'Bo‘laklarni bosib, o‘rinlarini almashtiring. Kontur yordam beradi!'
                : 'Rasmni to‘g‘ri ketma-ketlikda yig‘ing (Swap usulida)!'}
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

      {/* Controls & Progress bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs font-black text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-zinc-700">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>To‘g‘ri joylashgan: {correctlyPlacedCount} / {totalPieces}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition ${
              showHint
                ? 'bg-amber-200 dark:bg-amber-900/60 border-amber-400 text-amber-950 dark:text-amber-200'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 text-zinc-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Kontur {showHint ? 'yoqilgan' : 'yopiq'}</span>
          </button>

          <button
            onClick={initializePuzzle}
            className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Qaytadan</span>
          </button>
        </div>
      </div>

      {/* Puzzle Board Grid */}
      <div
        className={`grid gap-3 sm:gap-4 p-4 sm:p-6 bg-white/70 dark:bg-zinc-900/70 rounded-3xl border-4 border-amber-200 dark:border-zinc-800 shadow-xl max-w-md mx-auto ${
          gridSize === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {Array.from({ length: totalPieces }).map((_, cellPos) => {
          const piece = getPieceAtCell(cellPos);
          if (!piece) return null;

          const isSelected = selectedPieceIndex === piece.id;
          const isCorrect = piece.currentPos === piece.correctPos;

          return (
            <motion.div
              key={cellPos}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleTileClick(piece.id)}
              className={`relative aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center cursor-pointer select-none border-4 transition-all shadow-md overflow-hidden ${
                isSelected
                  ? 'border-blue-500 ring-4 ring-blue-300 dark:ring-blue-700 scale-105 z-10'
                  : isCorrect
                  ? 'border-emerald-400/80 shadow-emerald-500/20'
                  : 'border-amber-300 dark:border-zinc-700 hover:border-amber-400'
              } bg-gradient-to-tr ${piece.color}`}
            >
              {/* Optional Background contour guide indicator */}
              {showHint && (
                <span className="absolute bottom-1 right-2 text-[10px] font-mono font-black text-white/50">
                  #{piece.correctPos + 1}
                </span>
              )}

              {/* Central Emoji / Image Symbol */}
              <span className={gridSize === 2 ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}>
                {piece.labelEmoji}
              </span>

              {/* Status indicator on tile */}
              {isCorrect && (
                <span className="absolute top-1.5 right-1.5 text-xs bg-emerald-500/80 text-white rounded-full p-0.5">
                  ✓
                </span>
              )}

              {isSelected && (
                <span className="absolute top-1.5 left-1.5 text-[9px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                  Tanlandi
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="text-center text-xs text-zinc-500 font-medium">
        💡 <strong>Ko‘rsatma:</strong> Bir bo‘lakni bosing, so‘ng almashtirmoqchi bo‘lgan ikkinchi bo‘lakni bosing!
      </div>

      {/* Break completion modal */}
      <GameBreakModal
        isOpen={isGameOver}
        gameTitle="Mini-pazl"
        score={correctlyPlacedCount * 12 + 20}
        bonusCoins={30}
        onRestart={initializePuzzle}
        onChooseAnother={onBackToMenu}
      />
    </div>
  );
}
