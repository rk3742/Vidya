import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const exam = searchParams.get('exam') || 'JEE';
    const chapter = searchParams.get('chapter');
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = adminDb.collection('questions').where('isActive', '==', true);

    if (subject) query = query.where('subject', '==', subject);
    if (difficulty) query = query.where('difficulty', '==', difficulty);
    if (chapter) query = query.where('chapter', '==', chapter);

    // Exam filter
    if (exam === 'JEE') {
      query = query.where('exam', 'in', ['JEE', 'BOTH']);
    } else if (exam === 'NEET') {
      query = query.where('exam', 'in', ['NEET', 'BOTH']);
    }

    const snapshot = await query.limit(limit).get();
    const questions = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      // Remove answers from list view
      const { correctAnswer, solution, commonMisconceptions, ...safe } = data;
      return { id: doc.id, ...safe };
    });

    // Get total count
    const countSnap = await adminDb.collection('questions')
      .where('isActive', '==', true)
      .count()
      .get();
    const total = countSnap.data().count;

    return NextResponse.json({ questions, total });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ref = adminDb.collection('questions').doc();
    await ref.set({
      ...body,
      isActive: true,
      attemptCount: 0,
      correctCount: 0,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: ref.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
