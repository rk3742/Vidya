'use client';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import clsx from 'clsx';

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'bg-indigo-600' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'bg-green-600' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'bg-amber-600' },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<keyof typeof MODES>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const reset = useCallback(() => {
    setTimeLeft(MODES[mode].duration);
    setIsRunning(false);
  }, [mode]);

  const switchMode = (newMode: keyof typeof MODES) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsRunning(false);
          // Play notification sound
          if (typeof window !== 'undefined') {
            new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+fn5+fn56enZubmpiYmJeXl5aWlpWVlZSUlJOTk5KSkpGRkZCQkI+Pj46Ojo2NjYyMjIuLi4qKiomJiYiIiIeHh4aGhoWFhYSEhIODg4KCgoGBgYCAgH9/f35+fn19fXx8fHt7e3p6enl5eXh4eHd3d3Z2dnV1dXR0dHNzc3JycnFxcXBwcG9vb25ubm1tbWxsbGtra2pqamlpaWhngA==').play().catch(() => {});
          }
          if (mode === 'focus') {
            setSessions(s => s + 1);
            // Auto switch to break
            const nextMode = (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
            switchMode(nextMode);
          } else {
            switchMode('focus');
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode, sessions]);

  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" /> Pomodoro Timer
        </h3>
        <span className="text-slate-400 text-sm">{sessions} sessions</span>
      </div>

      {/* Mode tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
        {Object.entries(MODES).map(([key, { label }]) => (
          <button key={key} onClick={() => switchMode(key as keyof typeof MODES)}
            className={clsx('flex-1 py-2 text-xs font-medium rounded-md transition-all',
              mode === key ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white')}>
            {label}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="88" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle cx="96" cy="96" r="88" fill="none" stroke={mode === 'focus' ? '#6366f1' : mode === 'shortBreak' ? '#10b981' : '#f59e0b'}
            strokeWidth="8" strokeLinecap="round" strokeDasharray={553} strokeDashoffset={553 - (553 * progress) / 100}
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white font-mono">{formatTime(timeLeft)}</span>
          <span className="text-slate-400 text-sm mt-1">{MODES[mode].label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button onClick={reset}
          className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => setIsRunning(!isRunning)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all ${MODES[mode].color} hover:opacity-90`}>
          {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </button>
        <button onClick={() => switchMode(mode === 'focus' ? 'shortBreak' : 'focus')}
          className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
          <Coffee className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
