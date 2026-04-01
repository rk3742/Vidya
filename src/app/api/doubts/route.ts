import { NextRequest, NextResponse } from 'next/server';
import { answerDoubt, generateHint } from '@/lib/groq';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, questionId, studentMessage, hintLevel, chatHistory, language, userId } = body;

    if (type === 'hint') {
      if (!questionId) return NextResponse.json({ error: 'questionId required' }, { status: 400 });
      const qDoc = await adminDb.collection('questions').doc(questionId).get();
      if (!qDoc.exists) return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      const q = qDoc.data()!;
      const hint = await generateHint(q.questionText, q.subject, q.topic, hintLevel || 1, language || 'english');
      return NextResponse.json({ hint });
    }

    // Default: answer doubt
    if (!studentMessage) return NextResponse.json({ error: 'message required' }, { status: 400 });

    let questionText = '';
    let subject = 'JEE/NEET';
    let topic = 'General';

    if (questionId) {
      const qDoc = await adminDb.collection('questions').doc(questionId).get();
      if (qDoc.exists) {
        const q = qDoc.data()!;
        questionText = q.questionText;
        subject = q.subject;
        topic = q.topic;
      }
    }

    const answer = await answerDoubt(questionText, subject, topic, studentMessage, language || 'english', chatHistory || []);
    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error('Doubt error:', err);
    return NextResponse.json({ error: 'AI temporarily unavailable. Please try again.' }, { status: 500 });
  }
}
