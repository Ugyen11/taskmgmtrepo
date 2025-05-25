'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Don't show navigation on login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
          >
            Task Management
          </Link>
          
          <div className="flex items-center gap-4">
            {pathname === '/' ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-500/20"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : pathname === '/dashboard' ? (
              <>
                <Link
                  href="/tasks/create"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-500/20"
                >
                  Create Task
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 