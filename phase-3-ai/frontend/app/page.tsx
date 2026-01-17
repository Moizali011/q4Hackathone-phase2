'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // If user is logged in, redirect to dashboard
      router.push('/dashboard');
    } else {
      // If not logged in, redirect to auth
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">AI Task Assistant</h1>
        <p className="text-slate-300">Redirecting...</p>
      </div>
    </div>
  );
}