import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { REWARDS_CONFIG } from '@/config/rewardsConfig';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, subject, type, correct, total } = body;

    if (!studentId || !type) {
      return NextResponse.json(
        { error: 'studentId va type talab qilinadi' },
        { status: 400 }
      );
    }

    // Check student existence
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "O'quvchi topilmadi" }, { status: 404 });
    }

    const numCorrect = Math.max(0, parseInt(correct, 10) || 0);
    const numTotal = Math.max(numCorrect, parseInt(total, 10) || numCorrect || 1);

    // SERVER-SIDE REWARD CALCULATION — Do not trust client coins
    let coinsEarned = 0;
    let xpEarned = 0;
    let streakEarned = 0;

    if (type === 'quiz') {
      coinsEarned = numCorrect * REWARDS_CONFIG.QUIZ.COINS_PER_CORRECT;
      xpEarned = numCorrect * REWARDS_CONFIG.QUIZ.XP_PER_CORRECT;
    } else if (type === 'lesson') {
      coinsEarned = REWARDS_CONFIG.LESSON.COINS_PER_LESSON;
      xpEarned = REWARDS_CONFIG.LESSON.XP_PER_LESSON;
      streakEarned = REWARDS_CONFIG.LESSON.STREAK_PER_LESSON;
    } else if (type === 'puzzle') {
      if (numCorrect > 0) {
        coinsEarned = REWARDS_CONFIG.PUZZLE.COINS_PER_PUZZLE;
        xpEarned = REWARDS_CONFIG.PUZZLE.XP_PER_PUZZLE;
        streakEarned = REWARDS_CONFIG.PUZZLE.STREAK_PER_PUZZLE;
      }
    }

    // 1. Insert result record
    const { error: resultInsertError } = await supabaseAdmin
      .from('results')
      .insert({
        student_id: studentId,
        subject: subject || 'general',
        type,
        correct: numCorrect,
        total: numTotal,
        coins_earned: coinsEarned,
        created_at: new Date().toISOString(),
      });

    if (resultInsertError) {
      return NextResponse.json({ error: resultInsertError.message }, { status: 500 });
    }

    // 2. Update student stats
    const newCoins = (student.coins || 0) + coinsEarned;
    const newXp = (student.xp || 0) + xpEarned;
    const newStreak = (student.streak || 0) + streakEarned;

    const { data: updatedStudent, error: updateError } = await supabaseAdmin
      .from('students')
      .update({
        coins: newCoins,
        xp: newXp,
        streak: newStreak,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', studentId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      coinsEarned,
      xpEarned,
      streakEarned,
      student: updatedStudent,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server xatoligi' }, { status: 500 });
  }
}
