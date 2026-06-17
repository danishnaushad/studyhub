import React, { useEffect } from 'react';
import { Play, Pause, Square, Zap } from 'lucide-react';
import { useFocusStore } from '../../store/focusStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export const FloatingTimer: React.FC = () => {
  const {
    isRunning,
    isPaused,
    activity,
    mode,
    remainingTime,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    tick,
  } = useFocusStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, tick]);

  const handleStartDemo = () => {
    startSession('Focus Session', 'pomodoro', 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // If completely inactive, render just the demo button as per requirements
  if (!isRunning && remainingTime === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handleStartDemo}
          className="shadow-xl rounded-full px-6 py-6 bg-background/80 backdrop-blur-md border border-primary/20 hover:bg-primary/10 text-foreground transition-all duration-300 flex items-center gap-2"
          variant="outline"
        >
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-semibold">Start Demo Session</span>
        </Button>
      </div>
    );
  }

  // Active or Paused session card (modern glassmorphism)
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-background/60 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-2xl p-5 w-72 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg leading-none">{activity}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-medium">{mode}</p>
          </div>
          <div className={cn(
            "px-2 py-1 rounded text-xs font-bold tracking-wider",
            isPaused ? "bg-amber-500/20 text-amber-500" : "bg-primary/20 text-primary"
          )}>
            {isPaused ? 'PAUSED' : 'FOCUS'}
          </div>
        </div>

        <div className="text-5xl font-black tracking-tighter text-center tabular-nums text-foreground/90 py-2 drop-shadow-sm">
          {formatTime(remainingTime)}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 border-t border-border/30">
          {isPaused ? (
            <Button size="icon" variant="default" className="rounded-full h-10 w-10 shadow-md" onClick={resumeSession}>
              <Play className="h-4 w-4 ml-0.5" />
            </Button>
          ) : (
            <Button size="icon" variant="outline" className="rounded-full h-10 w-10 bg-background/50 hover:bg-background/80" onClick={pauseSession}>
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button size="icon" variant="outline" className="rounded-full h-10 w-10 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 shadow-md" onClick={resetSession}>
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
