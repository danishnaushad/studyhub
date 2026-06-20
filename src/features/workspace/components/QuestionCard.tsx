import { MoreVertical, Edit2, Trash2, HelpCircle, CheckCircle2, Zap, Brain, Activity } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import type { Question } from '../../../types';
import { cn } from '../../../lib/utils';
import { useDemo } from '../../../contexts/DemoContext';

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { isDemo } = useDemo();

  // Defensive Guard for Malformed Documents
  if (!question || !question.id) {
    console.error('Malformed question document detected:', question);
    return (
      <Card className="group relative overflow-hidden transition-all border-destructive/50 bg-destructive/5">
        <CardContent className="p-4 sm:p-5 flex flex-col h-full items-center justify-center text-center">
          <HelpCircle className="h-8 w-8 text-destructive/50 mb-2" />
          <p className="text-destructive font-semibold">Corrupted Card Data</p>
          <p className="text-xs text-muted-foreground mt-1">This card contains invalid data and cannot be displayed.</p>
          <button 
            onClick={() => question?.id ? onDelete(question.id) : null}
            className="mt-4 px-3 py-1 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md text-xs font-medium transition-colors"
          >
            Attempt Delete
          </button>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: Question['status']) => {
    switch (status) {
      case 'mastered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'review': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'learning': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  const getStatusIcon = (status: Question['status']) => {
    switch (status) {
      case 'mastered': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'review': return <Activity className="h-5 w-5 text-amber-500" />;
      case 'learning': return <Brain className="h-5 w-5 text-blue-500" />;
      default: return <HelpCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/30">
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 shrink-0">
              {getStatusIcon(question.status)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border", getStatusColor(question.status))}>
                  {question.status}
                </span>
                <span className="text-xs text-muted-foreground border border-border/50 px-2 py-0.5 rounded bg-muted/20 capitalize">
                  {question.type ? question.type.replace('_', ' ') : 'Unknown'}
                </span>
              </div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors pr-8">
                {question.question}
              </h3>
            </div>
          </div>
          
          <div className="relative shrink-0 ml-2">
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
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 disabled:opacity-50"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(question); }}
                    disabled={isDemo}
                    title={isDemo ? "Disabled in Demo Mode" : undefined}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent text-destructive flex items-center gap-2 disabled:opacity-50"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(question.id); }}
                    disabled={isDemo}
                    title={isDemo ? "Disabled in Demo Mode" : undefined}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {question.sourceHighlightText && question.sourceResourceTitle && (
          <div className="mt-3 text-xs bg-muted/40 p-2 rounded border-l-2 border-primary/50 text-muted-foreground line-clamp-2 italic">
            "{question.sourceHighlightText}"
            <div className="font-semibold not-italic mt-1 text-[10px] text-foreground/70 uppercase tracking-wider">
              From: {question.sourceResourceTitle} (Page {question.sourcePageNumber})
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
              Mastery: {question.masteryScore}%
            </span>
            <span>
              Reviews: {question.reviewCount}
            </span>
            {question.nextReview && (
              <span>
                Next: {new Date(question.nextReview).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
