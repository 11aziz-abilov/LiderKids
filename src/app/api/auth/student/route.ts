import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const phone = searchParams.get('phone');

    if (!studentId && !phone) {
      return NextResponse.json({ error: 'studentId yoki phone talab qilinadi' }, { status: 400 });
    }

    let query = supabaseAdmin.from('students').select('*');
    if (studentId) {
      query = query.eq('id', studentId);
    } else if (phone) {
      const digits = phone.replace(/\D/g, '');
      const last9 = digits.slice(-9);
      if (last9.length === 9) {
        query = query.ilike('parent_phone', `%${last9}%`);
      } else {
        query = query.eq('parent_phone', phone.trim());
      }
    }

    const { data: students, error } = await query.limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!students || students.length === 0) {
      return NextResponse.json({ student: null }, { status: 200 });
    }

    const student = students[0];

    // Check if telegram bot is linked
    const { data: parentLinks } = await supabaseAdmin
      .from('parent_links')
      .select('telegram_chat_id')
      .eq('student_id', student.id)
      .limit(1);

    const isBotLinked = Boolean(parentLinks && parentLinks.length > 0);

    return NextResponse.json({
      student: {
        ...student,
        isBotLinked,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server xatoligi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, grade, region, school, parentName, parentPhone } = body;

    if (!name || !parentPhone) {
      return NextResponse.json(
        { error: "O'quvchi ismi va ota-ona telefon raqami talab qilinadi" },
        { status: 400 }
      );
    }

    const cleanPhone = parentPhone.trim();
    const cleanName = name.trim();
    const studentGrade = Math.min(4, Math.max(1, parseInt(grade, 10) || 1));

    // Check if student with this phone and name already exists
    const { data: existingStudents } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('parent_phone', cleanPhone)
      .limit(5);

    let matchedStudent = existingStudents?.find(
      (s) => s.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (matchedStudent) {
      // Update last_active_at
      await supabaseAdmin
        .from('students')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', matchedStudent.id);

      return NextResponse.json({
        success: true,
        isNew: false,
        student: matchedStudent,
      });
    }

    // New student starts at 0 coins, 0 xp, 0 streak!
    const newStudent = {
      name: cleanName,
      grade: studentGrade,
      region: region?.trim() || 'Toshkent shahri',
      school: school?.trim() || '',
      parent_name: parentName?.trim() || "Ota-ona",
      parent_phone: cleanPhone,
      coins: 0,
      xp: 0,
      streak: 0,
      last_active_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error } = await supabaseAdmin
      .from('students')
      .insert(newStudent)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      isNew: true,
      student: inserted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server xatoligi' }, { status: 500 });
  }
}
