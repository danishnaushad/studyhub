import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FocusMode = 'pomodoro' | 'animedoro' | 'deep_work' | 'countdown' | 'stopwatch' | 'custom' | string;
export type FocusPhase = 'focus' | 'break' | 'completed' | 'idle';
export type FocusTheme = 'classic' | 'minimal' | 'dark-academic' | 'terminal' | 'glass';
export type FocusBackground = 'none' | 'rainy-cafe' | 'forest' | 'library' | 'dark-study-room' | 'terminal' | 'ocean';
export type AmbientSoundscape = 'none' | 'rain' | 'forest' | 'cafe' | 'ocean';
export type SessionLayout = 'classic' | 'minimal' | 'stats-heavy';

export interface WidgetVisibility {
  clock: boolean;
  dailyGoal: boolean;
  currentSprint: boolean;
  quote: boolean;
}

export interface CompletedSession {
  id: string;
  activity: string;
  categoryId: string | null;
  mode: FocusMode;
  durationCompleted: number; // in seconds
  completedAt: number;
  totalSessions?: number;
  completedSessions?: number;
}

export interface FocusState {
  // Timer State
  isRunning: boolean;
  isPaused: boolean;
  activity: string | null;
  categoryId: string | null;
  mode: FocusMode | null;
  phase: FocusPhase;
  
  focusDuration: number;
  breakDuration: number;
  remainingTime: number;
  elapsedTime: number;
  sessionStartTime: number | null;
  lastTickTime: number | null;
  sessionId: string | null;
  currentSession: number;
  totalSessions: number;
  
  // Customization & Preferences
  focusTheme: FocusTheme;
  focusBackground: FocusBackground;
  ambientSoundscape: AmbientSoundscape;
  sessionLayout: SessionLayout;
  quoteCategory: string;
  widgetVisibility: WidgetVisibility;
  
  // Analytics State
  history: CompletedSession[];
  focusMinutesToday: number;
  streak: number;
  lastSessionDate: string | null; // YYYY-MM-DD
  categoryProgress: Record<string, number>; // categoryId -> accumulated seconds
  dailyTargets: Record<string, number>; // Local legacy reference (soon to be deprecated)
  
  // Actions
  startSession: (activity: string, categoryId: string | null, mode: FocusMode, focusDuration: number, breakDuration: number, totalSessions?: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  resetSession: () => void;
  
  // Settings & Initialization Actions
  setCategoryTarget: (categoryId: string, targetMinutes: number) => void;
  checkDailyReset: () => void;
  
  // Atomic Engine Actions
  tick: (deltaSec: number) => void;
  syncTickTime: (now: number) => void;
  setPhase: (phase: FocusPhase, remainingTime: number) => void;
  logSession: () => void;
  completeSession: () => void;
  
  // Customization Actions
  setTheme: (theme: FocusTheme) => void;
  setBackground: (bg: FocusBackground) => void;
  setSoundscape: (audio: AmbientSoundscape) => void;
  setLayout: (layout: SessionLayout) => void;
  setQuoteCategory: (category: string) => void;
  setWidgetVisibility: (key: keyof WidgetVisibility, visible: boolean) => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      isPaused: false,
      activity: null,
      categoryId: null,
      mode: null,
      phase: 'idle',
      currentSession: 1,
      totalSessions: 1,
      
      focusDuration: 25 * 60,
      breakDuration: 0,
      remainingTime: 0,
      elapsedTime: 0,
      sessionStartTime: null,
      lastTickTime: null,
      sessionId: null,
      
      focusTheme: 'classic',
      focusBackground: 'none',
      ambientSoundscape: 'none',
      sessionLayout: 'classic',
      quoteCategory: 'motivation',
      widgetVisibility: {
        clock: true,
        dailyGoal: true,
        currentSprint: true,
        quote: true
      },

      history: [],
      focusMinutesToday: 0,
      streak: 1,
      lastSessionDate: null,
      categoryProgress: {},
      dailyTargets: {},

      setCategoryTarget: (categoryId, targetMinutes) => set((state) => ({
        dailyTargets: { ...state.dailyTargets, [categoryId]: targetMinutes }
      })),

      setTheme: (theme) => set({ focusTheme: theme }),
      setBackground: (bg) => set({ focusBackground: bg }),
      setSoundscape: (audio) => set({ ambientSoundscape: audio }),
      setLayout: (layout) => set({ sessionLayout: layout }),
      setQuoteCategory: (category) => set({ quoteCategory: category }),
      setWidgetVisibility: (key, visible) => set((state) => ({
        widgetVisibility: { ...state.widgetVisibility, [key]: visible }
      })),

      checkDailyReset: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        // If lastSessionDate exists and is not today, it's a new day
        if (state.lastSessionDate && state.lastSessionDate !== today) {
          // Only trigger a state update if there is actually data to clear
          if (Object.keys(state.categoryProgress).length > 0 || state.focusMinutesToday > 0) {
            set({
              categoryProgress: {},
              focusMinutesToday: 0
            });
          }
        }
      },

      startSession: (activity, categoryId, mode, focusDuration, breakDuration, totalSessions = 1) => set({
        isRunning: true,
        isPaused: false,
        activity,
        categoryId,
        mode,
        phase: 'focus',
        focusDuration,
        breakDuration,
        remainingTime: focusDuration,
        elapsedTime: 0,
        sessionStartTime: Date.now(),
        lastTickTime: Date.now(),
        sessionId: crypto.randomUUID(),
        currentSession: 1,
        totalSessions,
      }),

