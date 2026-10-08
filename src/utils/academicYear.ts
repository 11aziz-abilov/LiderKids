import { GradeLevel } from '@/types';

/**
 * O‘zbekiston maktablarida o‘quv yili 2-sentabrda boshlanadi va 25-mayda yakunlanadi.
 */
export function getCurrentAcademicYear(date = new Date()): {
  academicYear: string;
  startDate: Date;
  endDate: Date;
} {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 is January, 4 is May, 8 is September

  if (month >= 8) {
    // 1-sentabrdan keyin: masalan 2025-2026 o'quv yili (yakuni 2026-yil 25-may)
    return {
      academicYear: `${year}-${year + 1}`,
      startDate: new Date(year, 8, 2),
      endDate: new Date(year + 1, 4, 25, 23, 59, 59),
    };
  } else {
    // 1-sentabrgacha: masalan 2024-2025 o'quv yili (yakuni shu yil 25-may)
    return {
      academicYear: `${year - 1}-${year}`,
      startDate: new Date(year - 1, 8, 2),
      endDate: new Date(year, 4, 25, 23, 59, 59),
    };
  }
}

/**
 * O'quv yili tugagandagi keyingi sinfni hisoblash
 */
export function getNextGrade(currentGrade: GradeLevel): GradeLevel {
  if (currentGrade >= 4) return 4;
  return (currentGrade + 1) as GradeLevel;
}
