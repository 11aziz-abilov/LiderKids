import { GradeLevel } from './index';

export type PuzzleCategory =
  | 'scale'       // Tarozi va og'irlik balansi
  | 'cipher'      // Emojilar va belgilar shifri
  | 'matrix'      // Ketma-ketlik va fazoviy panjara
  | 'detective'   // Detektiv xulosalar va isbot
  | 'paradox'     // Vaqt va nostandart paradokslar
  | 'logic_math'; // Prezident maktabi mantiqiy hisob-kitobi

export interface ScalePanItem {
  emoji: string;
  label: string;
  count: number;
  weightPerUnit?: number;
}

export interface ScaleVisual {
  scaleNumber: number;
  leftItems: ScalePanItem[];
  rightItems: ScalePanItem[];
  isBalanced: boolean;
  note?: string;
}

export interface EquationVisual {
  leftItems: { emoji: string; count?: number; op?: '+' | '-' | '×' | '÷' }[];
  result: number | string;
}

export interface DetectiveClueVisual {
  number: number;
  icon: string;
  text: string;
}

export interface PuzzleVisualData {
  type: 'scale' | 'equation' | 'clues' | 'grid' | 'scene';
  scales?: ScaleVisual[];
  equations?: EquationVisual[];
  clues?: DetectiveClueVisual[];
  grid?: {
    rows: string[][];
    highlightIndex?: [number, number];
  };
  sceneEmoji?: string;
}

export interface DailyPuzzleOption {
  id: string;
  text: string;
  subtext?: string;
}

export interface DailyPuzzle {
  id: string;
  grade: GradeLevel;
  dayIndex: number;
  title: string;
  category: PuzzleCategory;
  categoryTitle: string;
  difficultyLabel: string;
  difficultyStars: number;
  story: string;
  visualData: PuzzleVisualData;
  questionPrompt: string;
  options: DailyPuzzleOption[];
  correctOptionIndex: number;
  hint: string;
  thinkingSteps: string[];
  explanation: string;
  keyTakeaway: string;
  rewardCoins: number;
  rewardXp: number;
}

export interface DailyPuzzleRecord {
  date: string; // YYYY-MM-DD
  puzzleId: string;
  grade: GradeLevel;
  solved: boolean;
  selectedOptionIndex: number;
  attempts: number;
  usedHint: boolean;
  solvedAt: string;
  rewardCoins: number;
  rewardXp: number;
}
