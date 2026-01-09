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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800">Loading your tasks...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Header title="Todo Dashboard" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-lg text-gray-600">Here's what you need to do today</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
            <Link
              href="/tasks"
              className="btn-primary px-6 py-3 text-lg"
            >
              View All Tasks
            </Link>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-16 card bg-white p-8 rounded-2xl shadow-lg">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold mb-4">
                +
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first task!</p>
              <Link
                href="/tasks"
                className="btn-secondary inline-block px-6 py-3"
              >
                Create Your First Task
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : 'pending'} p-6`}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mb-4">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        task.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.completed ? '✓ Completed' : '○ Pending'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-white p-6 rounded-2xl shadow-lg card">
              <div className="text-3xl font-bold text-indigo-600">{tasks.length}</div>
              <div className="text-gray-600 mt-1">Total Tasks</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg card">
              <div className="text-3xl font-bold text-green-600">
                {tasks.filter(t => t.completed).length}
              </div>
              <div className="text-gray-600 mt-1">Completed</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg card">
              <div className="text-3xl font-bold text-yellow-600">
                {tasks.filter(t => !t.completed).length}
              </div>
              <div className="text-gray-600 mt-1">Pending</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}