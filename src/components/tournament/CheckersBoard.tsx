'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShashkaPiece, CheckersMove, PieceColor, BoardPosition } from '@/types/tournament';
import { BOARD_SIZE, isDarkSquare } from '@/utils/checkersLogic';
import { Crown, Sparkles } from 'lucide-react';

interface CheckersBoardProps {
  board: ShashkaPiece[];
  selectedPiece: ShashkaPiece | null;
  legalMoves: CheckersMove[];
  currentTurn: PieceColor;
  playerColor: PieceColor;
  lastMove: CheckersMove | null;
  isAiThinking?: boolean;
  onSquareClick: (row: number, col: number) => void;
}

export default function CheckersBoard({
  board,
  selectedPiece,
  legalMoves,
  currentTurn,
  playerColor,
  lastMove,
  isAiThinking,
  onSquareClick,
}: CheckersBoardProps) {
  // Katakda tosh borligini tekshirish
  const getPieceAtCoord = (r: number, c: number) => {
    return board.find((p) => p.row === r && p.col === c);
  };

  // Ushbu katak tanlangan tosh uchun borishi mumkin bo'lgan katakmi
  const isTargetSquare = (r: number, c: number) => {
    return legalMoves.some((m) => m.to.row === r && m.to.col === c);
  };

  // Oxirgi yurilgan katakmi
  const isLastMoveSquare = (r: number, c: number) => {
    if (!lastMove) return false;
    return (
      (lastMove.from.row === r && lastMove.from.col === c) ||
      (lastMove.to.row === r && lastMove.to.col === c)
    );
  };

  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const rowLabels = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[480px] sm:max-w-[540px] mx-auto">
      {/* Board Frame */}
      <div className="relative p-2.5 sm:p-3.5 bg-gradient-to-br from-amber-900 via-stone-800 to-amber-950 rounded-3xl shadow-2xl border-4 border-amber-600/60 dark:border-amber-500/40 w-full aspect-square">
        {/* Inner Board */}
        <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-2xl overflow-hidden border-2 border-amber-700/50 shadow-inner">
          {Array.from({ length: BOARD_SIZE }).map((_, r) =>
            Array.from({ length: BOARD_SIZE }).map((_, c) => {
              const isDark = isDarkSquare(r, c);
              const piece = getPieceAtCoord(r, c);
              const isSelected = selectedPiece?.row === r && selectedPiece?.col === c;
              const isTarget = isTargetSquare(r, c);
              const isLast = isLastMoveSquare(r, c);

              // Katak foni
              let squareBg = isDark
                ? 'bg-amber-950/90 dark:bg-stone-900'
                : 'bg-amber-100 dark:bg-stone-300';

              if (isLast) {
                squareBg = isDark ? 'bg-amber-800/90' : 'bg-amber-200';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => onSquareClick(r, c)}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors ${squareBg}`}
                >
                  {/* Katak koordinatalari (burchaklarda) */}
                  {c === 0 && (
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-bold text-amber-500/70 select-none pointer-events-none">
                      {rowLabels[r]}
                    </span>
                  )}
                  {r === 7 && (
                    <span className="absolute bottom-0.5 right-1 text-[8px] sm:text-[9px] font-bold text-amber-500/70 select-none pointer-events-none">
                      {colLabels[c]}
                    </span>
                  )}

                  {/* Yurish mumkin bo'lgan katak indikatori (Yashil/Oltin nuqta) */}
                  {isTarget && (
                    <div className="absolute z-20 flex items-center justify-center pointer-events-none">
                      {piece ? (
                        /* Agar raqib toshi bo'lsa, urish doirasi */
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-rose-500 bg-rose-500/25 shadow-lg shadow-rose-500/50"
                        />
                      ) : (
                        /* Bo'sh katak bo'lsa, yorqin nuqta */
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: [0.9, 1.2, 0.9] }}
                          transition={{ repeat: Infinity, duration: 1.4 }}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-400 dark:bg-emerald-500 shadow-md shadow-emerald-400/80 ring-4 ring-emerald-300/40"
                        />
                      )}
                    </div>
                  )}

                  {/* Shashka Toshi */}
                  {piece && (
                    <motion.div
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isSelected ? 1.08 : 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`relative z-10 w-[82%] h-[82%] rounded-full flex items-center justify-center shadow-lg transition-transform ${
                        piece.color === 'white'
                          ? 'bg-gradient-to-tr from-amber-100 via-stone-100 to-amber-50 border-4 border-amber-300 text-amber-900 shadow-amber-900/40'
                          : 'bg-gradient-to-tr from-stone-900 via-stone-800 to-neutral-700 border-4 border-stone-600 text-stone-100 shadow-black/60'
                      } ${
                        isSelected
                          ? 'ring-4 ring-amber-400 ring-offset-2 scale-105 shadow-xl shadow-amber-500/60'
                          : ''
                      }`}
                    >
                      {/* Ichki halqa bezagi */}
                      <div
                        className={`w-[70%] h-[70%] rounded-full border-2 flex items-center justify-center ${
                          piece.color === 'white'
                            ? 'border-amber-300/70 bg-amber-50/50'
                            : 'border-stone-600/70 bg-stone-900/50'
                        }`}
                      >
                        {/* Damka (Shoh) Belgisi */}
                        {piece.isKing ? (
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="flex flex-col items-center justify-center"
                          >
                            <Crown
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                piece.color === 'white'
                                  ? 'text-amber-500 fill-amber-400'
                                  : 'text-yellow-400 fill-yellow-400'
                              } drop-shadow-md`}
                            />
                          </motion.div>
                        ) : (
                          <div
                            className={`w-2 h-2 rounded-full ${
                              piece.color === 'white'
                                ? 'bg-amber-300'
                                : 'bg-stone-500'
                            }`}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
