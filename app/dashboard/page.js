'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      await fetchTasks();
      setNewTask({ title: '', description: '', dueDate: '' });
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  // Update task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTask),
      });

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      await fetchTasks();
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Task Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Create Task Form */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 rounded-md border border-input bg-background"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full p-2 rounded-md border border-input bg-background"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="glass-card p-6">
              {editingTask?.id === task.id ? (
                // Edit Form
                <form onSubmit={handleUpdateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                      type="datetime-local"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Task Display
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-primary hover:text-primary/90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}