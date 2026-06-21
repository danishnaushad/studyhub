import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Settings, X, Monitor, Palette, Globe } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeProvider';
import { useFocusStore } from '../../../store/focusStore';
import { cn } from '../../../lib/utils';

interface ClockSettings {
  use24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showDayOfWeek: boolean;
  timezone: string;
  fontSize: 'small' | 'medium' | 'large';
  displayMode: 'digital' | 'analog' | 'both';
  accentColor: string;
  analogTheme: 'minimal' | 'linear' | 'flocus' | 'modern-glass';
  digitalTheme: 'minimal' | 'terminal' | 'apple' | 'dashboard' | 'focus';
}

const DEFAULT_SETTINGS: ClockSettings = {
  use24Hour: true,
  showSeconds: true,
  showDate: true,
  showDayOfWeek: true,
  timezone: 'local',
  fontSize: 'medium',
  displayMode: 'both',
  accentColor: '#8b5cf6', // Default purple accent
  analogTheme: 'modern-glass',
  digitalTheme: 'apple'
};

const TIMEZONES = [
  { value: 'local', label: 'Local Time' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Chicago', label: 'Chicago (CST)' },
  { value: 'America/Denver', label: 'Denver (MST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' }
];

export function LiveClockCard() {
  const { theme } = useTheme();
  const isRunning = useFocusStore(state => state.isRunning);
  const [time, setTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ClockSettings>(() => {
    const saved = localStorage.getItem('studyos_clock_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map old themes to new ones
        if (!['minimal', 'linear', 'flocus', 'modern-glass'].includes(parsed.analogTheme)) {
          parsed.analogTheme = 'modern-glass';
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('studyos_clock_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateSetting = <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getTargetTime = () => {
    if (settings.timezone === 'local') return time;
    try {
      const tzTime = new Date(time.toLocaleString('en-US', { timeZone: settings.timezone }));
      return tzTime;
    } catch {
      return time;
    }
  };

  const targetTime = getTargetTime();
  const hours = targetTime.getHours();
  const minutes = targetTime.getMinutes();
  const seconds = targetTime.getSeconds();
  
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const displayHours = settings.use24Hour ? hours.toString().padStart(2, '0') : (hours % 12 || 12).toString().padStart(2, '0');
  const ampm = settings.use24Hour ? '' : (hours >= 12 ? ' PM' : ' AM');

  const sizeClasses = {
    small: 'text-3xl md:text-4xl',
    medium: 'text-5xl md:text-6xl',
    large: 'text-7xl md:text-[80px]'
  };

  const getAnalogThemeColors = () => {
    switch (settings.analogTheme) {
      case 'linear': return {
        container: 'bg-transparent shadow-none',
        dot: 'bg-foreground w-2 h-2 shadow-[0_0_8px_rgba(255,255,255,0.8)]',
        tickMajor: 'bg-foreground opacity-80 w-[1px]',
        tickMinor: 'bg-foreground opacity-20 w-[1px]',
        hourHand: 'bg-foreground opacity-90 w-[2px] rounded-full',
        minuteHand: 'bg-foreground opacity-60 w-[1.5px] rounded-full',
        secondHand: `bg-[${settings.accentColor}] w-[1px] shadow-[0_0_8px_${settings.accentColor}80]`,
        borderStyle: { border: '1px solid rgba(150,150,150,0.1)' }
      };
      case 'flocus': return {
        container: 'bg-black/80 dark:bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        dot: `bg-[${settings.accentColor}] w-3 h-3`,
        tickMajor: 'bg-white opacity-60 w-1 rounded-full',
        tickMinor: 'hidden', // Minimalist tick approach
        hourHand: 'bg-white opacity-90 w-[3px] rounded-full',
        minuteHand: 'bg-white opacity-70 w-[2px] rounded-full',
        secondHand: `bg-[${settings.accentColor}] w-[1px]`,
        borderStyle: { border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }
      };
      case 'modern-glass': return {
        container: 'bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)] ring-1 ring-white/10 dark:ring-white/5',
        dot: `bg-[${settings.accentColor}] w-2.5 h-2.5 shadow-[0_0_12px_${settings.accentColor}aa]`,
        tickMajor: 'bg-foreground opacity-50 w-0.5 rounded-full',
        tickMinor: 'bg-foreground opacity-10 w-[1px]',
        hourHand: 'bg-foreground opacity-90 w-1 rounded-full shadow-lg',
        minuteHand: 'bg-foreground opacity-60 w-[2px] rounded-full shadow-md',
        secondHand: `bg-[${settings.accentColor}] w-[1px] shadow-[0_0_10px_${settings.accentColor}]`,
        borderStyle: {}
      };
      case 'minimal':
      default: return {
        container: 'bg-transparent shadow-none',
        dot: 'bg-foreground w-1.5 h-1.5',
        tickMajor: 'bg-foreground opacity-60 w-0.5',
        tickMinor: 'bg-foreground opacity-20 w-[1px]',
        hourHand: 'bg-foreground opacity-90 w-0.5',
        minuteHand: 'bg-foreground opacity-60 w-[1px]',
        secondHand: `bg-[${settings.accentColor}] w-[1px]`,
        borderStyle: {}
      };
    }
  };

  const getDigitalThemeClasses = () => {
    switch (settings.digitalTheme) {
      case 'apple': return 'font-sans tracking-tight font-light text-foreground';
      case 'terminal': return 'font-mono text-green-500 bg-black/90 p-3 rounded-xl border border-green-500/30';
      case 'dashboard': return 'font-mono tracking-widest uppercase bg-primary/5 p-2 rounded';
      case 'focus': return 'font-serif opacity-90 tracking-widest font-bold leading-none';
      case 'minimal':
      default: return 'font-black tracking-tighter tabular-nums text-foreground';
    }
  };

  const t = getAnalogThemeColors();
  const isMidnightActive = theme === 'midnight' && isRunning;

  return (
    <Card className={cn(
      "border-primary/5 shadow-sm overflow-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-card to-muted/10 relative min-h-[300px] transition-all duration-1000",
      isMidnightActive && "shadow-[0_0_30px_rgba(124,58,237,0.1)] border-indigo-500/30"
    )}>
      
      {/* Floating Action Button for Settings */}
      <button 
        className={cn(
          "absolute top-4 right-4 z-10 flex items-center justify-center w-[40px] h-[40px] rounded-full",
          "bg-slate-900/75 backdrop-blur-[12px] border border-purple-500/25",
          "text-white/70 hover:text-white transition-all duration-300 ease-out",
          "hover:scale-105 hover:bg-slate-800/80 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
          showSettings && "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowSettings(true)}
      >
        <Settings className="w-4 h-4 transition-transform hover:rotate-90 duration-500" />
      </button>

      <div className="flex flex-col items-center justify-center gap-6 w-full z-0 relative">
        {(settings.displayMode === 'analog' || settings.displayMode === 'both') && (
          <div 
            className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full shrink-0 transition-all duration-500 ${t.container}`} 
            style={t.borderStyle}
          >
            {/* Center pivot dot */}
            <div 
              className={`absolute top-1/2 left-1/2 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 ${t.dot}`} 
            />
            
            {/* Clock ticks */}
            {[...Array(60)].map((_, i) => {
              const isHour = i % 5 === 0;
              if (!isHour && t.tickMinor === 'hidden') return null;
              
              return (
                <div 
                  key={`tick-${i}`}
                  className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 ${isHour ? t.tickMajor : t.tickMinor}`}
                  style={{ 
                    transform: `rotate(${i * 6}deg)`, 
                    paddingBottom: isHour ? 'calc(100% - 12px)' : 'calc(100% - 6px)',
                    background: isHour && settings.analogTheme === 'modern-glass' ? settings.accentColor : undefined
                  }}
                />
              );
            })}

            {/* Hour hand */}
            <div 
              className={`absolute top-1/2 left-1/2 origin-bottom -translate-x-1/2 rounded-full z-10 ${t.hourHand} h-12 md:h-14`}
              style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourDeg}deg)` }}
            />
            
            {/* Minute hand */}
            <div 
              className={`absolute top-1/2 left-1/2 origin-bottom -translate-x-1/2 rounded-full z-10 ${t.minuteHand} h-16 md:h-20`}
              style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteDeg}deg)` }}
            />
            
            {/* Second hand */}
            {settings.showSeconds && (
              <div 
                className={`absolute top-1/2 left-1/2 origin-bottom -translate-x-1/2 rounded-full z-10 ${t.secondHand} h-20 md:h-24`}
                style={{ transform: `translateX(-50%) translateY(-100%) rotate(${secondDeg}deg)` }}
              />
            )}
          </div>
        )}

        {(settings.displayMode === 'digital' || settings.displayMode === 'both') && (
          <div className={`flex flex-col items-center text-center ${getDigitalThemeClasses()}`}>
            <div className={`${settings.digitalTheme === 'focus' ? 'text-6xl md:text-7xl' : sizeClasses[settings.fontSize]} flex items-end font-black tracking-tighter`} style={{ color: settings.digitalTheme === 'dashboard' ? settings.accentColor : undefined, lineHeight: 0.85 }}>
              <span>{displayHours}:{minutes.toString().padStart(2, '0')}</span>
              {settings.showSeconds && (
                <span className="text-2xl md:text-3xl opacity-60 font-bold ml-1 mb-[2px] md:mb-[4px]">
                  :{seconds.toString().padStart(2, '0')}
                </span>
              )}
              {ampm && <span className="text-sm font-bold ml-2 opacity-40 mb-[4px]">{ampm}</span>}
            </div>
            
            {(settings.showDate || settings.showDayOfWeek) && !isRunning && (
              <div className="flex flex-col items-center gap-1 mt-4">
                {settings.showDayOfWeek && (
                  <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] opacity-60 font-bold">
                    {targetTime.toLocaleDateString(undefined, { weekday: 'long' })}
                  </span>
                )}
                {settings.showDate && (
                  <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] opacity-60 font-bold">
                    {targetTime.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            )}

            {isRunning && (
               <div className="text-[11px] md:text-xs uppercase tracking-widest font-bold mt-4 flex gap-2 text-primary animate-pulse shadow-sm">
                 <span className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                   Session Active
                 </span>
               </div>
            )}
          </div>
        )}
      </div>

      {/* Premium Settings Drawer */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-end pr-4 sm:pr-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[rgba(5,10,25,.75)] backdrop-blur-[12px]" onClick={() => setShowSettings(false)} />
          
          <div className="relative w-full max-w-[440px] max-h-[80vh] flex flex-col bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in slide-in-from-right-8 duration-400 ease-out">
            
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-white/5 bg-white/[0.02] shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Clock Settings</h3>
                <p className="text-xs text-white/50 mt-1">Customize your dashboard clock</p>
              </div>
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <style>{`
              .clock-settings-scroll::-webkit-scrollbar { display: none; }
              .clock-settings-scroll { -ms-overflow-style: none; scrollbar-width: none; }
              .premium-select {
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 1rem center;
                background-size: 1em;
              }
            `}</style>
            
            <div className="flex-1 overflow-y-auto clock-settings-scroll p-6 space-y-8 text-sm">
              
              {/* Display Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-white/80 font-medium mb-2">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  <h4>Display</h4>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold pl-1">Display Mode</label>
                  <select 
                    className="premium-select w-full h-[48px] px-4 rounded-xl bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.08)] text-white/90 focus:outline-none focus:border-purple-500/50 hover:border-purple-500/35 transition-colors"
                    value={settings.displayMode} 
                    onChange={e => updateSetting('displayMode', e.target.value as any)}
                  >
                    <option value="both" className="bg-[#0f172a]">Analog + Digital</option>
                    <option value="analog" className="bg-[#0f172a]">Analog Only</option>
                    <option value="digital" className="bg-[#0f172a]">Digital Only</option>
                  </select>
                </div>
              </section>

              {/* Appearance Section */}
              <section className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-white/80 font-medium mb-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <h4>Appearance</h4>
                </div>

                {(settings.displayMode === 'analog' || settings.displayMode === 'both') && (
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold pl-1">Analog Theme</label>
                    <select 
                      className="premium-select w-full h-[48px] px-4 rounded-xl bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.08)] text-white/90 focus:outline-none focus:border-purple-500/50 hover:border-purple-500/35 transition-colors"
                      value={settings.analogTheme} 
                      onChange={e => updateSetting('analogTheme', e.target.value as any)}
                    >
                      <option value="modern-glass" className="bg-[#0f172a]">Modern Glass (Premium)</option>
                      <option value="linear" className="bg-[#0f172a]">Linear Style</option>
                      <option value="flocus" className="bg-[#0f172a]">Flocus Style</option>
                      <option value="minimal" className="bg-[#0f172a]">Minimal Classic</option>
                    </select>
                  </div>
                )}

                {(settings.displayMode === 'digital' || settings.displayMode === 'both') && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold pl-1">Digital Theme</label>
                      <select 
                        className="premium-select w-full h-[48px] px-4 rounded-xl bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.08)] text-white/90 focus:outline-none focus:border-purple-500/50 hover:border-purple-500/35 transition-colors"
                        value={settings.digitalTheme} 
                        onChange={e => updateSetting('digitalTheme', e.target.value as any)}
                      >
                        <option value="apple" className="bg-[#0f172a]">Apple Style</option>
                        <option value="minimal" className="bg-[#0f172a]">Minimal Heavy</option>
                        <option value="dashboard" className="bg-[#0f172a]">Dashboard Compact</option>
                        <option value="focus" className="bg-[#0f172a]">Focus Serif</option>
                        <option value="terminal" className="bg-[#0f172a]">Terminal Mono</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold pl-1">Digital Size</label>
                      <div className="flex gap-2 h-[48px] p-1 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.08)] rounded-xl">
                        {['small', 'medium', 'large'].map(s => (
                          <button 
                            key={s} 
                            className={cn(
                              "flex-1 rounded-lg text-xs font-medium transition-all capitalize",
                              settings.fontSize === s ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-white/40 hover:text-white/80 hover:bg-white/5"
                            )}
                            onClick={() => updateSetting('fontSize', s as any)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold pl-1">Accent Color</label>
                  <div className="flex gap-4 px-1">
                    {['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#eab308', '#ffffff'].map(c => (
                      <button 
                        key={c} 
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all hover:scale-110 shadow-lg",
                          settings.accentColor === c ? "border-white ring-2 ring-purple-500/50 scale-110" : "border-white/10"
                        )}
                        style={{ backgroundColor: c }} 
                        onClick={() => updateSetting('accentColor', c)} 
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Localization Section */}
              <section className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-white/80 font-medium mb-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <h4>Localization</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider text-white/40 font-semibold pl-1">Timezone</label>
                  <select 
                    className="premium-select w-full h-[48px] px-4 rounded-xl bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.08)] text-white/90 focus:outline-none focus:border-purple-500/50 hover:border-purple-500/35 transition-colors"
                    value={settings.timezone} 
                    onChange={e => updateSetting('timezone', e.target.value)}
                  >
                    {TIMEZONES.map(tz => <option key={tz.value} value={tz.value} className="bg-[#0f172a]">{tz.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { key: 'use24Hour', label: '24-Hour Format' },
                    { key: 'showSeconds', label: 'Show Seconds' },
                    { key: 'showDate', label: 'Show Date' },
                    { key: 'showDayOfWeek', label: 'Show Day' }
                  ].map(toggle => (
                    <label 
                      key={toggle.key} 
                      className="flex flex-col gap-3 p-4 rounded-xl bg-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.05)] hover:bg-[rgba(255,255,255,.04)] cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs text-white/80 font-medium">{toggle.label}</span>
                        {/* Custom minimal toggle switch */}
                        <div className={cn(
                          "w-8 h-4 rounded-full transition-colors relative",
                          settings[toggle.key as keyof ClockSettings] ? "bg-purple-500" : "bg-white/10"
                        )}>
                          <div className={cn(
                            "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform shadow-sm",
                            settings[toggle.key as keyof ClockSettings] ? "translate-x-4.5 left-[18px]" : "translate-x-0.5 left-0"
                          )} />
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={settings[toggle.key as keyof ClockSettings] as boolean} 
                        onChange={e => updateSetting(toggle.key as keyof ClockSettings, e.target.checked as never)} 
                      />
                    </label>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
