import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { analyzeMockTestResult } from '@/lib/groq';

const TEST_CONFIGS: Record<string, any> = {
  JEE_MAINS: { title: 'JEE Mains Full Mock', totalMarks: 300, durationMinutes: 180, distribution: { physics: 30, chemistry: 30, mathematics: 30 } },
  JEE_ADVANCED: { title: 'JEE Advanced Paper 1', totalMarks: 198, durationMinutes: 180, distribution: { physics: 18, chemistry: 18, mathematics: 18 } },
  NEET: { title: 'NEET Full Mock', totalMarks: 720, durationMinutes: 200, distribution: { physics: 50, chemistry: 50, biology: 100 } },
  CHAPTER_TEST: { title: 'Chapter Test', totalMarks: 120, durationMinutes: 60, distribution: null },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { userId, testType, subject, difficulty } = body;
      const config = TEST_CONFIGS[testType] || TEST_CONFIGS.CHAPTER_TEST;
      const exam = testType.includes('NEET') ? 'NEET' : 'JEE';

      let allQuestions: any[] = [];

      if (testType === 'CHAPTER_TEST') {
        let q = adminDb.collection('questions').where('isActive', '==', true);
        if (subject) q = q.where('subject', '==', subject);
        if (difficulty) q = q.where('difficulty', '==', difficulty);
        const snap = await q.limit(30).get();
        allQuestions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } else {
        for (const [subj, count] of Object.entries(config.distribution as Record<string, number>)) {
          const snap = await adminDb.collection('questions')
            .where('subject', '==', subj)
            .where('exam', 'in', [exam, 'BOTH'])
            .where('isActive', '==', true)
            .limit(count)
            .get();
          allQuestions = [...allQuestions, ...snap.docs.map(d => ({ id: d.id, ...d.data() }))];
        }
      }

      if (allQuestions.length === 0) {
        return NextResponse.json({ error: 'Not enough questions. Please seed the database first.' }, { status: 400 });
      }

      const ref = adminDb.collection('mocktests').doc();
      const mockTest = {
        userId,
        testType,
        title: config.title,
        totalQuestions: allQuestions.length,
        totalMarks: config.totalMarks,
        durationMinutes: config.durationMinutes,
        status: 'not_started',
        questionIds: allQuestions.map(q => q.id),
        responses: {},
        result: null,
        createdAt: new Date(),
      };

      await ref.set(mockTest);
      return NextResponse.json({
        testId: ref.id,
        title: config.title,
        totalQuestions: allQuestions.length,
        durationMinutes: config.durationMinutes,
        questions: allQuestions.map(({ correctAnswer, solution, commonMisconceptions, ...safe }) => safe),
      });
    }

    if (action === 'start') {
      const { testId } = body;
      await adminDb.collection('mocktests').doc(testId).update({
        status: 'in_progress',
        startedAt: new Date(),
      });
      return NextResponse.json({ started: true });
    }

    if (action === 'save_response') {
      const { testId, questionId, selectedAnswer, isMarkedForReview } = body;
      await adminDb.collection('mocktests').doc(testId).update({
        [`responses.${questionId}`]: { selectedAnswer, isMarkedForReview: isMarkedForReview || false, savedAt: new Date() },
      });
      return NextResponse.json({ saved: true });
    }

    if (action === 'submit') {
      const { testId, userId, timeSpentSeconds, preferredLanguage } = body;
      const testDoc = await adminDb.collection('mocktests').doc(testId).get();
      if (!testDoc.exists) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

      const test = testDoc.data()!;
      const responses = test.responses || {};
      const config = TEST_CONFIGS[test.testType] || TEST_CONFIGS.CHAPTER_TEST;

      let totalCorrect = 0, totalWrong = 0, totalAttempted = 0, marksObtained = 0;
      const subjectWise: Record<string, { attempted: number; correct: number; marks: number }> = {
        physics: { attempted: 0, correct: 0, marks: 0 },
        chemistry: { attempted: 0, correct: 0, marks: 0 },
        mathematics: { attempted: 0, correct: 0, marks: 0 },
        biology: { attempted: 0, correct: 0, marks: 0 },
      };
      const weakTopics: Record<string, number> = {};
      const strongTopics: Record<string, number> = {};

      for (const qId of test.questionIds) {
        const response = responses[qId];
        if (!response || response.selectedAnswer === undefined || response.selectedAnswer === null) continue;

        totalAttempted++;
        const qDoc = await adminDb.collection('questions').doc(qId).get();
        if (!qDoc.exists) continue;
        const q = qDoc.data()!;

        let isCorrect = false;
        if (Array.isArray(q.correctAnswer)) {
          const userAns = Array.isArray(response.selectedAnswer) ? [...response.selectedAnswer].sort() : [response.selectedAnswer];
          isCorrect = JSON.stringify(userAns) === JSON.stringify([...q.correctAnswer].sort());
        } else {
          isCorrect = String(response.selectedAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
        }

        const marks = isCorrect ? 4 : -1;
        marksObtained += marks;

        if (q.subject && subjectWise[q.subject]) {
          subjectWise[q.subject].attempted++;
          if (isCorrect) { subjectWise[q.subject].correct++; subjectWise[q.subject].marks += marks; }
        }

        if (isCorrect) { totalCorrect++; strongTopics[q.topic] = (strongTopics[q.topic] || 0) + 1; }
        else { totalWrong++; weakTopics[q.topic] = (weakTopics[q.topic] || 0) + 1; }
      }

      const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
      const finalMarks = Math.max(0, marksObtained);

      // Gemini AI analysis
      const aiAnalysis = await analyzeMockTestResult(
        test.testType, totalCorrect, totalAttempted, finalMarks, config.totalMarks,
        Object.keys(weakTopics).slice(0, 3), Object.keys(strongTopics).slice(0, 3),
        preferredLanguage || 'english'
      );

      const result = {
        totalAttempted, totalCorrect, totalWrong,
        totalSkipped: test.questionIds.length - totalAttempted,
        marksObtained: finalMarks, accuracy, subjectWise,
        weakTopics: Object.keys(weakTopics).slice(0, 5),
        strongTopics: Object.keys(strongTopics).slice(0, 5),
        aiAnalysis,
      };

      await adminDb.collection('mocktests').doc(testId).update({
        status: 'completed',
        submittedAt: new Date(),
        timeSpentSeconds: timeSpentSeconds || 0,
        result,
      });

      // Update user subject mastery and stats
      if (userId) {
        const masteryUpdate: Record<string, number> = {};
        Object.entries(subjectWise).forEach(([subj, data]) => {
          if (data.attempted > 0) {
            masteryUpdate[`subjectMastery.${subj}`] = Math.round((data.correct / data.attempted) * 100);
          }
        });
        
        // Also update total stats
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data() || {};
        
        await userRef.set({
          ...userData,
          totalAttempted: (userData.totalAttempted || 0) + totalAttempted,
          totalCorrect: (userData.totalCorrect || 0) + totalCorrect,
          ...masteryUpdate,
        }, { merge: true });
      }

      // Create individual submissions for each answered question (for analytics/revision)
      for (const qId of test.questionIds) {
        const response = responses[qId];
        if (!response || response.selectedAnswer === undefined || response.selectedAnswer === null) continue;
        
        const qDoc = await adminDb.collection('questions').doc(qId).get();
        if (!qDoc.exists) continue;
        const q = qDoc.data()!;
        
        let isCorrect = false;
        if (Array.isArray(q.correctAnswer)) {
          const userAns = Array.isArray(response.selectedAnswer) ? [...response.selectedAnswer].sort() : [response.selectedAnswer];
          isCorrect = JSON.stringify(userAns) === JSON.stringify([...q.correctAnswer].sort());
        } else {
          isCorrect = String(response.selectedAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
        }
        
        // Create submission record
        await adminDb.collection('submissions').add({
          userId,
          questionId: qId,
          selectedAnswer: response.selectedAnswer,
          isCorrect,
          timeTaken: 0,
          subject: q.subject,
          chapter: q.chapter,
          topic: q.topic,
          difficulty: q.difficulty,
          source: 'mocktest',
          mocktestId: testId,
          aiAnalysis: { processingStatus: 'completed' },
          createdAt: new Date(),
        });
        
        // Create revision entry for wrong answers
        if (!isCorrect) {
          const existingRev = await adminDb.collection('revisions')
            .where('userId', '==', userId)
            .where('questionId', '==', qId)
            .where('isCompleted', '==', false)
            .limit(1)
            .get();
          
          if (existingRev.empty) {
            const nextReviewDate = new Date();
            nextReviewDate.setDate(nextReviewDate.getDate() + 1);
            
            await adminDb.collection('revisions').add({
              userId,
              questionId: qId,
              subject: q.subject,
              chapter: q.chapter,
              topic: q.topic,
              easeFactor: 2.5,
              interval: 1,
              repetitions: 0,
              nextReviewDate,
              priority: 'high',
              isCompleted: false,
              createdAt: new Date(),
            });
          }
        }
      }

      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Mocktest error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const snap = await adminDb.collection('mocktests')
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .orderBy('submittedAt', 'desc')
      .limit(20)
      .get();

    const tests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ tests });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
