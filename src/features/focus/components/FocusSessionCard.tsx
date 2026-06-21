import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { useAuth } from '../../../hooks/useAuth';
import { useCategories } from '../../../hooks/useCategories';
import { useFocusStore } from '../../../store/focusStore';
import type { FocusMode } from '../../../store/focusStore';
import { Timer, Play, Pause, Square, Activity, Settings } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useTheme } from '../../../contexts/ThemeProvider';

import { unlockAudio } from '../../../utils/sound';
import { getCategoryColor } from '../../../lib/colors';


export function FocusSessionCard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { categories } = useCategories();
  const { 
    isRunning, isPaused, activity, categoryId, mode, remainingTime, elapsedTime, phase,
    currentSession, totalSessions, focusTheme,
    focusBackground, ambientSoundscape, sessionLayout, quoteCategory, widgetVisibility,
    focusDuration, breakDuration,
    startSession, pauseSession, resumeSession, resetSession, setTheme,
    setBackground, setSoundscape, setLayout, setQuoteCategory, setWidgetVisibility
  } = useFocusStore();

  const [inputActivity, setInputActivity] = useState(user?.learningGoal || 'Focus Session');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<FocusMode>('pomodoro');
  const [focusInput, setFocusInput] = useState(25);
  const [breakInput, setBreakInput] = useState(5);
  const [sessionsInput, setSessionsInput] = useState(1);
  const [isCustomSession, setIsCustomSession] = useState(false);
  const [isSettingsFlipped, setIsSettingsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'environment' | 'widgets'>('appearance');

  React.useEffect(() => {
    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSelectedCategory(customEvent.detail);
    };
    window.addEventListener('study-os:select-category', handleSelect);
    return () => window.removeEventListener('study-os:select-category', handleSelect);
  }, []);

  const [formError, setFormError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!selectedCategory) {
      setFormError('Please select a category to start your session.');
      return;
    }
    setFormError(null);
    await unlockAudio();
    startSession(inputActivity, selectedCategory, selectedMode, Math.round(focusInput * 60), Math.round(breakInput * 60), sessionsInput);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as FocusMode;
    setSelectedMode(val);
    if (val === 'pomodoro') { setFocusInput(25); setBreakInput(5); }
    else if (val === 'animedoro') { setFocusInput(45); setBreakInput(15); }
    else if (val === 'deep_work') { setFocusInput(60); setBreakInput(0); }
    else if (val === 'countdown') { setFocusInput(10); setBreakInput(0); }
    else if (val === 'stopwatch') { setFocusInput(0); setBreakInput(0); }
  };

  const formatTime = (seconds: number) => {
    const total = Math.ceil(seconds);
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isCompleted = phase === 'completed';
  const activeCategory = categories.find(c => c.id === categoryId);

  const currentDuration = phase === 'focus' ? focusDuration : breakDuration;
  const progressPercent = mode === 'stopwatch' || currentDuration === 0 
    ? 100 
    : Math.max(0, Math.min(100, ((currentDuration - remainingTime) / currentDuration) * 100));

  const getThemeStyles = () => {
    switch (focusTheme) {
      case 'minimal': return {
        wrapper: 'bg-transparent border-transparent',
        timer: 'font-sans font-light tracking-tight text-foreground',
        badge: 'bg-muted text-muted-foreground border-transparent'
      };
      case 'dark-academic': return {
        wrapper: 'bg-[#2c241b]/50 border-[#c19a6b]/30 shadow-inner',
        timer: 'font-serif font-bold text-[#c19a6b]',
        badge: 'bg-[#c19a6b]/10 text-[#c19a6b] border-[#c19a6b]/30'
      };
      case 'terminal': return {
        wrapper: 'bg-black/90 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
        timer: 'font-mono font-bold text-green-500',
        badge: 'bg-green-500/10 text-green-500 border-green-500/30'
      };
      case 'glass': return {
        wrapper: 'bg-background/20 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]',
        timer: 'font-sans font-black tracking-tighter text-foreground/90',
        badge: 'bg-foreground/10 text-foreground border-foreground/20'
      };
      case 'classic':
      default: return {
        wrapper: 'bg-transparent border-transparent',
        timer: cn('font-black tracking-tighter', phase === 'break' ? 'text-orange-500' : 'text-green-500'),
        badge: cn(phase === 'break' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30')
      };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <Card className="overflow-hidden relative shadow-md h-full flex flex-col [perspective:1500px]">
      
      {/* 3D Flip Container */}
      <div className={cn(
        "grid h-full transition-all duration-700 [transform-style:preserve-3d]",
        isSettingsFlipped ? "[transform:rotateY(180deg)]" : ""
      )}>
        
        {/* ========================================================= */}
        {/* FRONT FACE: Focus Engine */}
        {/* ========================================================= */}
        <div className="[grid-area:1/1] [backface-visibility:hidden] flex flex-col bg-card">
          <CardHeader className="pb-3 border-b bg-muted/20 shrink-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-primary">
              <Timer className="h-4 w-4" />
              Focus Engine
            </CardTitle>
            {!isRunning && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary z-10"
                onClick={() => setIsSettingsFlipped(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
        {(!isRunning || isCompleted) ? (
          <div className="space-y-6 animate-in fade-in flex-1 flex flex-col">
            {isCompleted && (
              <div className="bg-primary/10 text-primary p-4 rounded-xl text-center font-bold text-lg animate-bounce shadow-sm border border-primary/20">
                Session Complete 🎉
              </div>
            )}
            
            <div className="space-y-6 flex-1">
              {/* Section 1: Session Setup */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">1. Session Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-semibold">Activity Name</Label>
                    <Input 
                      value={inputActivity} 
                      onChange={(e) => setInputActivity(e.target.value)} 
                      placeholder="What are you focusing on?"
                      className="h-11 border-muted-foreground/20 focus-visible:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-semibold">Category</Label>
                    <select 
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">No Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Configuration */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">2. Configuration</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-semibold">Mode</Label>
                    <select 
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-muted-foreground/20"
                      value={selectedMode}
                      onChange={handleModeChange}
                    >
                      <option value="pomodoro">Pomodoro</option>
                      <option value="animedoro">Animedoro</option>
                      <option value="deep_work">Deep Work</option>
                      <option value="countdown">Countdown</option>
                      <option value="stopwatch">Stopwatch</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-semibold">Focus (min)</Label>
                    <Input 
                      type="number" min="0.01" step="0.01" 
                      value={focusInput} 
                      onChange={(e) => setFocusInput(parseFloat(e.target.value) || 0)}
                      disabled={selectedMode === 'stopwatch'}
                      className="h-11 border-muted-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-semibold">Break (min)</Label>
                    <Input 
                      type="number" min="0" step="0.01" 
                      value={breakInput} 
                      onChange={(e) => setBreakInput(parseFloat(e.target.value) || 0)}
                      disabled={selectedMode === 'stopwatch'}
                      className="h-11 border-muted-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-semibold">Sessions</Label>
                    {!isCustomSession ? (
                      <select 
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-muted-foreground/20"
                        value={sessionsInput}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomSession(true);
                            setSessionsInput(10);
                          } else {
                            setSessionsInput(parseInt(e.target.value) || 1);
                          }
                        }}
                        disabled={selectedMode === 'stopwatch' || selectedMode === 'countdown'}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num}</option>)}
                        <option value="custom">Custom...</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <Input 
                          type="number" min="1" 
                          value={sessionsInput} 
                          onChange={(e) => setSessionsInput(parseInt(e.target.value) || 1)}
                          autoFocus
                          disabled={selectedMode === 'stopwatch' || selectedMode === 'countdown'}
                          className="h-11"
                        />
                        <Button variant="outline" className="h-11" onClick={() => { setIsCustomSession(false); setSessionsInput(1); }}>Back</Button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Minimal description of mode */}
                <div className="text-[11px] text-muted-foreground">
                  {selectedMode === 'pomodoro' && '25m focus, 5m break. Ideal for deep learning.'}
                  {selectedMode === 'animedoro' && '45m focus, 15m break. Great for watching an episode after studying.'}
                  {selectedMode === 'deep_work' && '60m+ pure focus. No breaks. Flow state.'}
                  {selectedMode === 'countdown' && 'Short sprints to get started.'}
                  {selectedMode === 'stopwatch' && 'Count up indefinitely. Log when done.'}
                </div>
              </div>
            </div>

            {/* Smart Session Summary & Action */}
            <div className="mt-auto pt-6 flex flex-col gap-5 border-t border-muted/50">
               <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex flex-col items-center justify-center text-center">
                 <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1.5 opacity-80">Session Summary</div>
                 <div className="text-sm font-medium text-foreground/90">
                   <span className="font-bold text-foreground">{inputActivity || 'Deep Work'}</span> • {selectedMode.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} • {sessionsInput} Session{sessionsInput > 1 ? 's' : ''}
                 </div>
                 {selectedMode !== 'stopwatch' && (
                   <div className="text-xs text-muted-foreground font-medium mt-1">
                      {focusInput}m Focus {breakInput > 0 ? `• ${breakInput}m Break` : ''} • Est. Time: {Math.round((focusInput + breakInput) * sessionsInput)}m
                   </div>
                 )}
               </div>

              <Button onClick={handleStart} size="lg" className="w-full h-16 text-lg font-black rounded-xl shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-gradient text-primary-foreground border border-white/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <div className="relative flex items-center justify-center">
                  <Play className="w-6 h-6 mr-3 fill-current" /> START FOCUS SESSION
                </div>
              </Button>
              {formError && <p className="text-sm font-semibold text-red-500 text-center animate-in slide-in-from-top-1">{formError}</p>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in zoom-in-95 duration-500 justify-center">
            <div className="flex-1 flex flex-col items-center justify-center py-8 md:py-12 space-y-10 relative">
              
              {/* Top Meta */}
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase border shadow-sm transition-colors duration-500",
                  themeStyles.badge
                )}>
                  {phase === 'break' ? 'BREAK TIME' : 'FOCUS SESSION'}
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-foreground">
                  {activity}
                </h2>
                
                {activeCategory && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold mt-2 shadow-sm border border-white/10" style={{ backgroundColor: getCategoryColor(activeCategory.color).replace(')', ' / 0.15)'), color: getCategoryColor(activeCategory.color) }}>
                    {activeCategory.name}
                  </span>
                )}
              </div>
              
              {/* Massive Timer */}
              <div className="relative flex justify-center items-center w-full my-6">
                <div 
                  className={cn(
                    "text-[7rem] md:text-[9rem] lg:text-[11rem] tabular-nums transition-all duration-1000 leading-none",
                    themeStyles.timer
                  )}
                  style={
                    theme === 'midnight' 
                      ? { filter: `drop-shadow(0 0 ${isRunning ? '60px' : '30px'} rgba(124,58,237,${isRunning ? '0.3' : '0.15'}))` } 
                      : focusTheme === 'terminal' ? { filter: 'drop-shadow(0 0 15px rgba(34,197,94,0.4))' } : { filter: 'drop-shadow(0 8px 10px rgb(0 0 0 / 0.1))' }
                  }
                >
                  {formatTime(mode === 'stopwatch' ? elapsedTime : remainingTime)}
                </div>
              </div>
              
              {/* Progress & Controls */}
              <div className="w-full max-w-md mx-auto space-y-8">
                <div className="flex items-center justify-between text-sm uppercase tracking-widest text-muted-foreground font-bold px-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {mode?.replace('_', ' ')}
                  </div>
                  <div>
                    {totalSessions > 1 && `Session ${currentSession} / ${totalSessions}`}
                  </div>
                </div>

                {mode !== 'stopwatch' && (
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden relative shadow-inner">
                    <div 
                      className={cn("h-full transition-all duration-1000 relative", phase === 'break' ? 'bg-orange-500' : 'bg-green-500')} 
                      style={{ width: `${progressPercent}%` }} 
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 w-full justify-center">
                  {isPaused ? (
                    <Button onClick={async () => { await unlockAudio(); resumeSession(); }} size="lg" className="h-14 w-40 rounded-2xl shadow-md text-base font-bold">
                      <Play className="w-5 h-5 mr-2" /> Resume
                    </Button>
                  ) : (
                    <Button onClick={pauseSession} variant="outline" size="lg" className="h-14 w-40 rounded-2xl shadow-sm bg-secondary/50 text-base font-bold border-muted-foreground/20 hover:bg-secondary">
                      <Pause className="w-5 h-5 mr-2" /> Pause
                    </Button>
                  )}
                  <Button onClick={resetSession} variant="outline" size="lg" className="h-14 w-40 rounded-2xl shadow-sm text-red-500 border-red-200/50 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 text-base font-bold">
                    <Square className="w-5 h-5 mr-2" /> Stop
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}
          </CardContent>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE: Settings Panel */}
        {/* ========================================================= */}
        <div className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col bg-card">
          <CardHeader className="pb-3 border-b bg-muted/20 shrink-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Settings className="h-4 w-4" />
              Focus Settings
            </CardTitle>
            <Button 
              variant="default" 
              size="sm" 
              className="h-8 shadow-sm"
              onClick={() => setIsSettingsFlipped(false)}
            >
              Done
            </Button>
          </CardHeader>
          
          <CardContent className="pt-6 flex-1 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex bg-muted/50 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('appearance')}
                className={cn("flex-1 text-xs font-semibold py-1.5 rounded-md transition-all", activeTab === 'appearance' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
              >Appearance</button>
              <button 
                onClick={() => setActiveTab('environment')}
                className={cn("flex-1 text-xs font-semibold py-1.5 rounded-md transition-all", activeTab === 'environment' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
              >Environment</button>
              <button 
                onClick={() => setActiveTab('widgets')}
                className={cn("flex-1 text-xs font-semibold py-1.5 rounded-md transition-all", activeTab === 'widgets' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
              >Widgets</button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-2 pb-2 -mr-2">
              
              {activeTab === 'appearance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Session Layout</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['classic', 'minimal', 'stats-heavy'] as const).map(layout => (
                        <div 
                          key={layout}
                          onClick={() => setLayout(layout)}
                          className={cn(
                            "border-2 rounded-lg p-3 cursor-pointer transition-all hover:bg-muted/50 text-center",
                            sessionLayout === layout ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                          )}
                        >
                          <div className="text-xs font-bold capitalize">{layout.replace('-', ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Focus Theme</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['classic', 'minimal', 'dark-academic', 'terminal', 'glass'] as const).map(t => (
                        <div
                          key={t}
                          onClick={() => setTheme(t)}
                          className={cn(
                            "border-2 rounded-lg p-3 cursor-pointer transition-all hover:bg-muted/50",
                            focusTheme === t ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                          )}
                        >
                          <div className="text-sm font-bold capitalize mb-1">{t.replace('-', ' ')}</div>
                          <div className="text-[10px] text-muted-foreground">Timer styling</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'environment' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Background</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'none', label: 'None' },
                        { id: 'rainy-cafe', label: 'Rainy Cafe' },
                        { id: 'forest', label: 'Forest' },
                        { id: 'library', label: 'Library' },
                        { id: 'dark-study-room', label: 'Dark Study Room' },
                        { id: 'terminal', label: 'Terminal' },
                        { id: 'ocean', label: 'Ocean' },
                      ].map(bg => (
                        <div
                          key={bg.id}
                          onClick={() => setBackground(bg.id as any)}
                          className={cn(
                            "border-2 rounded-lg h-20 flex items-center justify-center cursor-pointer transition-all hover:opacity-80 relative overflow-hidden",
                            focusBackground === bg.id ? "border-primary shadow-sm" : "border-border",
                            bg.id === 'none' ? "bg-muted/30" : "bg-primary/5"
                          )}
                        >
                          <span className="text-xs font-bold z-10 drop-shadow-sm">{bg.label}</span>
                          {focusBackground === bg.id && bg.id !== 'none' && (
                            <div className="absolute inset-0 bg-primary/10" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Ambient Soundscape</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={ambientSoundscape}
                      onChange={(e) => setSoundscape(e.target.value as any)}
                    >
                      <option value="none">None</option>
                      <option value="rain">Rain</option>
                      <option value="forest">Forest</option>
                      <option value="cafe">Cafe</option>
                      <option value="ocean">Ocean</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'widgets' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Dashboard Visibility</Label>
                    <div className="space-y-3 bg-muted/20 p-4 rounded-xl border">
                      {[
                        { id: 'clock', label: 'Live Clock' },
                        { id: 'dailyGoal', label: 'Daily Mission' },
                        { id: 'currentSprint', label: 'Active Sprint' },
                        { id: 'quote', label: 'Quote of the Day' }
                      ].map(widget => (
                        <div key={widget.id} className="flex items-center justify-between">
                          <Label className="font-semibold cursor-pointer">{widget.label}</Label>
                          <button
                            onClick={() => setWidgetVisibility(widget.id as any, !widgetVisibility[widget.id as keyof typeof widgetVisibility])}
                            className={cn(
                              "w-10 h-6 rounded-full transition-colors flex items-center p-1",
                              widgetVisibility[widget.id as keyof typeof widgetVisibility] ? "bg-primary" : "bg-muted-foreground/30"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                              widgetVisibility[widget.id as keyof typeof widgetVisibility] ? "translate-x-4" : "translate-x-0"
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {widgetVisibility.quote && (
                    <div className="space-y-3 animate-in fade-in">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Quote Category</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={quoteCategory}
                        onChange={(e) => setQuoteCategory(e.target.value)}
                      >
                        <option value="motivation">Motivation</option>
                        <option value="discipline">Discipline</option>
                        <option value="stoic">Stoic Philosophy</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </div>

      </div>
    </Card>
  );
}
