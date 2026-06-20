import React from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { MidnightStars } from './MidnightStars';
import { useTheme } from '../../contexts/ThemeProvider';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-500 relative">
      <MidnightStars />
      
      {/* Midnight Vignette & Atmosphere */}
      {theme === 'midnight' && (
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-black/40 mix-blend-multiply" />
      )}

      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-end px-8 shrink-0 transition-colors duration-500 z-10">
            <ThemeToggle />
          </header>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl p-8 pt-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
