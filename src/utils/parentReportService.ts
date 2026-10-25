import { UserProgress, GradeLevel } from '@/types';
import { ParentWeeklySummary, WeeklyExamResult, WeakTopicRecord } from '@/types/schedule';
import { getWeekId, getCurrentWeekDates, formatTashkentDateUz } from './tashkentTime';
import { getScheduledLessonsForWeek } from '@/data/weeklyScheduleConfig';

/**
 * Bitta o'quvchi uchun haftalik nazorat hisobotini generatsiya qiluvchi funksiya.
 * Ushbu xulosa kelajakda "LiderKids Nazorat" Telegram botiga xabar sifatida yuboriladi.
 */
export function generateParentWeeklyReport(
  progress: UserProgress,
  targetWeekId?: string
): ParentWeeklySummary {
  const currentWeekId = targetWeekId || getWeekId();
  const weekDates = getCurrentWeekDates();
  const mondayDate = weekDates[0]?.dateString || '';
  const sundayDate = weekDates[6]?.dateString || '';

  const periodLabel = `${formatTashkentDateUz(mondayDate)} — ${formatTashkentDateUz(sundayDate)}`;

  const studentName = progress.profile
    ? `${progress.profile.firstName} ${progress.profile.lastName}`.trim()
    : progress.name || "O'quvchi";

  const grade: GradeLevel = progress.grade || 4;

  // Shu hafta uchun belgilangan darslar (6 kun x 2 ta dars = 12 ta)
  const scheduledLessons = getScheduledLessonsForWeek(grade);
  const totalScheduledCount = scheduledLessons.length; // 12

  // Ushbu haftada bajarilgan darslarni aniqlash
  const scheduledProgress = progress.scheduledLessonsProgress || {};
  const completedInThisWeek = Object.values(scheduledProgress).filter(
    (item) => item.weekId === currentWeekId && item.isCompleted
  );

  const completedCount = completedInThisWeek.length;
  const missedCount = Math.max(0, totalScheduledCount - completedCount);
  const completionRate = totalScheduledCount > 0
    ? Math.round((completedCount / totalScheduledCount) * 100)
    : 0;

  // Yakshanba haftalik imtihoni natijasi
  const examHistory = progress.weeklyExamHistory || {};
  const examResult: WeeklyExamResult | null = examHistory[currentWeekId] || null;
  const weeklyExamTaken = !!examResult;

  // Zaif mavzular
  const weakTopics: WeakTopicRecord[] = (progress.weakTopics || []).filter(
    (w) => w.grade === grade
  );

  // Kuchli tomonlar va tavsiyalar
  const strengths: string[] = [];
  if (completionRate >= 90) {
    strengths.push("Haftalik barcha darslar rejasiga namunali amal qilindi!");
  } else if (completionRate >= 60) {
    strengths.push("Darslarning asosiy qismi o'zlashtirildi.");
  }

  if (examResult) {
    if (examResult.scoresBySubject.math?.score >= 4) strengths.push("Matematika fani bo'yicha a'lo natija");
    if (examResult.scoresBySubject.english?.score >= 4) strengths.push("Ingliz tili bo'yicha yuqori so'z boyligi");
    if (examResult.scoresBySubject.logic?.score >= 4) strengths.push("Mantiqiy fikrlash juda yaxshi");
    if (examResult.scoresBySubject.critical?.score >= 4) strengths.push("Tanqidiy tahlil qobiliyati ustun");
  }

  // Telegram bot uchun chiroyli o'zbekcha formatlangan matn (Markdown)
  const telegramLines: string[] = [
    `📊 *LIDERKIDS NAZORAT — HAFTALIK HISOBOT* 🦁`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *O‘quvchi:* ${studentName}`,
    `🎓 *Sinfi:* ${grade}-sinf (Prezident maktabiga tayyorlov)`,
    `🔑 *Botga ulanish kodi:* \`${progress.profile?.botSyncCode || '748291'}\``,
    `📅 *Hafta davri:* ${periodLabel}`,
    `🆔 *Hafta kodi:* \`${currentWeekId}\``,
    ``,
    `📚 *Darslarga qatnashish ko‘rsatkichi:*`,
    `• Belgilangan darslar: *${totalScheduledCount} ta*`,
    `• Bajarilgan darslar: *${completedCount} ta* ✅`,
    `• O‘tkazib yuborilgan: *${missedCount} ta* ${missedCount > 0 ? '⚠️' : '🎉'}`,
    `• O‘zlashtirish darajasi: *${completionRate}%*`,
    ``,
  ];

  if (weeklyExamTaken && examResult) {
    telegramLines.push(
      `🏆 *Yakshanba Katta Testi Natijasi:*`,
      `• Umumiy ball: *${examResult.totalScore} / ${examResult.maxScore}* (${examResult.percentage}%)`,
      `  📐 Matematika: *${examResult.scoresBySubject.math?.score || 0}/5*`,
      `  🇬🇧 Ingliz tili: *${examResult.scoresBySubject.english?.score || 0}/5*`,
      `  💡 Muammoli masalalar: *${examResult.scoresBySubject.logic?.score || 0}/5*`,
      `  🧠 Tanqidiy fikrlash: *${examResult.scoresBySubject.critical?.score || 0}/5*`,
      ``
    );
  } else {
    telegramLines.push(
      `⚠️ *Yakshanba Katta Testi:* Hali topshirilmadi`,
      ``
    );
  }

  if (weakTopics.length > 0) {
    telegramLines.push(
      `🎯 *Qo‘shimcha e’tibor talab etiladigan mavzular (Zaif mavzular):*`
    );
    weakTopics.slice(0, 4).forEach((wt) => {
      telegramLines.push(`  • ${wt.topic} (${wt.mistakeCount} marta noaniqlik)`);
    });
    telegramLines.push(
      `💡 *Tavsiya:* Ushbu mavzular bo‘yicha LiderKids ilovasida qayta mashq qilish tavsiya etiladi.`,
      ``
    );
  } else {
    telegramLines.push(
      `🌟 *Barcha o‘tilgan mavzular barqaror o‘zlashtirildi!*`,
      ``
    );
  }

  telegramLines.push(
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🔥 *Jami to‘plangan olovchalar (Streak):* ${progress.streaks} kun`,
    `🪙 *Jami tangalar:* ${progress.coins} ta`,
    `🚀 *LiderKids — Farzandingiz kelajagi uchun bugun poydevor quying!*`
  );

  const telegramMessageText = telegramLines.join('\n');

  return {
    studentName,
    grade,
    weekId: currentWeekId,
    periodLabel,
    lessonsScheduledCount: totalScheduledCount,
    lessonsCompletedCount: completedCount,
    lessonsCompletionRate: completionRate,
    missedLessonsCount: missedCount,
    weeklyExamTaken,
    weeklyExamResult: examResult,
    weakTopics,
    strengths,
    telegramMessageText,
    generatedAt: new Date().toISOString(),
  };
}
