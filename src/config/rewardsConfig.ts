/**
 * LiderKids — Yagona Mukofotlar va Ballar Konfiguratsiyasi
 * Barcha sahifalarda tanga va olovchalar hisobi shu yerdan olinadi.
 */

export const REWARDS_CONFIG = {
  // Testlar uchun mukofot:
  QUIZ: {
    COINS_PER_CORRECT: 10, // Har bir to'g'ri javob uchun +10 tanga
    XP_PER_CORRECT: 10,    // Har bir to'g'ri javob uchun +10 XP
  },

  // Video darslar uchun mukofot:
  LESSON: {
    COINS_PER_LESSON: 20,  // Har bir yakunlangan dars uchun +20 tanga
    XP_PER_LESSON: 30,     // +30 XP
    STREAK_PER_LESSON: 1,  // +1 olovcha
  },

  // Kun boshqotirmasi (Daily puzzle) uchun mukofot:
  PUZZLE: {
    COINS_PER_PUZZLE: 50,  // +50 tanga
    XP_PER_PUZZLE: 50,     // +50 XP
    STREAK_PER_PUZZLE: 1,  // +1 olovcha
  },
} as const;
