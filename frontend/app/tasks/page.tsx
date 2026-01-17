'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Header from '@/components/layout/Header';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    setIsCreating(true);
    setError('');

    try {
      const createdTask = await apiClient.createTask(taskData);
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean, callback?: () => void) => {
    try {
      const updatedTask = await apiClient.updateTask(taskId, { completed: !currentStatus });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error(err);
    } finally {
      if (callback) {
        callback();
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      console.error(err);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header title="Task Management" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Manage Your Tasks</h1>
            <p className="text-lg text-slate-300">Organize and track your daily activities</p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* AI Assistant Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-white/20 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">AI Task Assistant</h3>
                  </div>
                  <p className="text-cyan-100 mb-4 flex-grow">
                    Chat with our AI assistant to manage your tasks using natural language.
                  </p>
                  <a
                    href="/chat"
                    className="mt-auto inline-flex items-center px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors text-center"
                  >
                    Open AI Chat
                  </a>
                </div>
              </div>
            </div>

            {/* Create Task Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-2xl shadow-lg card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Task</h2>
                <TaskForm
                  onSubmit={handleCreateTask}
                  initialData={newTask}
                  isSubmitting={isCreating}
                />
              </div>
            </div>

            {/* Task List */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Tasks</h2>
                  <span className="text-sm text-gray-500">{tasks.length} tasks</span>
                </div>

                <TaskList
                  tasks={tasks}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}