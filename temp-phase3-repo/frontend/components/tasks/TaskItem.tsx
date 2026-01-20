'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, currentStatus: boolean, callback?: () => void) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = () => {
    setIsToggling(true);
    onToggle(task.id, task.completed, () => setIsToggling(false));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : 'pending'} transition-all duration-300 transform hover:translate-x-1 hover:shadow-md rounded-xl p-4 mb-3 animate-fade-in bg-white/80 backdrop-blur-sm border-l-4 ${
      task.completed
        ? 'border-green-500 bg-green-50/50'
        : 'border-indigo-500 bg-indigo-50/50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            disabled={isToggling}
            className={`h-6 w-6 border-2 rounded-md focus:ring-indigo-500 cursor-pointer transition-all duration-200 ${
              isToggling
                ? 'bg-gray-300 cursor-not-allowed'
                : task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-indigo-300 text-indigo-600'
            }`}
          />
          <div className="ml-3">
            <h3 className={`text-lg font-semibold ${
              task.completed
                ? 'line-through text-gray-500'
                : 'text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-gray-600 text-sm">{task.description}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-200 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-lg text-sm"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 font-medium transition duration-200 disabled:opacity-50 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg text-sm"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            task.completed
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
          }`}
        >
          {task.completed ? '✓ Completed' : '○ Pending'}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(task.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}