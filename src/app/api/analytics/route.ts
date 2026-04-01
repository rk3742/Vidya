import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    // Get user
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const user = userDoc.data() || {};

    // Get submissions
    const subsSnap = await adminDb.collection('submissions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();
    const submissions = subsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

    const total = submissions.length;
    const correct = submissions.filter(s => s.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Due revisions
    const now = new Date();
    const revSnap = await adminDb.collection('revisions')
      .where('userId', '==', userId)
      .where('isCompleted', '==', false)
      .where('nextReviewDate', '<=', now)
      .get();
    const dueRevisions = revSnap.size;

    // Error type distribution
    const errorTypes: Record<string, number> = {};
    submissions.filter(s => !s.isCorrect && s.aiAnalysis?.errorType).forEach(s => {
      const et = s.aiAnalysis.errorType;
      errorTypes[et] = (errorTypes[et] || 0) + 1;
    });

    // 14-day trend
    const trendMap: Record<string, { total: number; correct: number }> = {};
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    submissions.filter(s => s.createdAt?.toDate ? s.createdAt.toDate() >= fourteenDaysAgo : new Date(s.createdAt) >= fourteenDaysAgo)
      .forEach(s => {
        const date = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
        const day = date.toISOString().split('T')[0];
        if (!trendMap[day]) trendMap[day] = { total: 0, correct: 0 };
        trendMap[day].total++;
        if (s.isCorrect) trendMap[day].correct++;
      });

    const trend = Object.entries(trendMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, d]) => ({ date, ...d, accuracy: Math.round((d.correct / d.total) * 100) }));

    // Weak topics (accuracy < 50%, min 3 attempts)
    const topicMap: Record<string, { total: number; correct: number; subject: string; chapter: string; topic: string }> = {};
    submissions.forEach(s => {
      if (!s.topic) return;
      const key = `${s.subject}::${s.topic}`;
      if (!topicMap[key]) topicMap[key] = { total: 0, correct: 0, subject: s.subject, chapter: s.chapter, topic: s.topic };
      topicMap[key].total++;
      if (s.isCorrect) topicMap[key].correct++;
    });

    const weakTopics = Object.values(topicMap)
      .filter(t => t.total >= 3 && (t.correct / t.total) < 0.5)
      .map(t => ({ ...t, accuracy: Math.round((t.correct / t.total) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    return NextResponse.json({
      overview: {
        totalAttempted: total,
        totalCorrect: correct,
        accuracy,
        streakDays: user.streakDays || 0,
        dueRevisions,
        subjectMastery: user.subjectMastery || { physics: 0, chemistry: 0, mathematics: 0, biology: 0 },
      },
      errorTypes,
      trend,
      weakTopics,
    });
  } catch (err: any) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
