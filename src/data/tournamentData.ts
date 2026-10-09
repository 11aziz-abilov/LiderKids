import { TournamentPlayer, TournamentLeague, UserTournamentProfile, MatchHistoryItem } from '@/types/tournament';
import { GradeLevel } from '@/types';

export const TOURNAMENT_PROFILE_KEY = 'liderkids_tournament_profile_v1';

export function getLeagueByRating(rating: number): TournamentLeague {
  if (rating >= 1600) return 'Grandmaster Qirol 👑';
  if (rating >= 1400) return 'Oltin Liga 🥇';
  if (rating >= 1200) return 'Kumush Liga 🥈';
  return 'Bronza Liga 🥉';
}

export const INITIAL_TOURNAMENT_STUDENTS: TournamentPlayer[] = [
  {
    id: 'tp_1',
    name: 'Muhammadali Yoqubov',
    grade: 4,
    gender: 'boy',
    region: 'Toshkent shahri',
    district: 'Yunusobod tumani',
    school: 'Prezident maktabi nomzodi',
    rating: 1720,
    wins: 28,
    losses: 4,
    draws: 2,
    totalMatches: 34,
    league: 'Grandmaster Qirol 👑',
    avatarEmoji: '🦁',
  },
  {
    id: 'tp_2',
    name: 'Fotima Zokirova',
    grade: 3,
    gender: 'girl',
    region: 'Samarqand viloyati',
    district: 'Samarqand shahri',
    school: '14-ixtisoslashtirilgan maktab',
    rating: 1650,
    wins: 24,
    losses: 5,
    draws: 3,
    totalMatches: 32,
    league: 'Grandmaster Qirol 👑',
    avatarEmoji: '👑',
  },
  {
    id: 'tp_3',
    name: 'Jasurbek Rahimberdiyev',
    grade: 4,
    gender: 'boy',
    region: 'Farg‘ona viloyati',
    district: 'Qo‘qon shahri',
    school: '2-maktab',
    rating: 1580,
    wins: 21,
    losses: 7,
    draws: 4,
    totalMatches: 32,
    league: 'Oltin Liga 🥇',
    avatarEmoji: '⚡',
  },
  {
    id: 'tp_4',
    name: 'Madinabonu Alimova',
    grade: 2,
    gender: 'girl',
    region: 'Buxoro viloyati',
    district: 'Buxoro shahri',
    school: '35-maktab',
    rating: 1510,
    wins: 19,
    losses: 8,
    draws: 2,
    totalMatches: 29,
    league: 'Oltin Liga 🥇',
    avatarEmoji: '🌟',
  },
  {
    id: 'tp_5',
    name: 'Bobur Mirzayev',
    grade: 3,
    gender: 'boy',
    region: 'Andijon viloyati',
    district: 'Andijon shahri',
    school: '1-IDUM',
    rating: 1470,
    wins: 17,
    losses: 9,
    draws: 3,
    totalMatches: 29,
    league: 'Oltin Liga 🥇',
    avatarEmoji: '🐯',
  },
  {
    id: 'tp_6',
    name: 'Shaxzod Qodirov',
    grade: 4,
    gender: 'boy',
    region: 'Namangan viloyati',
    district: 'Namangan shahri',
    school: '7-maktab',
    rating: 1420,
    wins: 15,
    losses: 10,
    draws: 2,
    totalMatches: 27,
    league: 'Oltin Liga 🥇',
    avatarEmoji: '🎯',
  },
  {
    id: 'tp_7',
    name: 'Sevara Karimova',
    grade: 2,
    gender: 'girl',
    region: 'Toshkent viloyati',
    district: 'Chirchiq shahri',
    school: '12-maktab',
    rating: 1380,
    wins: 14,
    losses: 9,
    draws: 4,
    totalMatches: 27,
    league: 'Kumush Liga 🥈',
    avatarEmoji: '🦊',
  },
  {
    id: 'tp_8',
    name: 'Diyorbek Toshpo‘latov',
    grade: 1,
    gender: 'boy',
    region: 'Qashqadaryo viloyati',
    district: 'Qarshi shahri',
    school: '8-maktab',
    rating: 1340,
    wins: 12,
    losses: 8,
    draws: 3,
    totalMatches: 23,
    league: 'Kumush Liga 🥈',
    avatarEmoji: '🐻',
  },
  {
    id: 'tp_9',
    name: 'Zilola Ergasheva',
    grade: 3,
    gender: 'girl',
    region: 'Xorazm viloyati',
    district: 'Urganch shahri',
    school: '19-maktab',
    rating: 1290,
    wins: 11,
    losses: 10,
    draws: 2,
    totalMatches: 23,
    league: 'Kumush Liga 🥈',
    avatarEmoji: '🦋',
  },
  {
    id: 'tp_10',
    name: 'Samandar Ortiqov',
    grade: 1,
    gender: 'boy',
    region: 'Surxondaryo viloyati',
    district: 'Termiz shahri',
    school: '4-maktab',
    rating: 1240,
    wins: 9,
    losses: 9,
    draws: 3,
    totalMatches: 21,
    league: 'Kumush Liga 🥈',
    avatarEmoji: '🐼',
  },
  {
    id: 'tp_11',
    name: 'Azizbek G‘aniyev',
    grade: 2,
    gender: 'boy',
    region: 'Jizzax viloyati',
    district: 'Jizzax shahri',
    school: '22-maktab',
    rating: 1180,
    wins: 7,
    losses: 11,
    draws: 2,
    totalMatches: 20,
    league: 'Bronza Liga 🥉',
    avatarEmoji: '🐺',
  },
  {
    id: 'tp_12',
    name: 'Rayhona Sobirova',
    grade: 1,
    gender: 'girl',
    region: 'Navoiy viloyati',
    district: 'Navoiy shahri',
    school: '11-maktab',
    rating: 1150,
    wins: 6,
    losses: 12,
    draws: 1,
    totalMatches: 19,
    league: 'Bronza Liga 🥉',
    avatarEmoji: '🌸',
  },
  {
    id: 'tp_13',
    name: 'Temurbek Omonov',
    grade: 4,
    gender: 'boy',
    region: 'Qoraqalpog‘iston Respublikasi',
    district: 'Nukus shahri',
    school: '1-maktab',
    rating: 1210,
    wins: 8,
    losses: 9,
    draws: 2,
    totalMatches: 19,
    league: 'Kumush Liga 🥈',
    avatarEmoji: '🦅',
  },
  {
    id: 'tp_14',
    name: 'Ominaxon Yo‘ldosheva',
    grade: 2,
    gender: 'girl',
    region: 'Sirdaryo viloyati',
    district: 'Guliston shahri',
    school: '5-maktab',
    rating: 1110,
    wins: 5,
    losses: 10,
    draws: 2,
    totalMatches: 17,
    league: 'Bronza Liga 🥉',
    avatarEmoji: '🐱',
  },
];

