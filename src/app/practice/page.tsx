'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { BookOpen, Filter, ChevronRight, Loader } from 'lucide-react';
import clsx from 'clsx';

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const SUBJECTS_JEE = ['physics', 'chemistry', 'mathematics'];
const SUBJECTS_NEET = ['physics', 'chemistry', 'biology'];

export default function PracticePage() {
  const { user } = useAuthStore();
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);

  const subjects = user?.targetExam === 'NEET' ? SUBJECTS_NEET : SUBJECTS_JEE;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const params = new URLSearchParams({ exam: user.targetExam || 'JEE', limit: '12', page: String(page) });
    if (subject) params.set('subject', subject);
    if (difficulty) params.set('difficulty', difficulty);
    fetch(`/api/questions?${params}`)
      .then(r => r.json())
      .then(data => { setQuestions(data.questions || []); setTotal(data.total || 0); })
      .finally(() => setLoading(false));
  }, [subject, difficulty, page, user]);

  const setFilter = (key: string, val: string) => {
    if (key === 'subject') { setSubject(val); setPage(1); }
    if (key === 'difficulty') { setDifficulty(val === difficulty ? '' : val); setPage(1); }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white">Practice Questions</h1>
          <p className="text-slate-400 mt-1">{total} questions · {user?.targetExam}</p>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterBtn active={!subject} onClick={() => setFilter('subject', '')}>All</FilterBtn>
            {subjects.map(s => (
              <FilterBtn key={s} active={subject === s} onClick={() => setFilter('subject', s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </FilterBtn>
            ))}
            <div className="w-px bg-slate-700 mx-1" />
            {['easy', 'medium', 'hard'].map(d => (
              <FilterBtn key={d} active={difficulty === d} onClick={() => setFilter('difficulty', d)}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </FilterBtn>
            ))}
          </div>
        </div>

        {/* Questions */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 card p-12">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-white font-semibold">No questions found</p>
            <p className="text-slate-400 text-sm mt-1">Try different filters or seed the database</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {questions.map((q: any) => (
              <Link key={q.id} href={`/practice/${q.id}`}
                className="card p-5 hover:border-indigo-500/40 hover:bg-slate-800/30 transition-all group cursor-pointer block">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`badge border capitalize ${DIFFICULTY_STYLES[q.difficulty]}`}>{q.difficulty}</span>
                  <span className="text-xs text-slate-500 capitalize">{q.subject}</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed line-clamp-3 mb-3">{q.questionText}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 capitalize">{q.chapter}</p>
                    <p className="text-xs text-slate-600">{q.source}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="flex justify-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm disabled:opacity-40">← Prev</button>
            <span className="flex items-center px-4 text-slate-400 text-sm">Page {page} of {Math.ceil(total / 12)}</span>
            <button disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function FilterBtn({ active, onClick, children }: any) {
  return (
    <button onClick={onClick} className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
      active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700')}>
      {children}
    </button>
  );
}
