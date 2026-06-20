import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Category } from '../../../types';

const CATEGORY_COLORS = [
  'blue',
  'green',
  'yellow',
  'purple',
  'red',
  'orange',
  'pink',
  'teal'
];

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string; targetMinutes: number }) => Promise<void>;
  initialData?: Category;
}

export function CategoryFormDialog({ isOpen, onClose, onSubmit, initialData }: CategoryFormDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [targetMinutes, setTargetMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setColor(initialData.color);
        setTargetMinutes(initialData.targetMinutes || 60);
      } else {
        setName('');
        setColor(CATEGORY_COLORS[0]);
        setTargetMinutes(60);
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    if (targetMinutes < 1) {
      setError('Daily target must be at least 1 minute.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({ name: name.trim(), color, targetMinutes });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">{initialData ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Mathematics"
              disabled={loading}
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Daily Target (Minutes)</label>
            <input 
              type="number" 
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(parseInt(e.target.value) || 0)}
              className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              min={1}
              max={1440}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Theme Color</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform bg-cat-${c} ${color === c ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-105'}`}
                  onClick={() => setColor(c)}
                  disabled={loading}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {initialData ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
