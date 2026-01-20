import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TaskProvider } from '@/contexts/TaskContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Full Stack Todo App',
  description: 'A multi-user todo application with authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <TaskProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TaskProvider>
      </body>
    </html>
  );
}