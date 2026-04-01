import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'practice';
    const exam = searchParams.get('exam') || 'JEE';
    const period = searchParams.get('period') || 'week';
    const userId = searchParams.get('userId');

    if (type === 'practice') {
      let query: any = adminDb.collection('submissions');

      if (period === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        query = query.where('createdAt', '>=', weekAgo);
      } else if (period === 'month') {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        query = query.where('createdAt', '>=', monthAgo);
      }

      const snap = await query.get();
      const userStats: Record<string, { total: number; correct: number }> = {};

      snap.docs.forEach((d: any) => {
        const data = d.data();
        if (!userStats[data.userId]) userStats[data.userId] = { total: 0, correct: 0 };
        userStats[data.userId].total++;
        if (data.isCorrect) userStats[data.userId].correct++;
      });

      // Get user details and build leaderboard
      const entries = await Promise.all(
        Object.entries(userStats)
          .filter(([, s]) => s.total >= 1)
          .map(async ([uid, stats]) => {
            const userDoc = await adminDb.collection('users').doc(uid).get();
            const user = userDoc.data();
            if (!user) return null;
            const accuracy = Math.round((stats.correct / stats.total) * 100);
            const score = stats.correct * 10 + accuracy * 5;
            return { uid, name: user.name, avatar: user.avatar, studentId: user.studentId, targetExam: user.targetExam, streakDays: user.streakDays || 0, totalAttempted: stats.total, totalCorrect: stats.correct, accuracy, score };
          })
      );

      const leaderboard = entries
        .filter(Boolean)
        .filter((e: any) => exam === 'ALL' || e.targetExam === exam || e.targetExam === 'BOTH')
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 50)
        .map((e: any, i) => ({ ...e, rank: i + 1 }));

      const myRank = userId ? leaderboard.findIndex((e: any) => e.uid === userId) + 1 : null;
      return NextResponse.json({ leaderboard, myRank });
    }

    if (type === 'mocktest') {
      const testType = exam === 'JEE' ? 'JEE_MAINS' : 'NEET';
      const snap = await adminDb.collection('mocktests')
        .where('testType', '==', testType)
        .where('status', '==', 'completed')
        .orderBy('result.marksObtained', 'desc')
        .limit(100)
        .get();

      const userBest: Record<string, any> = {};
      snap.docs.forEach(d => {
        const data = d.data();
        if (!userBest[data.userId] || data.result.marksObtained > userBest[data.userId].bestScore) {
          userBest[data.userId] = { userId: data.userId, bestScore: data.result.marksObtained, bestAccuracy: data.result.accuracy, testsAttempted: (userBest[data.userId]?.testsAttempted || 0) + 1 };
        }
      });

      const entries = await Promise.all(
        Object.values(userBest).map(async (entry: any) => {
          const userDoc = await adminDb.collection('users').doc(entry.userId).get();
          const user = userDoc.data();
          if (!user) return null;
          return { ...entry, uid: entry.userId, name: user.name, avatar: user.avatar, studentId: user.studentId, targetExam: user.targetExam };
        })
      );

      const leaderboard = entries.filter(Boolean)
        .sort((a: any, b: any) => b.bestScore - a.bestScore)
        .slice(0, 50)
        .map((e: any, i) => ({ ...e, rank: i + 1 }));

      return NextResponse.json({ leaderboard });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
