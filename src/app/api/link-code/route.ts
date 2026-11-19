import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

function generateRandom6Digit(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'studentId talab qilinadi' }, { status: 400 });
    }

    const now = new Date();

    // Check if there is already an active, unused code that has not expired
    const { data: activeCodes } = await supabaseAdmin
      .from('link_codes')
      .select('*')
      .eq('student_id', studentId)
      .eq('used', false)
      .gt('expires_at', now.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (activeCodes && activeCodes.length > 0) {
      return NextResponse.json({
        code: activeCodes[0].code,
        expiresAt: activeCodes[0].expires_at,
      });
    }

    // Otherwise, generate a new 15-minute code
    const newCode = generateRandom6Digit();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { data: inserted, error } = await supabaseAdmin
      .from('link_codes')
      .insert({
        student_id: studentId,
        code: newCode,
        expires_at: expiresAt,
        used: false,
        created_at: now.toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      code: inserted.code,
      expiresAt: inserted.expires_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server xatoligi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'studentId talab qilinadi' }, { status: 400 });
    }

    const now = new Date();
    const newCode = generateRandom6Digit();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Invalidate any older unused codes
    await supabaseAdmin
      .from('link_codes')
      .update({ used: true })
      .eq('student_id', studentId)
      .eq('used', false);

    const { data: inserted, error } = await supabaseAdmin
      .from('link_codes')
      .insert({
        student_id: studentId,
        code: newCode,
        expires_at: expiresAt,
        used: false,
        created_at: now.toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      code: inserted.code,
      expiresAt: inserted.expires_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server xatoligi' }, { status: 500 });
  }
}
