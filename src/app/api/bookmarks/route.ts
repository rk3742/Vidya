import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// GET bookmarks for user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const snap = await adminDb.collection('bookmarks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const bookmarks = await Promise.all(snap.docs.map(async d => {
      const data = d.data();
      const qDoc = await adminDb.collection('questions').doc(data.questionId).get();
      return {
        id: d.id,
        ...data,
        question: qDoc.exists ? { id: qDoc.id, ...qDoc.data() } : null,
      };
    }));

    return NextResponse.json({ bookmarks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - add bookmark
export async function POST(req: NextRequest) {
  try {
    const { userId, questionId, note } = await req.json();
    if (!userId || !questionId) {
      return NextResponse.json({ error: 'userId and questionId required' }, { status: 400 });
    }

    // Check if already bookmarked
    const existing = await adminDb.collection('bookmarks')
      .where('userId', '==', userId)
      .where('questionId', '==', questionId)
      .limit(1)
      .get();

    if (!existing.empty) {
      if (note !== undefined) {
        await existing.docs[0].ref.update({ note, updatedAt: new Date() });
      }
      return NextResponse.json({ id: existing.docs[0].id, exists: true });
    }

    const ref = await adminDb.collection('bookmarks').add({
      userId,
      questionId,
      note: note || '',
      createdAt: new Date(),
    });

    return NextResponse.json({ id: ref.id, created: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - remove bookmark
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const questionId = searchParams.get('questionId');
    
    if (!userId || !questionId) {
      return NextResponse.json({ error: 'userId and questionId required' }, { status: 400 });
    }

    const snap = await adminDb.collection('bookmarks')
      .where('userId', '==', userId)
      .where('questionId', '==', questionId)
      .limit(1)
      .get();

    if (!snap.empty) {
      await snap.docs[0].ref.delete();
    }

    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH - update note
export async function PATCH(req: NextRequest) {
  try {
    const { bookmarkId, note } = await req.json();
    if (!bookmarkId) {
      return NextResponse.json({ error: 'bookmarkId required' }, { status: 400 });
    }

    await adminDb.collection('bookmarks').doc(bookmarkId).update({
      note,
      updatedAt: new Date(),
    });

    return NextResponse.json({ updated: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
