import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface PDFNoteGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
  sourceHighlightText: string;
  sourcePageNumber: number;
  sourceResourceTitle: string;
}

export function PDFNoteGeneratorDialog({
  isOpen,
  onClose,
  onSubmit,
  sourceHighlightText,
  sourcePageNumber,
  sourceResourceTitle
}: PDFNoteGeneratorDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill title on open
  useEffect(() => {
    if (isOpen) {
      setTitle(`Note on ${sourceResourceTitle} - Page ${sourcePageNumber}`);
      setContent('');
      setIsSubmitting(false);
    }
  }, [isOpen, sourceResourceTitle, sourcePageNumber]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), content.trim());
      onClose();
    } catch (err) {
      console.error("Failed to generate note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create Note
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-muted/50 p-3 rounded-md border text-sm text-muted-foreground border-l-4 border-l-primary/50">
            <div className="font-medium text-foreground mb-1 text-xs">
              From: {sourceResourceTitle} (Page {sourcePageNumber})
            </div>
            <p className="line-clamp-4 italic">"{sourceHighlightText}"</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Key takeaway on Networking"
              className="w-full p-2 rounded-md border bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">Your Thoughts</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Synthesize your understanding here..."
              className="w-full p-2 rounded-md border bg-background min-h-[120px] resize-y"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
