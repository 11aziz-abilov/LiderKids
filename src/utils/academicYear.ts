import { GradeLevel } from '@/types';

/**
 * O‘zbekiston maktablarida o‘quv yili 2-sentabrda boshlanadi va 25-mayda yakunlanadi.
 * Joriy o'quv yili: 2026-2027 o'quv yili.
 */
export function getCurrentAcademicYear(date = new Date()): {
  academicYear: string;
  startDate: Date;
  endDate: Date;
} {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 is January, 4 is May, 8 is September

  // Hozirgi davr: 2026-2027 o'quv yili
  // Agar yil 2026 yoki undan oldin bo'lsa, joriy o'quv yili 2026-2027 o'quv yili hisoblanadi
  if (year <= 2026) {
    return {
      academicYear: '2026-2027',
      startDate: new Date(2026, 8, 2),
      endDate: new Date(2027, 4, 25, 23, 59, 59),
    };
  }

  if (month >= 8) {
    // 1-sentabrdan keyin
    return {
      academicYear: `${year}-${year + 1}`,
      startDate: new Date(year, 8, 2),
      endDate: new Date(year + 1, 4, 25, 23, 59, 59),
    };
  } else {
    // 1-sentabrgacha
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
