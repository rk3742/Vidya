import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'due';
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const now = new Date();

    if (type === 'due') {
      const snap = await adminDb.collection('revisions')
        .where('userId', '==', userId)
        .where('isCompleted', '==', false)
        .where('nextReviewDate', '<=', now)
        .orderBy('nextReviewDate', 'asc')
        .limit(30)
        .get();

      const due = await Promise.all(snap.docs.map(async d => {
        const data = d.data();
        const qDoc = await adminDb.collection('questions').doc(data.questionId).get();
        return {
          id: d.id,
          ...data,
          question: qDoc.exists ? { id: qDoc.id, ...qDoc.data() } : null,
        };
      }));

      return NextResponse.json({ due, count: due.length });
    }

    if (type === 'upcoming') {
      const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const snap = await adminDb.collection('revisions')
        .where('userId', '==', userId)
        .where('isCompleted', '==', false)
        .where('nextReviewDate', '>', now)
        .where('nextReviewDate', '<=', sevenDays)
        .orderBy('nextReviewDate', 'asc')
        .get();

      const byDate: Record<string, any[]> = {};
      snap.docs.forEach(d => {
        const data = d.data();
        const date = data.nextReviewDate.toDate
          ? data.nextReviewDate.toDate().toISOString().split('T')[0]
          : new Date(data.nextReviewDate).toISOString().split('T')[0];
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push({ id: d.id, ...data });
      });

      return NextResponse.json({ upcoming: byDate });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { revisionId, quality } = body;
    if (!revisionId) return NextResponse.json({ error: 'revisionId required' }, { status: 400 });

    const ref = adminDb.collection('revisions').doc(revisionId);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: 'Revision not found' }, { status: 404 });

    const data = doc.data()!;
    let { easeFactor, interval, repetitions } = data;
    const q = quality || 3;

    if (q < 3) { repetitions = 0; interval = 1; }
    else {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
    }
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    await ref.update({
      easeFactor, interval, repetitions, nextReviewDate,
      isCompleted: q >= 4,
      lastQuality: q,
      lastReviewDate: new Date(),
    });

    return NextResponse.json({ nextReviewDate, interval });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
