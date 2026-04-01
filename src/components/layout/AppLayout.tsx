 'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, BookOpen, Brain, BarChart3, User,
  LogOut, Menu, X, Flame, ClipboardList, Trophy, Bookmark,
  MessageCircle, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/practice', label: 'Practice', icon: BookOpen },
  { path: '/mocktest', label: 'Mock Test', icon: ClipboardList, badge: 'NEW' },
  { path: '/revision', label: 'Revision', icon: Brain },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, initialize, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = initialize();
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [initialize]);

  useEffect(() => {
    if (initialized && !user) router.push('/');
    if (initialized && user && !user.onboardingComplete) router.push('/onboarding');
  }, [initialized, user, router]);

  if (!initialized || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/60">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="text-white font-black text-sm">V</span>
        </div>
        <div>
          <span className="text-white font-black text-lg">VIDYA</span>
          <span className="text-indigo-400 text-xs ml-2">AI Tutor</span>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || 'Avatar'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <p className="text-indigo-400 text-xs font-mono">{user.studentId}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl px-3 py-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-sm font-bold">{user.streakDays || 0} day streak</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ path, label, icon: Icon, badge }) => {
          const active = pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
          return (
            <Link key={path} href={path} onClick={() => setSidebarOpen(false)}
              className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800')}>
              <Icon className={clsx('w-4 h-4 flex-shrink-0', active ? 'text-white' : 'text-slate-500 group-hover:text-white')} />
              <span className="flex-1">{label}</span>
              {badge && <span className="text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Exam badge */}
      <div className="px-4 pb-3">
        <div className="bg-gradient-to-r from-indigo-600/15 to-purple-600/15 border border-indigo-500/20 rounded-xl px-3 py-2.5 text-center">
          <p className="text-xs text-slate-400">Preparing for</p>
          <p className="text-indigo-400 font-black text-base">{user.targetExam}</p>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-slate-800">
        <button onClick={() => { logout(); router.push('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800/60 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">V</span>
            </div>
            <span className="text-white font-black">VIDYA</span>
          </div>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
