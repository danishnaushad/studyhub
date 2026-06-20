import { useEffect } from 'react';
import { useFocusStore } from '../../store/focusStore';
import { playSound } from '../../utils/sound';

/**
 * A headless component that drives the global unified timer.
 * Handles the tick logic and the Focus -> Break -> Focus cycle automatically.
 */
export function TimerEngine() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Always get the latest state directly from the store to avoid dependency array issues
      // and prevent the interval from resetting constantly.
      const state = useFocusStore.getState();

      if (!state.isRunning || state.isPaused) {
        state.syncTickTime(Date.now());
        return;
      }

      const now = Date.now();
      const lastTick = state.lastTickTime || now;
      const deltaMs = now - lastTick;
      state.syncTickTime(now);

      const deltaSec = deltaMs / 1000;

      if (state.remainingTime > 0 && state.mode !== 'stopwatch') {
        if (state.remainingTime <= 3 && state.remainingTime - deltaSec <= 3 && state.remainingTime > 3.9) {
          // Play sound once when crossing the 3-second boundary
          playSound('countdown');
        } else if (state.remainingTime <= 3 && Math.floor(state.remainingTime) !== Math.floor(state.remainingTime - deltaSec)) {
          playSound('countdown');
        }
        state.tick(deltaSec);
      } else if (state.mode === 'stopwatch') {
        state.tick(deltaSec);
      } else {
        // Timer reached 0
        if (state.phase === 'focus') {
          // Log the session exactly once
          state.logSession();
          
          if (state.currentSession < state.totalSessions && state.breakDuration > 0) {
            playSound('focus-end');
            playSound('break-start');
            state.setPhase('break', state.breakDuration);
          } else {
            // No break if final session, or if no break configured
            playSound('complete');
            state.completeSession();
          }
        } else if (state.phase === 'break') {
          // Cycle back to Focus for next session
          playSound('break-end');
          
          // Increment currentSession and reset timer
          useFocusStore.setState({ 
            currentSession: state.currentSession + 1,
            phase: 'focus',
            remainingTime: state.focusDuration
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
