/**
 * Asia/Tashkent vaqt zonasi bo'yicha sana va vaqt amallari
 * O'zbekiston standart vaqti: UTC+5
 */

export const TASHKENT_TIMEZONE = 'Asia/Tashkent';

export type DayOfWeekKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAYS_OF_WEEK_ORDER: DayOfWeekKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DAY_NAMES_UZ: Record<DayOfWeekKey, { full: string; short: string }> = {
  monday: { full: 'Dushanba', short: 'Dush' },
  tuesday: { full: 'Seshanba', short: 'Sesh' },
  wednesday: { full: 'Chorshanba', short: 'Chor' },
  thursday: { full: 'Payshanba', short: 'Pay' },
  friday: { full: 'Juma', short: 'Jum' },
  saturday: { full: 'Shanba', short: 'Shan' },
  sunday: { full: 'Yakshanba', short: 'Yak' },
};

/**
 * Tashkent vaqt zonasidagi joriy sana ma'lumotlarini qaytaradi
 */
export function getTashkentDate(dateInput: Date = new Date()): {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  dayOfWeekIndex: number; // 1: Dushanba, ..., 7: Yakshanba
  dayKey: DayOfWeekKey;
  dateString: string; // YYYY-MM-DD
} {
  // Asia/Tashkent bo'yicha formatlab olish
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TASHKENT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  const parts = formatter.formatToParts(dateInput);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const year = parseInt(partMap.year, 10);
  const month = parseInt(partMap.month, 10);
  const day = parseInt(partMap.day, 10);

  // Weekday mapping
  // en-US short: 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  const weekdayShort = partMap.weekday;
  let dayOfWeekIndex = 1;
  let dayKey: DayOfWeekKey = 'monday';

  switch (weekdayShort) {
    case 'Mon':
      dayOfWeekIndex = 1;
      dayKey = 'monday';
      break;
    case 'Tue':
      dayOfWeekIndex = 2;
      dayKey = 'tuesday';
      break;
    case 'Wed':
      dayOfWeekIndex = 3;
      dayKey = 'wednesday';
      break;
    case 'Thu':
      dayOfWeekIndex = 4;
      dayKey = 'thursday';
      break;
    case 'Fri':
      dayOfWeekIndex = 5;
      dayKey = 'friday';
      break;
    case 'Sat':
      dayOfWeekIndex = 6;
      dayKey = 'saturday';
      break;
    case 'Sun':
      dayOfWeekIndex = 7;
      dayKey = 'sunday';
      break;
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const dateString = `${year}-${pad(month)}-${pad(day)}`;

  return {
    year,
    month,
    day,
    dayOfWeekIndex,
    dayKey,
    dateString,
  };
}

/**
 * Bugungi sananing YYYY-MM-DD ko'rinishi (Asia/Tashkent)
 */
export function getTashkentTodayDateString(): string {
  return getTashkentDate().dateString;
}

/**
 * ISO 8601 bo'yicha hafta raqamini hisoblash (masalan: 2026-W43)
 */
export function getWeekId(dateInput: Date = new Date()): string {
  const t = getTashkentDate(dateInput);
  const d = new Date(Date.UTC(t.year, t.month - 1, t.day));

  // Payshanba kuniga qarab ISO hafta yili aniqlanadi
  const dayNr = (d.getUTCDay() + 6) % 7; // 0: Dushanba, ..., 6: Yakshanba
  d.setUTCDate(d.getUTCDate() - dayNr + 3);

  const firstThursday = d.getTime();
  d.setUTCMonth(0, 1);
  if (d.getUTCDay() !== 4) {
    d.setUTCMonth(0, 1 + ((4 - d.getUTCDay() + 7) % 7));
  }

  const weekNumber = 1 + Math.ceil((firstThursday - d.getTime()) / 604800000);
  const isoYear = new Date(firstThursday).getUTCFullYear();
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${isoYear}-W${pad(weekNumber)}`;
}

/**
 * Joriy haftaning barcha 7 kunining sanalarini qaytaradi (Dushanbadan Yakshanbagacha)
 */
export function getCurrentWeekDates(dateInput: Date = new Date()): Array<{
  dayKey: DayOfWeekKey;
  dateString: string;
  dayOfMonth: number;
  monthNameUz: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}> {
  const current = getTashkentDate(dateInput);
  const todayStr = current.dateString;

  // Dushanba kunining sanasini topamiz
  // Dushanbadan necha kun farq bor?
  const daysFromMonday = current.dayOfWeekIndex - 1;

  const baseDate = new Date(Date.UTC(current.year, current.month - 1, current.day));
  baseDate.setUTCDate(baseDate.getUTCDate() - daysFromMonday);

  const monthsUz = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
  ];

  const result = [];

  for (let i = 0; i < 7; i++) {
    const cur = new Date(baseDate);
    cur.setUTCDate(baseDate.getUTCDate() + i);

    const year = cur.getUTCFullYear();
    const month = cur.getUTCMonth() + 1;
    const day = cur.getUTCDate();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${year}-${pad(month)}-${pad(day)}`;

    const dayKey = DAYS_OF_WEEK_ORDER[i];
    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;
    const isFuture = dateStr > todayStr;

    result.push({
      dayKey,
      dateString: dateStr,
      dayOfMonth: day,
      monthNameUz: monthsUz[month - 1],
      isToday,
      isPast,
      isFuture,
    });
  }

  return result;
}

/**
 * Sanani o'zbekcha chiroyli formatda chiqarish: masalan "25-oktabr, Yakshanba"
 */
export function formatTashkentDateUz(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const monthsUz = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    const dayNr = (dateObj.getUTCDay() + 6) % 7; // 0=Mon, 6=Sun
    const dayKey = DAYS_OF_WEEK_ORDER[dayNr];
    const dayName = DAY_NAMES_UZ[dayKey].full;

    return `${d}-${monthsUz[m - 1]}, ${dayName}`;
  } catch {
    return dateStr;
  }
}
