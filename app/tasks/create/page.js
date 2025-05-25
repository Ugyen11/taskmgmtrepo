'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';

export default function CreateTask() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const task = {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      priority: formData.get('priority')
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
        <div className="max-w-2xl mx-auto pt-24 px-4">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-8">
              Create New Task
            </h1>
            
            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="Enter task description"
                ></textarea>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-500/20 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Task'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
} 