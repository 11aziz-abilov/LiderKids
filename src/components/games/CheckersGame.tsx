'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GradeLevel } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/utils/sound';
import GameTimer from './GameTimer';
import GameBreakModal from './GameBreakModal';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Crown,
  HelpCircle,
  X,
  Swords,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Piece {
  id: string;
  player: 'white' | 'black'; // white: o'quvchi (bola), black: Shercha AI
  isKing: boolean;
  row: number;
  col: number;
}

interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  capturedPiece?: Piece;
}

interface CheckersGameProps {
  grade: GradeLevel;
  onBackToMenu: () => void;
}

export default function CheckersGame({ grade, onBackToMenu }: CheckersGameProps) {
  const isJunior = grade <= 2;
  const boardSize = isJunior ? 6 : 8; // 6x6 kichiklar uchun, 8x8 kattalar uchun

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [capturedByWhite, setCapturedByWhite] = useState<Piece[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<Piece[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [kingAnnouncement, setKingAnnouncement] = useState<string | null>(null);

  // Initialize Board
  const initBoard = useCallback(() => {
    const newPieces: Piece[] = [];
    const rowsPerPlayer = isJunior ? 2 : 3;

    // Black pieces (Bot / Shercha) at the top rows
    for (let r = 0; r < rowsPerPlayer; r++) {
      for (let c = 0; c < boardSize; c++) {
        if ((r + c) % 2 === 1) {
          newPieces.push({
            id: `black-${r}-${c}`,
            player: 'black',
            isKing: false,
            row: r,
            col: c,
          });
        }
      }
    }

    // White pieces (Player / Bola) at the bottom rows
    for (let r = boardSize - rowsPerPlayer; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if ((r + c) % 2 === 1) {
          newPieces.push({
            id: `white-${r}-${c}`,
            player: 'white',
            isKing: false,
            row: r,
            col: c,
          });
        }
      }
    }

    setPieces(newPieces);
    setSelectedPiece(null);
    setValidMoves([]);
    setTurn('white');
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setIsGameOver(false);
    setGameResult(null);
    setIsBotThinking(false);
    setLastMove(null);
    setKingAnnouncement(null);
  }, [boardSize, isJunior]);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Find piece at position
  const getPieceAt = (r: number, c: number, currentPieces: Piece[] = pieces): Piece | undefined => {
    return currentPieces.find((p) => p.row === r && p.col === c);
  };

  // Calculate available moves for a given piece
  const getMovesForPiece = useCallback(
    (piece: Piece, currentPieces: Piece[] = pieces): Move[] => {
      const moves: Move[] = [];
      const directions: [number, number][] = [];

      if (piece.isKing) {
        // King can move in all 4 diagonal directions
        directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      } else if (piece.player === 'white') {
        // White regular moves upwards
        directions.push([-1, -1], [-1, 1]);
      } else {
        // Black regular moves downwards
        directions.push([1, -1], [1, 1]);
      }

      for (const [dr, dc] of directions) {
        const nextR = piece.row + dr;
        const nextC = piece.col + dc;

        // Check 1-step move
        if (nextR >= 0 && nextR < boardSize && nextC >= 0 && nextC < boardSize) {
          const target = getPieceAt(nextR, nextC, currentPieces);
          if (!target) {
            moves.push({
              fromRow: piece.row,
              fromCol: piece.col,
              toRow: nextR,
              toCol: nextC,
            });
          }
        }

        // Check Jump / Capture (also regular pieces can capture backwards in standard kid checkers)
        const allJumpDirections: [number, number][] = piece.isKing
          ? directions
          : [[-1, -1], [-1, 1], [1, -1], [1, 1]];

        for (const [jdr, jdc] of allJumpDirections) {
          const midR = piece.row + jdr;
          const midC = piece.col + jdc;
          const landR = piece.row + jdr * 2;
          const landC = piece.col + jdc * 2;

          if (landR >= 0 && landR < boardSize && landC >= 0 && landC < boardSize) {
            const midPiece = getPieceAt(midR, midC, currentPieces);
            const landPiece = getPieceAt(landR, landC, currentPieces);

            if (midPiece && midPiece.player !== piece.player && !landPiece) {
              moves.push({
                fromRow: piece.row,
                fromCol: piece.col,
                toRow: landR,
                toCol: landC,
                capturedPiece: midPiece,
              });
            }
          }
        }
      }

      // Prioritize capture moves if any exist
      const captureMoves = moves.filter((m) => m.capturedPiece);
      return captureMoves.length > 0 ? captureMoves : moves;
    },
    [boardSize, pieces]
  );

  // Check all available moves for a player
  const getAllMovesForPlayer = useCallback(
    (player: 'white' | 'black', currentPieces: Piece[] = pieces): { piece: Piece; moves: Move[] }[] => {
      const playerPieces = currentPieces.filter((p) => p.player === player);
      const pieceMovesList: { piece: Piece; moves: Move[] }[] = [];

      let hasAnyCaptures = false;

      for (const p of playerPieces) {
        const moves = getMovesForPiece(p, currentPieces);
        if (moves.some((m) => m.capturedPiece)) {
          hasAnyCaptures = true;
        }
        if (moves.length > 0) {
          pieceMovesList.push({ piece: p, moves });
        }
      }

      // In checkers, if captures are available, player must capture
      if (hasAnyCaptures) {
        return pieceMovesList
          .map((item) => ({
            piece: item.piece,
            moves: item.moves.filter((m) => m.capturedPiece),
          }))
          .filter((item) => item.moves.length > 0);
      }

      return pieceMovesList;
    },
    [getMovesForPiece, pieces]
  );

  // Handle piece selection
  const handlePieceClick = (piece: Piece) => {
    if (turn !== 'white' || isGameOver || isBotThinking) return;
    if (piece.player !== 'white') return;

    sound.playTap();

    const allPlayerMoves = getAllMovesForPlayer('white');
    const thisPieceMovesEntry = allPlayerMoves.find((item) => item.piece.id === piece.id);

    if (thisPieceMovesEntry) {
      setSelectedPiece(piece);
      setValidMoves(thisPieceMovesEntry.moves);
    } else {
      setSelectedPiece(piece);
      setValidMoves([]);
    }
  };

  // Execute a move
  const executeMove = useCallback(
    (move: Move, currentPieces: Piece[]): { nextPieces: Piece[]; captured?: Piece; becameKing: boolean } => {
      let becameKing = false;
      let nextPieces = currentPieces.map((p) => {
        if (p.row === move.fromRow && p.col === move.fromCol) {
          const promote =
            (!p.isKing && p.player === 'white' && move.toRow === 0) ||
            (!p.isKing && p.player === 'black' && move.toRow === boardSize - 1);

          if (promote) becameKing = true;

          return {
            ...p,
            row: move.toRow,
            col: move.toCol,
            isKing: p.isKing || promote,
          };
        }
        return p;
      });

      if (move.capturedPiece) {
        nextPieces = nextPieces.filter((p) => p.id !== move.capturedPiece!.id);
      }

      return { nextPieces, captured: move.capturedPiece, becameKing };
    },
    [boardSize]
  );

  // Handle cell click (moving selected piece)
  const handleCellClick = (r: number, c: number) => {
    if (turn !== 'white' || !selectedPiece || isGameOver || isBotThinking) return;

    const move = validMoves.find((m) => m.toRow === r && m.toCol === c);
    if (!move) return;

    const { nextPieces, captured, becameKing } = executeMove(move, pieces);

    if (captured) {
      sound.playCorrect();
      setCapturedByWhite((prev) => [...prev, captured]);
    } else {
      sound.playTap();
    }

    if (becameKing) {
      sound.playVictory();
      setKingAnnouncement('Shohga aylandi! 👑');
      setTimeout(() => setKingAnnouncement(null), 2500);
    }

    setLastMove({ from: [move.fromRow, move.fromCol], to: [move.toRow, move.toCol] });
    setPieces(nextPieces);
    setSelectedPiece(null);
    setValidMoves([]);

    // Check if player won
    const blackPiecesLeft = nextPieces.filter((p) => p.player === 'black');
    if (blackPiecesLeft.length === 0) {
      sound.playVictory();
      setGameResult('win');
      setIsGameOver(true);
      return;
    }

    // Switch to Bot's turn
    setTurn('black');
  };

  // Bot AI Turn
  useEffect(() => {
    if (turn !== 'black' || isGameOver) return;

    setIsBotThinking(true);

    const botTimer = setTimeout(() => {
      const allBotMoves = getAllMovesForPlayer('black', pieces);

      if (allBotMoves.length === 0) {
        // Bot has no moves, player wins
        sound.playVictory();
        setGameResult('win');
        setIsGameOver(true);
        setIsBotThinking(false);
        return;
      }

      // Check if any capture moves exist
      const captureOptions: { piece: Piece; move: Move }[] = [];
      const regularOptions: { piece: Piece; move: Move }[] = [];

      for (const item of allBotMoves) {
        for (const m of item.moves) {
          if (m.capturedPiece) {
            captureOptions.push({ piece: item.piece, move: m });
          } else {
            regularOptions.push({ piece: item.piece, move: m });
          }
        }
      }

      // Choose best move: Prioritize capture, otherwise choose strategically
      let chosen: { piece: Piece; move: Move };

      if (captureOptions.length > 0) {
        chosen = captureOptions[Math.floor(Math.random() * captureOptions.length)];
      } else {
        // Senior bot tries to advance kings or protect pieces, junior bot picks friendly random
        if (!isJunior && Math.random() > 0.3) {
          // Senior preference: move king or move pieces from back row
          const kingMoves = regularOptions.filter((opt) => opt.piece.isKing);
          if (kingMoves.length > 0) {
            chosen = kingMoves[Math.floor(Math.random() * kingMoves.length)];
          } else {
            chosen = regularOptions[Math.floor(Math.random() * regularOptions.length)];
          }
        } else {
          chosen = regularOptions[Math.floor(Math.random() * regularOptions.length)];
        }
      }

      const { nextPieces, captured, becameKing } = executeMove(chosen.move, pieces);

      if (captured) {
        sound.playIncorrect();
        setCapturedByBlack((prev) => [...prev, captured]);
      } else {
        sound.playTap();
      }

      if (becameKing) {
        setKingAnnouncement('Shercha shoh chiqardi! 🦁👑');
        setTimeout(() => setKingAnnouncement(null), 2500);
      }

      setLastMove({
        from: [chosen.move.fromRow, chosen.move.fromCol],
        to: [chosen.move.toRow, chosen.move.toCol],
      });
      setPieces(nextPieces);
      setIsBotThinking(false);

      // Check if white player has pieces or moves left
      const whitePiecesLeft = nextPieces.filter((p) => p.player === 'white');
      if (whitePiecesLeft.length === 0) {
        setGameResult('lose');
        setIsGameOver(true);
        return;
      }

      const whitePossibleMoves = getAllMovesForPlayer('white', nextPieces);
      if (whitePossibleMoves.length === 0) {
        setGameResult('lose');
        setIsGameOver(true);
        return;
      }

      setTurn('white');
    }, isJunior ? 700 : 900);

    return () => clearTimeout(botTimer);
  }, [turn, isGameOver, pieces, getAllMovesForPlayer, executeMove, isJunior]);

  // Handle Time Up
  const handleTimeUp = () => {
    const whiteCount = pieces.filter((p) => p.player === 'white').length;
    const blackCount = pieces.filter((p) => p.player === 'black').length;

    if (whiteCount > blackCount) {
      setGameResult('win');
    } else if (whiteCount < blackCount) {
      setGameResult('lose');
    } else {
      setGameResult('draw');
    }
    setIsGameOver(true);
  };

  const whiteCount = pieces.filter((p) => p.player === 'white').length;
  const blackCount = pieces.filter((p) => p.player === 'black').length;
  const score = capturedByWhite.length * 25 + (gameResult === 'win' ? 50 : 10);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-3xl border border-amber-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center text-2xl shadow-md">
            ⚪
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span>Shashka Bahsi</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {isJunior ? '6x6 Oson' : '8x8 Klassik'}
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {turn === 'white' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Sizning navbatingiz (Oq toshlar)
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <span>🦁 Shercha o‘ylamoqda...</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-2">
          <GameTimer totalSeconds={120} isActive={!isGameOver} onTimeUp={handleTimeUp} />

          <button
            onClick={() => setShowRulesModal(true)}
            className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
            title="Shashka qoidalari"
          >
            <HelpCircle className="w-5 h-5 text-amber-500" />
          </button>

          <button
            onClick={initBoard}
            className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
            title="Qaytadan boshlash"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Players Score Cards Bar */}
      <div className="grid grid-cols-2 gap-3">
        {/* White / Student */}
        <div
          className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
            turn === 'white'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-100 to-white text-zinc-800 flex items-center justify-center font-black text-xl border-2 border-amber-300 shadow-sm">
              ⚪
            </div>
            <div>
              <div className="text-xs font-black text-zinc-900 dark:text-white flex items-center gap-1">
                <span>Siz (Oq)</span>
                {turn === 'white' && <span className="text-[10px] text-emerald-600 font-black">● Yurish</span>}
              </div>
              <div className="text-[11px] font-bold text-zinc-500">
                Maydonda: {whiteCount} ta
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded-lg">
              +{capturedByWhite.length} yutildi
            </span>
          </div>
        </div>

        {/* Black / Shercha Bot */}
        <div
          className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
            turn === 'black'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 shadow-md ring-2 ring-amber-400/20'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-zinc-900 text-white flex items-center justify-center font-black text-xl border-2 border-amber-500 shadow-sm">
              🦁
            </div>
            <div>
              <div className="text-xs font-black text-zinc-900 dark:text-white flex items-center gap-1">
                <span>Shercha AI (Qora)</span>
                {turn === 'black' && <span className="text-[10px] text-amber-600 font-black animate-pulse">● Yurmoqda...</span>}
              </div>
              <div className="text-[11px] font-bold text-zinc-500">
                Maydonda: {blackCount} ta
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-1 rounded-lg">
              +{capturedByBlack.length} yutildi
            </span>
          </div>
        </div>
      </div>

      {/* Floating King Announcement */}
      <AnimatePresence>
        {kingAnnouncement && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-black text-sm text-center py-2 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 fill-white" />
            <span>{kingAnnouncement}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkers Board */}
      <div className="bg-gradient-to-b from-amber-900 to-amber-950 p-3 sm:p-5 rounded-3xl shadow-2xl border-4 border-amber-700/60 max-w-lg mx-auto">
        <div
          className="grid gap-1 sm:gap-1.5 aspect-square bg-amber-950 p-2 sm:p-3 rounded-2xl shadow-inner border border-amber-800"
          style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: boardSize * boardSize }).map((_, idx) => {
            const r = Math.floor(idx / boardSize);
            const c = idx % boardSize;
            const isDarkSquare = (r + c) % 2 === 1;
            const piece = getPieceAt(r, c);
            const isSelected = selectedPiece?.row === r && selectedPiece?.col === c;
            const isValidDestination = validMoves.some((m) => m.toRow === r && m.toCol === c);
            const isDestinationCapture = validMoves.some((m) => m.toRow === r && m.toCol === c && m.capturedPiece);
            const isRecentMove =
              (lastMove?.from[0] === r && lastMove?.from[1] === c) ||
              (lastMove?.to[0] === r && lastMove?.to[1] === c);

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => {
                  if (piece && piece.player === 'white') {
                    handlePieceClick(piece);
                  } else if (isValidDestination) {
                    handleCellClick(r, c);
                  }
                }}
                className={`relative rounded-xl flex items-center justify-center select-none transition-all duration-150 ${
                  isDarkSquare
                    ? 'bg-amber-800/90 dark:bg-amber-900/80 shadow-inner'
                    : 'bg-amber-100/90 dark:bg-amber-200/80'
                } ${
                  isRecentMove ? 'ring-2 ring-yellow-400/60' : ''
                } ${
                  isValidDestination
                    ? 'cursor-pointer hover:brightness-110 ring-2 ring-emerald-400 bg-emerald-900/60'
                    : piece?.player === 'white' && turn === 'white'
                    ? 'cursor-pointer hover:brightness-105'
                    : ''
                }`}
              >
                {/* Valid Move Indicator Marker */}
                {isValidDestination && (
                  <div
                    className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full z-10 animate-pulse flex items-center justify-center ${
                      isDestinationCapture
                        ? 'bg-rose-500 shadow-md shadow-rose-500/50 ring-2 ring-white'
                        : 'bg-emerald-400 shadow-md shadow-emerald-400/50'
                    }`}
                  >
                    {isDestinationCapture && <span className="text-[10px] text-white font-black">✕</span>}
                  </div>
                )}

                {/* Piece Rendering */}
                {piece && (
                  <motion.div
                    layout
                    whileHover={{ scale: piece.player === 'white' && turn === 'white' ? 1.08 : 1 }}
                    whileTap={{ scale: piece.player === 'white' && turn === 'white' ? 0.95 : 1 }}
                    className={`w-[84%] h-[84%] rounded-full flex flex-col items-center justify-center shadow-lg transition-transform relative ${
                      piece.player === 'white'
                        ? 'bg-gradient-to-b from-white via-zinc-100 to-amber-100 border-2 border-amber-300 text-amber-900 shadow-amber-900/40'
                        : 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-amber-600/80 text-amber-200 shadow-black/60'
                    } ${
                      isSelected
                        ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-amber-950 scale-105 shadow-yellow-500/50'
                        : ''
                    }`}
                  >
                    {/* Inner 3D Grooves for Checkers piece aesthetic */}
                    <div
                      className={`w-[70%] h-[70%] rounded-full border border-dashed flex items-center justify-center ${
                        piece.player === 'white'
                          ? 'border-amber-400/60 bg-amber-50/50'
                          : 'border-amber-500/40 bg-zinc-800/50'
                      }`}
                    >
                      {piece.isKing ? (
                        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-400 animate-pulse" />
                      ) : piece.player === 'black' ? (
                        <span className="text-xs sm:text-sm">🦁</span>
                      ) : (
                        <span className="text-xs sm:text-sm font-black text-amber-600">✦</span>
                      )}
                    </div>

                    {/* King small badge */}
                    {piece.isKing && (
                      <span className="absolute -top-1 -right-1 text-[10px] bg-yellow-400 text-amber-950 px-1 rounded-full font-black shadow">
                        SHOH
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action and Tips Bar */}
      <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
          <span className="text-base">💡</span>
          <span>
            <strong>Maslahat:</strong> Raqib toshining ustidan sakrab uni yeng! Oxirgi qatorga yetib borgan tosh <strong>Shoh (👑)</strong> bo‘ladi va orqaga ham yura oladi.
          </span>
        </div>

        <button
          onClick={onBackToMenu}
          className="text-amber-600 dark:text-amber-400 font-black hover:underline cursor-pointer shrink-0"
        >
          O‘yinlar menyusi →
        </button>
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-md w-full border-4 border-amber-300 dark:border-amber-700 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏁</span>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                    Shashka Qoidalari
                  </h3>
                </div>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
                    1
                  </span>
                  <p>
                    <strong>Yurish:</strong> Toshlar faqat to‘q rangli kataklar bo‘ylab, 1 katak diagonal oldinga yura oladi.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
                    2
                  </span>
                  <p>
                    <strong>Toshni yeyish:</strong> Agar raqib toshining orqasidagi katak bo‘sh bo‘lsa, uning ustidan sakrab raqib toshini o‘yindan chiqarasiz!
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
                    3
                  </span>
                  <p>
                    <strong>Shoh bo‘lish (👑):</strong> Taxtaning eng narigi qatoriga yetib borgan toshingiz Shoh (Damka) ga aylanadi va ham oldinga, ham orqaga yura oladi!
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0 text-xs">
                    4
                  </span>
                  <p>
                    <strong>G‘alaba:</strong> Sherchaning barcha toshlarini yeb bo‘lsangiz yoki uning yurish yo‘lini to‘sib qo‘ysangiz, g‘olib bo‘lasiz!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRulesModal(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm rounded-2xl shadow-md hover:from-amber-600 hover:to-orange-600 transition"
              >
                Tushundim, davom etamiz! 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Game Break / Completion Modal */}
      <GameBreakModal
        isOpen={isGameOver}
        gameTitle="Shashka Bahsi"
        gameId="checkers"
        score={score}
        bonusCoins={10}
        onRestart={initBoard}
        onChooseAnother={onBackToMenu}
      />
    </div>
  );
}
