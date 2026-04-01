import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doc = await adminDb.collection('questions').doc(params.id).get();
    if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // Hide answer
    const { correctAnswer, commonMisconceptions, ...safe } = doc.data()!;
    return NextResponse.json({ question: { id: doc.id, ...safe } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
