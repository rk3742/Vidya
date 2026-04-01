'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const LANGS = [
  { value: 'english', label: 'English', flag: '🇬🇧' },
  { value: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
  { value: 'tamil', label: 'தமிழ்', flag: '🎯' },
  { value: 'telugu', label: 'తెలుగు', flag: '⭐' },
];

export default function OnboardingPage() {
  const { user, updateUserProfile } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    targetExam: 'JEE' as 'JEE' | 'NEET' | 'BOTH',
    grade: '12',
    board: 'CBSE',
    preferredLanguage: 'english' as 'english' | 'hindi' | 'tamil' | 'telugu',
    targetYear: new Date().getFullYear() + 1,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const finish = async () => {
    setLoading(true);
    try {
      await updateUserProfile({ ...form, onboardingComplete: true });
      toast.success('Welcome to VIDYA! 🎓');
      router.push('/dashboard');
    } catch { toast.error('Failed to save preferences'); }
    finally { setLoading(false); }
  };

  const Opt = ({ selected, onClick, children }: any) => (
    <button onClick={onClick}
      className={clsx('w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all',
        selected ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800')}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl">V</span>
          </div>
          <span className="text-white font-black text-2xl">VIDYA</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['Exam Goal', 'Your Profile', 'Language'].map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0',
                  i < step ? 'bg-indigo-500 text-white' : i === step ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-slate-800 text-slate-500')}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={clsx('text-xs hidden sm:block', i === step ? 'text-white' : 'text-slate-500')}>{label}</span>
              </div>
              {i < 2 && <div className={clsx('h-px flex-1 mx-2', i < step ? 'bg-indigo-500' : 'bg-slate-800')} />}
            </div>
          ))}
        </div>

        <div className="card p-6">
          {step === 0 && (
            <>
              <h2 className="text-xl font-black text-white mb-1">What are you preparing for?</h2>
              <p className="text-slate-400 text-sm mb-6">VIDYA tailors content to your goal</p>
              <div className="space-y-3 mb-6">
                {[
                  { v: 'JEE', l: 'JEE (Mains + Advanced)', d: 'Physics, Chemistry, Mathematics' },
                  { v: 'NEET', l: 'NEET', d: 'Physics, Chemistry, Biology' },
                  { v: 'BOTH', l: 'Both JEE & NEET', d: 'Full science coverage' },
                ].map(({ v, l, d }) => (
                  <Opt key={v} selected={form.targetExam === v} onClick={() => set('targetExam', v)}>
                    <span className="font-semibold">{l}</span>
                    <span className="text-xs text-slate-400 ml-2">— {d}</span>
                  </Opt>
                ))}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Target year</label>
                <select value={form.targetYear} onChange={e => set('targetYear', parseInt(e.target.value))}
                  className="input">
                  {[2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Continue →</button>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-black text-white mb-1">Tell us about yourself</h2>
              <p className="text-slate-400 text-sm mb-6">Personalise difficulty and content</p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current class</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ v: '11', l: 'Class 11' }, { v: '12', l: 'Class 12' }, { v: 'dropper', l: 'Dropper' }].map(({ v, l }) => (
                      <Opt key={v} selected={form.grade === v} onClick={() => set('grade', v)}>
                        <span className="text-sm">{l}</span>
                      </Opt>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Board</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['CBSE', 'ICSE', 'State', 'Other'].map(b => (
                      <Opt key={b} selected={form.board === b} onClick={() => set('board', b)}>
                        <span className="text-sm">{b}</span>
                      </Opt>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">Continue →</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-black text-white mb-1">Preferred language</h2>
              <p className="text-slate-400 text-sm mb-6">AI will explain mistakes in this language</p>
              <div className="space-y-3 mb-6">
                {LANGS.map(({ value, label, flag }) => (
                  <Opt key={value} selected={form.preferredLanguage === value} onClick={() => set('preferredLanguage', value)}>
                    <span className="text-lg mr-3">{flag}</span>
                    <span className="font-semibold">{label}</span>
                  </Opt>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                <button onClick={finish} disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🎓 Start Learning'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
