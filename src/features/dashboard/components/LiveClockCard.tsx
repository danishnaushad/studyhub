import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Settings, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
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
  analogTheme: 'minimal' | 'focus-ring' | 'dark-academic' | 'terminal' | 'nord';
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
  accentColor: 'hsl(var(--primary))',
  analogTheme: 'minimal',
  digitalTheme: 'minimal'
};

const TIMEZONES = [
  { value: 'local', label: 'Local Time' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
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
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
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

  const isReadabilityMode = settings.displayMode === 'analog';



  const getAnalogThemeColors = () => {
    if (isReadabilityMode) {
      return {
        container: 'bg-white border-8 border-slate-800 shadow-xl text-slate-800',
        dot: 'bg-slate-800 w-4 h-4',
        tickMajor: 'bg-slate-800 w-1',
        tickMinor: 'bg-slate-400 w-0.5',
        hourHand: 'bg-slate-800 w-2.5',
        minuteHand: 'bg-slate-600 w-1.5',
        secondHand: 'bg-red-600 w-[2px]',
        borderStyle: {}
      };
    }

    switch (settings.analogTheme) {
      case 'dark-academic': return {
        container: 'bg-[#2c241b] border-4 border-[#c19a6b] shadow-lg',
        dot: 'bg-[#c19a6b] w-3 h-3',
        tickMajor: 'bg-[#c19a6b] opacity-80 w-1.5',
        tickMinor: 'bg-[#c19a6b] opacity-40 w-0.5',
        hourHand: 'bg-[#c19a6b] w-2',
        minuteHand: 'bg-[#c19a6b] w-1.5',
        secondHand: 'bg-[#d4af37] w-[2px]',
        borderStyle: {}
      };
      case 'terminal': return {
        container: 'bg-black border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
        dot: 'bg-green-500 w-3 h-3 shadow-[0_0_5px_rgba(34,197,94,0.5)]',
        tickMajor: 'bg-green-500 opacity-90 w-1.5 shadow-[0_0_5px_rgba(34,197,94,0.5)]',
        tickMinor: 'bg-green-500 opacity-50 w-0.5',
        hourHand: 'bg-green-400 w-1.5 shadow-[0_0_5px_rgba(34,197,94,0.5)]',
        minuteHand: 'bg-green-400 w-1 shadow-[0_0_5px_rgba(34,197,94,0.5)]',
        secondHand: 'bg-green-600 w-[2px]',
        borderStyle: {}
      };
      case 'nord': return {
        container: 'bg-[#2e3440] border-[6px] border-[#4c566a] shadow-md',
        dot: 'bg-[#88c0d0] w-3 h-3',
        tickMajor: 'bg-[#d8dee9] opacity-80 w-1.5',
        tickMinor: 'bg-[#d8dee9] opacity-30 w-0.5',
        hourHand: 'bg-[#81a1c1] w-2',
        minuteHand: 'bg-[#88c0d0] w-1.5',
        secondHand: 'bg-[#bf616a] w-[2px]',
        borderStyle: {}
      };
      case 'focus-ring': return {
        container: 'bg-background border-2 border-primary shadow-lg ring-4 ring-primary/20',
        dot: 'bg-primary w-4 h-4',
        tickMajor: 'bg-primary opacity-60 w-2',
        tickMinor: 'bg-primary opacity-30 w-1',
        hourHand: 'bg-foreground w-2',
        minuteHand: 'bg-foreground w-1.5',
        secondHand: 'bg-primary w-[3px]',
        borderStyle: {}
      };
      case 'minimal':
      default: return {
        container: 'bg-background shadow-inner',
        dot: '', 
        tickMajor: 'bg-foreground opacity-80 w-1.5',
        tickMinor: 'bg-muted-foreground opacity-40 w-0.5',
        hourHand: 'bg-foreground opacity-90 w-1.5',
        minuteHand: 'bg-current opacity-70 w-1',
        secondHand: '',
        borderStyle: { border: `6px solid ${settings.accentColor}20` }
      };
    }
  };

  const getDigitalThemeClasses = () => {
    switch (settings.digitalTheme) {
      case 'terminal': return 'font-mono text-green-500 bg-black/90 p-3 rounded-xl border border-green-500/30';
      case 'apple': return 'font-sans tracking-tight font-light text-foreground';
      case 'dashboard': return 'font-mono tracking-widest text-primary uppercase bg-primary/5 p-2 rounded';
      case 'focus': return 'font-serif opacity-90 tracking-widest font-bold leading-none';
      case 'minimal':
      default: return 'font-black tracking-tighter tabular-nums text-foreground';
    }
  };

  const t = getAnalogThemeColors();
  const isMidnightActive = theme === 'midnight' && isRunning;

  return (
    <Card className={cn(
      "border-primary/10 shadow-sm overflow-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-card to-muted/20 relative min-h-[300px] transition-all duration-1000",
      isMidnightActive && "shadow-[0_0_30px_rgba(124,58,237,0.1)] border-indigo-500/30"
    )}>
      
      {!showSettings && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-muted-foreground hover:text-primary z-10"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      )}

      <div className="flex flex-col items-center justify-center gap-8 w-full">
        {(settings.displayMode === 'analog' || settings.displayMode === 'both') && (
          <div 
            className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full shrink-0 transition-colors ${t.container}`} 
            style={t.borderStyle}
          >
            {/* Center dot */}
            <div 
              className={`absolute top-1/2 left-1/2 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 ${t.dot || 'w-3 h-3'}`} 
              style={!t.dot ? { backgroundColor: settings.accentColor } : {}} 
            />
            
            {/* Clock marks & Numbers */}
            {isReadabilityMode ? (
              <>
                {Array.from({ length: 60 }).map((_, i) => {
                  const isHour = i % 5 === 0;
                  return (
                    <div 
                      key={`tick-${i}`}
                      className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 ${isHour ? t.tickMajor : t.tickMinor}`}
                      style={{ transform: `rotate(${i * 6}deg)`, paddingBottom: isHour ? 'calc(100% - 16px)' : 'calc(100% - 8px)' }}
                    />
                  );
                })}
                {Array.from({ length: 12 }).map((_, i) => {
                  const num = i === 0 ? 12 : i;
                  const angle = (num * 30 - 90) * (Math.PI / 180);
                  const radius = 38;
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);
                  return (
                    <div 
                      key={`num-${num}`}
                      className="absolute font-bold text-lg md:text-xl -translate-x-1/2 -translate-y-1/2 text-slate-800"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      {num}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {[0, 3, 6, 9].map(h => (
                  <div 
                    key={`h-${h}`} 
                    className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 ${t.tickMajor}`}
                    style={{ transform: `rotate(${h * 30}deg)`, paddingBottom: 'calc(100% - 16px)' }}
                  />
                ))}
                {[1, 2, 4, 5, 7, 8, 10, 11].map(h => (
                  <div 
                    key={`h-${h}`} 
                    className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 ${t.tickMinor}`}
                    style={{ transform: `rotate(${h * 30}deg)`, paddingBottom: 'calc(100% - 8px)' }}
                  />
                ))}
              </>
            )}

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
                className={`absolute top-1/2 left-1/2 origin-bottom -translate-x-1/2 rounded-full z-10 ${t.secondHand || 'w-[2px] bg-current opacity-50'} h-20 md:h-24`}
                style={{ 
                  backgroundColor: !t.secondHand ? settings.accentColor : undefined, 
                  transform: `translateX(-50%) translateY(-100%) rotate(${secondDeg}deg)` 
                }}
              />
            )}
          </div>
        )}

        {(settings.displayMode === 'digital' || settings.displayMode === 'both') && (
          <div className={`flex flex-col items-center text-center ${getDigitalThemeClasses()}`}>
            <div className={`${settings.digitalTheme === 'focus' ? 'text-7xl md:text-[110px]' : sizeClasses[settings.fontSize]} flex items-baseline`}>
              {displayHours}:{minutes.toString().padStart(2, '0')}
              {settings.showSeconds && (
                <span className="text-xl md:text-2xl opacity-70 font-semibold tracking-normal ml-1">
                  :{seconds.toString().padStart(2, '0')}
                </span>
              )}
              {ampm && <span className="text-sm font-bold ml-2 opacity-60">{ampm}</span>}
            </div>
            
            {(settings.showDate || settings.showDayOfWeek) && (
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold mt-2 flex flex-col gap-0.5">
                {settings.showDayOfWeek && <span>{targetTime.toLocaleDateString(undefined, { weekday: 'long' })}</span>}
                {settings.showDate && <span>{targetTime.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {showSettings && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-30 flex flex-col p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Clock Settings</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 flex-1 text-sm pb-4">
            
            <div className="space-y-2">
              <label className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Display Mode</label>
              <select className="w-full p-2 rounded border bg-background" value={settings.displayMode} onChange={e => updateSetting('displayMode', e.target.value as any)}>
                <option value="both">Analog + Digital</option>
                <option value="analog">Analog Only</option>
                <option value="digital">Digital Only</option>
              </select>
              {settings.displayMode === 'analog' && (
                <p className="text-xs text-muted-foreground mt-1 bg-muted p-2 rounded border-l-2 border-primary">
                  Analog Only automatically enables enhanced readability.
                </p>
              )}
            </div>

            {(settings.displayMode === 'analog' || settings.displayMode === 'both') && (
              <div className="space-y-2">
                <label className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Analog Theme</label>
                <select className="w-full p-2 rounded border bg-background" value={settings.analogTheme} onChange={e => updateSetting('analogTheme', e.target.value as any)}>
                  <option value="minimal">Minimal Classic</option>
                  <option value="focus-ring">Focus Ring</option>
                  <option value="dark-academic">Dark Academic</option>
                  <option value="terminal">Terminal Analog</option>
                  <option value="nord">Nord Clock</option>
                </select>
              </div>
            )}

            {(settings.displayMode === 'digital' || settings.displayMode === 'both') && (
              <div className="space-y-2">
                <label className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Digital Theme</label>
                <select className="w-full p-2 rounded border bg-background" value={settings.digitalTheme} onChange={e => updateSetting('digitalTheme', e.target.value as any)}>
                  <option value="minimal">Minimal Digital</option>
                  <option value="terminal">Terminal Clock</option>
                  <option value="apple">Apple Style</option>
                  <option value="dashboard">Dashboard Compact</option>
                  <option value="focus">Focus Mode Clock</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Timezone</label>
              <select className="w-full p-2 rounded border bg-background" value={settings.timezone} onChange={e => updateSetting('timezone', e.target.value)}>
                {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input type="checkbox" checked={settings.use24Hour} onChange={e => updateSetting('use24Hour', e.target.checked)} className="accent-primary" />
                24h Format
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input type="checkbox" checked={settings.showSeconds} onChange={e => updateSetting('showSeconds', e.target.checked)} className="accent-primary" />
                Show Seconds
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input type="checkbox" checked={settings.showDate} onChange={e => updateSetting('showDate', e.target.checked)} className="accent-primary" />
                Show Date
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input type="checkbox" checked={settings.showDayOfWeek} onChange={e => updateSetting('showDayOfWeek', e.target.checked)} className="accent-primary" />
                Show Day
              </label>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Digital Size</label>
              <div className="flex gap-2">
                {['small', 'medium', 'large'].map(s => (
                  <Button key={s} size="sm" variant={settings.fontSize === s ? 'default' : 'outline'} className="flex-1 capitalize" onClick={() => updateSetting('fontSize', s as any)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Accent Color</label>
              <div className="flex gap-2">
                {['hsl(var(--primary))', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6'].map(c => (
                  <button key={c} className="w-8 h-8 rounded-full border-2 border-background ring-1 ring-border shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: c }} onClick={() => updateSetting('accentColor', c)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
