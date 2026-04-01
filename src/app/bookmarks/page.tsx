'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Bookmark, Trash2, StickyNote, Loader, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookmarksPage() {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch(`/api/bookmarks?userId=${user.uid}`)
      .then(r => r.json())
      .then(data => setBookmarks(data.bookmarks || []))
      .finally(() => setLoading(false));
  }, [user]);

  const removeBookmark = async (questionId: string) => {
    await fetch(`/api/bookmarks?userId=${user?.uid}&questionId=${questionId}`, { method: 'DELETE' });
    setBookmarks(prev => prev.filter(b => b.questionId !== questionId));
    toast.success('Bookmark removed');
  };

  const saveNote = async (bookmarkId: string) => {
    await fetch('/api/bookmarks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookmarkId, note: noteText }),
    });
    setBookmarks(prev => prev.map(b => b.id === bookmarkId ? { ...b, note: noteText } : b));
    setEditingNote(null);
    toast.success('Note saved');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Bookmarked Questions</h1>
            <p className="text-slate-400 text-sm">Questions you saved for later review</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>
        ) : bookmarks.length === 0 ? (
          <div className="card p-12 text-center">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-white font-semibold">No bookmarks yet</p>
            <p className="text-slate-400 text-sm mt-1">Bookmark questions while practicing to review them later</p>
            <Link href="/practice" className="btn-primary mt-4 inline-flex">Start Practice</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map(bookmark => (
              <div key={bookmark.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[bookmark.question?.subject, bookmark.question?.chapter, bookmark.question?.difficulty].filter(Boolean).map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full capitalize">{tag}</span>
                      ))}
                    </div>
                    <p className="text-white text-sm line-clamp-2 mb-2">{bookmark.question?.questionText}</p>
                    
                    {editingNote === bookmark.id ? (
                      <div className="mt-3">
                        <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                          className="input w-full h-20 text-sm" placeholder="Add your notes..." />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => saveNote(bookmark.id)} className="btn-primary text-xs px-3 py-1.5">Save</button>
                          <button onClick={() => setEditingNote(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                        </div>
                      </div>
                    ) : bookmark.note ? (
                      <div className="mt-2 p-2 bg-slate-800 rounded-lg">
                        <p className="text-slate-300 text-xs flex items-center gap-1"><StickyNote className="w-3 h-3" /> {bookmark.note}</p>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link href={`/practice/${bookmark.questionId}`}
                      className="w-9 h-9 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 flex items-center justify-center text-indigo-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button onClick={() => { setEditingNote(bookmark.id); setNoteText(bookmark.note || ''); }}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                      <StickyNote className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeBookmark(bookmark.questionId)}
                      className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
