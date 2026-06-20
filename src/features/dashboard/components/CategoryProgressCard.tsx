import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Edit2, Check, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useFocusStore } from '../../../store/focusStore';
import { useCategories } from '../../../hooks/useCategories';
import { db } from '../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getCategoryColor } from '../../../lib/colors';

export function CategoryProgressCard() {
  const { categoryProgress } = useFocusStore();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEditStart = (id: string, currentTarget: number) => {
    setEditingId(id);
    setEditValue(currentTarget.toString());
  };

  const handleEditSave = async (id: string) => {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val > 0) {
      try {
        await updateDoc(doc(db, 'categories', id), { targetMinutes: val });
      } catch (err) {
        console.error('Failed to update target', err);
      }
    }
    setEditingId(null);
  };

  const progressData = categories.map(cat => {
    const currentSeconds = categoryProgress[cat.id] || 0;
    const currentMinutes = Math.floor(currentSeconds / 60);
    
    // Now fully relies on initialized targets from Firestore
    const targetMinutes = cat.targetMinutes || 60; // fallback if somehow missing during migration
    const percentage = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));

    return {
      ...cat,
      currentMinutes,
      targetMinutes,
      percentage
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const renderProgressBar = (percentage: number) => {
    if (isNaN(percentage)) return '';
    const totalBlocks = 10;
    const filledBlocks = Math.round((percentage / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <Target className="h-4 w-4" />
          Category Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {progressData.length === 0 ? (
            <div className="text-sm text-muted-foreground italic text-center py-4">
              No categories created yet.
            </div>
          ) : (
            progressData.map((data) => (
              <div key={data.id} className="flex flex-col w-full border border-border/50 rounded-lg p-3 bg-muted/10 group">
                <div className="flex justify-between items-center mb-2">
                  <button 
                    onClick={() => navigate(`/category/${data.id}`)}
                    className="text-sm font-bold flex items-center gap-2 hover:underline decoration-muted-foreground underline-offset-4 text-left"
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(data.color) }} />
                    {data.name}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </button>
                  <span className="text-xs font-medium text-muted-foreground">
                    {!isNaN(data.percentage) ? `${data.percentage}%` : '0%'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs mb-1">
                  {editingId === data.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-medium">
                        {data.currentMinutes}m /
                      </span>
                      <input
                        type="number"
                        className="w-16 px-1 py-0.5 text-xs bg-background border border-input rounded"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSave(data.id)}
                        autoFocus
                        min="1"
                        max="1440"
                      />
                      <span className="text-muted-foreground font-medium">m</span>
                      <button 
                        onClick={() => handleEditSave(data.id)}
                        className="p-1 hover:bg-accent rounded text-primary"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group cursor-pointer w-full" onClick={() => handleEditStart(data.id, data.targetMinutes)}>
                      <span className="text-muted-foreground font-medium">
                        {data.currentMinutes}m / {data.targetMinutes}m
                      </span>
                      {data.targetMinutes > data.currentMinutes && (
                        <span className="text-xs text-muted-foreground ml-auto pr-2">
                          Remaining: {data.targetMinutes - data.currentMinutes}m
                        </span>
                      )}
                      <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </div>
                  )}
                </div>
                
                <div className="w-full text-[10px] tracking-widest text-primary/80 font-mono">
                  {!isNaN(data.percentage) ? renderProgressBar(data.percentage) : renderProgressBar(0)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
