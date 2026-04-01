import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { analyzeWrongAnswer } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, questionId, selectedAnswer, timeTaken, preferredLanguage } = body;

    if (!userId || !questionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get question
    const qDoc = await adminDb.collection('questions').doc(questionId).get();
    if (!qDoc.exists) return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    const question = qDoc.data()!;

    // Check correctness
    let isCorrect = false;
    if (Array.isArray(question.correctAnswer)) {
      const userAns = Array.isArray(selectedAnswer) ? [...selectedAnswer].sort() : [selectedAnswer];
      isCorrect = JSON.stringify(userAns) === JSON.stringify([...question.correctAnswer].sort());
    } else {
      isCorrect = String(selectedAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
    }

    // Create submission
    const subRef = adminDb.collection('submissions').doc();
    const submission = {
      userId,
      questionId,
      selectedAnswer,
      isCorrect,
      timeTaken: timeTaken || 0,
      subject: question.subject,
      chapter: question.chapter,
      topic: question.topic,
      difficulty: question.difficulty,
      aiAnalysis: { processingStatus: 'pending' },
      createdAt: new Date(),
    };
    await subRef.set(submission);

    // Update question stats
    await adminDb.collection('questions').doc(questionId).update({
      attemptCount: (question.attemptCount || 0) + 1,
      correctCount: (question.correctCount || 0) + (isCorrect ? 1 : 0),
    });

    // Update user stats
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};

    const subjectStats = userData.subjectStats || {};
    const subj = question.subject;
    if (!subjectStats[subj]) subjectStats[subj] = { total: 0, correct: 0 };
    subjectStats[subj].total += 1;
    if (isCorrect) subjectStats[subj].correct += 1;

    const subjectMastery = { ...userData.subjectMastery };
    if (subjectStats[subj].total > 0) {
      subjectMastery[subj] = Math.round((subjectStats[subj].correct / subjectStats[subj].total) * 100);
    }

    await userRef.update({
      totalAttempted: (userData.totalAttempted || 0) + 1,
      totalCorrect: (userData.totalCorrect || 0) + (isCorrect ? 1 : 0),
      subjectStats,
      subjectMastery,
    });

    // SM-2 Spaced Repetition scheduling
    const quality = isCorrect ? 4 : 1;
    const existingRevision = await adminDb.collection('revisions')
      .where('userId', '==', userId)
      .where('questionId', '==', questionId)
      .where('isCompleted', '==', false)
      .limit(1)
      .get();

    const sm2Data = existingRevision.empty ? { easeFactor: 2.5, interval: 1, repetitions: 0 }
      : existingRevision.docs[0].data();

    let { easeFactor, interval, repetitions } = sm2Data;
    if (quality < 3) { repetitions = 0; interval = 1; }
    else {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
    }
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    if (existingRevision.empty) {
      await adminDb.collection('revisions').add({
        userId, questionId,
        subject: question.subject, chapter: question.chapter, topic: question.topic,
        easeFactor, interval, repetitions, nextReviewDate,
        priority: quality <= 2 ? 'high' : 'medium',
        isCompleted: false,
        createdAt: new Date(),
      });
    } else {
      await existingRevision.docs[0].ref.update({ easeFactor, interval, repetitions, nextReviewDate });
    }

    // Trigger AI analysis asynchronously (fire and forget)
    if (!isCorrect) {
      analyzeWrongAnswer(
        question.questionText,
        question.subject,
        question.topic,
        question.correctAnswer,
        preferredLanguage || 'english'
      ).then(async (analysis) => {
        if (analysis) {
          await subRef.update({
            'aiAnalysis.errorType': analysis.error_type,
            'aiAnalysis.confidence': analysis.confidence,
            'aiAnalysis.misconception': analysis.misconception,
            'aiAnalysis.explanation': analysis.explanation,
            'aiAnalysis.memoryTip': analysis.memory_tip,
            'aiAnalysis.suggestedConcepts': analysis.suggested_concepts,
            'aiAnalysis.processingStatus': 'completed',
          });
        }
      }).catch(console.error);
    } else {
      await subRef.update({ 'aiAnalysis.processingStatus': 'completed' });
    }

    return NextResponse.json({
      submissionId: subRef.id,
      isCorrect,
      correctAnswer: question.correctAnswer,
      solution: question.solution,
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (submissionId) {
      const doc = await adminDb.collection('submissions').doc(submissionId).get();
      if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ submission: { id: doc.id, ...doc.data() } });
    }

    if (userId) {
      const snap = await adminDb.collection('submissions')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      const submissions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ submissions });
    }

    return NextResponse.json({ error: 'Missing id or userId' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
