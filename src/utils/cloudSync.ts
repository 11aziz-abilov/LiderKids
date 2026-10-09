import { ActiveLearner } from '@/data/leaderboardData';

// Firebase Realtime Database URL
export const FIREBASE_DB_URL =
  process.env.NEXT_PUBLIC_FIREBASE_DB_URL?.replace(/\/$/, '') ||
  'https://liderkids-afad8-default-rtdb.firebaseio.com';

/**
 * ID ni Firebase kalitiga mos xavfsiz formatga o'tkazish
 */
function sanitizeKey(id: string): string {
  return id.replace(/[.#$[\]/\\+ ()-]/g, '_');
}

/**
 * O'quvchi ma'lumotlarini bulutli Firebase bazasiga saqlash/yangilash
 */
export async function syncLearnerToCloud(learner: ActiveLearner): Promise<boolean> {
  const dbUrl = FIREBASE_DB_URL;
  if (!dbUrl) {
    // Agar DB URL hali ulanmagan bo'lsa, xato bermaydi
    return false;
  }

  try {
    const safeKey = sanitizeKey(learner.id || learner.name);
    const url = `${dbUrl}/learners/${safeKey}.json`;

    const payload = {
      ...learner,
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (error) {
    console.warn('Firebase sync xatosi:', error);
    return false;
  }
}

/**
 * Barcha ro'yxatdan o'tgan haqiqiy o'quvchilarni Firebase bulutidan yuklab olish
 */
export async function fetchCloudLearners(): Promise<ActiveLearner[]> {
  const dbUrl = FIREBASE_DB_URL;
  if (!dbUrl) {
    return [];
  }

  try {
    const url = `${dbUrl}/learners.json`;
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data || typeof data !== 'object') return [];

    const list: ActiveLearner[] = Object.values(data);
    return list;
  } catch (error) {
    console.warn('Firebase yuklash xatosi:', error);
    return [];
  }
}
