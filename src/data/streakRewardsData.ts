import { StreakPrize } from '@/types';

export const STREAK_PRIZES: StreakPrize[] = [
  {
    id: 'streak_pen_7',
    daysRequired: 7,
    periodLabel: '1 hafta',
    name: 'LiderKids Brend Ruchkasi',
    category: 'pen',
    emoji: '🖊️',
    badge: '7 Kunlik Olovcha',
    description: '1 hafta (7 kun) davomida har kuni uzluksiz dars qilgan o‘quvchi uchun maxsus LiderKids metall korpusli brend ruchkasi!',
    detailedFeature: 'Lazer gravirovkali LiderKids logotipi, qulay ushlagich va tekis yozuvchi ko‘k siyoh.',
    color: 'from-blue-500 via-indigo-600 to-blue-700',
    border: 'border-blue-400 dark:border-blue-600',
    bgSoft: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
    realGiftNote: 'Haqiqiy jismoniy sovg‘a! Bepul kuryer orqali eshigingizgacha yetkazib beriladi.',
  },
  {
    id: 'streak_cap_30',
    daysRequired: 30,
    periodLabel: '1 oy',
    name: 'LiderKids Brend Kepkasi',
    category: 'cap',
    emoji: '🧢',
    badge: '30 Kunlik Olovcha',
    description: '1 oy (30 kun) uzluksiz darsda qatnashgan qahramonlar uchun sifatli paxtali brend kepka!',
    detailedFeature: '100% tabiiy paxta, naqshli kashtalangan LiderKids sheri, o‘lchami moslanuvchan kamari bor.',
    color: 'from-amber-500 via-orange-500 to-amber-600',
    border: 'border-amber-400 dark:border-amber-600',
    bgSoft: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300',
    realGiftNote: 'Haqiqiy jismoniy sovg‘a! Bepul kuryer orqali eshigingizgacha yetkazib beriladi.',
  },
  {
    id: 'streak_cup_60',
    daysRequired: 60,
    periodLabel: '2 oy',
    name: 'LiderKids Brend Stakani (Termokrujka)',
    category: 'cup',
    emoji: '☕',
    badge: '60 Kunlik Olovcha',
    description: '2 oy (60 kun) ketma-ket dars qilib olovchani saqlagan a‘lochilar uchun LiderKids termo-stakani!',
    detailedFeature: 'Zanglamas po‘latdan ishlangan 350ml termo-krujka, issiqlikni 8 soat saqlaydi, qopqoqli va germetik.',
    color: 'from-emerald-500 via-teal-600 to-emerald-700',
    border: 'border-emerald-400 dark:border-emerald-600',
    bgSoft: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300',
    realGiftNote: 'Haqiqiy jismoniy sovg‘a! Bepul kuryer orqali eshigingizgacha yetkazib beriladi.',
  },
  {
    id: 'streak_tshirt_100',
    daysRequired: 100,
    periodLabel: '100 kun',
    name: 'LiderKids Brend Futbolkasi',
    category: 'tshirt',
    emoji: '👕',
    badge: '100 Kunlik Grand Chempion',
    description: '100 kun uzluksiz dars qilgan eng kuchli va irodali Liderlar uchun maxsus Chempionlik futbolkasi!',
    detailedFeature: 'Yuqori sifatli qalin paxta mato, orqasida "100 Kunlik Bilim Chempioni" oltin yozuvi, o‘quvchining sinfiga mos o‘lcham.',
    color: 'from-purple-600 via-pink-600 to-rose-600',
    border: 'border-purple-400 dark:border-purple-600',
    bgSoft: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300',
    realGiftNote: 'Haqiqiy jismoniy sovg‘a! Bepul kuryer orqali eshigingizgacha yetkazib beriladi.',
  },
];

export function getPrizeForStreak(streaks: number): StreakPrize | undefined {
  return STREAK_PRIZES.find((p) => streaks >= p.daysRequired);
}

export function getNextStreakPrize(streaks: number): StreakPrize | undefined {
  return STREAK_PRIZES.find((p) => streaks < p.daysRequired);
}
