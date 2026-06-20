import React, { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeProvider';
import { useFocusStore } from '../../store/focusStore';

export const MidnightStars: React.FC = () => {
  const { theme } = useTheme();
  const isRunning = useFocusStore(state => state.isRunning);

  // Generate 80 small stars
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5
      size: Math.random() > 0.8 ? 2 : 1, // Mostly 1px, some 2px
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 4 + 3}s`, // 3s to 7s
      twinkle: Math.random() > 0.6 // 40% of stars twinkle
    }));
  }, []);

  if (theme !== 'midnight') return null;

  return (
    <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000 ${isRunning ? 'opacity-100' : 'opacity-60'}`}>
      
      {/* 2. Moonlight Atmosphere */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />

      {/* 3. Aurora Depth Layer (Slow movement simulated by very wide blurred shapes) */}
      <div className="absolute top-[20%] -left-[10%] w-[60%] h-[40%] bg-violet-900/5 rounded-[100%] blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[30%] bg-indigo-900/5 rounded-[100%] blur-[100px] animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }} />

      {/* 1. Star Field */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white transition-opacity ${star.twinkle ? 'animate-pulse' : ''}`}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.15)`
          }}
        />
      ))}
    </div>
  );
};
