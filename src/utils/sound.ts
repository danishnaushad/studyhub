export type SoundType = 'focus-end' | 'break-start' | 'break-end' | 'complete' | 'countdown';

let globalAudioContext: AudioContext | null = null;
let isAudioUnlocked = false;

// Initialize the global AudioContext
const getAudioContext = (): AudioContext | null => {
  if (globalAudioContext) {
    console.log("[DEBUG] getAudioContext: Returning existing globalAudioContext");
    return globalAudioContext;
  }
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      console.log("[DEBUG] getAudioContext: Creating NEW AudioContext instance");
      globalAudioContext = new AudioContextClass();
    }
  } catch (e) {
    console.error("Failed to initialize AudioContext:", e);
  }
  
  return globalAudioContext;
};

// Call this on user interaction (e.g. click "Start Session")
export const unlockAudio = async (): Promise<void> => {
  console.log(`[AUDIO UNLOCK CALLED] isAudioUnlocked: ${isAudioUnlocked}`);
  if (isAudioUnlocked) return;
  
  const ctx = getAudioContext();
  if (!ctx) return;

  console.log(`[DEBUG] AudioContext state BEFORE resume: ${ctx.state}`);

  // Resume the context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
      isAudioUnlocked = true;
      console.log(`[AUDIO RESUMED] AudioContext unlocked successfully.`);
      console.log(`[AUDIO STATE AFTER RESUME] ${ctx.state}`);
    } catch (err) {
      console.error("Failed to resume AudioContext:", err);
    }
  } else {
    isAudioUnlocked = true;
    console.log(`[DEBUG] AudioContext was already in state: ${ctx.state}`);
  }

  // Play a silent buffer to fully unlock audio on iOS
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (e) {
    // ignore
  }
};

// Fallback synthesizer to guarantee audible sounds even if MP3s are placeholders or missing
const playSynthesizedBeep = (type: SoundType) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // If we haven't officially unlocked, attempt a resume just in case (though it might fail if no user interaction in call stack)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'focus-end') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'break-start') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'break-end') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'complete') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4); // G5
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'countdown') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    console.error("Audio synthesis failed:", e);
  }
};

export const USE_SYNTH_AUDIO = true;

export const playSound = (type: SoundType) => {
  console.log(`[SOUND ALARM] Trying to play: ${type}`);
  
  if (type === 'focus-end') console.log("FOCUS END SOUND");
  if (type === 'break-start') console.log("BREAK START SOUND");
  if (type === 'break-end') console.log("BREAK END SOUND");
  if (type === 'complete') console.log("SESSION COMPLETE SOUND");
  if (type === 'countdown') console.log("COUNTDOWN SOUND");

  const ctx = getAudioContext();
  console.log(`[DEBUG] AudioContext State before playSound: ${ctx?.state}`);
  console.log(`[DEBUG] globalAudioContext === getAudioContext(): ${globalAudioContext === ctx}`);

  if (USE_SYNTH_AUDIO || type === 'countdown') {
    playSynthesizedBeep(type);
    return;
  }

  const audio = new Audio(`/sounds/${type}.mp3`);
  
  audio.play().catch((err) => {
    // Only warn if it's a real failure, but we still fallback to synth
    if (err.name === 'NotAllowedError') {
      console.warn(`Audio playback blocked by browser. Falling back to synth.`);
    }
    playSynthesizedBeep(type);
  });
};
