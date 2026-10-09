import { GradeLevel } from '@/types';
import { syncLearnerToCloud, fetchCloudLearners } from '@/utils/cloudSync';

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
 * Platformadan foydalanayotgan ro'yxatdan o'tgan haqiqiy o'quvchilarni yuklash (localStorage keshidan)
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
 * Yangi foydalanuvchini platforma o'quvchilari ro'yxatiga saqlash (mahalliy va bulutda)
 */
export function saveStoredLearner(learner: ActiveLearner) {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredLearners();
    const existingIndex = list.findIndex(
      (l) =>
        l.id === learner.id ||
        (l.name.toLowerCase() === learner.name.toLowerCase() && l.region === learner.region)
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...learner };
    } else {
      list.push(learner);
    }
    localStorage.setItem(ACTIVE_LEARNERS_STORAGE_KEY, JSON.stringify(list));

    // Bulutli bazaga (Firebase) sinxronizatsiya qilish
    syncLearnerToCloud(learner).catch(() => {});
  } catch {
    // ignore
  }
}

/**
 * Bulutdagi (Firebase) barcha o'quvchilarni olib kelib, mahalliy kesh bilan birlashtirish
 */
export async function refreshLearnersFromCloud(): Promise<ActiveLearner[]> {
  try {
    const cloudList = await fetchCloudLearners();
    if (!cloudList || cloudList.length === 0) {
      return getStoredLearners();
    }

    const localList = getStoredLearners();
    const map = new Map<string, ActiveLearner>();

    // 1. Mahalliy ro'yxatni joylaymiz
    localList.forEach((item) => {
      map.set(item.id, item);
    });

    // 2. Bulutdan kelgan yangi ma'lumotlarni ustiga yozamiz
    cloudList.forEach((item) => {
      map.set(item.id, {
        ...(map.get(item.id) || {}),
        ...item,
      });
    });

    const merged = Array.from(map.values());
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_LEARNERS_STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return getStoredLearners();
  }
}
