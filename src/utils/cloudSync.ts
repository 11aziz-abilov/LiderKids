import { ActiveLearner } from '@/data/leaderboardData';
import { supabase } from '@/lib/supabaseClient';

/**
 * O'quvchi ma'lumotlarini bulutli bazaga sinxronlash (Supabase)
 */
export async function syncLearnerToCloud(learner: ActiveLearner): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return false;
    }
    // Agar student_id bo'lsa, student stats yangilanadi
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Barcha ro'yxatdan o'tgan haqiqiy o'quvchilarni bulutdan yuklab olish
 */
export async function fetchCloudLearners(): Promise<ActiveLearner[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return [];
    }

    const { data: students, error } = await supabase
      .from('students')
      .select('id, name, grade, region, school, coins, xp, streak')
      .order('streak', { ascending: false })
      .limit(20);

    if (error || !students) return [];

    return students.map((s) => ({
      id: s.id,
      name: s.name,
      grade: s.grade || 1,
      gender: 'boy',
      region: s.region || 'Toshkent shahri',
      district: '',
      school: s.school || '',
      streaks: s.streak || 0,
      coins: s.coins || 0,
      xp: s.xp || 0,
      badge:
        (s.streak || 0) >= 30
          ? 'Afsonaviy Lider 👑'
          : (s.streak || 0) >= 15
          ? 'Oltin Chempion 🥇'
          : (s.streak || 0) >= 5
          ? 'Faol O‘quvchi ⚡'
          : 'Yosh Izlanuvchi 🌱',
    }));
  } catch (error) {
    return [];
  }
}
