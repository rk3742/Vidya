'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLeaderboard } from '@/lib/swr';
import AppLayout from '@/components/layout/AppLayout';
import { LeaderboardSkeleton } from '@/components/ui/Skeleton';
import { Trophy, Flame } from 'lucide-react';
import clsx from 'clsx';

const RANK_STYLES: Record<number, any> = {
  1: { bg: 'bg-yellow-500/20 border-yellow-500/50', text: 'text-yellow-400', icon: '🥇' },
  2: { bg: 'bg-slate-400/20 border-slate-400/50', text: 'text-slate-300', icon: '🥈' },
  3: { bg: 'bg-amber-700/20 border-amber-700/50', text: 'text-amber-600', icon: '🥉' },
};

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState('practice');
  const [period, setPeriod] = useState('week');
  const [exam, setExam] = useState('JEE');
  
  const { data, isLoading } = useLeaderboard(tab, exam, period, user?.uid);
  const leaderboard = data?.leaderboard || [];
  const myRank = data?.myRank;

  const myEntry = leaderboard.find((e: any) => e.uid === user?.uid);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Leaderboard</h1>
            <p className="text-slate-400 text-sm">Compete with students across India</p>
          </div>
        </div>

        {/* My rank */}
        {myEntry && (
          <div className="bg-indigo-600/15 border border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black">
                #{data.myRank}
              </div>
              <div>
                <p className="text-white font-bold">Your Rank</p>
                <p className="text-indigo-300 text-sm">{myEntry.score} points · {myEntry.accuracy}% accuracy</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">{myEntry.totalCorrect} correct</p>
              <p className="text-slate-400 text-sm">{myEntry.totalAttempted} attempted</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            {[{ v: 'practice', l: 'Practice' }, { v: 'mocktest', l: 'Mock Tests' }].map(({ v, l }) => (
              <button key={v} onClick={() => setTab(v)}
                className={clsx('px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  tab === v ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white')}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {tab === 'practice' && (
              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                {[{ v: 'week', l: 'Week' }, { v: 'month', l: 'Month' }, { v: 'all', l: 'All' }].map(({ v, l }) => (
                  <button key={v} onClick={() => setPeriod(v)}
                    className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      period === v ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white')}>
                    {l}
                  </button>
                ))}
              </div>
            )}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
              {['JEE', 'NEET'].map(e => (
                <button key={e} onClick={() => setExam(e)}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    exam === e ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white')}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings */}
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : leaderboard.length === 0 ? (
          <div className="card p-12 text-center">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-white font-semibold">No data yet</p>
            <p className="text-slate-400 text-sm mt-1">Practice more to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Top 3 */}
            {leaderboard.slice(0, 3).map((entry: any) => {
              const style = RANK_STYLES[entry.rank] || {};
              const isMe = entry.uid === user?.uid;
              return (
                <div key={entry.uid} className={`border rounded-2xl p-5 flex items-center gap-4 ${style.bg || 'card'} ${isMe ? 'ring-2 ring-indigo-500' : ''}`}>
                  <span className="text-3xl">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-lg ${style.text || 'text-white'}`}>{entry.name}</p>
                      {isMe && <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">You</span>}
                    </div>
                    <p className="text-slate-400 text-sm">{entry.studentId} · {entry.targetExam}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-2xl ${style.text || 'text-white'}`}>
                      {tab === 'practice' ? `${entry.score} pts` : `${entry.bestScore} marks`}
                    </p>
                    <p className="text-slate-400 text-sm">{tab === 'practice' ? `${entry.accuracy}%` : `${entry.bestAccuracy}%`}</p>
                  </div>
                </div>
              );
            })}

            {/* Rest */}
            <div className="card overflow-hidden">
              {leaderboard.slice(3).map((entry: any) => {
                const isMe = entry.uid === user?.uid;
                return (
                  <div key={entry.uid} className={`flex items-center gap-4 px-5 py-4 border-b border-slate-800 last:border-0 transition-colors ${isMe ? 'bg-indigo-500/10' : 'hover:bg-slate-800/50'}`}>
                    <span className="text-slate-400 font-bold w-8 text-center">#{entry.rank}</span>
                    {entry.avatar ? (
                      <Image
                        src={entry.avatar}
                        alt={entry.name || 'Avatar'}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {entry.name?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">{entry.name}</p>
                        {isMe && <span className="text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">You</span>}
                      </div>
                      <p className="text-slate-500 text-xs">{entry.totalAttempted} questions</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.streakDays > 0 && (
                        <span className="flex items-center gap-1 text-orange-400 text-xs">
                          <Flame className="w-3 h-3" />{entry.streakDays}
                        </span>
                      )}
                      <div className="text-right">
                        <p className="text-white font-bold text-sm">{tab === 'practice' ? `${entry.score} pts` : `${entry.bestScore} marks`}</p>
                        <p className="text-slate-400 text-xs">{tab === 'practice' ? `${entry.accuracy}%` : `${entry.bestAccuracy}%`}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
