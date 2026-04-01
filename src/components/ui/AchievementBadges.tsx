'use client';
import { Trophy, Target, Flame, BookOpen, Brain, Star, Zap, Award } from 'lucide-react';
import clsx from 'clsx';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  requirement: (stats: any) => boolean;
}

const BADGES: Badge[] = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first question', icon: Star, color: 'text-yellow-400 bg-yellow-400/20', requirement: (s) => s.totalAttempted >= 1 },
  { id: 'getting_started', name: 'Getting Started', description: 'Attempt 10 questions', icon: BookOpen, color: 'text-blue-400 bg-blue-400/20', requirement: (s) => s.totalAttempted >= 10 },
  { id: 'dedicated', name: 'Dedicated', description: 'Attempt 50 questions', icon: Target, color: 'text-indigo-400 bg-indigo-400/20', requirement: (s) => s.totalAttempted >= 50 },
  { id: 'century', name: 'Century', description: 'Attempt 100 questions', icon: Trophy, color: 'text-amber-400 bg-amber-400/20', requirement: (s) => s.totalAttempted >= 100 },
  { id: 'streak_3', name: 'On Fire', description: '3 day streak', icon: Flame, color: 'text-orange-400 bg-orange-400/20', requirement: (s) => s.streakDays >= 3 },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: Flame, color: 'text-red-400 bg-red-400/20', requirement: (s) => s.streakDays >= 7 },
  { id: 'accurate', name: 'Sharpshooter', description: '70%+ accuracy (min 20 questions)', icon: Zap, color: 'text-green-400 bg-green-400/20', requirement: (s) => s.totalAttempted >= 20 && (s.totalCorrect / s.totalAttempted) >= 0.7 },
  { id: 'master', name: 'Subject Master', description: '80%+ in any subject', icon: Brain, color: 'text-purple-400 bg-purple-400/20', requirement: (s) => Object.values(s.subjectMastery || {}).some((v: any) => v >= 80) },
  { id: 'perfectionist', name: 'Perfectionist', description: '90%+ accuracy (min 30 questions)', icon: Award, color: 'text-pink-400 bg-pink-400/20', requirement: (s) => s.totalAttempted >= 30 && (s.totalCorrect / s.totalAttempted) >= 0.9 },
];

export function getUnlockedBadges(stats: any): Badge[] {
  return BADGES.filter(badge => badge.requirement(stats));
}

export function getNextBadges(stats: any): Badge[] {
  return BADGES.filter(badge => !badge.requirement(stats)).slice(0, 3);
}

export default function AchievementBadges({ stats }: { stats: any }) {
  const unlocked = getUnlockedBadges(stats);
  const next = getNextBadges(stats);

  return (
    <div className="card p-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" /> Achievements
      </h3>
      
      {/* Unlocked badges */}
      <div className="flex flex-wrap gap-3 mb-4">
        {unlocked.length === 0 ? (
          <p className="text-slate-500 text-sm">Complete questions to unlock badges!</p>
        ) : (
          unlocked.map(badge => (
            <div key={badge.id} className={clsx('flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700', badge.color.split(' ')[1])}>
              <badge.icon className={clsx('w-5 h-5', badge.color.split(' ')[0])} />
              <div>
                <p className="text-white text-sm font-medium">{badge.name}</p>
                <p className="text-slate-400 text-xs">{badge.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Next badges */}
      {next.length > 0 && (
        <>
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Next to unlock</p>
          <div className="flex flex-wrap gap-2">
            {next.map(badge => (
              <div key={badge.id} className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded-lg opacity-50">
                <badge.icon className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500 text-xs">{badge.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
