import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Timer, Plus, Trash2, Edit2, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useDeadlines } from '../hooks/useDeadlines';
import { useCategories } from '../../../hooks/useCategories';
import { useAuth } from '../../../hooks/useAuth';
import { createDeadline, updateDeadline, deleteDeadline } from '../services/deadline.service';
import { getCategoryColor } from '../../../lib/colors';


export function DeadlineWidget() {
  const { deadlines } = useDeadlines();
  const { categories } = useCategories();
  const { user } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const resetForm = () => {
    setTitle('');
    setTargetDate('');
    setCategoryId('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!user || !title || !targetDate) return;
    
    if (editingId) {
      await updateDeadline(editingId, { title, targetDate, categoryId });
    } else {
      await createDeadline({ userId: user.uid, title, targetDate, categoryId });
    }
    resetForm();
  };

  const calculateDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="border-primary/10 shadow-sm flex flex-col bg-gradient-to-br from-card to-muted/10">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
          <Timer className="h-4 w-4" />
          Deadline Countdown
        </CardTitle>
        {!isAdding && !editingId && (
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 pt-4 space-y-4">
        {(isAdding || editingId) && (
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">{editingId ? 'Edit Deadline' : 'New Deadline'}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={resetForm}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <input 
              type="text" 
              placeholder="E.g. Security+ Exam" 
              className="w-full text-sm p-1.5 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <input 
                type="date" 
                className="w-1/2 text-sm p-1.5 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
              />
              <select 
                className="w-1/2 text-sm p-1.5 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
              >
                <option value="">No Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Button size="sm" className="w-full h-8" onClick={handleSave} disabled={!title || !targetDate}>
              Save
            </Button>
          </div>
        )}

        {!isAdding && !editingId && deadlines.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground italic">
            No active deadlines.
          </div>
        )}

        {!isAdding && !editingId && deadlines.map(deadline => {
          const daysLeft = calculateDaysLeft(deadline.targetDate);
          const cat = categories.find(c => c.id === deadline.categoryId);
          const isOverdue = daysLeft < 0;

          return (
            <div key={deadline.id} className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/30 transition-colors relative overflow-hidden">
              {cat && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: getCategoryColor(cat.color) }} />}
              <div className="flex flex-col pl-2">
                <span className="font-semibold text-sm">{deadline.title}</span>
                {cat && <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{cat.name}</span>}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className={`text-xl font-black tracking-tighter ${isOverdue ? 'text-red-500' : (daysLeft <= 7 ? 'text-orange-500' : 'text-primary')}`}>
                    {Math.abs(daysLeft)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {isOverdue ? 'Days Ago' : 'Days Left'}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => {
                    setEditingId(deadline.id);
                    setTitle(deadline.title);
                    setTargetDate(deadline.targetDate);
                    setCategoryId(deadline.categoryId || '');
                  }}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteDeadline(deadline.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
