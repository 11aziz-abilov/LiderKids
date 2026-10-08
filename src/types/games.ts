import { GradeLevel } from '@/types';

export type MiniGameId = 'memory' | 'puzzle' | 'stars';

export type GameDifficultyGroup = 'junior' | 'senior'; // junior: 1-2 sinflar, senior: 3-4 sinflar

export interface MiniGameMeta {
  id: MiniGameId;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  gradient: string;
  juniorDescription: string;
  seniorDescription: string;
}

export function getDifficultyGroup(grade: GradeLevel): GameDifficultyGroup {
  return grade <= 2 ? 'junior' : 'senior';
}

export interface GameCompletionResult {
  gameId: MiniGameId;
  score: number;
  timeSpentSeconds: number;
  bonusCoins: number;
  isTimerFinished: boolean;
  isStageCompleted: boolean;
}
