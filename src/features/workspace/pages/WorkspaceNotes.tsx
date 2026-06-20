import { useState, useMemo } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../../../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { notesService } from '../services/notes.service';
import { NoteCard } from '../components/NoteCard';
import { NoteEditorDialog } from '../components/NoteEditorDialog';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Note } from '../../../types';

export function WorkspaceNotes() {
  const { category } = useWorkspace();
  const { user } = useAuth();
  const { notes, loading } = useNotes(category.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const handleOpenAdd = () => {
    setEditingNote(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await notesService.deleteNote(id);
    }
  };

  const handleSubmit = async (data: { title: string; content: string }) => {
    if (!user) return;
    
    if (editingNote) {
      await notesService.updateNote(editingNote.id, data);
    } else {
      await notesService.createNote({
        ...data,
        userId: user.uid,
        categoryId: category.id
      });
    }
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(q) || 
      note.content.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground mt-1">
            Capture your thoughts and learnings for {category.name}.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={handleOpenAdd} className="shrink-0 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Note</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center flex-1">
          <LoadingSpinner />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground italic border rounded-xl border-dashed bg-card/50 flex-1 flex flex-col items-center justify-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 opacity-50" />
          </div>
          <p>No notes created yet.</p>
          <p className="text-sm mt-1">Click 'New Note' to start writing.</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground italic border rounded-xl border-dashed bg-card/50 flex-1 flex flex-col items-center justify-center">
          <Search className="h-8 w-8 opacity-20 mb-4" />
          <p>No notes found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start pb-8">
          {filteredNotes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NoteEditorDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingNote}
      />
    </div>
  );
}
