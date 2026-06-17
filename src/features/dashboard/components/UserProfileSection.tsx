import React from 'react';
import { useAuth } from '../../../hooks/useAuth';

export const UserProfileSection: React.FC = () => {
  const { user } = useAuth();
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground mt-1">
          {today} — Welcome back, {user?.displayName || 'Student'}!
        </p>
      </div>
      
      {/* Optional Avatar / User Menu Placeholder */}
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
      </div>
    </div>
  );
};
