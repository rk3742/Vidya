'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import toast from 'react-hot-toast';
import { Save, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    preferredLanguage: 'english',
    targetExam: 'JEE',
    grade: '12',
    board: 'CBSE',
  });

  // Sync form with user data when user loads
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        preferredLanguage: user.preferredLanguage || 'english',
        targetExam: user.targetExam || 'JEE',
        grade: user.grade || '12',
        board: user.board || 'CBSE',
      });
    }
  }, [user]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await updateUserProfile(form as any);
      toast.success(`Saved! Language set to ${form.preferredLanguage}`);
    } catch (err) { 
      console.error('Profile save error:', err);
      toast.error('Failed to update'); 
    }
    finally { setSaving(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-2xl font-black text-white">Profile Settings</h1>

        {/* Badge */}
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-5 flex items-center gap-4">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || 'Avatar'}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full ring-2 ring-indigo-500/30 object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-white font-bold text-lg">{user?.name}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <p className="text-indigo-400 text-xs font-mono mt-1">Student ID: {user?.studentId}</p>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-white font-bold">Personal Info</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Exam</label>
              <select value={form.targetExam} onChange={e => set('targetExam', e.target.value)} className="input">
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Preferred Language</label>
              <select value={form.preferredLanguage} onChange={e => set('preferredLanguage', e.target.value)} className="input">
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="tamil">தமிழ்</option>
                <option value="telugu">తెలుగు</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Grade</label>
              <select value={form.grade} onChange={e => set('grade', e.target.value)} className="input">
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="dropper">Dropper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Board</label>
              <select value={form.board} onChange={e => set('board', e.target.value)} className="input">
                {['CBSE', 'ICSE', 'State', 'Other'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>

        {/* Stats */}
        <div className="card p-6">
          <h2 className="text-white font-bold mb-4">Your Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Questions', value: user?.totalAttempted || 0 },
              { label: 'Correct', value: user?.totalCorrect || 0 },
              { label: 'Accuracy', value: user?.totalAttempted ? `${Math.round(((user.totalCorrect || 0) / user.totalAttempted) * 100)}%` : '0%' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-white">{value}</p>
                <p className="text-slate-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
