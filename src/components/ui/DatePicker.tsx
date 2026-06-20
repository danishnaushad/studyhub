import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format strictly for parent component
  onChange: (date: string) => void;
  minDate?: string;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function DatePicker({ value, onChange, minDate, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const [y, m] = value.split('-');
      return new Date(Number(y), Number(m) - 1, 1);
    }
    return new Date();
  });
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Format internal YYYY-MM-DD to DD-MM-YYYY for display initially
    if (value) {
      const [y, m, d] = value.split('-');
      if (y && m && d && inputValue !== `${d}-${m}-${y}` && inputValue !== `${d}/${m}/${y}` && inputValue !== value) {
        setInputValue(`${d}-${m}-${y}`);
        setCurrentMonth(new Date(Number(y), Number(m) - 1, 1));
        setError(null);
      }
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isValidDate = (year: number, month: number, day: number) => {
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
  };

  const getLocalYYYYMMDD = (d: Date) => {
    const offset = d.getTimezoneOffset();
    const adjusted = new Date(d.getTime() - (offset * 60 * 1000));
    return adjusted.toISOString().split('T')[0];
  };

  const parseInputDate = (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return null;

    let day, month, year;

    if (cleaned.includes('-') || cleaned.includes('/')) {
      const parts = cleaned.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          year = Number(parts[0]);
          month = Number(parts[1]);
          day = Number(parts[2]);
        } else {
          // DD-MM-YYYY or DD/MM/YYYY
          day = Number(parts[0]);
          month = Number(parts[1]);
          year = Number(parts[2]);
        }
      }
    }

    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      return { error: 'Invalid format. Use DD-MM-YYYY' };
    }

    if (!isValidDate(year, month, day)) {
      return { error: 'Invalid date (e.g. wrong leap year)' };
    }

    const parsedDate = new Date(year, month - 1, day);
    const yyyymmdd = getLocalYYYYMMDD(parsedDate);

    if (minDate && yyyymmdd < minDate) {
      return { error: 'Date cannot be in the past' };
    }

    return { date: yyyymmdd, parsedDate };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    
    if (text === '') {
      setError('Date is required');
      return;
    }

    const result = parseInputDate(text);
    if (result && result.error) {
      setError(result.error);
    } else if (result && result.date) {
      setError(null);
      onChange(result.date);
      setCurrentMonth(new Date(result.parsedDate.getFullYear(), result.parsedDate.getMonth(), 1));
    }
  };

  const handleDaySelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const yyyymmdd = getLocalYYYYMMDD(selected);
    
    if (minDate && yyyymmdd < minDate) {
      return; // Cannot select past dates
    }

    const [y, m, d] = yyyymmdd.split('-');
    setInputValue(`${d}-${m}-${y}`);
    setError(null);
    onChange(yyyymmdd);
    setIsOpen(false);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentIterDate = new Date(year, month, day);
      const yyyymmdd = getLocalYYYYMMDD(currentIterDate);
      const isSelected = value === yyyymmdd;
      const isDisabled = minDate ? yyyymmdd < minDate : false;
      const isToday = yyyymmdd === getLocalYYYYMMDD(new Date());

      days.push(
        <button
          key={`day-${day}`}
          onClick={(e) => {
            e.preventDefault();
            handleDaySelect(day);
          }}
          disabled={isDisabled}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors",
            isSelected ? "bg-primary text-primary-foreground font-semibold" : 
            isDisabled ? "text-muted-foreground/30 cursor-not-allowed" : 
            "hover:bg-accent hover:text-accent-foreground",
            isToday && !isSelected && "border border-primary text-primary"
          )}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="DD-MM-YYYY"
          className={cn(
            "w-full p-2 pl-3 pr-10 bg-background border rounded-md focus:ring-2 focus:ring-primary focus:outline-none",
            error ? "border-red-500 focus:ring-red-500" : "border-input"
          )}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-1 absolute -bottom-5">{error}</p>}

      {isOpen && (
        <div className="absolute top-full mt-2 z-50 p-3 bg-popover border shadow-xl rounded-md w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
              }}
              className="p-1 hover:bg-accent rounded text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="font-semibold text-sm">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
              }}
              className="p-1 hover:bg-accent rounded text-muted-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-muted-foreground">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
}
