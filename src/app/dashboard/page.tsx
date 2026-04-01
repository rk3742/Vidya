'use client';
import { useAuthStore } from '@/store/authStore';
import { useAnalytics } from '@/lib/swr';
import AppLayout from '@/components/layout/AppLayout';
import { StatsSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import PomodoroTimer from '@/components/ui/PomodoroTimer';
import AchievementBadges from '@/components/ui/AchievementBadges';
import DownloadReportButton from '@/components/ui/PDFReport';
import Link from 'next/link';
import { BookOpen, Brain, TrendingUp, Flame, CheckCircle, AlertCircle, ChevronRight, ClipboardList, Trophy } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

const SUBJECT_COLORS: Record<string, string> = {
  physics: '#6366f1', chemistry: '#10b981', mathematics: '#f59e0b', biology: '#ef4444'
};

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: analytics, isLoading } = useAnalytics(user?.uid);

  const trendData = analytics?.trend || [];
  const chartData = {
    labels: trendData.map((d: any) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }),
    datasets: [{
      label: 'Accuracy %',
      data: trendData.map((d: any) => d.accuracy),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
    }]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: (v: number) => v + '%' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 7 } }
    }
  };

  const ov = analytics?.overview || {};

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-black text-white">
            Good {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-400 mt-1">
            {ov.dueRevisions > 0
              ? `You have ${ov.dueRevisions} revision${ov.dueRevisions > 1 ? 's' : ''} due today.`
              : "You're all caught up! Keep practising."}
          </p>
        </div>

        {/* Stats */}
        {isLoading ? <StatsSkeleton /> : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle, label: 'Total Attempted', value: ov.totalAttempted || 0, color: 'text-green-400', bg: 'bg-green-500/10' },
              { icon: TrendingUp, label: 'Overall Accuracy', value: `${ov.accuracy || 0}%`, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { icon: Brain, label: 'Due Revisions', value: ov.dueRevisions || 0, color: 'text-purple-400', bg: 'bg-purple-500/10', link: '/revision' },
              { icon: Flame, label: 'Day Streak', value: `${ov.streakDays || 0} 🔥`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map(({ icon: Icon, label, value, color, bg, link }) => {
              const content = (
                <div className="card p-5 hover:border-slate-700 transition-colors">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-slate-400 text-sm mt-1">{label}</p>
                </div>
              );
              return link ? <Link key={label} href={link}>{content}</Link> : <div key={label}>{content}</div>;
            })}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance chart */}
          {isLoading ? <div className="lg:col-span-2"><ChartSkeleton /></div> : (
            <div className="lg:col-span-2 card p-6">
              <h2 className="text-white font-bold mb-4">Performance — Last 14 Days</h2>
              <div className="h-48">
                {trendData.length > 0
                  ? <Line data={chartData} options={chartOptions} />
                  : <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data yet. Start practising!</div>}
              </div>
            </div>
          )}

          {/* Subject mastery */}
          <div className="card p-6">
            <h2 className="text-white font-bold mb-4">Subject Mastery</h2>
            <div className="space-y-4">
              {Object.entries(ov.subjectMastery || { physics: 0, chemistry: 0, mathematics: 0, biology: 0 }).map(([subj, score]: any) => (
                <div key={subj}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 capitalize">{subj}</span>
                    <span className="text-slate-400">{Math.round(score)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${score}%`, backgroundColor: SUBJECT_COLORS[subj] || '#6366f1' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weak topics */}
          {analytics?.weakTopics?.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h2 className="text-white font-bold">Weak Topics — Focus Here</h2>
              </div>
              <div className="space-y-3">
                {analytics.weakTopics.map((topic: any, i: number) => (
                  <Link key={i} href={`/practice?subject=${topic.subject}`}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors group">
                    <div>
                      <p className="text-white text-sm font-medium capitalize">{topic.topic}</p>
                      <p className="text-slate-400 text-xs capitalize">{topic.subject} · {topic.chapter}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm font-bold">{topic.accuracy}%</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="card p-6">
            <h2 className="text-white font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: '/practice', icon: BookOpen, label: 'Practice Now', color: 'bg-indigo-600/20 border-indigo-500/30 hover:bg-indigo-600/30 text-indigo-400' },
                { href: '/revision', icon: Brain, label: `Revise (${ov.dueRevisions || 0})`, color: 'bg-purple-600/20 border-purple-500/30 hover:bg-purple-600/30 text-purple-400' },
                { href: '/mocktest', icon: ClipboardList, label: 'Mock Test', color: 'bg-green-600/20 border-green-500/30 hover:bg-green-600/30 text-green-400' },
                { href: '/leaderboard', icon: Trophy, label: 'Leaderboard', color: 'bg-amber-600/20 border-amber-500/30 hover:bg-amber-600/30 text-amber-400' },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all text-center ${color}`}>
                  <Icon className="w-7 h-7" />
                  <span className="text-sm font-semibold">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pomodoro Timer */}
          <PomodoroTimer />

          {/* Achievements */}
          {analytics && <AchievementBadges stats={{ ...ov, subjectMastery: analytics.overview?.subjectMastery }} />}
        </div>

        {/* Download Report */}
        {analytics && (
          <div className="flex justify-center">
            <DownloadReportButton data={{
              userName: user?.name || 'Student',
              studentId: user?.studentId || 'N/A',
              targetExam: user?.targetExam || 'JEE',
              totalAttempted: ov.totalAttempted || 0,
              totalCorrect: ov.totalCorrect || 0,
              accuracy: ov.accuracy || 0,
              streakDays: ov.streakDays || 0,
              subjectMastery: ov.subjectMastery || {},
              weakTopics: analytics.weakTopics || [],
              trend: analytics.trend || [],
            }} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
