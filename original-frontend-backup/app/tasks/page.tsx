'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/contexts/TaskContext';
import Header from '@/components/layout/Header';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import ChatBot from '@/components/tasks/ChatBot';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('tasks'); // Clear tasks on logout
    router.push('/auth');
  };

  const handleCreateTask = (taskData: { title: string; description?: string }) => {
    setIsCreating(true);
    setError('');

    addTask({
      title: taskData.title,
      description: taskData.description || '',
      completed: false
    });

    setNewTask({ title: '', description: '' });
    setIsCreating(false);
  };

  const toggleTaskCompletion = (taskId: string, currentStatus: boolean, callback?: () => void) => {
    updateTask(taskId, { completed: !currentStatus });

    if (callback) {
      callback();
    }
  };

  const deleteTaskFromPage = (taskId: string) => {
    deleteTask(taskId);
  };

  // No loading state needed for client-side implementation

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

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

          {/* ChatBot Section */}
          <div className="mt-8">
            <ChatBot
              tasks={tasks}
              onAddTask={handleCreateTask}
              onUpdateTask={toggleTaskCompletion}
              onDeleteTask={deleteTaskFromPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}