      pauseSession: () => set((state) => {
        if (!state.isRunning || state.isPaused) return state;
        return { isPaused: true };
      }),

      resumeSession: () => set((state) => {
        if (!state.isRunning || !state.isPaused) return state;
        return { isPaused: false, lastTickTime: Date.now() };
      }),

      resetSession: () => {
        const state = get();
        // Log partial stopwatch session
        if (state.mode === 'stopwatch' && state.elapsedTime >= 60) {
          get().logSession();
        }
        
        set({
          isRunning: false,
          isPaused: false,
          activity: null,
          categoryId: null,
          mode: null,
          phase: 'idle',
          focusDuration: 0,
          breakDuration: 0,
          remainingTime: 0,
          elapsedTime: 0,
          sessionStartTime: null,
          lastTickTime: null,
        });
      },

      tick: (deltaSec) => set((state) => {
        if (state.mode === 'stopwatch') {
          return { elapsedTime: state.elapsedTime + deltaSec, remainingTime: state.elapsedTime + deltaSec };
        }
        return { remainingTime: Math.max(0, state.remainingTime - deltaSec) };
      }),
      syncTickTime: (now) => set({ lastTickTime: now }),
      setPhase: (phase, remainingTime) => set((state) => ({ 
        phase, 
        remainingTime,
        lastTickTime: Date.now(),
        sessionId: phase === 'focus' ? Date.now().toString() : state.sessionId
      })),
      
      logSession: () => {
        const state = get();
        if (!state.sessionId) return;

        const durationLogged = state.mode === 'stopwatch' ? state.elapsedTime : state.focusDuration;
        const existingSessionIndex = state.history.findIndex(s => s.id === state.sessionId);


        const today = new Date().toISOString().split('T')[0];
        
        // Always reset focusMinutesToday if it's a new calendar day
        let newMinutesToday = state.focusMinutesToday;
        if (state.lastSessionDate && state.lastSessionDate !== today) {
          newMinutesToday = 0;
        }
        newMinutesToday += Math.floor(durationLogged / 60);

        // Optimistic Streak Update Engine
        let newStreak = state.streak;
        let updatedLastSessionDate = state.lastSessionDate;

        if (newMinutesToday >= 5) {
          if (state.lastSessionDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (state.lastSessionDate === yesterdayStr) {
              newStreak += 1;
            } else {
              newStreak = 1;
            }
            updatedLastSessionDate = today;

            // Run strict background transaction against Firestore to maintain absolute truth
            import('../config/firebase').then(({ auth }) => {
              const user = auth.currentUser;
              if (user) {
                import('../services/analytics.service').then(({ analyticsService }) => {
                  analyticsService.updateStreakTransaction(user.uid, today, yesterdayStr);
                });
              }
            });
          }
        }

        const updatedProgress = { ...state.categoryProgress };
        if (state.categoryId) {
          updatedProgress[state.categoryId] = (updatedProgress[state.categoryId] || 0) + durationLogged;
        }

        if (existingSessionIndex >= 0) {
          const updatedHistory = [...state.history];
          const updatedSession = {
            ...updatedHistory[existingSessionIndex],
            durationCompleted: updatedHistory[existingSessionIndex].durationCompleted + durationLogged,
            completedAt: Date.now(),
            completedSessions: state.currentSession,
            totalSessions: state.totalSessions,
          };
          updatedHistory[existingSessionIndex] = updatedSession;
          
          // Asynchronously sync to cloud
          import('../services/analytics.service').then(({ analyticsService }) => {
            analyticsService.saveSession(updatedSession);
          });
          
          if (state.categoryId) {
            import('../features/sprints/services/sprints.service').then(({ sprintsService }) => {
              sprintsService.incrementProgress(state.categoryId!, 'hours', durationLogged / 3600);
            });
          }

          set({
            history: updatedHistory,
            focusMinutesToday: newMinutesToday,
            streak: newStreak,
            lastSessionDate: updatedLastSessionDate,
            categoryProgress: updatedProgress
          });
          return;
        }

        // First session in the cycle, create a new entry
        const session: CompletedSession = {
          id: state.sessionId,
          activity: state.activity || 'Focus Session',
          categoryId: state.categoryId,
          mode: state.mode!,
          durationCompleted: durationLogged,
          completedAt: Date.now(),
          completedSessions: state.currentSession,
          totalSessions: state.totalSessions,
        };

        // Asynchronously sync to cloud (Write-Through caching)
        import('../services/analytics.service').then(({ analyticsService }) => {
          analyticsService.saveSession(session);
        });
        
        if (state.categoryId) {
          import('../features/sprints/services/sprints.service').then(({ sprintsService }) => {
            sprintsService.incrementProgress(state.categoryId!, 'hours', durationLogged / 3600);
          });
        }

        set({
          history: [session, ...state.history],
          focusMinutesToday: newMinutesToday,
          streak: newStreak,
          lastSessionDate: updatedLastSessionDate,
          categoryProgress: updatedProgress,
        });
      },

      completeSession: () => set({
        isRunning: false,
        isPaused: false,
        phase: 'completed',
        remainingTime: 0,
      }),
    }),
    {
      name: 'studyhub-focus-storage',
      // Persist entire state so active timers survive a page refresh
    }
  )
);
