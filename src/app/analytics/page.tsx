'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { TrendingUp, AlertTriangle, Loader } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const darkOpts: any = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } } },
  scales: {
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
  }
};

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/analytics?userId=${user.uid}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Loader className="w-8 h-8 text-indigo-400 animate-spin" /></div></AppLayout>;

  const ov = data?.overview || {};
  const trend = data?.trend || [];
  const subjectLabels = Object.keys(ov.subjectMastery || {});
  const subjectValues = subjectLabels.map(s => ov.subjectMastery[s] || 0);
  const errorLabels = Object.keys(data?.errorTypes || {}).map(k => k.replace('_', ' '));
  const errorValues = Object.values(data?.errorTypes || {}) as number[];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-indigo-400" /> Analytics
          </h1>
          <p className="text-slate-400 mt-1">Your complete performance breakdown</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Attempted', value: ov.totalAttempted || 0 },
            { label: 'Total Correct', value: ov.totalCorrect || 0 },
            { label: 'Overall Accuracy', value: `${ov.accuracy || 0}%` },
            { label: 'Due Revisions', value: ov.dueRevisions || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="card p-5">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-slate-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Trend */}
        <div className="card p-6">
          <h2 className="text-white font-bold mb-4">30-Day Performance Trend</h2>
          <div className="h-56">
            {trend.length > 0 ? (
              <Line data={{
                labels: trend.map((d: any) => new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
                datasets: [
                  { label: 'Accuracy %', data: trend.map((d: any) => d.accuracy), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4, pointRadius: 2 },
                  { label: 'Questions', data: trend.map((d: any) => d.total), borderColor: '#10b981', backgroundColor: 'transparent', tension: 0.4, yAxisID: 'y1', pointRadius: 2 }
                ]
              }} options={{ ...darkOpts, scales: { ...darkOpts.scales, y: { ...darkOpts.scales.y, min: 0, max: 100, ticks: { ...darkOpts.scales.y.ticks, callback: (v: any) => v + '%' } }, y1: { position: 'right', grid: { display: false }, ticks: { color: '#94a3b8' } } } }} />
            ) : <div className="h-full flex items-center justify-center text-slate-500">No data yet</div>}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Subject accuracy */}
          <div className="card p-6">
            <h2 className="text-white font-bold mb-4">Subject-wise Accuracy</h2>
            <div className="h-56">
              {subjectLabels.length > 0 ? (
                <Bar data={{
                  labels: subjectLabels.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
                  datasets: [{ label: 'Mastery %', data: subjectValues, backgroundColor: COLORS, borderRadius: 6 }]
                }} options={{ ...darkOpts, scales: { ...darkOpts.scales, y: { ...darkOpts.scales.y, min: 0, max: 100, ticks: { ...darkOpts.scales.y.ticks, callback: (v: any) => v + '%' } } } }} />
              ) : <div className="h-full flex items-center justify-center text-slate-500">No data yet</div>}
            </div>
          </div>

          {/* Error types */}
          <div className="card p-6">
            <h2 className="text-white font-bold mb-4">Error Type Distribution</h2>
            <div className="h-56 flex items-center justify-center">
              {errorValues.length > 0 ? (
                <Doughnut data={{
                  labels: errorLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
                  datasets: [{ data: errorValues, backgroundColor: COLORS, borderWidth: 0 }]
                }} options={{ ...darkOpts, cutout: '65%' }} />
              ) : <p className="text-slate-500 text-sm">No incorrect submissions yet</p>}
            </div>
          </div>
        </div>

        {/* Weak topics */}
        {data?.weakTopics?.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-white font-bold">Weak Topics</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    {['Topic', 'Subject', 'Chapter', 'Accuracy', 'Attempts'].map(h => (
                      <th key={h} className={`py-2 font-medium ${h === 'Accuracy' || h === 'Attempts' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.weakTopics.map((t: any, i: number) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 text-white capitalize">{t.topic}</td>
                      <td className="py-3 text-slate-400 capitalize">{t.subject}</td>
                      <td className="py-3 text-slate-400">{t.chapter}</td>
                      <td className="py-3 text-right"><span className={t.accuracy < 30 ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>{t.accuracy}%</span></td>
                      <td className="py-3 text-right text-slate-400">{t.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
