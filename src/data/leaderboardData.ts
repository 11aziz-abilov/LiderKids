import { GradeLevel } from '@/types';

export interface ActiveLearner {
  id: string;
  name: string;
  grade: GradeLevel;
  gender: 'boy' | 'girl';
  region: string;
  district: string;
  school: string;
  streaks: number; // Olovchalar
  coins: number;
  xp: number;
  badge: string;
  equippedOutfit?: string;
  isCurrentUser?: boolean;
}

export const ACTIVE_LEARNERS_STORAGE_KEY = 'liderkids_registered_learners_v2';

/**
 * Platformadan foydalanayotgan ro'yxatdan o'tgan haqiqiy o'quvchilarni yuklash
 */
export function getStoredLearners(): ActiveLearner[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACTIVE_LEARNERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Yangi foydalanuvchini platforma o'quvchilari ro'yxatiga saqlash yoki yangilash
 */
export function saveStoredLearner(learner: ActiveLearner) {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredLearners();
    const existingIndex = list.findIndex(
      (l) => l.id === learner.id || (l.name.toLowerCase() === learner.name.toLowerCase() && l.region === learner.region)
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...learner };
    } else {
      list.push(learner);
    }
    localStorage.setItem(ACTIVE_LEARNERS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}
