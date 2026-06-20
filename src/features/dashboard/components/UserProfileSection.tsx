import React, { useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../contexts/ThemeProvider';
import { useFocusStore } from '../../../store/focusStore';

const quotes = {
  motivation: [
    "The quiet hours build the strongest habits.",
    "Focus now. Celebrate later.",
    "One focused session is enough.",
    "Progress compounds in silence.",
    "Everyone is asleep. The world is quiet. Now it's time to focus."
  ],
  discipline: [
    "Discipline equals freedom.",
    "Do it now. Sometimes 'later' becomes 'never'.",
    "Motivation gets you going, but discipline keeps you growing.",
    "Action creates momentum."
  ],
  stoic: [
    "You have power over your mind - not outside events.",
    "Waste no more time arguing what a good man should be. Be one.",
    "It is not that we have a short time to live, but that we waste a lot of it."
  ]
};

export const UserProfileSection: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const widgetVisibility = useFocusStore(state => state.widgetVisibility);
  const quoteCategory = useFocusStore(state => state.quoteCategory);
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const randomQuote = useMemo(() => {
    const list = quotes[quoteCategory as keyof typeof quotes] || quotes.motivation;
    return list[Math.floor(Math.random() * list.length)];
  }, [quoteCategory]);

  return (
    <div className="flex items-center justify-between">
      <div>
        {theme === 'midnight' ? (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-primary/90">Good Evening, {user?.displayName || 'Student'} 🌙</h1>
            {widgetVisibility.quote && (
              <p className="text-muted-foreground mt-1 opacity-80 tracking-wide">
                Focus quietly. {randomQuote}
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
            <p className="text-muted-foreground mt-1">
              {today} — Welcome back, {user?.displayName || 'Student'}!
            </p>
            {widgetVisibility.quote && (
              <p className="text-sm text-muted-foreground mt-2 italic border-l-2 border-primary/20 pl-3 py-1">
                "{randomQuote}"
              </p>
            )}
          </>
        )}
      </div>
      
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
      </div>
    </div>
  );
};
