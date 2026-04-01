'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LandingPage from '@/components/landing/LandingPage';

export default function HomePage() {
  const { user, initialized, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsub = initialize();
    return () => unsub();
  }, [initialize]);

  useEffect(() => {
    if (initialized && user) {
      if (!user.onboardingComplete) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading VIDYA...</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  return <LandingPage />;
}
