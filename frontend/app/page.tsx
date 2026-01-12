'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      // Add a small delay to ensure everything is loaded
      await new Promise(resolve => setTimeout(resolve, 100));

      const token = localStorage.getItem('access_token');
      if (token) {
        // If authenticated, redirect to dashboard
        router.push('/dashboard');
      } else {
        // If not authenticated, redirect to auth
        router.push('/auth');
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-bold mb-6 animate-pulse">
            T
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600 mb-6">Loading...</p>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-bold mb-6 animate-bounce">
          T
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
        <p className="text-gray-600 mb-6">Organize your tasks efficiently</p>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
}