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
export const UNIQUE_USER_ID_KEY = 'liderkids_device_user_id_v2';

/**
 * Har bir foydalanuvchi/qurilma uchun noyob identifikator olish yoki yaratish
 */
export function getOrCreateUniqueUserId(): string {
  if (typeof window === 'undefined') return 'user_server';
  try {
    let uid = localStorage.getItem(UNIQUE_USER_ID_KEY);
    if (!uid) {
      uid = 'student_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(UNIQUE_USER_ID_KEY, uid);
    }
    return uid;
  } catch {
    return 'student_' + Date.now().toString(36);
  }
}

/**
 * O'quvchilar ro'yxatidan dublikatlarni (bir xil ID yoki bir xil ism + sinf) tozalash
 */
export function deduplicateLearners(list: ActiveLearner[]): ActiveLearner[] {
  if (!Array.isArray(list)) return [];
  const map = new Map<string, ActiveLearner>();

  for (const item of list) {
    if (!item || !item.name) continue;
    // Bitta o'quvchi bir xil sinfda faqat bir marta bo'lishi kerak
    const dedupeKey = `${item.name.trim().toLowerCase()}_${item.grade}`;

    const existing = map.get(dedupeKey);
    if (!existing) {
      map.set(dedupeKey, item);
    } else {
      // Agar olovchalari ko'proq bo'lsa yoki yangiroq bo'lsa, yangilaymiz
      if ((item.streaks || 0) >= (existing.streaks || 0)) {
        map.set(dedupeKey, { ...existing, ...item });
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Platformadan foydalanayotgan ro'yxatdan o'tgan haqiqiy o'quvchilarni yuklash (localStorage keshidan)
 */
export function getStoredLearners(): ActiveLearner[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACTIVE_LEARNERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Dublikatlarni tozalab qaytaramiz
    const cleaned = deduplicateLearners(parsed);
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(ACTIVE_LEARNERS_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
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
        (l.name.trim().toLowerCase() === learner.name.trim().toLowerCase() && l.grade === learner.grade)
    );

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...learner };
    } else {
      list.push(learner);
    }

    const cleaned = deduplicateLearners(list);
    localStorage.setItem(ACTIVE_LEARNERS_STORAGE_KEY, JSON.stringify(cleaned));

    // Bulutli bazaga (Firebase Realtime Database) sinxronizatsiya qilish
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
    const combined = [...localList, ...cloudList];
    const merged = deduplicateLearners(combined);

    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_LEARNERS_STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return getStoredLearners();
  }
}
