import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { useFocusStore } from '../../store/focusStore';
import { useCategories } from '../../hooks/useCategories';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

import { unlockAudio } from '../../utils/sound';
import { getCategoryColor } from '../../lib/colors';


export const FloatingTimer: React.FC = () => {
  const { categories } = useCategories();
  const {
    isRunning,
    isPaused,
    activity,
    categoryId,
    mode,
    phase,
    remainingTime,
    elapsedTime,
    pauseSession,
    resumeSession,
    resetSession,
  } = useFocusStore();



  const formatTime = (seconds: number) => {
    const total = Math.ceil(seconds);
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // If completely inactive, render nothing
  if (!isRunning && remainingTime === 0 && elapsedTime === 0) {
    return null;
  }

  const category = categories.find(c => c.id === categoryId);

  // Active or Paused session card (modern glassmorphism)
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={cn(
        "bg-background/60 backdrop-blur-2xl border shadow-2xl rounded-2xl p-5 w-72 flex flex-col gap-4 transition-colors duration-500",
        phase === 'break' ? "border-orange-500/30" : "border-green-500/30"
      )}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg leading-none truncate max-w-[150px]" title={activity || ''}>{activity}</h4>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                {mode?.replace('_', ' ')}
              </p>
              {category && (
                 <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: getCategoryColor(category.color).replace(')', ' / 0.2)'), color: getCategoryColor(category.color) }}>
                   {category.name}
                 </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={cn(
              "px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase transition-colors duration-500",
              isPaused ? "bg-amber-500/20 text-amber-500" : 
              phase === 'break' ? "bg-orange-500/20 text-orange-500" : "bg-green-500/20 text-green-500"
            )}>
              {isPaused ? 'PAUSED' : phase === 'break' ? 'BREAK TIME' : 'FOCUS SESSION'}
            </div>
            {useFocusStore.getState().totalSessions > 1 && (
              <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                Session {useFocusStore.getState().currentSession} / {useFocusStore.getState().totalSessions}
              </span>
            )}
          </div>
        </div>

        <div className={cn(
          "text-5xl font-black tracking-tighter text-center tabular-nums py-2 drop-shadow-sm transition-colors duration-500",
          phase === 'break' ? "text-orange-500" : "text-green-500"
        )}>
          {formatTime(mode === 'stopwatch' ? elapsedTime : remainingTime)}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 border-t border-border/30">
          {isPaused ? (
            <Button size="icon" variant="default" className="rounded-full h-10 w-10 shadow-md" onClick={async () => { await unlockAudio(); resumeSession(); }}>
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
