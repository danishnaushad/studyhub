import { create } from 'zustand';

export type FocusMode = 'pomodoro' | 'deep_work' | 'custom' | string;

export interface FocusState {
  isRunning: boolean;
  isPaused: boolean;
  activity: string | null;
  mode: FocusMode | null;
  duration: number; // in seconds
  remainingTime: number; // in seconds
  sessionStartTime: number | null;
  
  // Actions
  startSession: (activity: string, mode: FocusMode, duration: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  resetSession: () => void;
  tick: () => void;
  completeSession: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  isRunning: false,
  isPaused: false,
  activity: null,
  mode: null,
  duration: 0,
  remainingTime: 0,
  sessionStartTime: null,

  startSession: (activity, mode, duration) => set({
    isRunning: true,
    isPaused: false,
    activity,
    mode,
    duration,
    remainingTime: duration,
    sessionStartTime: Date.now(),
  }),

  pauseSession: () => set((state) => {
    if (!state.isRunning || state.isPaused) return state;
    return { isPaused: true };
  }),

  resumeSession: () => set((state) => {
    if (!state.isRunning || !state.isPaused) return state;
    return { isPaused: false };
  }),

  resetSession: () => set({
    isRunning: false,
    isPaused: false,
    activity: null,
    mode: null,
    duration: 0,
    remainingTime: 0,
    sessionStartTime: null,
  }),

  tick: () => set((state) => {
    if (!state.isRunning || state.isPaused || state.remainingTime <= 0) {
      return state;
    }
    
    const nextTime = state.remainingTime - 1;
    
    // Automatically complete if it hits 0
    if (nextTime <= 0) {
      return {
        remainingTime: 0,
        isRunning: false,
        isPaused: false,
      };
    }
    
    return { remainingTime: nextTime };
  }),

  completeSession: () => set({
    isRunning: false,
    isPaused: false,
    remainingTime: 0,
  }),
}));
