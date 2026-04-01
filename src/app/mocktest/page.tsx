'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import { Flag, ChevronLeft, ChevronRight, Clock, Send, Loader } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  not_visited: 'bg-slate-700 text-slate-300',
  not_answered: 'bg-red-500/20 text-red-400 border border-red-500/40',
  answered: 'bg-green-500 text-white',
  marked: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
};

export default function MockTestPage() {
  const { user } = useAuthStore();
  const [phase, setPhase] = useState<'setup' | 'exam' | 'result'>('setup');
  const [config, setConfig] = useState({ testType: 'JEE_MAINS', subject: '', difficulty: '' });
  const [testId, setTestId] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [testInfo, setTestInfo] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<any>(null);
  const startRef = useRef<number>(0);
  const handleSubmitRef = useRef<(auto?: boolean) => Promise<void> | void>();

  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmitRef.current?.(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const createTest = async () => {
    if (!user) return;
    setCreating(true);
    try {
      const res = await fetch('/api/mocktest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', userId: user.uid, ...config }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      setTestId(data.testId);
      setQuestions(data.questions);
      setTestInfo(data);
      setTimeLeft(data.durationMinutes * 60);
      const init: Record<string, string> = {};
      data.questions.forEach((q: any) => { init[q.id] = 'not_visited'; });
      setStatuses(init);
      await fetch('/api/mocktest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', testId: data.testId }),
      });
      startRef.current = Date.now();
      setPhase('exam');
    } catch { toast.error('Failed to create test'); }
    finally { setCreating(false); }
  };

  const q = questions[currentIdx];

  const selectAnswer = async (optId: string) => {
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: optId }));
    const newStatus = marked.has(q.id) ? 'marked' : 'answered';
    setStatuses(prev => ({ ...prev, [q.id]: newStatus }));
    await fetch('/api/mocktest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_response', testId, questionId: q.id, selectedAnswer: optId }),
    });
  };

  const toggleMark = () => {
    if (!q) return;
    const newMarked = new Set(marked);
    if (newMarked.has(q.id)) newMarked.delete(q.id); else newMarked.add(q.id);
    setMarked(newMarked);
    const hasAnswer = answers[q.id];
    setStatuses(prev => ({ ...prev, [q.id]: newMarked.has(q.id) ? (hasAnswer ? 'marked' : 'marked') : (hasAnswer ? 'answered' : 'not_answered') }));
  };

  const goTo = (idx: number) => {
    if (q) setStatuses(prev => ({ ...prev, [q.id]: prev[q.id] === 'not_visited' ? 'not_answered' : prev[q.id] }));
    setCurrentIdx(idx);
  };

  const userId = user?.uid;
  const preferredLanguage = user?.preferredLanguage;

  const handleSubmit = useCallback(async (auto = false) => {
    if (!auto) {
      const unattempted = questions.length - Object.keys(answers).length;
      if (unattempted > 0 && !confirm(`${unattempted} questions unattempted. Submit anyway?`)) return;
    }
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
      const res = await fetch('/api/mocktest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit', testId, userId, timeSpentSeconds: timeSpent, preferredLanguage }),
      });
      const data = await res.json();
      setResult(data.result);
      setPhase('result');
    } catch { toast.error('Submission failed'); }
    finally { setSubmitting(false); }
  }, [answers, questions.length, testId, userId, preferredLanguage]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  const answered = Object.keys(answers).length;

  // SETUP
  if (phase === 'setup') return (
    <AppLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-black text-white mb-2">Mock Test</h1>
        <p className="text-slate-400 mb-8">Simulate real exam conditions</p>
        <div className="card p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Select Test Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 'JEE_MAINS', l: 'JEE Mains', d: '90 Qs · 3 hrs · 300 marks' },
                { v: 'JEE_ADVANCED', l: 'JEE Advanced', d: '54 Qs · 3 hrs · 198 marks' },
                { v: 'NEET', l: 'NEET', d: '200 Qs · 3h 20m · 720 marks' },
                { v: 'CHAPTER_TEST', l: 'Chapter Test', d: '30 Qs · 1 hr · Custom' },
              ].map(({ v, l, d }) => (
                <button key={v} onClick={() => setConfig(c => ({ ...c, testType: v }))}
                  className={clsx('p-4 rounded-xl border-2 text-left transition-all',
                    config.testType === v ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-600')}>
                  <p className={clsx('font-bold', config.testType === v ? 'text-indigo-300' : 'text-white')}>{l}</p>
                  <p className="text-slate-400 text-xs mt-1">{d}</p>
                </button>
              ))}
            </div>
          </div>
          {config.testType === 'CHAPTER_TEST' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <select value={config.subject} onChange={e => setConfig(c => ({ ...c, subject: e.target.value }))} className="input">
                  <option value="">All</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="biology">Biology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                <select value={config.difficulty} onChange={e => setConfig(c => ({ ...c, difficulty: e.target.value }))} className="input">
                  <option value="">Mixed</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          )}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-slate-300">
            ⚠️ <span className="font-semibold text-amber-400">Rules:</span> +4 correct · −1 wrong · auto-submit on timer expiry
          </div>
          <button onClick={createTest} disabled={creating} className="btn-primary w-full py-4 text-lg">
            {creating ? <><Loader className="w-5 h-5 animate-spin" /> Creating...</> : '🚀 Start Test'}
          </button>
        </div>
      </div>
    </AppLayout>
  );

  // EXAM
  if (phase === 'exam' && q) return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div>
          <p className="text-white font-bold text-sm">{testInfo?.title}</p>
          <p className="text-slate-400 text-xs">Q {currentIdx + 1} of {questions.length}</p>
        </div>
        <div className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg',
          timeLeft < 300 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-white')}>
          <Clock className="w-5 h-5" />{fmt(timeLeft)}
        </div>
        <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn-primary text-sm px-4 py-2">
          <Send className="w-4 h-4" /> {submitting ? '...' : 'Submit'}
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Question */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-2 mb-4 flex-wrap">
            {[q.subject, q.chapter, q.difficulty].map((t, i) => (
              <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full capitalize">{t}</span>
            ))}
          </div>
          <div className="card p-6 mb-6">
            <p className="text-white text-base leading-relaxed">{q.questionText}</p>
          </div>
          <div className="space-y-3 mb-6">
            {q.options?.map((opt: any) => (
              <button key={opt.id} onClick={() => selectAnswer(opt.id)}
                className={clsx('w-full text-left p-4 rounded-xl border-2 transition-all',
                  answers[q.id] === opt.id ? 'border-indigo-500 bg-indigo-500/15 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50')}>
                <span className={clsx('font-bold mr-3', answers[q.id] === opt.id ? 'text-indigo-400' : 'text-slate-500')}>
                  {opt.id.toUpperCase()}.
                </span>{opt.text}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={toggleMark} className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all',
              marked.has(q.id) ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 text-slate-400 hover:border-slate-500')}>
              <Flag className="w-4 h-4" /> {marked.has(q.id) ? 'Marked' : 'Mark for Review'}
            </button>
            {answers[q.id] && (
              <button onClick={() => { setAnswers(prev => { const n = {...prev}; delete n[q.id]; return n; }); setStatuses(prev => ({ ...prev, [q.id]: 'not_answered' })); }}
                className="px-4 py-2 rounded-xl text-sm border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500 transition-all">
                Clear
              </button>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => goTo(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className="btn-secondary disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button onClick={() => goTo(Math.min(questions.length - 1, currentIdx + 1))} disabled={currentIdx === questions.length - 1} className="btn-primary disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Palette */}
        <div className="w-60 bg-slate-900 border-l border-slate-800 flex-shrink-0 overflow-y-auto p-4">
          <p className="text-white font-semibold text-sm mb-3">Question Palette</p>
          <div className="grid grid-cols-3 gap-1.5 mb-4 text-xs">
            {[['answered', 'Done', answered.toString()], ['not_answered', 'Skipped', String(questions.length - answered - Object.values(statuses).filter(s => s === 'not_visited').length)], ['not_visited', 'Left', String(Object.values(statuses).filter(s => s === 'not_visited').length)]].map(([s, l, v]) => (
              <div key={s} className={`${STATUS_COLORS[s]} rounded-lg p-2 text-center`}>
                <p className="font-bold text-sm">{v}</p>
                <p className="text-xs opacity-70">{l}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q: any, i) => {
              const st = statuses[q.id] || 'not_visited';
              return (
                <button key={i} onClick={() => goTo(i)}
                  className={clsx('w-9 h-9 rounded-lg text-xs font-bold transition-all', STATUS_COLORS[st],
                    currentIdx === i ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : '')}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // RESULT
  if (phase === 'result' && result) return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{result.accuracy >= 70 ? '🏆' : result.accuracy >= 40 ? '📈' : '💪'}</div>
          <h1 className="text-3xl font-black text-white">{result.marksObtained} / {testInfo?.durationMinutes <= 60 ? 120 : testInfo?.title?.includes('NEET') ? 720 : testInfo?.title?.includes('Advanced') ? 198 : 300}</h1>
          <p className="text-slate-400 mt-2">{result.accuracy}% accuracy · {result.totalAttempted} attempted</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { l: 'Correct', v: result.totalCorrect, c: 'text-green-400', bg: 'bg-green-500/10' },
            { l: 'Wrong', v: result.totalWrong, c: 'text-red-400', bg: 'bg-red-500/10' },
            { l: 'Skipped', v: result.totalSkipped, c: 'text-slate-400', bg: 'bg-slate-800' },
            { l: 'Score', v: result.marksObtained, c: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          ].map(({ l, v, c, bg }) => (
            <div key={l} className={`${bg} border border-slate-800 rounded-2xl p-5 text-center`}>
              <p className={`text-3xl font-black ${c}`}>{v}</p>
              <p className="text-slate-400 text-sm mt-1">{l}</p>
            </div>
          ))}
        </div>

        {/* Subject breakdown */}
        <div className="card p-6">
          <h2 className="text-white font-bold mb-4">Subject-wise Performance</h2>
          <div className="space-y-3">
            {Object.entries(result.subjectWise || {}).filter(([, d]: any) => d.attempted > 0).map(([subj, data]: any) => {
              const acc = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;
              return (
                <div key={subj}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 capitalize font-medium">{subj}</span>
                    <span className="text-slate-400">{data.correct}/{data.attempted} · {data.marks} marks</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={clsx('h-full rounded-full', acc >= 70 ? 'bg-green-500' : acc >= 40 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${acc}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Analysis */}
        {result.aiAnalysis && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6">
            <p className="text-indigo-400 font-bold mb-2">🤖 AI Performance Analysis</p>
            <p className="text-slate-200 leading-relaxed">{result.aiAnalysis}</p>
            {result.weakTopics?.length > 0 && (
              <div className="mt-4">
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Focus on these topics:</p>
                <div className="flex flex-wrap gap-2">
                  {result.weakTopics.map((t: string) => (
                    <span key={t} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => { setPhase('setup'); setQuestions([]); setAnswers({}); setStatuses({}); }} className="btn-secondary flex-1 py-3">Take Another Test</button>
          <a href="/analytics" className="btn-primary flex-1 py-3 text-center">View Analytics</a>
        </div>
      </div>
    </AppLayout>
  );

  return <AppLayout><div className="flex justify-center py-20"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div></AppLayout>;
}
