'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from './components/Navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.includes('token=');
    if (!token) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-8 bg-gradient-to-b from-background to-accent/20">
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </main>
    </>
  );
} 