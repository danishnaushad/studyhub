import { MoreVertical, Edit2, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import type { Note } from '../../../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(note.updatedAt);

  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      onClick={() => onEdit(note)}
    >
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 flex-1 group-hover:text-primary transition-colors">
            {note.title}
          </h3>
          
          <div className="relative ml-2 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1 text-muted-foreground hover:bg-accent rounded transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                />
                <div className="absolute right-0 top-full mt-1 w-32 bg-popover border shadow-md rounded-md overflow-hidden z-20">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(note); }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-destructive flex items-center gap-2"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(note.id); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap font-serif">
            {note.content}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </div>

        {note.sourceHighlightText && note.sourceResourceTitle && (
          <div className="mt-3 text-xs bg-muted/40 p-2 rounded border-l-2 border-primary/50 text-muted-foreground line-clamp-2 italic">
            "{note.sourceHighlightText}"
            <div className="font-semibold not-italic mt-1 text-[10px] text-foreground/70 uppercase tracking-wider">
              From: {note.sourceResourceTitle} (Page {note.sourcePageNumber})
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center text-xs text-muted-foreground/70 shrink-0">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Edited {formattedDate}
        </div>
      </CardContent>
    </Card>
  );
}
