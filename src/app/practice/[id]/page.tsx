'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import DoubtChat from '@/components/chat/DoubtChat';
import { Clock, CheckCircle, XCircle, Brain, ChevronLeft, Loader, RefreshCw, Lightbulb } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const LANG_KEY: Record<string, string> = {
  english: 'explanation', hindi: 'explanationHindi', tamil: 'explanationTamil', telugu: 'explanationTelugu'
};

export default function QuestionPage() {
  const params = useParams();
  const qId = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const [question, setQuestion] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef<any>(null);
  const pollRef = useRef<any>(null);

  useEffect(() => {
    fetch(`/api/questions/${qId}`)
      .then(r => r.json())
      .then(data => { setQuestion(data.question); setLoading(false); })
      .catch(() => { toast.error('Question not found'); router.push('/practice'); });

    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { clearInterval(timerRef.current); clearInterval(pollRef.current); };
  }, [qId, router]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSubmit = async () => {
    if (!selected) { toast.error('Please select an answer'); return; }
    if (!user) return;
    clearInterval(timerRef.current);
    setSubmitting(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          questionId: qId,
          selectedAnswer: selected,
          timeTaken: elapsed,
          preferredLanguage: user.preferredLanguage || 'english',
        }),
      });
      const data = await res.json();
      setResult(data);
      setSubmitted(true);

      // Poll for AI analysis
      if (!data.isCorrect) {
        setPolling(true);
        let attempts = 0;
        pollRef.current = setInterval(async () => {
          attempts++;
          const r = await fetch(`/api/submissions?id=${data.submissionId}`);
          const s = await r.json();
          const status = s.submission?.aiAnalysis?.processingStatus;
          if (status === 'completed' || status === 'failed' || attempts > 12) {
            clearInterval(pollRef.current);
            setPolling(false);
            setResult((prev: any) => ({ ...prev, aiAnalysis: s.submission?.aiAnalysis }));
          }
        }, 2500);
      }
    } catch {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/practice')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {!submitted && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-mono text-sm">{formatTime(elapsed)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {[question.subject, question.chapter, question.difficulty, question.source].filter(Boolean).map((tag, i) => (
            <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full capitalize">{tag}</span>
          ))}
        </div>

        {/* Question */}
        <div className="card p-6">
          <p className="text-white text-base leading-relaxed">{question.questionText}</p>
        </div>

        {/* Options */}
        {!submitted && (
          <div className="space-y-3">
            {question.options?.map((opt: any) => (
              <button key={opt.id} onClick={() => setSelected(opt.id)}
                className={clsx('w-full text-left p-4 rounded-xl border-2 transition-all',
                  selected === opt.id ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50')}>
                <span className={clsx('font-bold mr-3', selected === opt.id ? 'text-indigo-400' : 'text-slate-500')}>
                  {opt.id.toUpperCase()}.
                </span>
                {opt.text}
              </button>
            ))}
          </div>
        )}

        {/* Result */}
        {submitted && result && (
          <div className={clsx('rounded-2xl border-2 p-5 flex items-center gap-4',
            result.isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10')}>
            {result.isCorrect
              ? <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              : <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />}
            <div>
              <p className="font-bold text-white text-lg">{result.isCorrect ? 'Correct! 🎉' : 'Incorrect'}</p>
              {!result.isCorrect && (
                <p className="text-slate-400 text-sm mt-0.5">
                  Correct answer: <span className="text-green-400 font-bold">{String(result.correctAnswer).toUpperCase()}</span>
                </p>
              )}
              <p className="text-slate-500 text-xs mt-1">Time: {formatTime(elapsed)}</p>
            </div>
          </div>
        )}

        {/* Solution */}
        {submitted && result?.solution && (
          <div className="card p-6">
            <h3 className="text-white font-bold mb-3">Solution</h3>
            {result.solution.steps?.map((step: string, i: number) => (
              <div key={i} className="flex gap-3 mb-2">
                <span className="text-indigo-400 font-bold text-sm w-5 flex-shrink-0">{i + 1}.</span>
                <p className="text-slate-300 text-sm">{step}</p>
              </div>
            ))}
            {result.solution.explanation && (
              <p className="text-slate-400 text-sm mt-3 pt-3 border-t border-slate-800">{result.solution.explanation}</p>
            )}
          </div>
        )}

        {/* AI Analysis */}
        {submitted && !result.isCorrect && (
          <div className="card border-indigo-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h3 className="text-white font-bold">AI Analysis</h3>
              {polling && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span className="text-indigo-400 text-xs">Analysing...</span>
                </div>
              )}
            </div>

            {result?.aiAnalysis?.processingStatus === 'completed' && result.aiAnalysis.explanation ? (
              <div className="space-y-4">
                {result.aiAnalysis.errorType && (
                  <span className="badge bg-amber-400/10 text-amber-400 border border-amber-400/20 capitalize">
                    {result.aiAnalysis.errorType?.replace('_', ' ')}
                  </span>
                )}
                <p className="text-slate-200 text-sm leading-relaxed">{result.aiAnalysis.explanation}</p>
                {result.aiAnalysis.memoryTip && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                    <p className="text-indigo-300 text-xs font-semibold mb-1">💡 Memory Tip</p>
                    <p className="text-slate-300 text-sm">{result.aiAnalysis.memoryTip}</p>
                  </div>
                )}
                {result.aiAnalysis.suggestedConcepts?.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 font-medium">Review these</p>
                    <div className="flex flex-wrap gap-2">
                      {result.aiAnalysis.suggestedConcepts.map((c: string, i: number) => (
                        <span key={i} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-1 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                {polling ? 'AI is analyzing your answer... (5-10 seconds)' : 'AI analysis will appear here after submission.'}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!submitted ? (
            <button onClick={handleSubmit} disabled={submitting || !selected} className="btn-primary flex-1 py-3 text-base">
              {submitting ? <Loader className="w-4 h-4 animate-spin" /> : 'Submit Answer'}
            </button>
          ) : (
            <>
              <button onClick={() => router.push('/practice')} className="btn-secondary flex-1 py-3">← More Questions</button>
              <button onClick={() => router.push('/revision')} className="btn-primary flex-1 py-3">
                <Brain className="w-4 h-4" /> Revision
              </button>
            </>
          )}
        </div>

        {/* Doubt Chat floating */}
        <DoubtChat questionId={qId} questionText={question?.questionText} />
      </div>
    </AppLayout>
  );
}
