import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DemoProvider } from '../../contexts/DemoContext';

export const DemoLayout: React.FC = () => {
  return (
    <DemoProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Demo Banner */}
        <div className="bg-primary/10 border-b border-primary/20 text-foreground px-4 py-2 flex items-center justify-between shrink-0 z-50 relative">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>🚀 Danish Study OS Demo Workspace</span>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <span className="text-muted-foreground hidden sm:inline">You are currently exploring a read-only demo environment.</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link to="/register" className="hover:text-primary transition-colors">Create Free Account</Link>
            <Link to="/login" className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors">Sign In</Link>
          </div>
        </div>
        
        {/* Render the normal app layout (DashboardLayout) below */}
        <div className="flex-1 relative overflow-hidden">
          <Outlet />
        </div>
      </div>
    </DemoProvider>
  );
};
