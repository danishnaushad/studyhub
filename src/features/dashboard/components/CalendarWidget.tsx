import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useDeadlines } from '../hooks/useDeadlines';
import { useCategories } from '../../../hooks/useCategories';
import { useAuth } from '../../../hooks/useAuth';
import { createDeadline, deleteDeadline } from '../services/deadline.service';
import { getCategoryColor } from '../../../lib/colors';


export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { deadlines } = useDeadlines();
  const { categories } = useCategories();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'event' | 'deadline'>('event');
  const [categoryId, setCategoryId] = useState('');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
  const todayDate = today.getDate();

  const handleSaveEvent = async () => {
    if (!user || !title || !selectedDate) return;
    
    const tzOffset = selectedDate.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(selectedDate.getTime() - tzOffset)).toISOString().split('T')[0];
    
    await createDeadline({
      userId: user.uid,
      title,
      targetDate: localISOTime,
      categoryId: categoryId || undefined,
      type
    });
    
    setTitle('');
    setCategoryId('');
    setType('event');
  };

  const getDayString = (day: number) => {
    const d = new Date(year, currentDate.getMonth(), day);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return (new Date(d.getTime() - tzOffset)).toISOString().split('T')[0];
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = isCurrentMonth && i === todayDate;
    const dateStr = getDayString(i);
    const dayEvents = deadlines.filter(d => d.targetDate === dateStr);
    
    days.push(
      <div 
        key={i} 
        onClick={() => setSelectedDate(new Date(year, currentDate.getMonth(), i))}
        className={`relative w-8 h-8 flex flex-col items-center justify-center text-xs rounded-full transition-colors cursor-pointer ${
          isToday ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'hover:bg-muted text-foreground font-medium'
        }`}
      >
        <span>{i}</span>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 flex gap-0.5">
            {dayEvents.slice(0, 3).map((ev, idx) => (
              <div 
                key={idx} 
                className={`w-1 h-1 rounded-full ${isToday ? 'bg-primary-foreground' : 'bg-primary'}`}
                style={ev.categoryId ? { backgroundColor: getCategoryColor(categories.find(c => c.id === ev.categoryId)?.color) } : {}}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const selectedDateStr = selectedDate ? (new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
  const selectedEvents = selectedDate ? deadlines.filter(d => d.targetDate === selectedDateStr) : [];

  return (
    <Card className="shadow-sm border-primary/10 bg-gradient-to-br from-card to-muted/10 relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center font-bold text-sm mb-4 tracking-wide">
          {monthName} {year}
        </div>
        
        <div className="grid grid-cols-7 gap-1 justify-items-center mb-2">
          {weekDays.map(day => (
            <div key={day} className="w-8 text-center text-[10px] font-bold text-muted-foreground/70 uppercase">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 justify-items-center">
          {days}
        </div>
      </CardContent>

      {/* Modal Overlay for Selected Date */}
      {selectedDate && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            {/* Events List */}
            {selectedEvents.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Events & Deadlines</h4>
                {selectedEvents.map(ev => {
                  const cat = categories.find(c => c.id === ev.categoryId);
                  return (
                    <div key={ev.id} className="flex justify-between items-center bg-card border rounded p-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(cat?.color) }} />
                        <span className="font-semibold">{ev.title}</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-bold px-1.5 py-0.5 bg-muted rounded-md">
                          {ev.type || 'deadline'}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => deleteDeadline(ev.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic text-center py-4">No events scheduled.</div>
            )}

            <div className="bg-muted/30 p-3 rounded-lg border space-y-3">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Add Event</h4>
              <input 
                type="text" 
                placeholder="Title..." 
                className="w-full text-sm p-1.5 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <select 
                  className="w-1/2 text-sm p-1.5 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  value={type}
                  onChange={e => setType(e.target.value as 'event'|'deadline')}
                >
                  <option value="event">Event</option>
                  <option value="deadline">Deadline</option>
                </select>
                <select 
                  className="w-1/2 text-sm p-1.5 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <option value="">No Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <Button size="sm" className="w-full" onClick={handleSaveEvent} disabled={!title}>
                <Plus className="h-4 w-4 mr-2" /> Add to Calendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
