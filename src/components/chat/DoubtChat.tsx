'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MessageCircle, X, Send, Bot, User, Loader, Lightbulb } from 'lucide-react';
import clsx from 'clsx';

interface Message { role: 'user' | 'assistant'; content: string; }

const QUICK = ['Explain the concept', 'Show me the formula', 'Give a similar example', "What's my mistake?"];

export default function DoubtChat({ questionId, questionText }: { questionId?: string; questionText?: string }) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm VIDYA AI. Ask me anything — I'll explain in ${user?.preferredLanguage || 'English'}.`
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

  const send = async (e?: React.FormEvent, msg?: string) => {
    e?.preventDefault();
    const text = msg || input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat', questionId, studentMessage: text,
          chatHistory: messages.slice(-6),
          language: user?.preferredLanguage || 'english',
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, temporarily unavailable. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const getHint = async () => {
    if (!questionId || hintLevel >= 3) return;
    const level = hintLevel + 1;
    setHintLevel(level);
    setLoading(true);
    try {
      const res = await fetch('/api/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hint', questionId, hintLevel: level, language: user?.preferredLanguage || 'english' }),
      });
      const data = await res.json();
      setMessages(prev => [...prev,
        { role: 'user', content: `Hint ${level}` },
        { role: 'assistant', content: `💡 Hint ${level}: ${data.hint}` }
      ]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)}
        className={clsx('fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all z-40 hover:scale-105',
          open ? 'bg-slate-700 rotate-90' : 'bg-indigo-600 hover:bg-indigo-500')}>
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[70vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-indigo-600/10">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">VIDYA AI Tutor</p>
              <p className="text-indigo-400 text-xs">Powered by LLaMA · {user?.preferredLanguage}</p>
            </div>
            {questionId && hintLevel < 3 && (
              <button onClick={getHint} disabled={loading}
                className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-lg hover:bg-amber-500/30 transition-colors disabled:opacity-50">
                <Lightbulb className="w-3 h-3" /> Hint {hintLevel + 1}
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={clsx('flex gap-2', m.role === 'user' ? 'flex-row-reverse' : '')}>
                <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700')}>
                  {m.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className={clsx('max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm')}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK.map(p => (
                <button key={p} onClick={() => send(undefined, p)}
                  className="text-xs bg-slate-800 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 px-2 py-1 rounded-lg border border-slate-700 hover:border-indigo-500/40 transition-all">
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={send} className="p-3 border-t border-slate-800 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500" />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-9 h-9 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
