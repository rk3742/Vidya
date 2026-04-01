'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  Brain, Zap, Globe, Trophy, ArrowRight, Star,
  CheckCircle, BookOpen, BarChart3, MessageCircle,
  Target, Clock, Users, Flame
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    gradient: 'from-indigo-500 to-purple-600',
    glow: 'shadow-indigo-500/20',
    title: 'AI Misconception Detection',
    desc: 'Gemini AI identifies your exact mistake — concept error, formula error, or calculation mistake. Not just wrong, but precisely why.'
  },
  {
    icon: Globe,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    title: 'Native Language Explanations',
    desc: 'Explanations in Telugu, Tamil, Hindi & English. Bridge the language gap that blocks lakhs of students from their dream rank.'
  },
  {
    icon: Trophy,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    title: 'Full Mock Tests',
    desc: 'JEE Mains (90Q/3hrs), JEE Advanced (54Q), NEET (200Q) with real negative marking, question palette & AI performance analysis.'
  },
  {
    icon: Zap,
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-500/20',
    title: 'SM-2 Spaced Repetition',
    desc: 'Ebbinghaus forgetting curve algorithm schedules revision at the exact moment before you forget — scientifically proven to 3x retention.'
  },
  {
    icon: MessageCircle,
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'shadow-blue-500/20',
    title: 'AI Doubt Chat',
    desc: 'Ask any doubt instantly. Powered by LLaMA 3.3 70B. 3-level hint system before revealing solutions. Responds in your language.'
  },
  {
    icon: BarChart3,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
    title: 'Deep Analytics',
    desc: 'Error type distribution, subject accuracy, 30-day trends, weak topic detection. Know exactly what to study next.'
  },
];

const STATS = [
  { value: '96+', label: 'Real JEE/NEET Questions', icon: BookOpen },
  { value: '4', label: 'Indian Languages', icon: Globe },
  { value: 'SM-2', label: 'Memory Algorithm', icon: Brain },
  { value: '100%', label: 'Free to Start', icon: Target },
];

const TESTIMONIALS = [
  { name: 'Arjun S.', exam: 'JEE Advanced 2024', rank: 'AIR 847', avatar: 'A', color: 'bg-indigo-600', text: 'VIDYA told me I had formula errors in thermodynamics, not concept errors. That one distinction changed my preparation completely.' },
  { name: 'Priya M.', exam: 'NEET 2024', rank: '645/720', avatar: 'P', color: 'bg-rose-600', text: 'Telugu explanations made organic chemistry click after 2 years of struggling with English-only resources. Game changer.' },
  { name: 'Rahul K.', exam: 'JEE Mains 2024', rank: '99.2 percentile', avatar: 'R', color: 'bg-emerald-600', text: 'The spaced repetition schedule shows me what I\'m about to forget the night before I forget it. It\'s scary accurate.' },
];

export default function LandingPage() {
  const { signInWithGoogle, loading } = useAuthStore();
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-black text-sm">V</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">VIDYA</span>
            <span className="hidden sm:block text-indigo-400 text-xs font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">AI Tutor</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-3 py-2">
              Sign in
            </Link>
            <button onClick={signInWithGoogle} disabled={loading}
              className="btn-primary text-sm px-5 py-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Start Free <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 left-1/4 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 right-1/4 w-[300px] h-[300px] bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-indigo-300 text-sm font-medium">AI-Powered JEE & NEET Preparation · Free</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            Know{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              why
            </span>
            {' '}you fail,
            <br className="hidden sm:block" />
            {' '}not just{' '}
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              that
            </span>
            {' '}you failed.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            VIDYA uses AI to detect your exact misconception in every wrong answer —
            explained in <span className="text-white font-semibold">Telugu, Tamil, Hindi or English</span>.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={signInWithGoogle} disabled={loading}
              className="group bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Continue with Google <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
            <Link href="/auth/login"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all flex items-center justify-center">
              Sign in with Email
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center hover:border-slate-700 transition-colors">
                <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-xl font-black text-white">{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Every other platform tells you{' '}
              <span className="text-red-400">you&apos;re wrong.</span>
            </h2>
            <p className="text-slate-400 text-lg">VIDYA tells you <span className="text-white font-semibold">exactly why</span> — and explains it in your language.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                emoji: '❌', title: 'Other platforms', highlight: false,
                points: ['Correct / Incorrect only', 'Generic English explanation', 'No step analysis', 'No revision planning', 'No native language support']
              },
              {
                emoji: '✅', title: 'VIDYA', highlight: true,
                points: ['Exact error type detected', 'Explained in your language', 'Step-by-step correction', 'SM-2 spaced repetition', 'Telugu · Tamil · Hindi · English']
              },
              {
                emoji: '🏆', title: 'Your result', highlight: false,
                points: ['Stop repeating mistakes', 'Understand in mother tongue', 'Know your exact weak spots', '3x better retention', 'Higher rank, faster']
              },
            ].map(({ emoji, title, points, highlight }) => (
              <div key={title} className={`rounded-2xl p-6 ${highlight ? 'bg-indigo-600/15 border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/10' : 'bg-slate-900 border border-slate-800'}`}>
                <p className="text-3xl mb-3">{emoji}</p>
                <p className={`font-bold text-lg mb-4 ${highlight ? 'text-indigo-300' : 'text-white'}`}>{title}</p>
                <ul className="space-y-2.5">
                  {points.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-indigo-400' : 'text-slate-600'}`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Everything you need to crack JEE/NEET</h2>
            <p className="text-slate-400 text-lg">Built specifically for Indian students</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, gradient, glow, title, desc }, i) => (
              <div key={title}
                onClick={() => setActiveFeature(i)}
                className={`card p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${activeFeature === i ? `border-indigo-500/40 shadow-xl ${glow}` : 'hover:border-slate-700'}`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg ${glow}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Students who cracked it</h2>
          <p className="text-slate-400 mb-12">Real results from real preparation</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, exam, rank, avatar, color, text }) => (
              <div key={name} className="card p-6 text-left hover:border-slate-700 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">&quot;{text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-indigo-400 text-xs">{exam} · {rank}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-600/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Your exam is getting closer</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Start preparing smarter{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">today.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">Join students preparing with AI. Free forever — no credit card needed.</p>
          <button onClick={signInWithGoogle} disabled={loading}
            className="group inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl text-xl transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1">
            {loading
              ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <>Start Free with Google <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>}
          </button>
          <p className="text-slate-600 text-sm mt-4">No credit card · Free forever · 30 seconds to start</p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">V</span>
            </div>
            <span className="text-white font-bold">VIDYA</span>
            <span className="text-slate-600 text-sm">— AI Tutoring for JEE & NEET</span>
          </div>
          <p className="text-slate-600 text-sm">Built with ❤️ for Indian students · Free forever</p>
        </div>
      </footer>
    </div>
  );
}
