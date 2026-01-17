'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import Header from '@/components/layout/Header';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiClient.getTasks();
        setTasks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-slate-800">Loading your dashboard...</h1>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header title="Dashboard Overview" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Dashboard Overview</h1>
          <p className="mt-2 text-slate-300">Track your productivity and manage your tasks</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl shadow-xl p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-slate-600">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-500/30 backdrop-blur-sm rounded-xl mr-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl shadow-xl p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-slate-600">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-500/30 backdrop-blur-sm rounded-xl mr-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-white">{completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl shadow-xl p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-slate-600">
            <div className="flex items-center">
              <div className="p-3 bg-amber-500/30 backdrop-blur-sm rounded-xl mr-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl shadow-xl p-6 text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-slate-600">
            <div className="flex items-center">
              <div className="p-3 bg-violet-500/30 backdrop-blur-sm rounded-xl mr-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-400">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-100">Recent Tasks</h2>
                <Link
                  href="/tasks"
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-sm"
                >
                  View All →
                </Link>
              </div>

              {error && (
                <div className="rounded-lg bg-red-900/30 p-4 mb-6 border border-red-700">
                  <div className="text-sm text-red-300">{error}</div>
                </div>
              )}

              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 text-2xl font-bold mb-4">
                    +
                  </div>
                  <h3 className="text-lg font-medium text-slate-100 mb-2">No tasks yet</h3>
                  <p className="text-slate-400 mb-6">Get started by creating your first task!</p>
                  <Link
                    href="/tasks"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Your First Task
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 4).map((task, index) => (
                    <div
                      key={task.id}
                      className={`border-l-4 p-4 rounded-r-lg transition-all duration-300 hover:shadow-lg animate-fade-in ${
                        task.completed
                          ? 'border-emerald-500 bg-emerald-900/20'
                          : 'border-amber-500 bg-amber-900/20'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mt-0.5 ${
                          task.completed
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-amber-500 bg-amber-500'
                        }`}>
                          {task.completed && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-slate-100">{task.title}</h3>
                          {task.description && (
                            <p className="mt-1 text-sm text-slate-300">{task.description}</p>
                          )}
                          <div className="mt-2 flex items-center text-xs text-slate-400">
                            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              task.completed
                                ? 'bg-emerald-900/50 text-emerald-300'
                                : 'bg-amber-900/50 text-amber-300'
                            }`}>
                              {task.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Progress */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/tasks"
                  className="flex items-center p-4 border border-slate-600 rounded-xl hover:bg-slate-700/50 transition-colors backdrop-blur-sm"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-100">Create New Task</p>
                    <p className="text-sm text-slate-400">Add a new task to your list</p>
                  </div>
                </Link>

                <Link
                  href="/tasks"
                  className="flex items-center p-4 border border-slate-600 rounded-xl hover:bg-slate-700/50 transition-colors backdrop-blur-sm"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-600/30 flex items-center justify-center text-emerald-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-100">Complete Tasks</p>
                    <p className="text-sm text-slate-400">Mark pending tasks as done</p>
                  </div>
                </Link>

                <Link
                  href="/chat"
                  className="flex items-center p-4 border border-slate-600 rounded-xl hover:bg-slate-700/50 transition-colors backdrop-blur-sm"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-600/30 flex items-center justify-center text-cyan-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-100">AI Task Assistant</p>
                    <p className="text-sm text-slate-400">Chat with AI to manage tasks</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Weekly Progress</h2>
              <div className="flex items-end h-32 space-x-2">
                {[65, 80, 45, 70, 90, 55, 75].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg transition-all duration-500 hover:from-cyan-400 hover:to-blue-400"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-slate-400 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}