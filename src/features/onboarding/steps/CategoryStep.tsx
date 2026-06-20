import { useState, useEffect } from 'react';
import type { OnboardingData, OnboardingCategory } from '../OnboardingWizard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Plus, Trash2 } from 'lucide-react';

const PRESET_COLORS = [
  'blue',
  'green',
  'yellow',
  'purple',
  'red',
  'orange',
  'pink',
  'teal'
];

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

export function CategoryStep({ 
  data, updateData, onNext, onPrev, onSkip 
}: { 
  data: OnboardingData, updateData: (d: Partial<OnboardingData>) => void, onNext: () => void, onPrev: () => void, onSkip: () => void 
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Start with one empty category if none exist
    if (data.categories.length === 0) {
      const newId = `temp-${Date.now()}`;
      updateData({ 
        categories: [{
          id: newId,
          name: '',
          color: PRESET_COLORS[0],
          targetMinutes: 60
        }] 
      });
      setEditingId(newId);
    }
  }, [data.categories.length, updateData]);

  const addCategory = () => {
    const newId = `temp-${Date.now()}`;
    updateData({
      categories: [
        ...data.categories,
        { id: newId, name: '', color: PRESET_COLORS[data.categories.length % PRESET_COLORS.length], targetMinutes: 60 }
      ]
    });
    setEditingId(newId);
  };

  const removeCategory = (id: string) => {
    updateData({ categories: data.categories.filter(c => c.id !== id) });
    if (editingId === id) setEditingId(null);
  };

  const updateCategory = (id: string, partial: Partial<OnboardingCategory>) => {
    updateData({
      categories: data.categories.map(c => c.id === id ? { ...c, ...partial } : c)
    });
  };

  const isFormValid = data.categories.length > 0 && data.categories.every(c => c.name.trim() !== '' && c.targetMinutes > 0);

  return (
    <div className="p-6 sm:p-10 space-y-8 flex-1">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Study Categories</h2>
        <p className="text-muted-foreground">Create categories for the different subjects or topics you will be focusing on.</p>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {data.categories.map((cat) => (
          <div key={cat.id} className="p-4 border rounded-lg bg-background space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">Category Configuration</h3>
              <Button variant="ghost" size="sm" onClick={() => removeCategory(cat.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={cat.name} 
                  onChange={e => updateCategory(cat.id, { name: e.target.value })} 
                  onBlur={() => updateCategory(cat.id, { name: toTitleCase(cat.name.trim()) })}
                  placeholder="e.g. History"
                  autoFocus={editingId === cat.id}
                />
              </div>
              <div className="space-y-2">
                <Label>Daily Target (Minutes)</Label>
                <Input 
                  type="number"
                  min="1"
                  value={cat.targetMinutes || ''} 
                  onChange={e => updateCategory(cat.id, { targetMinutes: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateCategory(cat.id, { color })}
                    className={`w-6 h-6 rounded-full border-2 focus:outline-none transition-all bg-cat-${color} ${cat.color === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-110'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full border-dashed" onClick={addCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add Another Category
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 pt-6 mt-auto">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={onPrev}>Back</Button>
          <Button onClick={onNext} disabled={!isFormValid}>Continue</Button>
        </div>
        <button onClick={onSkip} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline">Skip & Go To Dashboard</button>
      </div>
    </div>
  );
}
