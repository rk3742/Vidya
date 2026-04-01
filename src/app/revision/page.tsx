'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import { Brain, Calendar, CheckCircle, Clock, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const QUALITY_BTNS = [
  { q: 1, label: 'Forgot', color: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' },
  { q: 3, label: 'Hard', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' },
  { q: 4, label: 'Good', color: 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' },
  { q: 5, label: 'Easy', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20' },
];

export default function RevisionPage() {
  const { user } = useAuthStore();
  const [due, setDue] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<Record<string, boolean>>({});

  const fetch_ = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [dueRes, upRes] = await Promise.all([
      fetch(`/api/revisions?userId=${user.uid}&type=due`),
      fetch(`/api/revisions?userId=${user.uid}&type=upcoming`),
    ]);
    const dueData = await dueRes.json();
    const upData = await upRes.json();
    setDue(dueData.due || []);
    setUpcoming(upData.upcoming || {});
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const complete = async (revisionId: string, quality: number) => {
    setCompleting(c => ({ ...c, [revisionId]: true }));
    try {
      await fetch('/api/revisions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId, quality }),
      });
      toast.success(quality >= 4 ? '✅ Mastered!' : '📅 Scheduled for review');
      setDue(prev => prev.filter(r => r.id !== revisionId));
    } catch { toast.error('Failed'); }
    finally { setCompleting(c => ({ ...c, [revisionId]: false })); }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Brain className="w-7 h-7 text-indigo-400" /> Revision Schedule
          </h1>
          <p className="text-slate-400 mt-1">SM-2 spaced repetition — Ebbinghaus forgetting curve</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>
        ) : (
          <>
            {/* Due today */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-red-400" />
                <h2 className="text-white font-bold">Due Today ({due.length})</h2>
              </div>
              {due.length === 0 ? (
                <div className="card p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">All caught up! 🎉</p>
                  <p className="text-slate-400 text-sm mt-1">No revisions due today.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {due.map((r: any) => (
                    <div key={r.id} className="card p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="text-white font-medium text-sm line-clamp-2">
                            {r.question?.questionText || r.topic}
                          </p>
                          <p className="text-slate-400 text-xs mt-1 capitalize">
                            {r.subject} · {r.chapter} · {r.topic}
                          </p>
                        </div>
                        <span className={clsx('badge flex-shrink-0 capitalize',
                          r.priority === 'high' ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400')}>
                          {r.priority}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mb-3">
                        Interval: {r.interval}d · Reps: {r.repetitions} · EF: {r.easeFactor?.toFixed(2)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-slate-500 text-xs self-center">How well did you recall?</span>
                        {QUALITY_BTNS.map(({ q, label, color }) => (
                          <button key={q} disabled={completing[r.id]}
                            onClick={() => complete(r.id, q)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${color}`}>
                            {completing[r.id] ? '...' : label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            {Object.keys(upcoming).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-white font-bold">Upcoming (Next 7 Days)</h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(upcoming).map(([date, items]) => (
                    <div key={date} className="card p-4">
                      <p className="text-indigo-400 text-sm font-semibold mb-2">
                        {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(items as any[]).map((r: any) => (
                          <span key={r.id} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full capitalize">
                            {r.subject} · {r.topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
