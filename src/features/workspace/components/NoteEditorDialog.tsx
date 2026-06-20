import { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Note } from '../../../types';

interface NoteEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  initialData?: Note;
}

export function NoteEditorDialog({ isOpen, onClose, onSubmit, initialData }: NoteEditorDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
      } else {
        setTitle('');
        setContent('');
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({ title: title.trim(), content });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-card w-full border flex flex-col shadow-lg transition-all ${isFullscreen ? 'h-full max-w-none rounded-none border-0' : 'max-w-3xl max-h-[85vh] rounded-xl'}`}>
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            className="text-lg font-bold bg-transparent border-none focus:outline-none flex-1 placeholder:text-muted-foreground/50"
            disabled={loading}
          />
          <div className="flex items-center gap-1 ml-4 shrink-0">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="p-1.5 hover:bg-accent rounded-md text-muted-foreground transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-accent rounded-md text-muted-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-hidden flex flex-col relative">
          {error && (
            <div className="p-3 mb-4 bg-destructive/10 text-destructive text-sm rounded-md shrink-0">
              {error}
            </div>
          )}
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here... (Markdown supported)"
            className="w-full flex-1 p-0 bg-transparent border-none resize-none focus:outline-none leading-relaxed"
            disabled={loading}
          />
        </div>

        <div className="p-4 border-t flex justify-end gap-2 shrink-0 bg-muted/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()} disabled={loading}>
            {loading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
            {initialData ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </div>
    </div>
  );
}
