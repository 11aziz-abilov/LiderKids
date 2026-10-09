import { GradeLevel } from '@/types';

export type PieceColor = 'white' | 'black';

export interface ShashkaPiece {
  id: string;
  color: PieceColor;
  isKing: boolean;
  row: number;
  col: number;
}

export interface BoardPosition {
  row: number;
  col: number;
}

export interface CheckersMove {
  from: BoardPosition;
  to: BoardPosition;
  captured?: BoardPosition;
  isKingPromotion?: boolean;
}

export type TournamentLeague =
  | 'Bronza Liga 🥉'
  | 'Kumush Liga 🥈'
  | 'Oltin Liga 🥇'
  | 'Grandmaster Qirol 👑';

export interface TournamentPlayer {
  id: string;
  name: string;
  grade: GradeLevel;
  gender: 'boy' | 'girl';
  region: string;
  district: string;
  school: string;
  rating: number; // 1000 - 2000 Elo ochkolari
  wins: number;
  losses: number;
  draws: number;
  totalMatches: number;
  league: TournamentLeague;
  avatarEmoji: string;
  isCurrentUser?: boolean;
}

export type GameMode = 'online_matchmaking' | 'local_pvp' | 'training_ai';

export interface MatchHistoryItem {
  id: string;
  opponentName: string;
  opponentRating: number;
  opponentAvatar: string;
  result: 'win' | 'loss' | 'draw';
  ratingChange: number;
  coinsEarned: number;
  playedAt: string;
}

export interface UserTournamentProfile {
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  totalMatches: number;
  league: TournamentLeague;
  history: MatchHistoryItem[];
}