export const DEFAULT_USER_TOURNAMENT_PROFILE: UserTournamentProfile = {
  rating: 1200,
  wins: 0,
  losses: 0,
  draws: 0,
  totalMatches: 0,
  league: 'Kumush Liga 🥈',
  history: [],
};

export function loadUserTournamentProfile(): UserTournamentProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_TOURNAMENT_PROFILE;
  try {
    const raw = localStorage.getItem(TOURNAMENT_PROFILE_KEY);
    if (!raw) return DEFAULT_USER_TOURNAMENT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      rating: parsed.rating ?? 1200,
      wins: parsed.wins ?? 0,
      losses: parsed.losses ?? 0,
      draws: parsed.draws ?? 0,
      totalMatches: parsed.totalMatches ?? 0,
      league: getLeagueByRating(parsed.rating ?? 1200),
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return DEFAULT_USER_TOURNAMENT_PROFILE;
  }
}

export function saveUserTournamentProfile(profile: UserTournamentProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOURNAMENT_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

/**
 * Matchmaking uchun foydalanuvchi reytingiga eng yaqin raqibni tanlaydi
 */
export function findMatchingOpponent(
  userRating: number,
  preferredGrade?: GradeLevel
): TournamentPlayer {
  let pool = INITIAL_TOURNAMENT_STUDENTS;
  if (preferredGrade) {
    const gradePool = pool.filter((p) => p.grade === preferredGrade);
    if (gradePool.length >= 3) {
      pool = gradePool;
    }
  }

  // Reyting farqi bo'yicha saralash
  const sorted = [...pool].sort(
    (a, b) => Math.abs(a.rating - userRating) - Math.abs(b.rating - userRating)
  );

  // Eng yaqin 3 ta raqibdan tasodifiy birini tanlash (har safar har xil raqib chiqishi uchun)
  const candidateCount = Math.min(3, sorted.length);
  const randomIndex = Math.floor(Math.random() * candidateCount);
  return sorted[randomIndex];
}
