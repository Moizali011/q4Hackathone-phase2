'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (token && token !== 'undefined' && token !== 'null') {
      setIsAuthenticated(true);
      // For immediate redirect after checking
      setTimeout(() => {
        router.push('/dashboard');
      }, 500); // Small delay to show message
    } else {
      setIsAuthenticated(false);
    }
    setAuthChecked(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('tasks'); // Clear tasks on logout
  };

  if (!authChecked) {
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
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-bold mb-6">
          T
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Task Manager</h1>
        <p className="text-gray-600 mb-8">
          {isAuthenticated
            ? "You are logged in. Redirecting to dashboard..."
            : "Please sign in to manage your tasks."}
        </p>

        <div className="space-y-4">
          {!isAuthenticated ? (
            <Link
              href="/auth"
              className="inline-block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-center"
            >
              Sign In
            </Link>
          ) : (
            <div className="animate-pulse text-indigo-600">
              Redirecting to dashboard...
            </div>
          )}

          <p className="text-sm text-gray-500 mt-6">
            {isAuthenticated
              ? "If you're not redirected automatically, click below:"
              : "New user? "}

            {isAuthenticated ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Go to Dashboard
              </button>
            ) : (
              <span>Get started by creating an account</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}