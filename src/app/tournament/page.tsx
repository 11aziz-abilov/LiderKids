'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import {
  ShashkaPiece,
  CheckersMove,
  PieceColor,
  TournamentPlayer,
  UserTournamentProfile,
  GameMode,
} from '@/types/tournament';
import {
  createInitialBoard,
  getAllLegalMoves,
  getLegalMovesForSpecificPiece,
  executeMove,
  computeAIMove,
} from '@/utils/checkersLogic';
import {
  loadUserTournamentProfile,
  saveUserTournamentProfile,
  getLeagueByRating,
  findMatchingOpponent,
  INITIAL_TOURNAMENT_STUDENTS,
} from '@/data/tournamentData';
import CheckersBoard from '@/components/tournament/CheckersBoard';
import MatchmakingModal from '@/components/tournament/MatchmakingModal';
import MatchResultModal from '@/components/tournament/MatchResultModal';
import TournamentLeaderboard from '@/components/tournament/TournamentLeaderboard';
import { sound } from '@/utils/sound';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Swords,
  Trophy,
  Users,
  Bot,
  Flame,
  ArrowLeft,
  Sparkles,
  Award,
  Crown,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
} from 'lucide-react';

export default function TournamentPage() {
  const { progress, addCoins } = useGame();

  // State: Tab view ('hub' | 'playing')
  const [view, setView] = useState<'hub' | 'playing'>('hub');
  const [gameMode, setGameMode] = useState<GameMode>('online_matchmaking');

  // Foydalanuvchining turnir profili
  const [userProfile, setUserProfile] = useState<UserTournamentProfile>(() =>
    loadUserTournamentProfile()
  );

  // Matchmaking holatlari
  const [isMatchmakingOpen, setIsMatchmakingOpen] = useState(false);
  const [currentOpponent, setCurrentOpponent] = useState<TournamentPlayer | null>(null);

  // O'yin taxtasi holatlari
  const [board, setBoard] = useState<ShashkaPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<ShashkaPiece | null>(null);
  const [legalMoves, setLegalMoves] = useState<CheckersMove[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');
  const [lastMove, setLastMove] = useState<CheckersMove | null>(null);
  const [multiCapturePieceId, setMultiCapturePieceId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // O'yin natijasi modali
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [matchResult, setMatchResult] = useState<'win' | 'loss' | 'draw'>('win');
  const [rewardDetails, setRewardDetails] = useState({
    ratingChange: 0,
    coinsEarned: 0,
    xpEarned: 0,
    pvpWinnerName: '',
  });

  // Profilni saqlash
  const handleUpdateProfile = (newProf: UserTournamentProfile) => {
    setUserProfile(newProf);
    saveUserTournamentProfile(newProf);
  };

  // Foydalanuvchi jami o'yinchilar qatorida
  const currentUserPlayer: TournamentPlayer = useMemo(() => {
    const fullName = progress.profile
      ? `${progress.profile.firstName} ${progress.profile.lastName}`.trim()
      : progress.name;

    return {
      id: 'current_user',
      name: fullName,
      grade: progress.grade,
      gender: progress.profile?.gender || 'boy',
      region: progress.profile?.region || 'Toshkent shahri',
      district: progress.profile?.district || '',
      school: progress.profile?.school || `${progress.grade}-sinf o‘quvchisi`,
      rating: userProfile.rating,
      wins: userProfile.wins,
      losses: userProfile.losses,
      draws: userProfile.draws,
      totalMatches: userProfile.totalMatches,
      league: userProfile.league,
      avatarEmoji: '🦁',
      isCurrentUser: true,
    };
  }, [progress, userProfile]);

  // Barcha turnir o'yinchilari (Foydalanuvchi + Botlar)
  const allPlayers = useMemo(() => {
    return [currentUserPlayer, ...INITIAL_TOURNAMENT_STUDENTS];
  }, [currentUserPlayer]);

  // O'yinni to'liq boshlash
  const startNewGame = useCallback(
    (mode: GameMode, opponent: TournamentPlayer | null = null) => {
      setGameMode(mode);
      setCurrentOpponent(opponent);
      setBoard(createInitialBoard());
      setSelectedPiece(null);
      setLegalMoves([]);
      setCurrentTurn('white');
      setLastMove(null);
      setMultiCapturePieceId(null);
      setIsAiThinking(false);
      setIsResultOpen(false);
      setView('playing');
    },
    []
  );

  // Matchmakingni ochish
  const handleInitiateMatchmaking = () => {
    const matched = findMatchingOpponent(userProfile.rating, progress.grade);
    setCurrentOpponent(matched);
    setIsMatchmakingOpen(true);
  };

  // Matchmaking orqali o'yinni boshlash
  const handleStartMatchedGame = () => {
    setIsMatchmakingOpen(false);
    startNewGame('online_matchmaking', currentOpponent);
  };

  // 1 ta qurilmada do'st bilan o'yin
  const handleStartLocalPvp = () => {
    startNewGame('local_pvp', null);
  };

  // Robot bilan mashg'ulot
  const handleStartTraining = () => {
    const botOpponent: TournamentPlayer = {
      id: 'training_bot',
      name: 'Shashka Roboti 🤖',
      grade: progress.grade,
      gender: 'boy',
      region: 'LiderKids Akademiyasi',
      district: '',
      school: 'Mashg‘ulot Boti',
      rating: 1200,
      wins: 10,
      losses: 5,
      draws: 2,
      totalMatches: 17,
      league: 'Kumush Liga 🥈',
      avatarEmoji: '🤖',
    };
    startNewGame('training_ai', botOpponent);
  };

  // O'yin tugashini tekshirish
  const checkGameOver = useCallback(
    (currentBoard: ShashkaPiece[], nextTurn: PieceColor) => {
      const whitePieces = currentBoard.filter((p) => p.color === 'white');
      const blackPieces = currentBoard.filter((p) => p.color === 'black');

      // 1. Toshlar soni bo'yicha
      if (whitePieces.length === 0) {
        handleFinishMatch('black');
        return true;
      }
      if (blackPieces.length === 0) {
        handleFinishMatch('white');
        return true;
      }

      // 2. Qonuniy yurishlar borligini tekshirish
      const availableMoves = getAllLegalMoves(nextTurn, currentBoard);
      if (availableMoves.length === 0) {
        // Navbati kelgan o'yinchi yura olmasa, yutqazadi
        handleFinishMatch(nextTurn === 'white' ? 'black' : 'white');
        return true;
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameMode, currentOpponent, userProfile]
  );

  // O'yin yakunlanganda natijani hisoblash
  const handleFinishMatch = (winnerColor: PieceColor | 'draw') => {
    let result: 'win' | 'loss' | 'draw' = 'win';
    let ratingDelta = 0;
    let coinsBonus = 0;
    let xpBonus = 0;
    let winnerName = '';

    if (gameMode === 'local_pvp') {
      winnerName = winnerColor === 'white' ? '1-O‘yinchi (Oq)' : '2-O‘yinchi (Qora)';
      result = 'win';
    } else {
      if (winnerColor === 'white') {
        result = 'win';
        ratingDelta = 25;
        coinsBonus = 20;
        xpBonus = 30;
      } else if (winnerColor === 'draw') {
        result = 'draw';
        ratingDelta = 10;
        coinsBonus = 10;
        xpBonus = 15;
      } else {
        result = 'loss';
        ratingDelta = 5; // ishtirok uchun rag'bat
        coinsBonus = 5;
        xpBonus = 5;
      }

      // Profilni yangilash
      const newRating = Math.max(1000, userProfile.rating + ratingDelta);
      const newLeague = getLeagueByRating(newRating);
      const updatedProf: UserTournamentProfile = {
        rating: newRating,
        wins: result === 'win' ? userProfile.wins + 1 : userProfile.wins,
        losses: result === 'loss' ? userProfile.losses + 1 : userProfile.losses,
        draws: result === 'draw' ? userProfile.draws + 1 : userProfile.draws,
        totalMatches: userProfile.totalMatches + 1,
        league: newLeague,
        history: [
          {
            id: `m_${Date.now()}`,
            opponentName: currentOpponent?.name || 'Raqib',
            opponentRating: currentOpponent?.rating || 1200,
            opponentAvatar: currentOpponent?.avatarEmoji || '👤',
            result,
            ratingChange: ratingDelta,
            coinsEarned: coinsBonus,
            playedAt: new Date().toLocaleDateString('uz-UZ'),
          },
          ...userProfile.history.slice(0, 19),
        ],
      };

      handleUpdateProfile(updatedProf);
      addCoins(coinsBonus);
    }

    setMatchResult(result);
    setRewardDetails({
      ratingChange: ratingDelta,
      coinsEarned: coinsBonus,
      xpEarned: xpBonus,
      pvpWinnerName: winnerName,
    });
    setIsResultOpen(true);
  };

  // Katak bosilganda
  const handleSquareClick = (row: number, col: number) => {
    if (isAiThinking) return;

    // Local pvp da har kim o'z navbatida, online va AI da o'yinchi 'white'
    const isPlayerTurn =
      gameMode === 'local_pvp' ? true : currentTurn === 'white';

    if (!isPlayerTurn) return;

    const clickedPiece = board.find((p) => p.row === row && p.col === col);

    // 1. Agar mavjud tosh bosilsa va u navbati kelgan rangda bo'lsa
    if (clickedPiece && clickedPiece.color === currentTurn) {
      if (multiCapturePieceId && clickedPiece.id !== multiCapturePieceId) {
        // Zanjirli urish paytida boshqa toshni tanlab bo'lmaydi
        return;
      }
      setSelectedPiece(clickedPiece);
      const moves = getLegalMovesForSpecificPiece(
        clickedPiece,
        board,
        multiCapturePieceId
      );
      setLegalMoves(moves);
      sound.playClick();
      return;
    }

    // 2. Agar tanlangan tosh bo'lsa va nishon katak bosilsa
    if (selectedPiece) {
      const targetMove = legalMoves.find(
        (m) => m.to.row === row && m.to.col === col
      );

      if (targetMove) {
        // Yurishni bajarish
        const { newBoard, movedPiece, hasFurtherCaptures } = executeMove(
          board,
          targetMove
        );
        setBoard(newBoard);
        setLastMove(targetMove);
        sound.playPop();

        // Ketma-ket urish bormi?
        if (hasFurtherCaptures) {
          setMultiCapturePieceId(movedPiece.id);
          setSelectedPiece(movedPiece);
          const moreMoves = getLegalMovesForSpecificPiece(
            movedPiece,
            newBoard,
            movedPiece.id
          );
          setLegalMoves(moreMoves);
        } else {
          // Navbatni raqibga uzatamiz
          setMultiCapturePieceId(null);
          setSelectedPiece(null);
          setLegalMoves([]);
          const nextTurn: PieceColor = currentTurn === 'white' ? 'black' : 'white';
          setCurrentTurn(nextTurn);

          const isOver = checkGameOver(newBoard, nextTurn);
          if (!isOver && (gameMode === 'online_matchmaking' || gameMode === 'training_ai')) {
            // Raqib (AI) navbati
            triggerAiMove(newBoard, nextTurn);
          }
        }
      } else {
        // Bo'sh katak bosilsa, tanlovni bekor qilamiz (agar multi-capture bo'lmasa)
        if (!multiCapturePieceId) {
          setSelectedPiece(null);
          setLegalMoves([]);
        }
      }
    }
  };

  // AI harakatini amalga oshirish
  const triggerAiMove = (currentBoard: ShashkaPiece[], aiColor: PieceColor) => {
    setIsAiThinking(true);

    const delay = Math.floor(Math.random() * 600) + 900; // 900ms - 1500ms o'ylash
    setTimeout(() => {
      const bestMove = computeAIMove(currentBoard, aiColor);

      if (!bestMove) {
        setIsAiThinking(false);
        checkGameOver(currentBoard, aiColor);
        return;
      }

      const { newBoard, movedPiece, hasFurtherCaptures } = executeMove(
        currentBoard,
        bestMove
      );
      setBoard(newBoard);
      setLastMove(bestMove);
      sound.playPop();

      if (hasFurtherCaptures) {
        // AI yana urishni davom ettiradi
        triggerAiMove(newBoard, aiColor);
      } else {
        setIsAiThinking(false);
        const nextTurn: PieceColor = aiColor === 'white' ? 'black' : 'white';
        setCurrentTurn(nextTurn);
        checkGameOver(newBoard, nextTurn);
      }
    }, delay);
  };

  // Qolgan toshlar soni
  const whitePiecesCount = board.filter((p) => p.color === 'white').length;
  const blackPiecesCount = board.filter((p) => p.color === 'black').length;

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* View 1: Tournament Hub Dashboard */}
      {view === 'hub' ? (
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  <Swords className="w-4 h-4 text-yellow-200" />
                  <span>Respublika Shashka Chempionati</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                  LiderKids Shashka Turniri 🏁
                </h1>
                <p className="text-orange-100 text-xs sm:text-base font-medium max-w-2xl leading-relaxed">
                  O‘zbekiston bo‘ylab barcha tengdoshlaringiz bilan shashka taxtasida bellashing! G‘alaba qozonib kuboklar to‘plang va Grandmaster Qirol shohsupasini zabt eting!
                </p>
              </div>

              {/* User League Card */}
              <div className="bg-white/20 backdrop-blur-md p-5 rounded-3xl border border-white/30 flex flex-col items-center sm:items-end gap-1.5 min-w-[220px] shadow-lg">
                <div className="text-[11px] font-bold text-orange-100 uppercase">
                  Sizning darajangiz:
                </div>
                <div className="text-xl sm:text-2xl font-black flex items-center gap-2">
                  <span>{userProfile.league}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/30 px-3 py-1 rounded-xl text-sm font-black mt-1">
                  <Trophy className="w-4 h-4 text-yellow-200" />
                  <span>{userProfile.rating} Kubok balli</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl font-black">
                🏆
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Reyting</div>
                <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  {userProfile.rating}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-black">
                🥇
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase">G‘alabalar</div>
                <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  {userProfile.wins} ta
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-black">
                🎮
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Jami O‘yin</div>
                <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  {userProfile.totalMatches} ta
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl font-black">
                🔥
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase">G‘alaba %</div>
                <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  {userProfile.totalMatches > 0
                    ? Math.round((userProfile.wins / userProfile.totalMatches) * 100)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Game Modes Selection Cards */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Swords className="w-6 h-6 text-orange-500" />
              <span>O‘yin rejimini tanlang</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mode 1: Online Matchmaking */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInitiateMatchmaking}
                className="bg-gradient-to-b from-white to-amber-50/50 dark:from-zinc-900 dark:to-zinc-850 rounded-3xl p-6 border-2 border-amber-300 dark:border-zinc-700 shadow-lg hover:shadow-2xl hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
                      ⚡
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200">
                      Reytingli Turnir
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                      Jonli Matchmaking 🔍
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Sizning reytingingizga mos boshqa maktab o‘quvchisi bilan bellashing! G‘alabada +25 kubok va tangalar yutasiz.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                    +25 🏆 • +20 🪙
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl shadow-md">
                    Raqib topish ➜
                  </span>
                </div>
              </motion.div>

              {/* Mode 2: Local 2-Player */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartLocalPvp}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-blue-200 dark:border-zinc-700 shadow-lg hover:shadow-2xl hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                      👥
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                      1 Qurilma • 2 O‘yinchi
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                      Do‘st bilan o‘ynash 🤝
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Birga o‘tirgan sinfdoshingiz yoki oila a’zoingiz bilan bitta telefon yoki kompyuterda navbatma-navbat o‘ynang!
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">
                    Do‘stona bellashuv
                  </span>
                  <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md">
                    Boshlash ➜
                  </span>
                </div>
              </motion.div>

              {/* Mode 3: Training / Bot */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartTraining}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border-2 border-purple-200 dark:border-zinc-700 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
                      🤖
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                      Mashg‘ulot Boti
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                      Robot bilan mashq 🧠
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Turnirdan oldin taktikangizni sinab ko‘ring va mahoratingizni oshiring! Hech qanday reyting yo‘qotmaysiz.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">
                    Cheksiz mashq
                  </span>
                  <span className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md">
                    Mashq qilish ➜
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tournament Leaderboard Section */}
          <div className="pt-4">
            <TournamentLeaderboard
              players={allPlayers}
              currentUserId="current_user"
            />
          </div>
        </div>
      ) : (
        /* View 2: Live Checkers Match */
        <div className="space-y-6">
          {/* Top Controls: Exit & Turn indicator */}
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-3xl border-2 border-amber-200 dark:border-zinc-800 shadow-sm">
            <button
              onClick={() => setView('hub')}
              className="inline-flex items-center gap-2 text-xs font-black text-amber-700 dark:text-amber-400 hover:underline px-3 py-1.5 rounded-xl border border-amber-200 dark:border-zinc-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Turnir zaliga qaytish</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500">Holat:</span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                  currentTurn === 'white'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-900 text-white border border-stone-700'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentTurn === 'white' ? 'bg-amber-500' : 'bg-stone-300'
                  }`}
                />
                <span>
                  {gameMode === 'local_pvp'
                    ? currentTurn === 'white'
                      ? '1-O‘yinchi navbati (Oq)'
                      : '2-O‘yinchi navbati (Qora)'
                    : currentTurn === 'white'
                    ? 'Sizning navbatingiz (Oq)'
                    : isAiThinking
                    ? 'Raqib fikrlamoqda... 🤔'
                    : 'Raqib navbati (Qora)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleFinishMatch('black')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
            >
              Taslim bo‘lish
            </button>
          </div>

          {/* Players Info Bar */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Player 1 (White / User) */}
            <div
              className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${
                currentTurn === 'white'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-md ring-2 ring-amber-300/40'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shadow-sm">
                  🦁
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white truncate max-w-[110px] sm:max-w-none">
                    {gameMode === 'local_pvp' ? '1-O‘yinchi (Oq)' : currentUserPlayer.name}
                  </div>
                  <div className="text-[10px] text-amber-600 font-bold">
                    Oq toshlar • Qolgan: {whitePiecesCount}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-amber-600">
                  {currentUserPlayer.rating} 🏆
                </div>
              </div>
            </div>

            {/* Player 2 (Black / Opponent) */}
            <div
              className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${
                currentTurn === 'black'
                  ? 'bg-stone-100 dark:bg-stone-900 border-stone-500 shadow-md ring-2 ring-stone-400/40'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-800 text-white flex items-center justify-center text-2xl shadow-sm">
                  {currentOpponent?.avatarEmoji || '👤'}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white truncate max-w-[110px] sm:max-w-none">
                    {gameMode === 'local_pvp'
                      ? '2-O‘yinchi (Qora)'
                      : currentOpponent?.name || 'Raqib'}
                  </div>
                  <div className="text-[10px] text-stone-500 font-bold">
                    Qora toshlar • Qolgan: {blackPiecesCount}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-stone-600 dark:text-stone-300">
                  {currentOpponent?.rating || 1200} 🏆
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Checkers Board */}
          <div className="py-2">
            <CheckersBoard
              board={board}
              selectedPiece={selectedPiece}
              legalMoves={legalMoves}
              currentTurn={currentTurn}
              playerColor="white"
              lastMove={lastMove}
              isAiThinking={isAiThinking}
              onSquareClick={handleSquareClick}
            />
          </div>

          {/* Tactical Advice Footer */}
          <div className="bg-amber-100/60 dark:bg-zinc-850 p-4 rounded-3xl border border-amber-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-xl mx-auto flex items-center gap-3">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <strong className="text-zinc-900 dark:text-white font-black block">
                Turnir qoidalari:
              </strong>
              Shashkada tosh urish majburiydir! Agar bir nechta toshni ketma-ket urish imkoniyati bo‘lsa, tosh sakrashda davom etadi. Oxirgi qatorga borgan tosh <strong>Damka (👑 Shoh)</strong>ga aylanadi!
            </div>
          </div>
        </div>
      )}

      {/* Matchmaking Radar Modal */}
      <MatchmakingModal
        isOpen={isMatchmakingOpen}
        userPlayer={{
          name: currentUserPlayer.name,
          grade: currentUserPlayer.grade,
          rating: currentUserPlayer.rating,
          region: currentUserPlayer.region,
        }}
        matchedOpponent={currentOpponent}
        onMatchFound={handleStartMatchedGame}
        onCancel={() => setIsMatchmakingOpen(false)}
      />

      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={isResultOpen}
        result={matchResult}
        opponent={currentOpponent}
        ratingChange={rewardDetails.ratingChange}
        newRating={userProfile.rating}
        newLeague={userProfile.league}
        coinsEarned={rewardDetails.coinsEarned}
        xpEarned={rewardDetails.xpEarned}
        isPvp={gameMode === 'local_pvp'}
        pvpWinnerName={rewardDetails.pvpWinnerName}
        onPlayAgain={() => {
          setIsResultOpen(false);
          if (gameMode === 'online_matchmaking') {
            handleInitiateMatchmaking();
          } else if (gameMode === 'local_pvp') {
            handleStartLocalPvp();
          } else {
            handleStartTraining();
          }
        }}
        onGoToHub={() => {
          setIsResultOpen(false);
          setView('hub');
        }}
      />
    </div>
  );
}
