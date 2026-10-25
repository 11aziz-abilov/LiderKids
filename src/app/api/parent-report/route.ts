import { NextRequest, NextResponse } from 'next/server';
import { generateParentWeeklyReport } from '@/utils/parentReportService';
import { UserProgress } from '@/types';

/**
 * Kelajakda "LiderKids Nazorat" Telegram botiga xizmat qiluvchi endpoint.
 * Bola progressi va hafta kodi yuborilganda, to'liq xulosa va tayyor Telegram matnini qaytaradi.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const progress: UserProgress = body.progress;
    const weekId: string | undefined = body.weekId;

    if (!progress) {
      return NextResponse.json(
        { error: "O'quvchi ma'lumotlari (progress) yuborilmadi" },
        { status: 400 }
      );
    }

    const report = generateParentWeeklyReport(progress, weekId);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Hisobotni yaratishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
