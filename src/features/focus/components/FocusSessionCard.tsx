import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { useAuth } from '../../../hooks/useAuth';
import { useCategories } from '../../../hooks/useCategories';
import { useFocusStore } from '../../../store/focusStore';
import type { FocusMode } from '../../../store/focusStore';
import { Timer, Play, Pause, Square, Activity, Target, TrendingUp, Settings } from 'lucide-react';
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
    currentSession, totalSessions, focusMinutesToday, categoryProgress, focusTheme,
    focusBackground, ambientSoundscape, sessionLayout, quoteCategory, widgetVisibility,
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
  const activeCategoryProgress = categoryId ? Math.floor((categoryProgress[categoryId] || 0) / 60) : 0;
  const activeCategoryTarget = activeCategory?.targetMinutes || 0;

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
          <div className="space-y-4 animate-in fade-in flex-1">
            {isCompleted && (
              <div className="bg-primary/10 text-primary p-4 rounded-lg text-center font-bold text-lg animate-bounce shadow-sm border border-primary/20">
                Session Complete 🎉
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Activity</Label>
              <Input 
                value={inputActivity} 
                onChange={(e) => setInputActivity(e.target.value)} 
                placeholder="What are you focusing on?"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mode</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                {selectedMode === 'pomodoro' && <p className="text-[10px] text-muted-foreground mt-1">25m focus, 5m break. Ideal for deep learning.</p>}
                {selectedMode === 'animedoro' && <p className="text-[10px] text-muted-foreground mt-1">45m focus, 15m break. Great for watching an episode after studying.</p>}
                {selectedMode === 'deep_work' && <p className="text-[10px] text-muted-foreground mt-1">60m+ pure focus. No breaks. Flow state.</p>}
                {selectedMode === 'countdown' && <p className="text-[10px] text-muted-foreground mt-1">Short sprints to get started.</p>}
                {selectedMode === 'stopwatch' && <p className="text-[10px] text-muted-foreground mt-1">Count up indefinitely. Log when done.</p>}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Focus Duration (min)</Label>
                <Input 
                  type="number" 
                  min="0.01"
                  step="0.01" 
                  value={focusInput} 
                  onChange={(e) => setFocusInput(parseFloat(e.target.value) || 0)}
                  disabled={selectedMode === 'stopwatch'}
                />
              </div>
              <div className="space-y-2">
                <Label>Break Duration (min)</Label>
                <Input 
                  type="number" 
                  min="0.01"
                  step="0.01" 
                  value={breakInput} 
                  onChange={(e) => setBreakInput(parseFloat(e.target.value) || 0)}
                  disabled={selectedMode === 'stopwatch'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sessions</Label>
              {!isCustomSession ? (
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    min="1" 
                    value={sessionsInput} 
                    onChange={(e) => setSessionsInput(parseInt(e.target.value) || 1)}
                    autoFocus
                    disabled={selectedMode === 'stopwatch' || selectedMode === 'countdown'}
                  />
                  <Button variant="outline" onClick={() => {
                    setIsCustomSession(false);
                    setSessionsInput(1);
                  }}>Back</Button>
                </div>
              )}
            </div>


            <Button onClick={handleStart} className="w-full mt-4">
              <Play className="w-4 h-4 mr-2" /> Start Focus Session
            </Button>
            {formError && <p className="text-sm font-semibold text-red-500 text-center animate-in slide-in-from-top-1">{formError}</p>}
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in zoom-in-95 duration-300">
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                 <span className="font-bold text-foreground">Current Focus:</span> {activity}
                 {activeCategory && (
                   <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: getCategoryColor(activeCategory.color).replace(')', ' / 0.2)'), color: getCategoryColor(activeCategory.color) }}>
                     {activeCategory.name}
                   </span>
                  )}
              </div>
              
              <div className={cn(
                "w-full max-w-sm rounded-3xl border transition-all duration-700 p-8 flex flex-col items-center justify-center my-4",
                themeStyles.wrapper
              )}>
                <div className={cn(
                  "px-3 py-1 mb-6 rounded-full text-[10px] font-black tracking-widest uppercase border shadow-sm transition-colors duration-500",
                  themeStyles.badge
                )}>
                  {phase === 'break' ? 'BREAK TIME' : 'FOCUS SESSION'}
                </div>

                <div 
                  className={cn(
                    "text-7xl tabular-nums transition-all duration-1000",
                    themeStyles.timer
                  )}
                  style={
                    theme === 'midnight' 
                      ? { filter: `drop-shadow(0 0 ${isRunning ? '45px' : '30px'} rgba(124,58,237,${isRunning ? '0.25' : '0.15'}))` } 
                      : focusTheme === 'terminal' ? { filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.4))' } : { filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' }
                  }
                >
                  {formatTime(mode === 'stopwatch' ? elapsedTime : remainingTime)}
                </div>
              </div>
              
              <div className="text-sm uppercase tracking-widest text-muted-foreground mt-2 font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {mode?.replace('_', ' ')} {totalSessions > 1 && `• Session ${currentSession} / ${totalSessions}`}
              </div>
              
              <div className="flex gap-4 mt-8 w-full justify-center">
                {isPaused ? (
                  <Button onClick={async () => { await unlockAudio(); resumeSession(); }} size="lg" className="w-32 rounded-full shadow-md">
                    <Play className="w-4 h-4 mr-2" /> Resume
                  </Button>
                ) : (
                  <Button onClick={pauseSession} variant="outline" size="lg" className="w-32 rounded-full shadow-sm bg-secondary/50">
                    <Pause className="w-4 h-4 mr-2" /> Pause
                  </Button>
                )}
                <Button onClick={resetSession} variant="outline" size="lg" className="w-32 rounded-full shadow-sm text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                  <Square className="w-4 h-4 mr-2" /> Stop
                </Button>
              </div>
            </div>

            {/* Current Session Progress Details */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-auto">
              {activeCategory ? (
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase mb-1">
                    <Target className="h-3.5 w-3.5" /> Category Progress
                  </div>
                  <div className="text-lg font-bold">
                    {activeCategoryProgress}m <span className="text-muted-foreground text-sm font-normal">/ {activeCategoryTarget}m</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ 
                        width: `${Math.min(100, activeCategoryTarget > 0 ? (activeCategoryProgress / activeCategoryTarget) * 100 : 0)}%`,
                        backgroundColor: getCategoryColor(activeCategory.color)
                      }} 
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 p-3 rounded-lg border flex items-center justify-center text-sm text-muted-foreground">
                  No category selected
                </div>
              )}

              <div className="bg-muted/30 p-3 rounded-lg border">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase mb-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Today's Total
                </div>
                <div className="text-lg font-bold text-primary">
                  {Math.floor(focusMinutesToday / 60)}h {focusMinutesToday % 60}m
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
