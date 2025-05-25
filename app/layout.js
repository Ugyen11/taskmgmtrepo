import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Task Management',
  description: 'A modern task management system',
  keywords: ['task management', 'productivity', 'organization'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}