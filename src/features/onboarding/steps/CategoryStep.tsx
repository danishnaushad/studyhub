import { useState } from 'react';
import type { OnboardingData } from '../OnboardingWizard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type {  } from '../OnboardingWizard';
import { Plus, X } from 'lucide-react';

export function CategoryStep({ 
  data, updateData, onNext, onPrev 
}: { 
  data: OnboardingData, updateData: (d: Partial<OnboardingData>) => void, onNext: () => void, onPrev: () => void 
}) {
  const [newCat, setNewCat] = useState('');

  const addCategory = () => {
    if (newCat.trim() && !data.categories.includes(newCat.trim())) {
      updateData({ categories: [...data.categories, newCat.trim()] });
      setNewCat('');
    }
  };

  const removeCategory = (cat: string) => {
    updateData({ categories: data.categories.filter(c => c !== cat) });
  };

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Setup Workspaces</h2>
        <p className="text-muted-foreground">Create at least one category to organize your learning.</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={newCat} 
            onChange={e => setNewCat(e.target.value)} 
            placeholder="e.g. Cyber Security"
            onKeyDown={e => e.key === 'Enter' && addCategory()}
          />
          <Button type="button" onClick={addCategory} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {data.categories.map(cat => (
            <div key={cat} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-medium">
              {cat}
              <button onClick={() => removeCategory(cat)} className="hover:text-destructive transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {data.categories.length === 0 && (
            <div className="text-sm text-muted-foreground py-2">No categories added yet.</div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={onNext} disabled={data.categories.length === 0}>Continue</Button>
      </div>
    </div>
  );
}
